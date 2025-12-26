import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { addToCartSchema } from '@/lib/validation';
import { auth } from '@/lib/auth';
import { getClientIdentifier, checkRateLimit, generalRateLimiter } from '@/lib/rate-limit';

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

    // Validate input
    const validated = addToCartSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validated.error.errors },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity } = validated.data;

    // Verify product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check base product stock/availability
    if (product.stockCount !== undefined && product.inStock === false) {
       return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      );
    }

    // Validate variant if provided
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }

      if (variant.productId !== productId) {
        return NextResponse.json(
          { error: 'Variant does not belong to this product' },
          { status: 400 }
        );
      }

      if (!variant.inStock) {
        return NextResponse.json(
          { error: 'Variant is out of stock' },
          { status: 400 }
        );
      }
    }

    // Get or create cart
    let cart;
    const sessionId = req.cookies.get('cart_session')?.value || crypto.randomUUID();
    let isNewSession = !req.cookies.get('cart_session')?.value;

    if (session?.user?.id) {
      // User is logged in
      // Try to find existing cart for user
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id }
      });

      if (!cart) {
        // Create new cart for user (without sessionId to avoid unique constraint violation if guest cart exists)
        cart = await prisma.cart.create({
          data: {
            userId: session.user.id,
          }
        });
      }
    } else {
      // Guest user
      // Avoid upsert on sessionId alone if possible, but sessionId is unique so upsert is safe here
      cart = await prisma.cart.upsert({
        where: { sessionId },
        create: {
          sessionId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        update: {},
      });
    }

    // Check inventory including existing cart quantity
    // Manually find existing item to handle potential null variantId issues safely and calculate total
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null, // Explicitly match null if undefined
      },
    });

    let currentQuantityInCart = 0;
    if (existingItem) {
      currentQuantityInCart = existingItem.quantity;
    }

    const totalQuantity = currentQuantityInCart + quantity;

    // Use stockCount if available
    if (product.stockCount !== undefined && product.stockCount < totalQuantity) {
      return NextResponse.json(
        { error: `Insufficient inventory. You already have ${currentQuantityInCart} in cart, and only ${product.stockCount} are available.` },
        { status: 400 }
      );
    }

    // Add or update cart item
    // Using findFirst above, now we use update or create
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
        },
      });
    }

    const response = NextResponse.json({ success: true, message: 'Item added to cart' });

    // Set cookie if it's a new session or guest
    if (isNewSession && !session?.user?.id) {
      response.cookies.set('cart_session', sessionId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('[Cart API] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
