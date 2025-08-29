"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/renin-products"
import { ShoppingBag, Minus, Plus, X } from "@/components/ui/icons"

export function CartPageClient() {
  const { state, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  if (state.items.length === 0) {
    return (
      <main className="section-apple">
        <div className="container-apple">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-pg-gray/30 mx-auto mb-8" />
            <h1 className="text-h1 mb-4">Your Cart is Empty</h1>
            <p className="text-body-l text-pg-gray mb-8 max-w-md mx-auto">
              Looks like you haven't added any premium closet doors to your cart yet.
            </p>
            <Button variant="primary" size="lg" href="/store">
              Shop Closet Doors
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section-apple">
      <div className="container-apple">
        <div className="mb-8">
          <h1 className="text-h1 mb-4">Shopping Cart ({getTotalItems()})</h1>
          <p className="text-body-l text-pg-gray">Review your selected premium closet doors</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedFinish}`}
                className="card-apple p-6 flex gap-6"
              >
                <img
                  src={item.product.images[0] || "/placeholder.svg?height=120&width=120"}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-h3 mb-2">{item.product.name}</h3>
                  <p className="text-body-s text-pg-gray mb-2">{item.product.description}</p>

                  {item.selectedSize && (
                    <p className="text-sm text-pg-gray">
                      <span className="font-medium">Size:</span> {item.selectedSize}
                    </p>
                  )}
                  {item.selectedFinish && (
                    <p className="text-sm text-pg-gray">
                      <span className="font-medium">Finish:</span> {item.selectedFinish}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-pg-border flex items-center justify-center hover:bg-pg-sky/10 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-pg-border flex items-center justify-center hover:bg-pg-sky/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-pg-navy">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card-apple p-6 sticky top-8">
              <h3 className="text-h3 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pg-navy">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="primary" size="lg" href="/checkout" className="w-full">
                  Proceed to Checkout
                </Button>
                <Button variant="secondary" size="lg" href="/store" className="w-full">
                  Continue Shopping
                </Button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Free shipping in Ottawa area</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Professional installation available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
