import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { checkoutRateLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// Validation schemas
const createCheckoutSchema = z.object({
  shippingAddressId: z.string().cuid().optional(),
  billingAddressId: z.string().cuid().optional(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().min(2).max(100).optional(),
  guestPhone: z.string().optional(),
  customerNotes: z.string().max(500).optional(),
});

// POST /api/checkout - Create checkout session
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req);
    const { allowed } = await checkRateLimit(identifier, checkoutRateLimiter);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const session = await auth();
    const sessionId = req.cookies.get('cart_session')?.value;
    const body = await req.json();

    // Validate input
    const validated = createCheckoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validated.error.errors },
        { status: 400 }
      );
    }

    const { guestEmail, guestName, guestPhone, customerNotes } = validated.data;

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          ...(session?.user?.id ? [{ userId: session.user.id }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
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
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Verify inventory for all items
    for (const item of cart.items) {
      if (item.product.trackInventory && item.product.inventory < item.quantity) {
        return NextResponse.json(
          {
            error: 'Insufficient inventory',
            details: `${item.product.name} only has ${item.product.inventory} items available`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals (in cents)
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
      0
    );

    const taxRate = 0.13; // 13% HST Ontario
    const tax = Math.round(subtotal * taxRate);
    const shippingCost = subtotal >= 10000 ? 0 : 2500; // Free shipping over $100
    const total = subtotal + tax + shippingCost;

    // Get customer email
    let customerEmail = guestEmail;
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
      });
      customerEmail = user?.email || guestEmail;
    }

    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: customerEmail,
      metadata: {
        cartId: cart.id,
        userId: session?.user?.id || 'guest',
        customerNotes: customerNotes || '',
      },
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.product.name,
            description: item.product.description.substring(0, 200),
            images: item.product.images.length > 0
              ? [`${process.env.NEXT_PUBLIC_APP_URL}${item.product.images[0].url}`]
              : undefined,
            metadata: {
              productId: item.productId,
              variantId: item.variantId || '',
            },
          },
          unit_amount: item.product.salePrice || item.product.price,
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingCost,
              currency: 'cad',
            },
            display_name: shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 4500, // $45.00
              currency: 'cad',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['CA'],
      },
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
      allow_promotion_codes: true,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error('[Checkout API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// POST /api/checkout/create-payment-intent - Create Stripe Payment Intent (alternative to checkout session)
export async function PUT(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req);
    const { allowed } = await checkRateLimit(identifier, checkoutRateLimiter);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const session = await auth();
    const sessionId = req.cookies.get('cart_session')?.value;

    if (!session && !sessionId) {
      return NextResponse.json(
        { error: 'No cart found' },
        { status: 400 }
      );
    }

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          ...(session?.user?.id ? [{ userId: session.user.id }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
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
        { error: 'Cart is empty' },
        { status: 400 }
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

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      metadata: {
        cartId: cart.id,
        userId: session?.user?.id || 'guest',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: total,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('[Checkout API] Payment Intent Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}