'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createCartAndSetCookie() {
  // For now, create a simple cart ID
  const cartId = generateCartId();
  
  const cookieStore = await cookies();
  cookieStore.set('cartId', cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return cartId;
}

export async function redirectToCheckout() {
  redirect('/checkout');
}

function generateCartId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}