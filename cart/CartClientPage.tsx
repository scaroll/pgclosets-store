"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Home, Truck, Shield, Gift, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"

export default function CartClientPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal, tax, total } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setAppliedPromo("WELCOME10")
      setPromoCode("")
    }
  }

  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0
  const shipping = subtotal >= 500 ? 0 : 99
  const finalTotal = subtotal - promoDiscount + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold text-foreground font-serif">PG Closets</span>
                  <p className="text-xs text-muted-foreground">Premium Home Organization</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4 font-serif">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Discover our premium closet solutions and start building your dream organization system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4">
                Shop Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 px-8 py-4 bg-transparent"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground font-serif">PG Closets</span>
                <p className="text-xs text-muted-foreground">Premium Home Organization</p>
              </div>
            </Link>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative hover:bg-accent/20">
                <ShoppingCart className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground font-serif">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{(item as any).category || 'Product'}</p>
                            <h3 className="text-lg font-semibold text-foreground font-serif">{item.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xl font-bold text-foreground">
                                ${item.price.toLocaleString()} CAD
                              </span>
                              {(item as any).originalPrice && (
                                <>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${(item as any).originalPrice.toLocaleString()} CAD
                                  </span>
                                  <Badge className="bg-red-100 text-red-700 text-xs">
                                    Save ${(((item as any).originalPrice - item.price) * item.quantity).toLocaleString()} CAD
                                  </Badge>
                                </>
                              )}
                            </div>
                            {item.customizations && (
                              <div className="text-sm text-muted-foreground mt-2">
                                {item.customizations.width && item.customizations.height && (
                                  <span>
                                    Size: {item.customizations.width}" × {item.customizations.height}"
                                  </span>
                                )}
                                {item.customizations.hardware && (
                                  <span className="ml-2">Hardware: {item.customizations.hardware}</span>
                                )}
                                {item.customizations.installation && <span className="ml-2">+ Installation</span>}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          {((item as any).features || []).slice(0, 2).map((feature: string, index: number) => (
                            <span key={index} className="flex items-center">
                              <div className="w-1 h-1 bg-accent rounded-full mr-2"></div>
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground mr-3">Quantity:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">
                              ${(item.price * item.quantity).toLocaleString()} CAD
                            </p>
                            {(item as any).originalPrice && (
                              <p className="text-sm text-green-600">
                                You save ${(((item as any).originalPrice - item.price) * item.quantity).toLocaleString()} CAD
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="pt-6">
              <Link href="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 bg-transparent">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()} CAD</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo ({appliedPromo})</span>
                    <span>-${promoDiscount.toFixed(2)} CAD</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping} CAD`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (HST)</span>
                  <span className="font-medium">${tax.toFixed(2)} CAD</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)} CAD</span>
                </div>

                {shipping > 0 && (
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm text-accent-foreground">
                      <Truck className="w-4 h-4 inline mr-2" />
                      Add ${(500 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Promo Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={applyPromoCode} variant="outline">
                    <Tag className="w-4 h-4 mr-2" />
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-green-600 mt-2">Promo code {appliedPromo} applied! 10% off your order.</p>
                )}
              </CardContent>
            </Card>

            {/* Trust Signals */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-accent mr-3" />
                    <span className="text-muted-foreground">Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Truck className="w-4 h-4 text-accent mr-3" />
                    <span className="text-muted-foreground">Free shipping on orders over $500</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Gift className="w-4 h-4 text-accent mr-3" />
                    <span className="text-muted-foreground">30-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            {/* Alternative Actions */}
            <div className="space-y-2">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                Get Free Quote
              </Button>
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
