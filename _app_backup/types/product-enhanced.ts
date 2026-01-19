/**
 * Enhanced Product Types for PG Closets + Renin Integration
 *
 * Complete type definitions for all product categories including
 * Renin barn doors, bifold, bypass, pivot, hardware, and mirrors
 */

// Base Types
export type AvailabilityStatus = 'InStock' | 'OutOfStock' | 'MadeToOrder' | 'Discontinued'

export type DoorType =
  | 'barn'
  | 'bifold'
  | 'bypass'
  | 'pivot'
  | 'closet'
  | 'pocket'
  | 'room-divider'
  | 'hardware'
  | 'mirror'

export type StyleType =
  | 'modern'
  | 'traditional'
  | 'contemporary'
  | 'industrial'
  | 'rustic'
  | 'farmhouse'
  | 'minimalist'
  | 'craftsman'
  | 'mid-century'
  | 'transitional'

export type FrameMaterial =
  | 'aluminum'
  | 'steel'
  | 'wood'
  | 'fiberglass'
  | 'glass'
  | 'composite'
  | 'solid-wood'
  | 'engineered-wood'

export type FinishType =
  | 'matte-black'
  | 'brushed-nickel'
  | 'chrome'
  | 'bronze'
  | 'brass'
  | 'white'
  | 'black'
  | 'natural-wood'
  | 'painted-white'
  | 'stained-oak'
  | 'walnut'
  | 'maple'
  | 'ash'
  | 'hickory'

export type GlazingType =
  | 'clear'
  | 'frosted'
  | 'mirrored'
  | 'tinted'
  | 'obscured'
  | 'laminated'
  | 'tempered'
  | 'low-e'
  | 'privacy'
  | 'textured'

export type HardwareType =
  | 'handle'
  | 'pull'
  | 'hinge'
  | 'track'
  | 'roller'
  | 'guide'
  | 'stopper'
  | 'lock'
  | 'handle-set'
  | 'track-system'

// Enhanced Product Interfaces
export interface ProductMedia {
  url: string
  alt: string
  role: 'hero' | 'detail' | 'gallery' | 'technical' | 'room-scene'
  width?: number
  height?: number
  caption?: string
}

export interface ProductDimensions {
  width: number
  height: number
  depth?: number
  unit: 'inches' | 'mm' | 'cm'
}

export interface ProductVariant {
  sku: string
  name: string
  priceCAD: number
  installAddonCAD?: number
  availability: AvailabilityStatus
  dimensions: ProductDimensions
  weight?: number
  finish?: FinishType
  frame?: FrameMaterial
  glazing?: GlazingType
  configuration?: string
  images?: ProductMedia[]
  specifications?: Record<string, string>
}

export interface ProductAttributes {
  type: DoorType
  style: StyleType
  frame: FrameMaterial
  finish: FinishType
  glazing?: GlazingType
  material?: string
  origin?: string
  warranty?: string
  installationTime?: string
  madeInCanada?: boolean
  ecoFriendly?: boolean
  customOptions?: boolean
}

export interface ProductSEO {
  title: string
  description: string
  keywords: string[]
  canonical?: string
}

export interface ProductSpecifications {
  frameMaterial?: string
  glassType?: string
  trackSystem?: string
  weightCapacity?: string
  finishOptions?: string[]
  warranty?: string
  installationTime?: string
  madeIn?: string
  certifications?: string[]
  dimensions?: ProductDimensions
  openingRequirements?: Record<string, any>
  includedHardware?: string[]
  technicalDrawings?: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  tagline: string
  description: string
  features: string[]
  specifications: ProductSpecifications
  attributes: ProductAttributes
  media: ProductMedia[]
  variants: ProductVariant[]
  badges: string[]
  relatedProductIds: string[]
  seo: ProductSEO
  category?: string
  subcategory?: string
  collection?: string
  series?: string
  isNew?: boolean
  isFeatured?: boolean
  isBestSeller?: boolean
  createdAt?: string
  updatedAt?: string
}

// Renin-Specific Types
export interface ReninProduct extends Product {
  brand: 'Renin'
  reninSku?: string
  reninCategory?: ReninCategory
  reninCollection?: string
  reninSeries?: string
  leadTime?: string
  minimumOrder?: number
  freightRequired?: boolean
}

export type ReninCategory =
  | 'barn-doors'
  | 'bifold-doors'
  | 'bypass-doors'
  | 'pivot-doors'
  | 'room-dividers'
  | 'hardware'
  | 'mirrors'
  | 'closet-doors'

// Hardware Specific Types
export interface HardwareProduct extends Product {
  attributes: ProductAttributes & {
    type: 'hardware'
    hardwareType: HardwareType
    compatibleDoors: DoorType[]
    material: FrameMaterial
    finish: FinishType
    weightCapacity?: number
    dimensions: ProductDimensions
  }
}

// Mirror Specific Types
export interface MirrorProduct extends Product {
  attributes: ProductAttributes & {
    type: 'mirror'
    mirrorType: 'wall-mount' | 'door-mount' | 'floor-standing' | 'recessed'
    frameStyle?: string
    bevelEdge?: boolean
    backingType?: string
  }
}

// Filter and Search Types
export interface ProductFilter {
  categories?: string[]
  types?: DoorType[]
  styles?: StyleType[]
  materials?: FrameMaterial[]
  finishes?: FinishType[]
  glazings?: GlazingType[]
  priceRange?: {
    min: number
    max: number
  }
  inStockOnly?: boolean
  canadianMadeOnly?: boolean
  ecoFriendlyOnly?: boolean
  badges?: string[]
  brands?: string[]
  collections?: string[]
}

export interface SortOption {
  value: string
  label: string
  field: keyof Product | string
  direction: 'asc' | 'desc'
}

// Configuration Types
export interface ProductConfiguration {
  productId: string
  selectedVariant: string
  customOptions?: {
    width?: number
    height?: number
    finish?: FinishType
    glazing?: GlazingType
    hardware?: HardwareType
    installation?: boolean
  }
  price: {
    base: number
    options: number
    installation: number
    total: number
  }
}

// Cart and Checkout Types
export interface CartItem extends ProductConfiguration {
  quantity: number
  addedAt: string
}

export interface QuoteRequest {
  product: ProductConfiguration
  customerInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  projectDetails: {
    roomType: string
    dimensions: ProductDimensions
    installationTimeline: string
    specialRequirements?: string
  }
  submittedAt: string
  status: 'pending' | 'reviewed' | 'quoted' | 'approved' | 'rejected'
}

// Comparison Types
export interface ProductComparison {
  products: Product[]
  criteria: (keyof Product)[]
  weights?: Record<string, number>
}

// Analytics Types
export interface ProductAnalytics {
  views: number
  addToCart: number
  quoteRequests: number
  conversionRate: number
  popularVariants: Array<{
    sku: string
    name: string
    orders: number
  }>
}

// API Response Types
export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
  filters: ProductFilter
  sort: SortOption
}

export interface ProductDetailResponse {
  product: Product
  relatedProducts: Product[]
  variants: ProductVariant[]
  specifications: ProductSpecifications
}

// Error Types
export interface ProductError {
  code: string
  message: string
  details?: Record<string, any>
}

// Utility Types
export type ProductField = keyof Product
export type ProductSearchFields =
  | 'name'
  | 'description'
  | 'tagline'
  | 'features'
  | 'badges'
  | 'seo.keywords'

export type PriceDisplay = {
  from: number
  to: number
  currency: 'CAD'
  formatted: string
}

export type StockStatus = {
  available: boolean
  quantity?: number
  nextAvailable?: string
  location?: string
}