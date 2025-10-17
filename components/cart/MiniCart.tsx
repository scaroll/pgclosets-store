"use client"

import { Fragment, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Plus, Minus, ChevronRight, Trash2 } from "lucide-react"
import { useEnhancedCart } from "@/hooks/use-enhanced-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface MiniCartProps {
  className?: string
}

export function MiniCart({ className }: MiniCartProps) {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalItems,
    clearCart
  } = useEnhancedCart()

  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([])

  // Track recently added items
  useEffect(() => {
    const latestItem = items[items.length - 1]
    if (latestItem) {
      setRecentlyAdded(prev => [...prev, latestItem.productId].slice(-3))
    }
  }, [items.length])

  const subtotal = getSubtotal()
  const itemCount = getTotalItems()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-xl font-semibold">
                  Your Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            {items.length > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="mb-6 last:mb-0"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                              sizes="80px"
                            />
                            {recentlyAdded.includes(item.productId) && (
                              <Badge className="absolute -top-2 -right-2 text-xs px-1 py-0.5 bg-green-500">
                                New
                              </Badge>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm mb-1 line-clamp-2">
                              {item.name}
                            </h3>

                            {/* Options */}
                            {Object.entries(item.selectedOptions || {}).length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <Badge
                                    key={key}
                                    variant="outline"
                                    className="text-xs py-0.5 px-1"
                                  >
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Price & Quantity */}
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1,
                                      item.selectedOptions
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1,
                                      item.selectedOptions
                                    )
                                  }
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    removeItem(item.productId, item.selectedOptions)
                                    toast.success("Item removed")
                                  }}
                                  className="p-1 hover:bg-red-50 text-red-600 rounded ml-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {item.installationIncluded && (
                              <span className="text-xs text-green-600">
                                Installation included
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t p-6">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-xl font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/checkout" onClick={closeCart}>
                      <Button size="lg" className="w-full gap-2">
                        Checkout
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link href="/cart" onClick={closeCart}>
                      <Button size="lg" variant="outline" className="w-full">
                        View Cart
                      </Button>
                    </Link>
                  </div>

                  {/* Clear Cart */}
                  {items.length > 2 && (
                    <button
                      onClick={() => {
                        if (confirm("Remove all items from cart?")) {
                          clearCart()
                          toast.success("Cart cleared")
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-700 mt-4 w-full text-center"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">
                  Add items to get started
                </p>
                <Link href="/products" onClick={closeCart}>
                  <Button>Browse Products</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Cart trigger button component
export function CartTrigger() {
  const { openCart, getTotalItems } = useEnhancedCart()
  const itemCount = getTotalItems()

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Open shopping cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </motion.span>
      )}
    </button>
  )
}