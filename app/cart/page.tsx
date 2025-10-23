"use client"

import StandardLayout from "@/components/layout/StandardLayout"
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton"
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  Gift,
  Tag,
  Star,
  Clock,
  ChevronRight,
  Lock,
  Check,
  X,
  AlertCircle,
  Percent
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { useCart } from "../../lib/useCart"
import { toast } from "sonner"

interface SavedItem {
  id: string
  title: string
  price: number
  image: string
  slug?: string
  savedAt: Date
}

interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
  description: string
}

interface PromoCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder?: number
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 0,
    estimatedDays: '5-7 business days',
    description: 'Free shipping on orders over $100'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 25,
    estimatedDays: '2-3 business days',
    description: 'Fast track delivery'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 50,
    estimatedDays: 'Next business day',
    description: 'Order before 12pm EST'
  }
]

const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage', minOrder: 50 },
  { code: 'FREESHIP', discount: 25, type: 'fixed', minOrder: 100 },
  { code: 'SAVE20', discount: 20, type: 'percentage', minOrder: 200 }
]

const RECOMMENDED_PRODUCTS = [
  { id: 'rec1', title: 'Premium Wardrobe Organizer', price: 299, image: '/placeholder.svg', rating: 4.8, reviews: 124 },
  { id: 'rec2', title: 'Shoe Storage Solution', price: 149, image: '/placeholder.svg', rating: 4.6, reviews: 89 },
  { id: 'rec3', title: 'Accessory Drawer Set', price: 79, image: '/placeholder.svg', rating: 4.9, reviews: 203 }
]

export default function CartPage() {
  const { items, remove, setQty } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>('standard')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState('')
  const [giftWrapping, setGiftWrapping] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)

  const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0)
  const shippingCost = calculateShipping(subtotal, selectedShipping)
  const giftWrappingCost = giftWrapping ? items.length * 5 : 0
  const promoDiscount = calculatePromoDiscount(subtotal, appliedPromo)
  const tax = (subtotal + shippingCost + giftWrappingCost - promoDiscount) * 0.13
  const total = subtotal + shippingCost + giftWrappingCost - promoDiscount + tax

  const freeShippingThreshold = 100
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && items.length > 0) {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [items.length])

  function calculateShipping(subtotal: number, shippingId: string): number {
    if (subtotal >= freeShippingThreshold && shippingId === 'standard') return 0
    const option = SHIPPING_OPTIONS.find(opt => opt.id === shippingId)
    return option?.price || 0
  }

  function calculatePromoDiscount(subtotal: number, promo: PromoCode | null): number {
    if (!promo || (promo.minOrder && subtotal < promo.minOrder)) return 0
    return promo.type === 'percentage' ? subtotal * (promo.discount / 100) : promo.discount
  }

  const handleApplyPromo = () => {
    setPromoError('')
    const promo = PROMO_CODES.find(p => p.code.toLowerCase() === promoCode.toLowerCase())
    if (!promo) {
      setPromoError('Invalid promo code')
      return
    }
    if (promo.minOrder && subtotal < promo.minOrder) {
      setPromoError(`Minimum order of $${promo.minOrder} required`)
      return
    }
    setAppliedPromo(promo)
    toast.success(`Promo code applied: ${promo.code}`)
    setPromoCode('')
  }

  const handleSaveForLater = (item: any) => {
    const savedItem: SavedItem = {
      ...item,
      savedAt: new Date()
    }
    setSavedItems([...savedItems, savedItem])
    remove(item.id)
    toast.success('Item saved for later')
  }

  const handleMoveToCart = (savedItem: SavedItem) => {
    // Add back to cart logic here
    setSavedItems(savedItems.filter(item => item.id !== savedItem.id))
    toast.success('Item moved to cart')
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      window.location.href = "/checkout"
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
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
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {/* Exit Intent Popup */}
        {showExitIntent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Wait! Don't leave empty-handed</h3>
                  <p className="text-gray-600 mb-4">Use code <span className="font-bold">STAY10</span> for 10% off your order</p>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowExitIntent(false)} className="flex-1">
                      Continue Shopping
                    </Button>
                    <Button variant="outline" onClick={() => setShowExitIntent(false)}>
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Cart Items */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cart Items</span>
                    <Badge variant="secondary">{items.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-24 h-24 relative flex-shrink-0 mx-auto sm:mx-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                            sizes="96px"
                          />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">Premium Quality Product</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">(4.8)</span>
                          </div>
                          <p className="font-bold text-xl text-slate-900">${item.price}</p>
                        </div>

                        <div className="flex flex-col items-center sm:items-end gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => item.qty > 1 && setQty(item.id, item.qty - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>

                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => setQty(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center h-8"
                              min="1"
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveForLater(item)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Heart className="w-4 h-4" />
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
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Saved for Later ({savedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveToCart(item)}
                      >
                        Move to Cart
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button onClick={handleApplyPromo} variant="outline">
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="text-red-600 text-sm mt-2">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="mt-2 p-2 bg-green-50 rounded flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">
                      {appliedPromo.code} applied (-${promoDiscount.toFixed(2)})
                    </span>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Available offers:</p>
                  <div className="space-y-1">
                    {PROMO_CODES.map((promo) => (
                      <div key={promo.code} className="text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{promo.code}</span>
                        {promo.type === 'percentage' ? ` ${promo.discount}% off` : ` $${promo.discount} off`}
                        {promo.minOrder && ` (min $${promo.minOrder})`}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShipping === option.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        <p className="text-sm text-gray-500">{option.estimatedDays}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {option.price === 0 ? 'FREE' : `$${option.price}`}
                      </p>
                      {option.id === 'standard' && amountForFreeShipping > 0 && (
                        <p className="text-xs text-gray-500">
                          Add ${amountForFreeShipping.toFixed(2)} more for free shipping
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Gift Wrapping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Gift Wrapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrapping}
                    onChange={(e) => setGiftWrapping(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Add gift wrapping</p>
                    <p className="text-sm text-gray-600">Premium gift wrapping service</p>
                  </div>
                  <p className="font-semibold">${(items.length * 5).toFixed(2)}</p>
                </label>
              </CardContent>
            </Card>

            {/* Product Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {RECOMMENDED_PRODUCTS.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="w-full h-32 relative mb-3">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{product.title}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                      </div>
                      <p className="font-semibold text-sm mb-2">${product.price}</p>
                      <Button size="sm" className="w-full">
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.qty, 0)} items):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                )}

                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Gift Wrapping:</span>
                    <span>${giftWrappingCost.toFixed(2)}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount:</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax (13% HST):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)} CAD</span>
                </div>

                {amountForFreeShipping > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">
                        Add ${amountForFreeShipping.toFixed(2)} more for free shipping!
                      </p>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
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

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Buyer Protection</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Accepted Payment Methods</p>
                  <div className="flex gap-2">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">VISA</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">MC</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">AMEX</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">PayPal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StandardLayout>
  )
}
