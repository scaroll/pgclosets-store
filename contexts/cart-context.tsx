"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  inStock: boolean
  features: string[]
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case "UPDATE_QUANTITY":
      if (action.payload.quantity === 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      }
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pgclosets-cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pgclosets-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
