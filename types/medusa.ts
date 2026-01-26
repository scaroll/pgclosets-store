// Local Medusa type definitions to avoid import issues with @medusajs/medusa
// These are simplified types for use in this project

export interface Product {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  images?: ProductImage[]
  variants?: ProductVariant[]
  collection_id?: string
  collection?: ProductCollection
  status?: 'draft' | 'published' | 'proposed' | 'rejected'
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface ProductImage {
  id: string
  url: string
  alt_text?: string
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  barcode?: string
  prices?: ProductPrice[]
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
}

export interface ProductPrice {
  id: string
  currency_code: string
  amount: number
  variant_id?: string
}

export interface ProductCollection {
  id: string
  title: string
  handle: string
  products?: Product[]
  metadata?: Record<string, unknown>
}

export interface Cart {
  id: string
  email?: string
  items: LineItem[]
  region_id?: string
  currency_code?: string
  subtotal?: number
  tax_total?: number
  shipping_total?: number
  discount_total?: number
  total?: number
  metadata?: Record<string, unknown>
}

export interface LineItem {
  id: string
  cart_id?: string
  order_id?: string
  title: string
  description?: string
  thumbnail?: string
  unit_price: number
  quantity: number
  variant_id?: string
  variant?: ProductVariant
  subtotal?: number
  tax_total?: number
  total?: number
  metadata?: Record<string, unknown>
}

export interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface Order {
  id: string
  status: string
  customer_id?: string
  email: string
  items: LineItem[]
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
  currency_code: string
  metadata?: Record<string, unknown>
}
