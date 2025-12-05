/**
 * JSON Product Data Access Layer
 *
 * This module provides a fallback data access layer for products when the database is unavailable.
 * It imports JSON product data and transforms it to match the expected Product interface.
 */

import type { Product, ProductCategory, ProductVariant, ProductOption } from '@/types/product'
import reninProductsData from '@/data/renin-products.json'

// Interface for the JSON product data structure
interface JsonProduct {
  id: string
  slug: string
  name: string
  brand: string
  tagline?: string
  description: string
  features: string[]
  specifications: {
    frameMaterial?: string
    coreMaterial?: string
    thickness?: string
    weightCapacity?: string
    warranty?: string
    installationTime?: string
    madeIn?: string
    certifications?: string
    dimensions?: {
      width: number
      height: number
      unit: string
    }
    [key: string]: any
  }
  attributes: {
    type?: string
    style?: string
    frame?: string
    finish?: string
    material?: string
    origin?: string
    warranty?: string
    installationTime?: string
    madeInCanada?: boolean
    ecoFriendly?: boolean
    customOptions?: boolean
    [key: string]: any
  }
  media: Array<{
    url: string
    alt: string
    role: string
    width?: number
    height?: number
  }>
  variants: Array<{
    sku: string
    name: string
    priceCAD: number
    installAddonCAD?: number
    availability: string
    dimensions: {
      width: number
      height: number
      unit: string
    }
    weight?: number
    finish?: string
  }>
  badges?: string[]
  relatedProductIds?: string[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  category: string
  subcategory?: string
  collection?: string
  series?: string
  isNew: boolean
  isFeatured: boolean
  isBestSeller?: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Map JSON category to ProductCategory type
 */
function mapCategory(category: string): ProductCategory {
  const categoryMap: Record<string, ProductCategory> = {
    'barn-doors': 'barn-doors',
    'bifold-doors': 'bifold-doors',
    'bypass-doors': 'bypass-doors',
    'pivot-doors': 'pivot-doors',
    'room-dividers': 'room-dividers',
    'hardware': 'hardware',
    'mirrors': 'mirrors',
  }

  const normalized = category.toLowerCase().replace(/\s+/g, '-')
  return (categoryMap[normalized] || 'barn-doors') as ProductCategory
}

/**
 * Transform JSON product to Product interface
 */
function transformJsonProduct(jsonProduct: JsonProduct): Product {
  // Extract price from first variant (convert CAD dollars to cents)
  const baseVariant = jsonProduct.variants[0]
  const price = baseVariant ? Math.round(baseVariant.priceCAD * 100) : 0

  // Check if any variant has a sale price (for now, no sale logic in JSON)
  const salePrice = undefined

  // Extract all image URLs from media
  const images = jsonProduct.media
    .filter(m => m.role === 'hero' || m.role === 'detail' || m.role === 'gallery')
    .map(m => m.url)

  // Build specifications object
  const specifications: Record<string, string | number> = {}

  // Add all specification fields
  if (jsonProduct.specifications) {
    Object.entries(jsonProduct.specifications).forEach(([key, value]) => {
      if (key === 'dimensions' && typeof value === 'object' && value !== null) {
        const dims = value as { width: number; height: number; unit: string }
        specifications.width = `${dims.width} ${dims.unit}`
        specifications.height = `${dims.height} ${dims.unit}`
      } else if (value !== null && value !== undefined) {
        specifications[key] = value
      }
    })
  }

  // Add attributes to specifications
  if (jsonProduct.attributes) {
    Object.entries(jsonProduct.attributes).forEach(([key, value]) => {
      if (value !== null && value !== undefined && typeof value !== 'object') {
        specifications[key] = value
      }
    })
  }

  // Transform variants to ProductVariant format
  const variants: ProductVariant[] = jsonProduct.variants.map((v, index) => ({
    id: `${jsonProduct.id}-${v.sku}`,
    productId: jsonProduct.id,
    sku: v.sku,
    name: v.name,
    price: Math.round(v.priceCAD * 100), // Convert to cents
    compareAtPrice: undefined,
    options: {
      ...(v.dimensions && {
        Size: `${v.dimensions.width}" x ${v.dimensions.height}"`,
      }),
      ...(v.finish && { Finish: v.finish }),
    },
    inventory: {
      quantity: v.availability === 'InStock' ? 100 : 0,
      tracked: true,
      allowBackorder: v.availability === 'Backorder',
    },
    imageId: images[index] || images[0],
    weight: v.weight,
    dimensions: v.dimensions ? {
      width: v.dimensions.width,
      height: v.dimensions.height,
      depth: 1.75, // Default depth
      unit: 'inches',
    } : undefined,
    active: v.availability === 'InStock' || v.availability === 'Backorder',
  }))

  // Extract unique option values
  const sizeOptions = new Set<string>()
  const finishOptions = new Set<string>()

  variants.forEach(v => {
    if (v.options.Size) sizeOptions.add(v.options.Size)
    if (v.options.Finish) finishOptions.add(v.options.Finish)
  })

  const options: ProductOption[] = []

  if (sizeOptions.size > 0) {
    options.push({
      id: `${jsonProduct.id}-size`,
      name: 'Size',
      values: Array.from(sizeOptions),
      required: true,
    })
  }

  if (finishOptions.size > 0) {
    options.push({
      id: `${jsonProduct.id}-finish`,
      name: 'Finish',
      values: Array.from(finishOptions),
      required: false,
    })
  }

  // Determine if product is in stock (any variant in stock)
  const inStock = jsonProduct.variants.some(v => v.availability === 'InStock')

  return {
    id: jsonProduct.id,
    name: jsonProduct.name,
    slug: jsonProduct.slug,
    category: mapCategory(jsonProduct.category),
    price,
    salePrice,
    images,
    description: jsonProduct.description,
    features: jsonProduct.features,
    specifications,
    rating: 4.5, // Default rating (no reviews in JSON)
    reviewCount: 0,
    inStock,
    isNew: jsonProduct.isNew,
    isFeatured: jsonProduct.isFeatured,

    // Additional metadata
    popularity: jsonProduct.isBestSeller ? 100 : 50,
    createdAt: jsonProduct.createdAt,
    updatedAt: jsonProduct.updatedAt,
    sku: baseVariant?.sku,
    brand: jsonProduct.brand,
    tags: jsonProduct.badges || [],

    // Inventory (aggregate from variants)
    inventory: {
      tracked: true,
      quantity: variants.reduce((sum, v) => sum + v.inventory.quantity, 0),
      lowStockThreshold: 10,
      allowBackorder: variants.some(v => v.inventory.allowBackorder),
    },

    // Variants and options
    variants,
    options,
  }
}

/**
 * Get all products from JSON data
 */
export function getAllProducts(): Product[] {
  return (reninProductsData as JsonProduct[]).map(transformJsonProduct)
}

/**
 * Get a single product by slug
 */
export function getProductBySlug(slug: string): Product | null {
  const jsonProduct = (reninProductsData as JsonProduct[]).find(
    (p) => p.slug === slug
  )

  if (!jsonProduct) {
    return null
  }

  return transformJsonProduct(jsonProduct)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  const products = reninProductsData as JsonProduct[]

  return products
    .filter((p) => mapCategory(p.category) === category)
    .map(transformJsonProduct)
}

/**
 * Get all unique product categories
 */
export function getProductCategories(): ProductCategory[] {
  const products = reninProductsData as JsonProduct[]
  const categories = new Set<ProductCategory>()

  products.forEach((p) => {
    categories.add(mapCategory(p.category))
  })

  return Array.from(categories).sort()
}

/**
 * Get featured products
 */
export function getFeaturedProducts(limit?: number): Product[] {
  const products = getAllProducts()
  const featured = products.filter((p) => p.isFeatured)

  return limit ? featured.slice(0, limit) : featured
}

/**
 * Get new products
 */
export function getNewProducts(limit?: number): Product[] {
  const products = getAllProducts()
  const newProducts = products.filter((p) => p.isNew)

  return limit ? newProducts.slice(0, limit) : newProducts
}

/**
 * Search products by query
 */
export function searchProducts(query: string): Product[] {
  const products = getAllProducts()
  const lowerQuery = query.toLowerCase()

  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand?.toLowerCase().includes(lowerQuery) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  })
}

/**
 * Get products by IDs
 */
export function getProductsByIds(ids: string[]): Product[] {
  const products = getAllProducts()
  return products.filter((p) => ids.includes(p.id))
}

/**
 * Get product statistics
 */
export function getProductStats() {
  const products = getAllProducts()

  return {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    featured: products.filter((p) => p.isFeatured).length,
    new: products.filter((p) => p.isNew).length,
    byCategory: getProductCategories().reduce((acc, category) => {
      acc[category] = getProductsByCategory(category).length
      return acc
    }, {} as Record<ProductCategory, number>),
  }
}
