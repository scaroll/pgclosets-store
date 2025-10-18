"use client"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Order } from "@/lib/types"

interface InventoryItem {
  productId: string
  stock: number
  reserved: number
  lowStockThreshold: number
  lastUpdated: Date
}

interface InventoryState {
  inventory: InventoryItem[]
  orders: Order[]
  isLoading: boolean
}

type InventoryAction =
  | { type: "LOAD_INVENTORY"; payload: InventoryItem[] }
  | { type: "UPDATE_STOCK"; payload: { productId: string; quantity: number } }
  | { type: "RESERVE_STOCK"; payload: { productId: string; quantity: number } }
  | { type: "RELEASE_STOCK"; payload: { productId: string; quantity: number } }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"] } }
  | { type: "LOAD_ORDERS"; payload: Order[] }

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case "LOAD_INVENTORY":
      return { ...state, inventory: action.payload, isLoading: false }

    case "UPDATE_STOCK": {
      const inventory = state.inventory.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, stock: Math.max(0, action.payload.quantity), lastUpdated: new Date() }
          : item,
      )
      return { ...state, inventory }
    }

    case "RESERVE_STOCK": {
      const inventory = state.inventory.map((item) =>
        item.productId === action.payload.productId
          ? {
              ...item,
              stock: Math.max(0, item.stock - action.payload.quantity),
              reserved: item.reserved + action.payload.quantity,
              lastUpdated: new Date(),
            }
          : item,
      )
      return { ...state, inventory }
    }

    case "RELEASE_STOCK": {
      const inventory = state.inventory.map((item) =>
        item.productId === action.payload.productId
          ? {
              ...item,
              stock: item.stock + action.payload.quantity,
              reserved: Math.max(0, item.reserved - action.payload.quantity),
              lastUpdated: new Date(),
            }
          : item,
      )
      return { ...state, inventory }
    }

    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] }

    case "UPDATE_ORDER_STATUS": {
      const orders = state.orders.map((order) =>
        order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order,
      )
      return { ...state, orders }
    }

    case "LOAD_ORDERS":
      return { ...state, orders: action.payload }

    default:
      return state
  }
}

const initialState: InventoryState = {
  inventory: [],
  orders: [],
  isLoading: true,
}

interface InventoryContextType extends InventoryState {
  updateStock: (productId: string, quantity: number) => void
  reserveStock: (productId: string, quantity: number) => void
  releaseStock: (productId: string, quantity: number) => void
  processOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  getStockLevel: (productId: string) => number
  isLowStock: (productId: string) => boolean
  getLowStockItems: () => InventoryItem[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Mock inventory data
const mockInventory: InventoryItem[] = [
  { productId: "euro-1-lite-bypass-offwhite", stock: 25, reserved: 3, lowStockThreshold: 10, lastUpdated: new Date() },
  { productId: "euro-1-lite-bypass-ironage", stock: 18, reserved: 2, lowStockThreshold: 10, lastUpdated: new Date() },
  { productId: "euro-3-lite-bypass", stock: 32, reserved: 5, lowStockThreshold: 15, lastUpdated: new Date() },
  { productId: "euro-5-lite-bypass", stock: 8, reserved: 1, lowStockThreshold: 10, lastUpdated: new Date() },
  { productId: "harmony-1-lite-bypass", stock: 45, reserved: 7, lowStockThreshold: 20, lastUpdated: new Date() },
  { productId: "twilight-1-lite-bypass", stock: 22, reserved: 4, lowStockThreshold: 15, lastUpdated: new Date() },
  { productId: "lace-multix-bypass", stock: 15, reserved: 2, lowStockThreshold: 10, lastUpdated: new Date() },
  { productId: "trident-doublek-bypass", stock: 28, reserved: 6, lowStockThreshold: 15, lastUpdated: new Date() },
  { productId: "savona-2panel-steel-bypass", stock: 55, reserved: 8, lowStockThreshold: 25, lastUpdated: new Date() },
  { productId: "ashbury-2panel-steel-bypass", stock: 42, reserved: 5, lowStockThreshold: 20, lastUpdated: new Date() },
]

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState)

  // Load inventory from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("pg-closets-inventory")
    if (savedInventory) {
      try {
        const inventory = JSON.parse(savedInventory)
        dispatch({ type: "LOAD_INVENTORY", payload: inventory })
      } catch (error) {
        console.error("Failed to load inventory from localStorage:", error)
        dispatch({ type: "LOAD_INVENTORY", payload: mockInventory })
      }
    } else {
      dispatch({ type: "LOAD_INVENTORY", payload: mockInventory })
    }

    const savedOrders = localStorage.getItem("pg-closets-orders")
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders)
        dispatch({ type: "LOAD_ORDERS", payload: orders })
      } catch (error) {
        console.error("Failed to load orders from localStorage:", error)
      }
    }
  }, [])

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pg-closets-inventory", JSON.stringify(state.inventory))
  }, [state.inventory])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pg-closets-orders", JSON.stringify(state.orders))
  }, [state.orders])

  const updateStock = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_STOCK", payload: { productId, quantity } })
  }

  const reserveStock = (productId: string, quantity: number) => {
    dispatch({ type: "RESERVE_STOCK", payload: { productId, quantity } })
  }

  const releaseStock = (productId: string, quantity: number) => {
    dispatch({ type: "RELEASE_STOCK", payload: { productId, quantity } })
  }

  const processOrder = (order: Order) => {
    // Reserve stock for order items
    order.items.forEach((item) => {
      reserveStock(item.productId, item.quantity)
    })
    dispatch({ type: "ADD_ORDER", payload: order })
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } })
  }

  const getStockLevel = (productId: string): number => {
    const item = state.inventory.find((inv) => inv.productId === productId)
    return item ? item.stock : 0
  }

  const isLowStock = (productId: string): boolean => {
    const item = state.inventory.find((inv) => inv.productId === productId)
    return item ? item.stock <= item.lowStockThreshold : false
  }

  const getLowStockItems = (): InventoryItem[] => {
    return state.inventory.filter((item) => item.stock <= item.lowStockThreshold)
  }

  return (
    <InventoryContext.Provider
      value={{
        ...state,
        updateStock,
        reserveStock,
        releaseStock,
        processOrder,
        updateOrderStatus,
        getStockLevel,
        isLowStock,
        getLowStockItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
