import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { addToCartSchema, updateCartItemSchema } from '@/lib/validation';
import { generalRateLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit';

// GET /api/cart - Get current cart
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const sessionId = req.cookies.get('cart_session')?.value;

    if (!session && !sessionId) {
      return NextResponse.json({ items: [], total: 0 });
    }

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

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    // Calculate totals
    const items = cart.items.map(item => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.salePrice || item.product.price,
        originalPrice: item.product.price,
        image: item.product.images[0]?.url || '/placeholder.svg',
        inventory: item.product.inventory,
      },
      subtotal: (item.product.salePrice || item.product.price) * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    return NextResponse.json({
      items,
      subtotal,
      total: subtotal, // Can add tax and shipping later
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('[Cart API] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
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
      where: { id: productId, status: 'active' },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.trackInventory && product.inventory < quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart;
    if (session?.user?.id) {
      cart = await prisma.cart.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id },
        update: {},
      });
    } else {
      const sessionId = req.cookies.get('cart_session')?.value || crypto.randomUUID();
      cart = await prisma.cart.upsert({
        where: { sessionId },
        create: {
          sessionId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        update: {},
      });

      // Set cookie for guest cart if new
      if (!req.cookies.get('cart_session')?.value) {
        const response = NextResponse.json({ success: true });
        response.cookies.set('cart_session', sessionId, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        // Continue with the rest of the logic but return the response with cookie
        await prisma.cartItem.upsert({
          where: {
            cartId_productId_variantId: {
              cartId: cart.id,
              productId,
              variantId: variantId || (null as unknown as string),
            },
          },
          create: {
            cartId: cart.id,
            productId,
            variantId,
            quantity,
          },
          update: {
            quantity: { increment: quantity },
          },
        });

        return response;
      }
    }

    // Add or update cart item
    await prisma.cartItem.upsert({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId,
          variantId: variantId || (null as unknown as string),
        },
      },
      create: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
    });

    return NextResponse.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('[Cart API] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// PATCH /api/cart - Update cart item quantity
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const sessionId = req.cookies.get('cart_session')?.value;
    const body = await req.json();

    // Validate input
    const validated = updateCartItemSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validated.error.errors },
        { status: 400 }
      );
    }

    const { quantity } = validated.data;
    const itemId = body.itemId;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Find the cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          ...(session?.user?.id ? [{ userId: session.user.id }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find the cart item
    const cartItem = cart.items.find(item => item.id === itemId);
    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      return NextResponse.json({ success: true, message: 'Item removed from cart' });
    }

    // Check inventory if updating quantity
    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId },
    });

    if (product?.trackInventory && product.inventory < quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      );
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('[Cart API] PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart or remove item
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const sessionId = req.cookies.get('cart_session')?.value;
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    // Find the cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          ...(session?.user?.id ? [{ userId: session.user.id }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (itemId) {
      // Remove specific item
      await prisma.cartItem.delete({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      });

      return NextResponse.json({ success: true, message: 'Item removed from cart' });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }
  } catch (error) {
    console.error('[Cart API] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete from cart' },
      { status: 500 }
    );
  }
}