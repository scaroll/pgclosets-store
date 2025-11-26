"use client"

import * as React from "react"
import Image from "next/image"
import { useCartStore } from "@/lib/stores/cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  discount?: number
}

export function OrderSummary({ discount = 0 }: OrderSummaryProps) {
  const { items, total } = useCartStore()

  const subtotal = total
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax - discount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items Preview */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="text-sm font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
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
              <span className="font-medium text-green-600">
                -${discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          {subtotal < 100 && shipping > 0 && (
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
      </CardContent>
    </Card>
  )
}
