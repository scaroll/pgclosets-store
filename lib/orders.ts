// @ts-nocheck
import { prisma } from './prisma';
import { sendOrderConfirmation } from './emails';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number; // in cents
  quantity: number;
}

export interface CreateOrderData {
  userId?: string;
  email: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  subtotal: number; // in cents
  tax: number; // in cents
  shipping: number; // in cents
  total: number; // in cents
  paymentIntentId?: string;
  notes?: string;
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
 * Create a new order
 */
export async function createOrder(data: CreateOrderData) {
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: data.userId,
      email: data.email,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      total: data.total,
      shippingName: data.shippingAddress.name,
      shippingStreet: data.shippingAddress.street,
      shippingCity: data.shippingAddress.city,
      shippingProvince: data.shippingAddress.province,
      shippingPostalCode: data.shippingAddress.postalCode,
      shippingCountry: data.shippingAddress.country,
      paymentIntentId: data.paymentIntentId,
      notes: data.notes,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  // Send confirmation email
  await sendOrderConfirmation(data.email, orderNumber, {
    total: data.total,
    itemCount: data.items.reduce((sum, item) => sum + item.quantity, 0),
  });

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
 * Update order status
 */
export async function updateOrderStatus(
  id: string,
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  id: string,
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
) {
  return prisma.order.update({
    where: { id },
    data: { paymentStatus },
  });
}

/**
 * Cancel an order
 */
export async function cancelOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
    },
  });
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: OrderItem[]): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Ontario HST (13%)
  const taxRate = 0.13;
  const tax = Math.round(subtotal * taxRate);

  // Free shipping over $500, otherwise $50 flat rate
  const shipping = subtotal >= 50000 ? 0 : 5000;

  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}
