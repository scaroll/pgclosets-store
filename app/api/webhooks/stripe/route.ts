/**
 * Stripe Webhook Handler
 * Process payment events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendPaymentReceivedEmail } from '@/lib/email/quote-emails'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutExpired(session)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('[Stripe Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const quoteId = session.metadata?.quoteId
  const paymentType = session.metadata?.paymentType as 'DEPOSIT' | 'FINAL'

  if (!quoteId) {
    console.error('[Stripe Webhook] Missing quoteId in metadata')
    return
  }

  // Update payment record
  const payment = await prisma.quotePayment.findFirst({
    where: {
      stripePaymentId: session.id,
      status: 'PROCESSING'
    }
  })

  if (!payment) {
    console.error('[Stripe Webhook] Payment record not found for session:', session.id)
    return
  }

  // Get quote for status update
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: {
      id: true,
      quoteNumber: true,
      customerName: true,
      customerEmail: true,
      total: true,
      depositAmount: true,
      status: true
    }
  })

  if (!quote) {
    console.error('[Stripe Webhook] Quote not found:', quoteId)
    return
  }

  // Calculate totals
  const amountPaid = Number(payment.amount)
  const total = Number(quote.total)

  // Get all completed payments including this one
  const allPayments = await prisma.quotePayment.findMany({
    where: {
      quoteId,
      status: 'COMPLETED'
    }
  })

  const previouslyPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0)
  const remainingBalance = total - previouslyPaid - amountPaid

  // Update payment and quote in transaction
  await prisma.$transaction(async (tx) => {
    // Mark payment as completed
    await tx.quotePayment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date()
      }
    })

    // Update quote status based on payment type
    let newStatus: string
    let statusReason: string

    if (paymentType === 'DEPOSIT') {
      newStatus = 'DEPOSIT_PAID'
      statusReason = `Deposit of $${amountPaid.toLocaleString()} received`
    } else {
      newStatus = 'COMPLETED'
      statusReason = `Final payment of $${amountPaid.toLocaleString()} received`
    }

    await tx.quote.update({
      where: { id: quoteId },
      data: {
        status: newStatus as any,
        ...(newStatus === 'COMPLETED' ? { completedAt: new Date() } : {})
      }
    })

    await tx.quoteStatusLog.create({
      data: {
        quoteId,
        fromStatus: quote.status as any,
        toStatus: newStatus as any,
        reason: statusReason
      }
    })
  })

  // Send confirmation email
  await sendPaymentReceivedEmail({
    customerEmail: quote.customerEmail,
    customerName: quote.customerName,
    quoteNumber: quote.quoteNumber,
    quoteId: quote.id,
    paymentType,
    amountPaid,
    totalAmount: total,
    remainingBalance: Math.max(0, remainingBalance)
  })

  console.log(`[Stripe Webhook] Payment completed for quote ${quote.quoteNumber}`)
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  // Mark payment as failed
  await prisma.quotePayment.updateMany({
    where: {
      stripePaymentId: session.id,
      status: 'PROCESSING'
    },
    data: {
      status: 'FAILED',
      notes: 'Checkout session expired'
    }
  })

  console.log(`[Stripe Webhook] Checkout expired for session ${session.id}`)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Find and update the related payment
  const sessionId = paymentIntent.metadata?.sessionId

  if (sessionId) {
    await prisma.quotePayment.updateMany({
      where: {
        stripePaymentId: sessionId,
        status: 'PROCESSING'
      },
      data: {
        status: 'FAILED',
        notes: paymentIntent.last_payment_error?.message || 'Payment failed'
      }
    })
  }

  console.log(`[Stripe Webhook] Payment failed for intent ${paymentIntent.id}`)
}
