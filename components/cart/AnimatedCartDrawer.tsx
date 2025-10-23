'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cartDrawer, modalOverlay, slideIn } from '@/lib/animations/variants'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

interface AnimatedCartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export default function AnimatedCartDrawer({
  isOpen,
  onClose,
  items,
  onQuantityChange,
  onRemove
}: AnimatedCartDrawerProps) {
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleRemove = (id: string) => {
    setRemovingItemId(id)
    setTimeout(() => {
      onRemove(id)
      setRemovingItemId(null)
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={cartDrawer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                className="flex items-center justify-between p-6 border-b"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    {totalItems > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"
                      >
                        {totalItems}
                      </motion.div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold">Shopping Cart</h2>
                </div>
                <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center h-64 text-center"
                    >
                      <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-2">Your cart is empty</p>
                      <p className="text-sm text-gray-400">
                        Add some products to get started!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            x: -100,
                            height: 0,
                            margin: 0
                          }}
                          transition={{
                            opacity: { duration: 0.2 },
                            x: { duration: 0.3 },
                            height: { duration: 0.3 },
                            margin: { duration: 0.3 }
                          }}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {/* Product Image */}
                          <motion.div
                            className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm leading-tight mb-1">
                              {item.name}
                            </h3>
                            {item.variant && (
                              <p className="text-xs text-gray-500 mb-2">
                                {item.variant}
                              </p>
                            )}
                            <p className="font-semibold text-primary">
                              ${item.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-center gap-2">
                            <motion.div className="flex items-center gap-1">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              </motion.div>

                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="w-8 text-center font-medium text-sm"
                              >
                                {item.quantity}
                              </motion.span>

                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            </motion.div>

                            {/* Remove Button */}
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleRemove(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  className="border-t bg-white p-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full" onClick={onClose}>
                        Continue Shopping
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}