'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/lib/stores/cart-store'
import * as React from 'react'

type Step = 'shipping' | 'payment' | 'confirmation'

export function CheckoutFlow() {
  const [step, setStep] = React.useState<Step>('shipping')
  const [loading, setLoading] = React.useState(false)
  const { items, totalPrice, clearCart } = useCartStore()

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    clearCart()
    setStep('confirmation')
  }

  if (step === 'confirmation') {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your order #12345 has been placed successfully.</p>
          <Button onClick={() => (window.location.href = '/')}>Return to Home</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div
          className={`text-sm font-medium ${step === 'shipping' ? 'text-primary' : 'text-gray-500'}`}
        >
          1. Shipping
        </div>
        <div className="mx-4 h-px w-full bg-gray-200" />
        <div
          className={`text-sm font-medium ${step === 'payment' ? 'text-primary' : 'text-gray-500'}`}
        >
          2. Payment
        </div>
        <div className="mx-4 h-px w-full bg-gray-200" />
        <div className="text-sm font-medium text-gray-500">3. Confirmation</div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Form */}
        <div className="md:col-span-2">
          {step === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="base-full-name">Full Name</Label>
                    <Input id="base-full-name" required placeholder="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="base-address">Address</Label>
                    <Input id="base-address" required placeholder="123 Main St" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Processing...' : `Pay $${totalPrice()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {items.map(item => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
              <div className="mt-4 flex justify-between border-t pt-4 font-bold">
                <span>Total</span>
                <span>${totalPrice()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
