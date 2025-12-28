import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { checkoutRateLimiter, checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const { allowed } = await checkRateLimit(identifier, checkoutRateLimiter)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await auth()
    const sessionId = req.cookies.get('cart_session')?.value

    if (!session && !sessionId) {
      return NextResponse.json({ error: 'No cart found' }, { status: 400 })
    }

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: session?.user?.id }, { sessionId }],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const taxRate = 0.13 // 13% HST Ontario
    const tax = Math.round(subtotal * taxRate)
    const total = subtotal + tax

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      metadata: {
        cartId: cart.id,
        userId: session?.user?.id || 'guest',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: total,
    })
  } catch (error) {
    console.error('[Checkout API] Error:', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
