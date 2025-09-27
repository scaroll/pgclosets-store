"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface MedusaCartContextType {
  cart: any | null
  loading: boolean
  error: string | null
  addToCart: (_variantId: string, _quantity: number) => Promise<void>
  updateQuantity: (_lineId: string, _quantity: number) => Promise<void>
  removeFromCart: (_lineId: string) => Promise<void>
  getTotalItems: () => number
  getSubtotal: () => number
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const MedusaCartContext = createContext<MedusaCartContextType | undefined>(undefined)

export function MedusaCartProvider({ children }: { children: ReactNode }) {
  const [cart, _setCart] = useState<any | null>(null)
  const [loading, _setLoading] = useState(false)
  const [error, _setError] = useState<string | null>(null)

  const addToCart = async (_variantId: string, _quantity: number) => {
    // Stub - Medusa removed
  }

  const updateQuantity = async (_lineId: string, _quantity: number) => {
    // Stub - Medusa removed
  }

  const removeFromCart = async (_lineId: string) => {
    // Stub - Medusa removed
  }

  const getTotalItems = () => 0

  const getSubtotal = () => 0

  const clearCart = async () => {
    // Stub - Medusa removed
  }

  const refreshCart = async () => {
    // Stub - Medusa removed
  }

  const value: MedusaCartContextType = {
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
