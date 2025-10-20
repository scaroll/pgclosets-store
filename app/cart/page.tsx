"use client"

import StandardLayout from "@/components/layout/StandardLayout"
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import { useCart } from "../../lib/useCart"

export default function CartPage() {
  const { items, remove, setQty } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.qty), 0)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      // Redirect to the quote/checkout flow
      window.location.href = "/checkout"
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 font-light tracking-wide mb-8">Add some products to get started!</p>
            <Link href="/products">
              <Button className="bg-slate-900 hover:bg-slate-800 font-light tracking-widest">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600 text-sm">Product</p>
                    <p className="font-bold mt-2">${item.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => item.qty > 1 && setQty(item.id, item.qty - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => setQty(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      min="1"
                    />

                    <Button variant="outline" size="sm" onClick={() => setQty(item.id, item.qty + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(getTotal() * 0.13).toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${(getTotal() * 1.13).toFixed(2)}</span>
              </div>

              <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>

              <AddToQuoteButton
                convertFromCart
                variant="outline"
                size="default"
                className="w-full"
              />

              <Link href="/products">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </StandardLayout>
  )
}
