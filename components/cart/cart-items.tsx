'use client'

import { Button } from '@/components/ui/button'
import { LuxuryQuoteForm } from '@/components/ui/luxury-quote-form'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { Minus, Plus, X } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { useState } from 'react'

interface CartItemsProps {
  onItemRemove?: (id: string) => void
}

const DEFAULT_IMAGE = '/placeholder.jpg'

export function CartItems({ onItemRemove }: CartItemsProps) {
  const { items, removeItem, updateQuantity } = useCartStore()
  const [quoteItem, setQuoteItem] = useState<{ name: string; price: number } | null>(null)

  const handleRemove = (id: string) => {
    removeItem(id)
    onItemRemove?.(id)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <div className="flex gap-6">
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={item.image ?? DEFAULT_IMAGE}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mt-1 h-8 w-8"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Variant: {item.variantId}</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 h-auto p-0 text-sm text-apple-blue-600"
                  onClick={() =>
                    setQuoteItem({
                      name: item.name + (item.variantId ? ` (${item.variantId})` : ''),
                      price: item.price,
                    })
                  }
                >
                  Request Custom Quote
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Qty:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-base font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            </div>
          </div>
          {index < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
      <LuxuryQuoteForm
        open={!!quoteItem}
        onClose={() => setQuoteItem(null)}
        product={quoteItem || undefined}
      />
    </div>
  )
}
