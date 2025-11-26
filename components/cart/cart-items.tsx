"use client"

import * as React from "react"
import Image from "next/image"
import { X, Plus, Minus } from "lucide-react"
import { useCartStore, type CartItem } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface CartItemsProps {
  onItemRemove?: (id: string) => void
}

export function CartItems({ onItemRemove }: CartItemsProps) {
  const { items, removeItem, updateQuantity } = useCartStore()

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
            <div className="relative h-32 w-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mt-1"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
                {item.variantId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Variant: {item.variantId}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Qty:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-base font-medium w-10 text-center">
                      {item.quantity}
                    </span>
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
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            </div>
          </div>
          {index < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  )
}
