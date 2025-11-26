import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const trackEventSchema = z.object({
  event: z.string(),
  properties: z.record(z.any()).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const headersList = headers();
    const body = await req.json();

    const validated = trackEventSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    const { event, properties, userId, sessionId } = validated.data;

    // Get client info
    const ip = req.ip || headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const referer = headersList.get('referer') || null;

    // Store event in database (you could also send to a service like Segment, Mixpanel, etc.)
    await prisma.analyticsEvent.create({
      data: {
        event,
        properties: properties || {},
        userId,
        sessionId,
        ip,
        userAgent,
        referer,
        timestamp: new Date(),
      },
    });

    // Handle specific events
    switch (event) {
      case 'page_view':
        await handlePageView(properties, userId, sessionId);
        break;
      case 'product_view':
        await handleProductView(properties, userId, sessionId);
        break;
      case 'add_to_cart':
        await handleAddToCart(properties, userId, sessionId);
        break;
      case 'search':
        await handleSearch(properties, userId, sessionId);
        break;
      case 'purchase':
        await handlePurchase(properties, userId, sessionId);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ANALYTICS_TRACK_ERROR]', error);
    // Don't expose internal errors to the client
    return NextResponse.json({ success: true });
  }
}

async function handlePageView(properties: any, userId?: string, sessionId?: string) {
  // Track page views for analytics
  await prisma.pageView.create({
    data: {
      path: properties.path,
      title: properties.title,
      userId,
      sessionId,
      timestamp: new Date(),
    },
  });
}

async function handleProductView(properties: any, userId?: string, sessionId?: string) {
  // Track product views
  if (properties.productId) {
    await prisma.productView.create({
      data: {
        productId: properties.productId,
        userId,
        sessionId,
        timestamp: new Date(),
      },
    });
  }
}

async function handleAddToCart(properties: any, userId?: string, sessionId?: string) {
  // Track cart additions
  if (properties.productId) {
    await prisma.cartEvent.create({
      data: {
        type: 'add_to_cart',
        productId: properties.productId,
        variantId: properties.variantId,
        quantity: properties.quantity || 1,
        userId,
        sessionId,
        timestamp: new Date(),
      },
    });
  }
}

async function handleSearch(properties: any, userId?: string, sessionId?: string) {
  // Track search queries
  if (properties.query) {
    await prisma.searchQuery.create({
      data: {
        query: properties.query,
        filters: properties.filters || {},
        resultCount: properties.resultCount || 0,
        userId,
        sessionId,
      },
    });
  }
}

async function handlePurchase(properties: any, userId?: string, sessionId?: string) {
  // Track purchases
  if (properties.orderId) {
    await prisma.purchaseEvent.create({
      data: {
        orderId: properties.orderId,
        total: Math.round((properties.total || 0) * 100), // Convert to cents
        currency: properties.currency || 'CAD',
        userId,
        sessionId,
        timestamp: new Date(),
      },
    });
  }
}