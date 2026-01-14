"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  id: string
  title: string
  price: number
  qty: number
  image: string
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("pg-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        setItems([])
      }
    }
  }, [])

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(id)
      return
    }
    const newItems = items.map(item =>
      item.id === id ? { ...item, qty: newQty } : item
    )
    setItems(newItems)
    localStorage.setItem("pg-cart", JSON.stringify(newItems))
  }

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id)
    setItems(newItems)
    localStorage.setItem("pg-cart", JSON.stringify(newItems))
  }

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.qty), 0)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      // Redirect to contact for quote request
      window.location.href = "/contact?ref=cart"
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Please contact us directly for your order.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PG</span>
                </div>
                <span className="text-xl font-bold text-gray-900">PG Closets</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Browse our collection of premium closet doors and organization systems.</p>
          <Link
            href="/products"
            className="inline-flex px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PG Closets</span>
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg"
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${(item.price / 100).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${(getTotal() / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(getTotal() / 100).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                {isCheckingOut ? "Processing..." : "Request Quote"}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Final pricing includes measurement and installation consultation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
