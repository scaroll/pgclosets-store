import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { QuoteItem, QuoteRequest } from "@/lib/types/quote"
import type { CartItem } from "@/lib/types"

const TAX_RATE = 0.13 // 13% HST for Ontario

interface QuoteState {
  items: QuoteItem[]
  itemCount: number
  subtotal: number
  tax: number
  total: number
  addItem: (item: QuoteItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearQuote: () => void
  addFromCart: (cartItems: CartItem[]) => void
  convertToQuoteRequest: (customerInfo: QuoteRequest["customerInfo"], projectDetails?: QuoteRequest["projectDetails"]) => QuoteRequest
}

function calculateTotals(items: QuoteItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { subtotal, tax, total, itemCount }
}

export const useQuote = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      total: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.productId === item.productId &&
              JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
          )

          let newItems: QuoteItem[]
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          } else {
            newItems = [...state.items, { ...item, id: Date.now().toString() + Math.random() }]
          }

          const totals = calculateTotals(newItems)
          return { items: newItems, ...totals }
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id)
          const totals = calculateTotals(newItems)
          return { items: newItems, ...totals }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
            .filter((i) => i.quantity > 0)
          const totals = calculateTotals(newItems)
          return { items: newItems, ...totals }
        }),

      clearQuote: () =>
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          total: 0,
        }),

      addFromCart: (cartItems) =>
        set((state) => {
          const quoteItems: QuoteItem[] = cartItems.map((cartItem) => ({
            id: cartItem.id,
            productId: cartItem.productId,
            name: cartItem.name,
            image: cartItem.image,
            price: cartItem.price,
            quantity: cartItem.quantity,
            customizations: cartItem.customizations,
          }))

          const newItems = [...state.items, ...quoteItems]
          const totals = calculateTotals(newItems)
          return { items: newItems, ...totals }
        }),

      convertToQuoteRequest: (customerInfo, projectDetails) => {
        const state = get()
        return {
          id: Date.now().toString(),
          items: state.items,
          customerInfo,
          projectDetails,
          subtotal: state.subtotal,
          tax: state.tax,
          total: state.total,
          status: "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
    }),
    { name: "pg-closets-quote-v1" }
  )
)
