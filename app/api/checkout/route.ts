import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe only if secret key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil"
  })
}

export async function POST(request: Request) {
  try {
    const { amount, currency = "cad", metadata = {} } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}

// Handle webhook for payment confirmation
export async function PUT(request: Request) {
  try {
    const sig = request.headers.get("stripe-signature")
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { error: "Missing webhook signature or secret" },
        { status: 400 }
      )
    }

    const body = await request.text()
    const stripe = getStripe()

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        // Handle successful payment
        console.log("PaymentIntent was successful:", paymentIntent.id)
        // Update order status in database
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        // Handle failed payment
        console.log("PaymentIntent failed:", failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    )
  }
}