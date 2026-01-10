import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { generateOrderNumber } from '@/lib/orders';
import { generalRateLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit';

// Type definitions
interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface CreateOrderInput {
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  customerNotes?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
}

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1),
  })),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  customerNotes: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
}) as z.ZodType<CreateOrderInput>;

// GET /api/orders - Get user orders
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where = {
      userId: session.user.id,
      ...(status && { paymentStatus: status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1, orderBy: { position: 'asc' } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const formattedOrders = orders.map(order => ({
      ...order,
      subtotal: order.subtotal / 100,
      tax: order.tax / 100,
      discount: order.discount / 100,
      total: order.total / 100,
      shippingCost: order.shippingCost / 100,
      items: order.items.map(item => ({
        ...item,
        price: item.price / 100,
        total: item.total / 100,
      })),
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[ORDERS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req);
    const { allowed } = await checkRateLimit(identifier, generalRateLimiter);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const session = await auth();
    const body = await req.json();

    const validated = createOrderSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validated.error.errors },
        { status: 400 }
      );
    }

    const { items, shippingAddress, billingAddress, customerNotes, guestEmail, guestName, guestPhone } = validated.data;

    // Validate user or guest
    if (!session?.user?.id && (!guestEmail || !guestName)) {
      return NextResponse.json(
        { error: 'Authentication or guest information required' },
        { status: 401 }
      );
    }

    // Get products and calculate totals
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: 'active',
      },
      include: {
        images: { take: 1, orderBy: { position: 'asc' } },
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 404 }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const price = product.salePrice || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        variantId: item.variantId,
        variantName: null, // TODO: Get from variants table
        sku: product.sku,
        quantity: item.quantity,
        price,
        total: itemTotal,
      });
    }

    // Calculate tax (13% HST for Ontario)
    const tax = Math.round(subtotal * 0.13);
    const shippingCost = 0; // TODO: Calculate based on location and weight
    const total = subtotal + tax + shippingCost;

    // Create addresses if authenticated user
    let shippingAddressId = null;
    let billingAddressId = null;

    if (session?.user?.id) {
      const [createdShipping, createdBilling] = await Promise.all([
        prisma.address.create({
          data: {
            ...shippingAddress,
            userId: session.user.id,
            type: 'shipping',
          },
        }),
        prisma.address.create({
          data: {
            ...billingAddress,
            userId: session.user.id,
            type: 'billing',
          },
        }),
      ]);
      shippingAddressId = createdShipping.id;
      billingAddressId = createdBilling.id;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id || null,
        guestEmail,
        guestName,
        guestPhone,
        shippingAddressId,
        billingAddressId,
        subtotal,
        shippingCost,
        tax,
        total,
        customerNotes,
        items: {
          create: orderItems,
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

    // Clear cart if authenticated user
    if (session?.user?.id) {
      await prisma.cart.deleteMany({
        where: { userId: session.user.id },
      });
    }

    // Format response
    const formattedOrder = {
      ...order,
      subtotal: order.subtotal / 100,
      tax: order.tax / 100,
      discount: order.discount / 100,
      total: order.total / 100,
      shippingCost: order.shippingCost / 100,
      items: order.items.map(item => ({
        ...item,
        price: item.price / 100,
        total: item.total / 100,
      })),
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('[ORDER_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}