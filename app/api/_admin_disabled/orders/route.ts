import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Update order schema
const updateOrderSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  fulfillmentStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  trackingNumber: z.string().optional(),
  internalNotes: z.string().optional()
});

// GET /api/admin/orders - Get all orders with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentStatus = searchParams.get('paymentStatus');
    const fulfillmentStatus = searchParams.get('fulfillmentStatus');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (fulfillmentStatus) where.fulfillmentStatus = fulfillmentStatus;
    if (userId) where.userId = userId;

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true,
        billingAddress: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate summary metrics
    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.fulfillmentStatus] = (acc[order.fulfillmentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      orders,
      metrics: {
        totalRevenue,
        ordersByStatus,
        totalOrders: orders.length
      }
    });
  } catch (error) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/admin/orders/:id - Update order
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validated = updateOrderSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error },
        { status: 400 }
      );
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (validated.data.paymentStatus) {
      updateData.paymentStatus = validated.data.paymentStatus;
    }

    if (validated.data.fulfillmentStatus) {
      updateData.fulfillmentStatus = validated.data.fulfillmentStatus;

      // Set shipping date when status changes to shipped
      if (validated.data.fulfillmentStatus === 'shipped') {
        updateData.shippedAt = new Date();
      }
      // Set delivery date when status changes to delivered
      else if (validated.data.fulfillmentStatus === 'delivered') {
        updateData.deliveredAt = new Date();
      }
    }

    if (validated.data.trackingNumber) {
      updateData.trackingNumber = validated.data.trackingNumber;
    }

    if (validated.data.internalNotes) {
      updateData.internalNotes = validated.data.internalNotes;
    }

    // Update order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // TODO: Send email notification based on status change
    if (validated.data.fulfillmentStatus === 'shipped') {
      // Send shipping confirmation email
      console.log('TODO: Send shipping confirmation for order:', orderId);
    } else if (validated.data.fulfillmentStatus === 'delivered') {
      // Send delivery confirmation email
      console.log('TODO: Send delivery confirmation for order:', orderId);
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/orders/:id/refund - Process refund
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (action !== 'refund') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { amount, reason } = body;

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'Order must be paid to process refund' },
        { status: 400 }
      );
    }

    // TODO: Process refund through Stripe
    console.log('TODO: Process Stripe refund for order:', orderId, 'Amount:', amount || order.total);

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'refunded',
        fulfillmentStatus: 'cancelled',
        internalNotes: `Refunded: ${reason || 'No reason provided'}`,
        updatedAt: new Date()
      }
    });

    // TODO: Send refund confirmation email
    console.log('TODO: Send refund confirmation for order:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Admin order refund error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}