import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { checkRateLimit, generalRateLimiter, getClientIdentifier } from '@/lib/rate-limit'
import { addToCartSchema } from '@/lib/validation/schemas'
import { type NextRequest, NextResponse } from 'next/server'
import type { z } from 'zod'
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const sessionId = req.cookies.get('cart_session')?.value
    if (!session && !sessionId) {
      return NextResponse.json({ items: [], total: 0 })
    }
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: session?.user?.id }, { sessionId }],
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
    })
    if (!cart) {
      return NextResponse.json({ items: [], total: 0 })
    }
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return NextResponse.json({ items: cart.items, total })
  } catch (error) {
    console.error('[Cart API] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(req)
    const { allowed } = await checkRateLimit(identifier, generalRateLimiter)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const session = await auth()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = (await req.json()) as z.infer<typeof addToCartSchema>
    const validated = addToCartSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }
    const { productId, variantId, quantity } = validated.data
    // Get or create cart
    let cartId: string
    let isNewSession = false
    let sessionId: string | undefined
    if (session?.user?.id) {
      // Authenticated user
      const cart = await prisma.cart.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id },
        update: {},
        select: { id: true },
      })
      cartId = cart.id
    } else {
      // Guest user
      const existingSessionId = req.cookies.get('cart_session')?.value
      sessionId = existingSessionId || crypto.randomUUID()
      isNewSession = !existingSessionId
      const cart = await prisma.cart.upsert({
        where: { sessionId },
        create: { sessionId, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        update: {},
        select: { id: true },
      })
      cartId = cart.id
    }
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    // Add or update cart item
    // Note: Prisma's unique constraint with nullable fields doesn't allow null in the where clause
    // We need to find existing cart item manually when variantId is null
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId ?? null,
      },
    })
    const cartItem = existingItem
      ? await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: quantity } },
        })
      : await prisma.cartItem.create({
          data: {
            cartId,
            productId,
            variantId: variantId ?? null,
            quantity,
          },
        })
    // Create response with cookie for new guest sessions
    const response = NextResponse.json({ success: true, item: cartItem })
    if (isNewSession && sessionId) {
      response.cookies.set('cart_session', sessionId, { maxAge: 30 * 24 * 60 * 60, httpOnly: true })
    }
    return response
  } catch (error) {
    console.error('[Cart API] Error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
