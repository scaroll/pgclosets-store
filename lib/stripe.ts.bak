import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Helper functions for Stripe operations
export async function createPaymentIntent({
  amount,
  currency = 'cad',
  metadata = {},
}: {
  amount: number; // Amount in cents
  currency?: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function createCheckoutSession({
  lineItems,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata = {},
}: {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata,
    shipping_address_collection: {
      allowed_countries: ['CA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0, // Free shipping
            currency: 'cad',
          },
          display_name: 'Free shipping',
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
            amount: 2500, // $25.00
            currency: 'cad',
          },
          display_name: 'Express shipping',
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
  });
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export async function retrievePaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id);
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount, // If not specified, refunds the entire amount
  });
}

export async function createCustomer({
  email,
  name,
  metadata = {},
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  return await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
}