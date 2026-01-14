"use client"

// Removed shadcn import - using native HTML
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Home, Truck, Shield, Gift } from "lucide-react"
import Link from "next/link"
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">PG Closets</span>
                  <p className="text-xs text-gray-500">Premium Home Organization</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
            Discover our premium closet solutions and start building your dream organization system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Shop Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">PG Closets</span>
                <p className="text-xs text-gray-500">Premium Home Organization</p>
              </div>
            </Link>

            <div className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Door</p>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-xl font-bold text-gray-900">
                            ${item.price.toLocaleString()} CAD
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500 mr-3">Quantity:</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.price * item.quantity).toLocaleString()} CAD
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()} CAD</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo ({appliedPromo})</span>
                    <span>-${promoDiscount.toFixed(2)} CAD</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping} CAD`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (HST)</span>
                  <span className="font-medium">${tax.toFixed(2)} CAD</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Shield className="w-4 h-4 text-orange-500 mr-3" />
                  <span className="text-gray-500">Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center text-sm">
                  <Truck className="w-4 h-4 text-orange-500 mr-3" />
                  <span className="text-gray-500">Free shipping on orders over $500</span>
                </div>
                <div className="flex items-center text-sm">
                  <Gift className="w-4 h-4 text-orange-500 mr-3" />
                  <span className="text-gray-500">30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
