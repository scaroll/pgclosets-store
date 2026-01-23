import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import Stripe from 'stripe';
import { generalRateLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit';

// Type definitions for checkout
interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface Address {
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

type CheckoutError = Error & { message?: string };

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Handle missing Stripe key for build
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-08-27.basil',
});

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1),
  })),
  customerEmail: z.string().email(),
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
});

// POST /api/checkout - Create Stripe checkout session
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

    const validated = checkoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validated.error.errors },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    const isStripeConfigured = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy';

    if (!isStripeConfigured) {
      // MOCK MODE: Create order directly in DB
      const { items, customerEmail, shippingAddress, billingAddress, customerNotes } = validated.data;
      
      try {
        // Reuse robust order processing logic
        const { processOrder } = await import('@/lib/orders');
        
        await processOrder({
          userId: session?.user?.id,
          guestEmail: customerEmail,
          items: items.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
          shippingAddress,
          billingAddress,
          customerNotes,
          paymentIntentId: `mock_payment_${Math.random().toString(36).substring(7)}`
        });

        // Return fake session to satisfy frontend redirect
        return NextResponse.json({
          sessionId: `mock_session_${Math.random().toString(36).substring(7)}`,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/checkout/success?session_id=mock_session`,
          message: 'Checkout session created (Mock)',
        });
      } catch (err) {
        const error = err as CheckoutError;
        return NextResponse.json(
          { error: error.message || 'Failed to create mock order' },
          { status: 400 }
        );
      }
    }

    // STRIPE MODE: Original Logic
    const { items, customerEmail, shippingAddress, billingAddress, customerNotes } = validated.data;

    // Get products and validate inventory
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: 'active',
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 404 }
      );
    }

    // Check inventory
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product?.trackInventory && product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    let subtotal = 0;
    const lineItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const price = product.salePrice || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: product.name,
            description: product.description?.substring(0, 500) || product.name,
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      });
    }

    // Calculate tax and shipping
    const tax = Math.round(subtotal * 0.13); // 13% HST
    const shippingCost = 0; // Free shipping for now

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'HST (13%)',
            description: 'Harmonized Sales Tax',
          },
          unit_amount: tax,
        },
        quantity: 1,
      });
    }

    // Add shipping as a line item
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Shipping',
            description: 'Standard Shipping',
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['CA'],
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/checkout/cancel`,
      metadata: {
        userId: session?.user?.id || 'guest',
        customerEmail,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        customerNotes: customerNotes || '',
        items: JSON.stringify(items),
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shippingCost: shippingCost.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      message: 'Checkout session created',
    });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// PUT /api/checkout - Create payment intent for custom payment form
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'cad',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'pg-closets-website'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('[PAYMENT_INTENT_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}