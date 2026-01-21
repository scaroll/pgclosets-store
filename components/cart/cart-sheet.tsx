'use client'

import { Button } from '@/components/ui/button'
import { LuxuryQuoteForm } from '@/components/ui/luxury-quote-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/lib/stores/cart-store'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { formatPrice } from '../../lib/utils'

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, openCart, closeCart } =
    useCartStore()

  const [quoteItem, setQuoteItem] = useState<{ name: string; price: number } | null>(null)

  const subtotal = totalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={open => (open ? openCart() : closeCart())}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center text-xl font-bold">
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />

        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="flex flex-col gap-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="space-y-1">
                        <Link
                          href={`/products/details`}
                          className="line-clamp-2 font-semibold text-foreground hover:underline"
                        >
                          {item.name}
                        </Link>
                        {item.variantName && (
                          <p className="text-sm text-muted-foreground">
                            Variant: {item.variantName}
                          </p>
                        )}
                        <p className="font-medium text-foreground">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-md border text-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 disabled:opacity-50 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm font-medium text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 text-right">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setQuoteItem({
                              name: item.name + (item.variantName ? ` - ${item.variantName}` : ''),
                              price: item.price,
                            })
                          }
                        >
                          Request Custom Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 pr-6 pt-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <SheetTrigger asChild>
                <Button className="w-full" size="lg" onClick={closeCart}>
                  Checkout Now
                </Button>
              </SheetTrigger>
              <div className="text-center text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 pr-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground">
                Looks like adding some luxury items to your closet wouldn&apos;t hurt.
              </p>
            </div>
            <SheetTrigger asChild>
              <Button variant="outline" onClick={closeCart}>
                Continue Shopping
              </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>

      <LuxuryQuoteForm
        open={!!quoteItem}
        onClose={() => setQuoteItem(null)}
        product={quoteItem || undefined}
      />
    </Sheet>
  )
}
