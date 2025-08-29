"use client"

import { useMedusaCart } from "@/hooks/use-medusa-cart"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { X, Minus, Plus, ShoppingBag } from "@/components/ui/icons"
import type { LineItem } from "@medusajs/medusa"

interface CartDrawerProps {
  isOpen?: boolean
  onClose?: () => void
}

export function CartDrawer({ isOpen = false, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, getTotalItems, loading } = useMedusaCart()

  const closeCart = onClose || (() => {})

  if (!isOpen) return null

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} CAD`
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-h3">Shopping Cart ({getTotalItems()})</h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pg-blue mx-auto mb-4"></div>
                <p className="text-gray-500">Loading cart...</p>
              </div>
            ) : !cart?.items?.length ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={closeCart} href="/store">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item: LineItem) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <OptimizedImage
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={`${item.title} - Cart item - PG Closets`}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                      sizes="64px"
                      quality={90}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.description}</p>
                      <p className="text-sm font-medium text-pg-navy">{formatPrice(item.unit_price)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart?.items?.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(cart.total || 0)}</span>
              </div>
              <div className="space-y-2">
                <Button className="w-full" href="/checkout">
                  Proceed to Checkout
                </Button>
                <Button variant="secondary" className="w-full" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
