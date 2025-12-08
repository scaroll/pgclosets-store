/**
 * Quote Payment API
 * Create Stripe checkout sessions for quote payments
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

const createPaymentSchema = z.object({
  type: z.enum(['DEPOSIT', 'FINAL']),
  returnUrl: z.string().url().optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/quotes/[id]/payment
 * Create a Stripe checkout session for payment
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = createPaymentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { type, returnUrl } = validation.data

    // Get quote
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        configurations: true,
        payments: {
          where: { status: 'COMPLETED' }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Verify access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    const isOwner = quote.customerId === user?.id || quote.customerEmail === session.user.email
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check quote status
    if (type === 'DEPOSIT' && quote.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Quote must be approved before paying deposit' },
        { status: 400 }
      )
    }

    if (type === 'FINAL' && quote.status !== 'INSTALLED') {
      return NextResponse.json(
        { success: false, error: 'Installation must be complete before final payment' },
        { status: 400 }
      )
    }

    // Calculate amount
    const totalPaid = quote.payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const total = Number(quote.total)
    const depositAmount = Number(quote.depositAmount) || (total * (quote.depositPercent / 100))

    let amount: number
    let description: string

    if (type === 'DEPOSIT') {
      amount = depositAmount
      description = `Deposit for ${quote.quoteNumber}`
    } else {
      amount = total - totalPaid
      description = `Final payment for ${quote.quoteNumber}`
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'No payment required' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.ca'
    const successUrl = returnUrl || `${baseUrl}/account/quotes/${id}?payment=success`
    const cancelUrl = `${baseUrl}/account/quotes/${id}?payment=cancelled`

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: quote.customerEmail,
      client_reference_id: quote.id,
      metadata: {
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        paymentType: type
      },
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `PG Closets - ${type === 'DEPOSIT' ? 'Deposit' : 'Final Payment'}`,
              description,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    // Create pending payment record
    await prisma.quotePayment.create({
      data: {
        quoteId: quote.id,
        type,
        amount,
        method: 'stripe',
        status: 'PROCESSING',
        stripePaymentId: checkoutSession.id,
        invoiceNumber: `INV-${quote.quoteNumber}-${type === 'DEPOSIT' ? 'D' : 'F'}`
      }
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url
    })

  } catch (error) {
    console.error('[POST /api/quotes/[id]/payment] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/quotes/[id]/payment
 * Get payment history for a quote
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get quote with payments
    const quote = await prisma.quote.findUnique({
      where: { id },
      select: {
        id: true,
        customerId: true,
        customerEmail: true,
        total: true,
        depositAmount: true,
        depositPercent: true,
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Verify access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    const isAdmin = user?.role === 'ADMIN'
    const isOwner = quote.customerId === user?.id || quote.customerEmail === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Calculate summary
    const totalPaid = quote.payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p.amount), 0)

    const total = Number(quote.total)
    const remainingBalance = total - totalPaid

    return NextResponse.json({
      success: true,
      data: {
        payments: quote.payments,
        summary: {
          total,
          totalPaid,
          remainingBalance,
          depositAmount: Number(quote.depositAmount) || (total * (quote.depositPercent / 100)),
          depositPercent: quote.depositPercent
        }
      }
    })

  } catch (error) {
    console.error('[GET /api/quotes/[id]/payment] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
