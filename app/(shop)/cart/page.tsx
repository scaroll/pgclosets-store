'use client'

import * as React from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { CartItems } from '@/components/cart/cart-items'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const { items, totalPrice, totalItems } = useCartStore()
  const total = totalPrice()
  const itemCount = totalItems()
  const [promoCode, setPromoCode] = React.useState('')
  const [discount, setDiscount] = React.useState(0)

  const subtotal = total
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax - discount

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1)
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(subtotal * 0.2)
    } else {
      setDiscount(0)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {itemCount > 0
              ? `You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is empty'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingCart className="mx-auto mb-6 h-24 w-24 text-muted-foreground" />
            <h2 className="mb-4 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mb-8 text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <CartItems />
                  <Separator className="my-6" />
                  <Button variant="outline" asChild>
                    <Link href="/products">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label htmlFor="promo" className="text-sm font-medium leading-none">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            applyPromoCode()
                          }
                        }}
                      />
                      <Button onClick={applyPromoCode} variant="outline">
                        Apply
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm font-medium text-green-600">Promo code applied!</p>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    {subtotal < 100 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
