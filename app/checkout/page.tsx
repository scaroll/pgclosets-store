"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/useCart"
import { ShoppingCart, CreditCard, Truck, Shield } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0)
  const shipping = subtotal >= 100 ? 0 : 25
  const tax = subtotal * 0.13
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (items.length === 0) {
      window.location.href = "/cart"
      return
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
      }
    }

    createPaymentIntent()
  }, [items])

  const handleCheckout = async () => {
    if (!email || !name) {
      alert("Please fill in your contact information")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: email,
          guestName: name,
          guestPhone: phone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to process checkout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 font-light tracking-wide mb-8">Add some products to get started!</p>
            <Button onClick={() => window.location.href = "/products"} className="bg-slate-900 hover:bg-slate-800 font-light tracking-widest">
              Continue Shopping
            </Button>
          </div>
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(613) 123-4567"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">Product</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Shipping address and options will be collected during the secure payment process.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Free Shipping</strong> on orders over $100. Standard shipping $25 for orders under $100.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Your payment information is encrypted and secure. We accept all major credit cards, Apple Pay, and Google Pay.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">VISA</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">MC</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">AMEX</span>
                    </div>
                  </div>
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
                  <div className="flex justify-between">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.qty, 0)} items):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (13% HST):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)} CAD</span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isLoading || !email || !name}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By completing this purchase, you agree to our terms of service and privacy policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  )
}