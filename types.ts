export interface Product {
  id: string
  name: string
  slug: string
  type: string
  material: string
  finish: string
  glassType?: string
  priceRange: {
    min: number
    max: number
  }
  image: string
  images?: string[]
  description: string
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  category: string
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
