"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { medusaClient } from "@/lib/medusa-client"
import type { Cart, LineItem } from "@medusajs/medusa"

interface MedusaCartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addToCart: (variantId: string, quantity: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  getTotalItems: () => number
  getSubtotal: () => number
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const MedusaCartContext = createContext<MedusaCartContextType | undefined>(undefined)

export function MedusaCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [])

  const initializeCart = async () => {
    try {
      setLoading(true)
      let cartId = localStorage.getItem("medusa_cart_id")

      if (cartId) {
        // Try to retrieve existing cart
        try {
          const { cart: existingCart } = await medusaClient.getCart(cartId)
          setCart(existingCart)
        } catch {
          // Cart doesn't exist, create new one
          cartId = null
        }
      }

      if (!cartId) {
        // Create new cart
        const { cart: newCart } = await medusaClient.createCart()
        setCart(newCart)
        localStorage.setItem("medusa_cart_id", newCart.id)
      }
    } catch (err) {
      setError("Failed to initialize cart")
      console.error("Cart initialization error:", err)
    } finally {
      setLoading(false)
    }
  }

  const refreshCart = async () => {
    if (!cart?.id) return

    try {
      const { cart: updatedCart } = await medusaClient.getCart(cart.id)
      setCart(updatedCart)
    } catch (err) {
      setError("Failed to refresh cart")
      console.error("Cart refresh error:", err)
    }
  }

  const addToCart = async (variantId: string, quantity: number) => {
    if (!cart?.id) return

    try {
      setLoading(true)
      await medusaClient.addToCart(cart.id, variantId, quantity)
      await refreshCart()
    } catch (err) {
      setError("Failed to add item to cart")
      console.error("Add to cart error:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) return

    try {
      setLoading(true)
      await medusaClient.updateCartItem(cart.id, lineId, quantity)
      await refreshCart()
    } catch (err) {
      setError("Failed to update cart item")
      console.error("Update cart error:", err)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) return

    try {
      setLoading(true)
      await medusaClient.removeFromCart(cart.id, lineId)
      await refreshCart()
    } catch (err) {
      setError("Failed to remove item from cart")
      console.error("Remove from cart error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getTotalItems = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total: number, item: LineItem) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return cart?.subtotal || 0
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      const { cart: newCart } = await medusaClient.createCart()
      setCart(newCart)
      localStorage.setItem("medusa_cart_id", newCart.id)
    } catch (err) {
      setError("Failed to clear cart")
      console.error("Clear cart error:", err)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getSubtotal,
    clearCart,
    refreshCart,
  }

  return <MedusaCartContext.Provider value={value}>{children}</MedusaCartContext.Provider>
}

export function useMedusaCart() {
  const context = useContext(MedusaCartContext)
  if (context === undefined) {
    throw new Error("useMedusaCart must be used within a MedusaCartProvider")
  }
  return context
}
