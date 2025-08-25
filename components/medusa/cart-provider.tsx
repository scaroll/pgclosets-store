"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import { HttpTypes } from "@/lib/medusa"
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/lib/medusa"

interface CartState {
  cart: HttpTypes.StoreCart | null
  isLoading: boolean
  error: string | null
}

interface CartContextType extends CartState {
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  refreshCart: () => Promise<void>
  getCartItemsCount: () => number
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction = 
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: HttpTypes.StoreCart | null }
  | { type: "SET_ERROR"; payload: string | null }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_CART":
      return { ...state, cart: action.payload, error: null }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    default:
      return state
  }
}

export function MedusaCartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isLoading: false,
    error: null,
  })

  const refreshCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const cart = await getCart()
      dispatch({ type: "SET_CART", payload: cart })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to load cart" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const updatedCart = await addToCart(variantId, quantity, state.cart?.id)
      dispatch({ type: "SET_CART", payload: updatedCart })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to add item" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateItem = async (lineItemId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const updatedCart = await updateCartItem(lineItemId, quantity, state.cart?.id)
      dispatch({ type: "SET_CART", payload: updatedCart })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to update item" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const removeItem = async (lineItemId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const updatedCart = await removeFromCart(lineItemId, state.cart?.id)
      dispatch({ type: "SET_CART", payload: updatedCart })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Failed to remove item" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const getCartItemsCount = () => {
    return state.cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
  }

  const getCartTotal = () => {
    return state.cart?.total || 0
  }

  // Load cart on mount
  useEffect(() => {
    refreshCart()
  }, [])

  const value: CartContextType = {
    ...state,
    addItem,
    updateItem,
    removeItem,
    refreshCart,
    getCartItemsCount,
    getCartTotal,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useMedusaCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useMedusaCart must be used within a MedusaCartProvider")
  }
  return context
}