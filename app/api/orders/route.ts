import { NextRequest, NextResponse } from 'next/server';
import { auth, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generalRateLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { sendOrderConfirmation, type OrderEmailData } from '@/lib/email';

// Generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000);
  return `PGC-${year}-${random.toString().padStart(6, '0')}`;
}

// GET /api/orders - Get orders for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.paymentStatus = status;
    }

    // Get orders with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { position: 'asc' },
                  },
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('[Orders API] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create order from cart (called after successful payment)
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

    const {
      paymentIntentId,
      cartId,
      shippingAddress,
      billingAddress,
      guestEmail,
      guestName,
      guestPhone,
      customerNotes,
    } = body;

    if (!paymentIntentId || !cartId) {
      return NextResponse.json(
        { error: 'Payment intent ID and cart ID are required' },
        { status: 400 }
      );
    }

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart not found or empty' },
        { status: 404 }
      );
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
      0
    );

    const taxRate = 0.13; // 13% HST Ontario
    const tax = Math.round(subtotal * taxRate);
    const shippingCost = subtotal >= 10000 ? 0 : 2500; // Free shipping over $100
    const total = subtotal + tax + shippingCost;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create shipping address if provided
      let shippingAddressId = null;
      if (shippingAddress && session?.user?.id) {
        const createdAddress = await tx.address.create({
          data: {
            ...shippingAddress,
            userId: session.user.id,
            type: 'shipping',
          },
        });
        shippingAddressId = createdAddress.id;
      }

      // Create billing address if provided
      let billingAddressId = null;
      if (billingAddress && session?.user?.id) {
        const createdAddress = await tx.address.create({
          data: {
            ...billingAddress,
            userId: session.user.id,
            type: 'billing',
          },
        });
        billingAddressId = createdAddress.id;
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id || null,
          guestEmail: guestEmail || session?.user?.email || null,
          guestName: guestName || session?.user?.name || null,
          guestPhone,
          shippingAddressId,
          billingAddressId,
          subtotal,
          shippingCost,
          tax,
          discount: 0,
          total,
          paymentStatus: 'paid',
          paymentMethod: 'card',
          stripePaymentIntentId: paymentIntentId,
          fulfillmentStatus: 'pending',
          customerNotes,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              productName: item.product.name,
              variantName: null, // Can be added if using variants
              sku: item.product.sku,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.price,
              total: (item.product.salePrice || item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { take: 1 },
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      // Update product inventory
      for (const item of cart.items) {
        if (item.product.trackInventory) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Send order confirmation email
    try {
      const emailData: OrderEmailData = {
        orderNumber: order.orderNumber,
        customerName: order.guestName || order.user?.name || 'Customer',
        customerEmail: order.guestEmail || order.user?.email || '',
        orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: order.items.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price, // Already in cents
          image: item.product.images[0]?.url
        })),
        subtotal: order.subtotal, // Already in cents
        tax: order.tax, // Already in cents
        shipping: order.shippingCost, // Already in cents
        total: order.total, // Already in cents
        shippingAddress: order.shippingAddress || {
          firstName: order.guestName?.split(' ')[0] || '',
          lastName: order.guestName?.split(' ').slice(1).join(' ') || '',
          addressLine1: 'Address on file',
          city: 'Ottawa',
          province: 'ON',
          postalCode: 'K1A 0B1'
        },
        estimatedDelivery: order.shippedAt ?
          new Date(order.shippedAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : undefined
      };

      if (emailData.customerEmail) {
        await sendOrderConfirmation(emailData);
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('[Orders API] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders/[id] - Get specific order
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const { orderId, status, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns the order or is admin
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(session.user.role !== 'admin' && { userId: session.user.id }),
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { fulfillmentStatus: status }),
        ...(trackingNumber && { trackingNumber }),
        ...(status === 'shipped' && { shippedAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date() }),
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('[Orders API] PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}