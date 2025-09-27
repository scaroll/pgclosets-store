export interface Product {
  id: string
  name: string
  title?: string // Medusa compatibility 
  slug: string
  type: string
  material: string
  finish: string
  glassType?: string
  priceRange?: {
    min: number
    max: number
  }
  image: string
  images?: string[]
  thumbnail?: string // Medusa compatibility
  description: string
  features: string[]
  specifications: Record<string, string | number>
  inStock: boolean
  category: "barn" | "bifold" | "hardware" | "pivot" | "bypass"
  subcategory?: string
  featured?: boolean
  price?: number
  variants?: Array<{
    id: string
    title: string
    prices?: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

// Medusa.js compatibility types
export interface Cart {
  id: string
  items: LineItem[]
  subtotal: number
  total: number
  currency_code: string
  tax_total?: number
  shipping_total?: number
}

export interface LineItem {
  id: string
  product_id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  total: number
  thumbnail?: string
  variant?: {
    id: string
    title: string
  }
}

export interface ProductCollection {
  id: string
  title: string
  handle: string
  products?: Product[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  customizations?: {
    width?: number
    height?: number
    hardware?: string
    installation?: boolean
  }
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: User["address"]
  paymentMethod: string
}

// ARCAT product interface for compatibility
export interface ArcatProduct {
  id: number | string
  name: string
  slug: string
  category: string
  subcategory?: string
  price: number
  homeDepotImage?: string
  arcatImages?: string[]
  images?: string[]
  description: string
  features: string[]
  specifications: Record<string, string | number>
  installationTime?: string
  inStock: boolean
  featured?: boolean
}
