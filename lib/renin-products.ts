import productsData from "./renin-products-database.json"
import type { ArcatProduct } from "./enhanced-renin-products"

type GenericProduct = Product | ArcatProduct | (Product & Record<string, unknown>) | Record<string, unknown>

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  category: "barn" | "bypass" | "bifold" | "pivot" | "hardware"
  subcategory: string
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  featured: boolean
  // Enhanced commerce fields
  sku?: string
  image?: string // Primary image for cart compatibility
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceModifier?: number
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export const products: Product[] = productsData.products
export const categories: Category[] = productsData.categories

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.features.some((feature) => feature.toLowerCase().includes(lowercaseQuery)),
  )
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(price)
}

export function calculateTax(price: number, province = "ON"): number {
  // Canadian tax rates by province
  const taxRates: Record<string, number> = {
    ON: 0.13, // HST
    QC: 0.14975, // GST + QST
    BC: 0.12, // GST + PST
    AB: 0.05, // GST only
    SK: 0.11, // GST + PST
    MB: 0.12, // GST + PST
    NB: 0.15, // HST
    NS: 0.15, // HST
    PE: 0.15, // HST
    NL: 0.15, // HST
    NT: 0.05, // GST only
    NU: 0.05, // GST only
    YT: 0.05, // GST only
  }

  return price * (taxRates[province] || 0.13)
}

// Cart compatibility helpers
const resolveImage = (product: GenericProduct): string | undefined => {
  const potentialImages = [
    product && typeof product === "object" ? (product as any).image : undefined,
    product && typeof product === "object" && Array.isArray((product as any).images)
      ? (product as any).images[0]
      : undefined,
    product && typeof product === "object" ? (product as any).homeDepotImage : undefined,
    product && typeof product === "object" && Array.isArray((product as any).arcatImages)
      ? (product as any).arcatImages[0]
      : undefined,
  ]

  return potentialImages.find((img): img is string => typeof img === "string" && img.length > 0)
}

const normalizeSpecifications = (product: GenericProduct): Record<string, string> | undefined => {
  if (!product || typeof product !== "object") return undefined
  const specs = (product as any).specifications

  if (!specs || typeof specs !== "object") return undefined

  return Object.entries(specs).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === undefined || value === null) return acc
    acc[key] = typeof value === "string" ? value : String(value)
    return acc
  }, {})
}

const resolveVariants = (product: GenericProduct) => {
  if (!product || typeof product !== "object") return undefined
  const variants = (product as any).variants
  if (Array.isArray(variants)) {
    return variants
  }
  return undefined
}

const resolveCategory = (product: GenericProduct): string => {
  if (!product || typeof product !== "object") return "general"
  const category = (product as any).category ?? (product as any).subcategory
  return typeof category === "string" && category.length > 0 ? category : "general"
}

const resolveInStock = (product: GenericProduct): boolean => {
  if (!product || typeof product !== "object") return true
  const value = (product as any).inStock
  return typeof value === "boolean" ? value : true
}

const resolveId = (product: GenericProduct): string => {
  if (!product || typeof product !== "object") {
    return Math.random().toString(36).slice(2)
  }

  const rawId = (product as any).id ?? (product as any).slug ?? (product as any).name
  return typeof rawId === "string" ? rawId : String(rawId ?? Math.random().toString(36).slice(2))
}

const resolvePrice = (product: GenericProduct): number => {
  if (!product || typeof product !== "object") return 0
  const price = (product as any).price
  if (typeof price === "number" && !Number.isNaN(price)) {
    return price
  }
  const numeric = Number(price)
  return Number.isFinite(numeric) ? numeric : 0
}

const resolveDescription = (product: GenericProduct): string => {
  if (!product || typeof product !== "object") return ""
  const description = (product as any).description
  return typeof description === "string" ? description : ""
}

export function toCartProduct(product: GenericProduct): import('./stores/cart-store').Product {
  const specifications = normalizeSpecifications(product)
  const id = resolveId(product)
  const sku =
    product && typeof product === "object" && typeof (product as any).sku === "string"
      ? ((product as any).sku as string)
      : `SKU-${id}`

  return {
    id,
    name: (product as any)?.name ?? "Unknown Product",
    price: resolvePrice(product),
    image: resolveImage(product) ?? "/placeholder.svg",
    description: resolveDescription(product),
    category: resolveCategory(product),
    inStock: resolveInStock(product),
    sku,
    specifications,
    variants: resolveVariants(product),
  }
}

export function generateSKU(product: Product): string {
  const categoryPrefix = {
    barn: 'BRN',
    bypass: 'BYP',
    bifold: 'BIF',
    pivot: 'PIV',
    hardware: 'HRW'
  }

  return `${categoryPrefix[product.category]}-${product.id.slice(-6).toUpperCase()}`
}

// Enhanced product functions with commerce features
export function addToCartFormat(products: Product[]): import('./stores/cart-store').Product[] {
  return products.map(product => ({
    ...toCartProduct(product),
    sku: product.sku || generateSKU(product)
  }))
}
