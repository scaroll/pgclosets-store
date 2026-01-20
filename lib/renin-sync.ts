/**
 * Renin Product Sync Service
 *
 * Syncs products from transformed-renin-products.json to the PostgreSQL database
 *
 * @module lib/renin-sync
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Type definitions
export interface ReninProductImage {
  url: string
  altText: string
}

export interface ReninProductVariant {
  id: string
  title: string
  sku: string
  price: number // in cents
  inventory_quantity: number
}

export interface ReninProductCollection {
  id: string
  title: string
  handle: string
}

export interface ReninProductMetadata {
  source: string
  sku: string
  specifications: {
    sizes?: string[]
    suitable_for_openings?: string
    color?: string
    material?: string
    finish?: string
  }
  pdfs?: string[]
  videos?: string[]
  extractedFrom?: string
  lastSync?: string
}

export interface ReninProduct {
  id: string
  title: string
  handle: string
  description: string
  thumbnail: string
  images: ReninProductImage[]
  variants: ReninProductVariant[]
  tags: string[]
  collection: ReninProductCollection
  metadata: ReninProductMetadata
  created_at: string
  updated_at: string
}

export interface TransformedProduct {
  name: string
  slug: string
  description: string
  category: string
  subcategory: string | null
  price: number
  sku: string | null
  inventory: number
  material: string | null
  finish: string | null
  color: string | null
  features: string[]
  tags: string[]
  status: string
  featured: boolean
}

export interface SyncResult {
  success: boolean
  productsCreated?: number
  imagesCreated?: number
  variantsCreated?: number
  skipped?: boolean
  message?: string
  error?: string
}

export interface SyncOptions {
  force?: boolean
}

// Categories that we recognize
const VALID_CATEGORIES = ['barn-doors', 'bifold-doors', 'bypass-doors', 'closet-doors']

/**
 * Extract the primary category from product tags
 */
function extractCategory(tags: string[]): string {
  for (const tag of tags) {
    if (VALID_CATEGORIES.includes(tag)) {
      return tag
    }
  }
  // Default to closet-doors if no category found
  return 'closet-doors'
}

/**
 * Transform a Renin product from JSON format to database format
 */
export function transformReninProduct(product: ReninProduct): TransformedProduct {
  // Get the first variant for base price and SKU
  const firstVariant = product.variants[0]

  // Calculate total inventory across all variants
  const totalInventory = product.variants.reduce(
    (sum, variant) => sum + variant.inventory_quantity,
    0
  )

  // Extract specifications
  const specs = product.metadata.specifications || {}

  return {
    name: product.title,
    slug: product.handle,
    description: product.description,
    category: extractCategory(product.tags),
    subcategory: null,
    price: firstVariant?.price || 0,
    sku: firstVariant?.sku || product.metadata.sku || null,
    inventory: totalInventory,
    material: specs.material || null,
    finish: specs.finish || null,
    color: specs.color || null,
    features: [],
    tags: product.tags,
    status: 'active',
    featured: false,
  }
}

/**
 * Load Renin products from the JSON file
 */
function loadReninProducts(): ReninProduct[] {
  const dataPath = path.join(process.cwd(), 'data', 'transformed-renin-products.json')

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Renin products file not found at: ${dataPath}`)
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const data = JSON.parse(rawData) as { products: ReninProduct[] }

  return data.products
}

/**
 * Sync all Renin products to the database
 */
export async function syncReninProducts(
  prisma: PrismaClient,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const { force = false } = options

  try {
    // Check if products already exist
    const existingCount = await prisma.product.count()

    if (existingCount > 0 && !force) {
      return {
        success: true,
        skipped: true,
        message: `${existingCount} products already exist in database. Use force: true to overwrite.`,
      }
    }

    // If forcing, delete existing products first
    if (existingCount > 0 && force) {
      await prisma.product.deleteMany({})
    }

    // Load products from JSON
    const reninProducts = loadReninProducts()

    // Transform products
    const transformedProducts = reninProducts.map(transformReninProduct)

    // Create products in database
    const productResult = await prisma.product.createMany({
      data: transformedProducts.map((p, index) => ({
        id: reninProducts[index].id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        sku: p.sku,
        inventory: p.inventory,
        material: p.material,
        finish: p.finish,
        color: p.color,
        features: p.features,
        tags: p.tags,
        status: p.status,
        featured: p.featured,
      })),
      skipDuplicates: true,
    })

    // Create product images
    const imageData: Array<{ productId: string; url: string; alt: string; position: number }> = []
    for (const product of reninProducts) {
      product.images.forEach((img, index) => {
        imageData.push({
          productId: product.id,
          url: img.url,
          alt: img.altText || `${product.title} image ${index + 1}`,
          position: index,
        })
      })
    }

    const imageResult = await prisma.productImage.createMany({
      data: imageData,
      skipDuplicates: true,
    })

    // Create product variants
    const variantData: Array<{
      productId: string
      name: string
      sku: string | null
      price: number
      attributes: Record<string, string>
      inventory: number
    }> = []
    for (const product of reninProducts) {
      product.variants.forEach((variant) => {
        variantData.push({
          productId: product.id,
          name: variant.title,
          sku: variant.sku || null,
          price: variant.price,
          attributes: { size: variant.title },
          inventory: variant.inventory_quantity,
        })
      })
    }

    const variantResult = await prisma.productVariant.createMany({
      data: variantData,
      skipDuplicates: true,
    })

    return {
      success: true,
      productsCreated: productResult.count,
      imagesCreated: imageResult.count,
      variantsCreated: variantResult.count,
      message: `Successfully synced ${productResult.count} products, ${imageResult.count} images, ${variantResult.count} variants`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
