import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateCartItemSchema } from '@/lib/validation';

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
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    // Calculate totals
    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.salePrice) || Number(item.product.price),
        originalPrice: Number(item.product.price),
        image: item.product.images[0] || '/placeholder.svg',
        stockCount: item.product.stockCount,
      },
      subtotal: (Number(item.product.salePrice) || Number(item.product.price)) * item.quantity,
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
    const cartItem = cart.items.find((item) => item.id === itemId);
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

    if (product?.stockCount !== undefined && product.stockCount < quantity) {
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
