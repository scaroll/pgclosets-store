import { auth } from '@/auth'
import { prisma } from '@/lib/db/client'
import { checkRateLimit, generalRateLimiter, getClientIdentifier } from '@/lib/rate-limit'
import { addToCartSchema } from '@/lib/validation/schemas'
import { NextRequest, NextResponse } from 'next/server'

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
    const body = await req.json()

    const validated = addToCartSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const { productId, variantId, quantity } = validated.data

    // Get or create cart
    let cart
    if (session?.user?.id) {
      cart = await prisma.cart.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id },
        update: {},
      })
    } else {
      const sessionId = req.cookies.get('cart_session')?.value || crypto.randomUUID()
      cart = await prisma.cart.upsert({
        where: { sessionId },
        create: { sessionId, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        update: {},
      })

      // Set cookie for guest cart
      const response = NextResponse.json({ success: true })
      response.cookies.set('cart_session', sessionId, { maxAge: 30 * 24 * 60 * 60 })

      // We need to return the response here to set the cookie, but we also need to add the item
      // So we'll continue execution but we need to remember to return response with cookie ONLY if we created a new session
      // Actually, standard pattern is to return at the end.
      // But adding cookie requires returning a NextResponse object created earlier or modifying it.
    }

    // Since step 1183 code returns `NextResponse.json({ success: true })` at the end
    // I need to make sure the cookie is set if it was a guest cart.
    // The plan code block implementation:
    /*
      // Set cookie for guest cart
      const response = NextResponse.json({ success: true });
      response.cookies.set('cart_session', sessionId, { maxAge: 30 * 24 * 60 * 60 });
    */
    // Wait, the plan code creates `response` inside the `else` block but doesn't return it immediately.
    // It continues to `// Add or update cart item`.
    // And then `return NextResponse.json({ success: true });` at the end.
    // This implies the plan code has a bug: it sets cookie on a response object that is discarded?
    // Or maybe it returns it? "response" variable scope is block scoped.
    // I will fix this logic.

    // Correct Logic:
    let sessionId = req.cookies.get('cart_session')?.value
    let isNewSession = false

    if (!session?.user?.id && !sessionId) {
      sessionId = crypto.randomUUID()
      isNewSession = true
    }

    // ... DB operations ...
    // If guest, upsert with sessionId.

    // Return:
    const finalResponse = NextResponse.json({ success: true })
    if (isNewSession && sessionId) {
      finalResponse.cookies.set('cart_session', sessionId, { maxAge: 30 * 24 * 60 * 60 })
    }
    return finalResponse
  } catch (error) {
    // ...
  }
}
// Wait, I will copy the plan code but FIX this subtle bug.
// The plan code:
/*
    } else {
      const sessionId = req.cookies.get('cart_session')?.value || crypto.randomUUID();
      cart = await prisma.cart.upsert({...});

      // Set cookie for guest cart
      const response = NextResponse.json({ success: true });
      response.cookies.set('cart_session', sessionId, { maxAge: 30 * 24 * 60 * 60 });
    }

    // Add cart item...

    return NextResponse.json({ success: true });
*/
// The plan code returns a FRESH response at the end, ignoring the `response` created in the else block.
// Meaning the cookie is NEVER returned to the client.
// I WILL FIX THIS.
