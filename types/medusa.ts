export interface Product {
  id: string
  title: string
  handle: string
  description: string
  thumbnail?: string
  options?: Array<{
    id: string
    title: string
    values: Array<{ value: string }>
  }>
  images: Array<{
    url: string
    altText?: string
  }>
  variants: Array<{
    id: string
    title: string
    sku: string
    price: number
    inventory_quantity: number
  }>
  tags: string[]
  collection?: ProductCollection
  metadata?: Record<string, any>
}

export interface ProductCollection {
  id: string
  title: string
  handle: string
  products?: Product[]
}

export interface Cart {
  id: string
  items: LineItem[]
  region: Region
  shipping_address?: Address
  billing_address?: Address
  payment_sessions?: Array<{
    id: string
    status: string
    provider_id: string
  }>
  subtotal: number
  total: number
  discounts: Discount[]
  gift_cards: GiftCard[]
  shipping_methods: ShippingMethod[]
  status: CartStatus
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  count: number
  offset: number
  limit: number
}

export interface LineItem {
  id: string
  title: string
  variant: {
    id: string
    title: string
    sku: string
    product: {
      title: string
      handle: string
    }
  }
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Address {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province: string
  postal_code: string
  phone?: string
  country_code: string
}

export interface MedusaError {
  code: string
  message: string
  type: string
  tax_total: number
  tax_lines: LineItemTaxLine[]
  created_at: string
  updated_at: string
}

export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  payment_providers: string[]
  fulfillment_providers: string[]
  countries: Country[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Country {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id: string
}

export interface Discount {
  id: string
  code: string
  is_dynamic: boolean
  rule_id: string
  is_disabled: boolean
  parent_discount_id?: string
  starts_at?: string
  ends_at?: string
  valid_duration?: string
  usage_limit?: number
  usage_count: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface GiftCard {
  id: string
  code: string
  value: number
  balance: number
  region_id: string
  is_disabled: boolean
  ends_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ShippingMethod {
  id: string
  shipping_option_id: string
  order_id?: string
  cart_id?: string
  swap_id?: string
  claim_order_id?: string
  price: number
  data: Record<string, unknown>
  metadata?: Record<string, unknown>
  return_id?: string
  created_at: string
  updated_at: string
}

export interface PaymentSession {
  id: string
  cart_id?: string
  provider_id: string
  is_selected?: boolean
  is_initiated?: boolean
  status: string
  data: Record<string, unknown>
  metadata?: Record<string, unknown>
  idempotency_key?: string
  amount?: number
  created_at: string
  updated_at: string
}

export type CartStatus = 'completed' | 'pending' | 'requires_action'

export interface LineItemAdjustment {
  id: string
  item_id: string
  description: string
  discount_id?: string
  amount: number
  metadata?: Record<string, unknown>
}

export interface LineItemTaxLine {
  id: string
  item_id: string
  code: string
  name: string
  rate: number
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  title: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}