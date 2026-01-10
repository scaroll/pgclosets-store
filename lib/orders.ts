import { prisma } from '@/lib/db/client';
import { sendOrderConfirmation } from './emails';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name?: string; // Optional input, looked up from DB
  price?: number; // Optional input, looked up from DB
  quantity: number;
}

export interface CreateOrderData {
  userId?: string | null;
  guestEmail?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  customerNotes?: string;
  paymentIntentId?: string;
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PGC-${timestamp}-${random}`;
}

/**
 * Process and create a new order (Validates stock, calculates totals, creates DB records)
 */
export async function processOrder(data: CreateOrderData) {
  // 1. Fetch products to validate and get prices
  const productIds = data.items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: 'active',
    },
  });

  if (products.length !== productIds.length) {
    throw new Error('One or more products not found');
  }

  // 2. Validate Inventory & Calculate Totals
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of data.items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) continue;

    if (product.trackInventory && product.inventory < item.quantity) {
      throw new Error(`Insufficient inventory for ${product.name}`);
    }

    const price = product.salePrice || product.price;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      variantId: item.variantId,
      sku: product.sku,
      quantity: item.quantity,
      price,
      total: itemTotal, // Total for this line item
    });
  }

  // 3. Calculate Tax & Shipping
  const tax = Math.round(subtotal * 0.13); // 13% HST
  const shippingCost = 0; // Free shipping logic can be enhanced here
  const total = subtotal + tax + shippingCost;

  // 4. Create Addresses (if User is authenticated)
  let shippingAddressId: string | null = null;
  let billingAddressId: string | null = null;

  if (data.userId) {
    const [createdShipping, createdBilling] = await Promise.all([
      prisma.address.create({
        data: {
          ...data.shippingAddress,
          userId: data.userId,
          type: 'shipping',
        },
      }),
      prisma.address.create({
        data: {
          ...data.billingAddress,
          userId: data.userId,
          type: 'billing',
        },
      }),
    ]);
    shippingAddressId = createdShipping.id;
    billingAddressId = createdBilling.id;
  }

  // 5. Create Order
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: data.userId || null,
      guestEmail: data.guestEmail,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      shippingAddressId,
      billingAddressId,
      subtotal,
      shippingCost,
      tax,
      total,
      customerNotes: data.customerNotes,
      paymentStatus: data.paymentIntentId ? 'PAID' : 'PENDING', // If we have an ID, assume paid/processing
      stripePaymentIntentId: data.paymentIntentId,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // 6. Clear Cart (if User is authenticated)
  if (data.userId) {
    await prisma.cart.deleteMany({
      where: { userId: data.userId },
    });
  }

  // 7. Send Email (Fail gracefully)
  try {
    const email = data.userId ? (await prisma.user.findUnique({ where: { id: data.userId } }))?.email : data.guestEmail;
    if (email) {
       sendOrderConfirmation(email, order.orderNumber, {
        total: order.total,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      });
    }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }

  return order;
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });
}

/**
 * Get orders for a user
 */
export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Calculate order totals (Helper)
 */
export function calculateOrderTotals(items: OrderItem[]): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // Ontario HST (13%)
  const taxRate = 0.13;
  const tax = Math.round(subtotal * taxRate);

  // Free shipping over $500, otherwise $50 flat rate
  // This should match processOrder logic
  const shipping = subtotal >= 50000 ? 0 : 5000;

  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

