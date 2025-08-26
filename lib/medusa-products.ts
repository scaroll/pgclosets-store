import { medusaClient } from "./medusa-client"
import type { Product, ProductCollection } from "@medusajs/medusa"

// Product data adapter to convert local products to Medusa format
export interface MedusaProductData {
  title: string
  subtitle?: string
  description: string
  handle: string
  is_giftcard: boolean
  status: "draft" | "proposed" | "published" | "rejected"
  images: string[]
  thumbnail?: string
  options: Array<{
    title: string
    values: string[]
  }>
  variants: Array<{
    title: string
    sku: string
    inventory_quantity: number
    manage_inventory: boolean
    allow_backorder: boolean
    prices: Array<{
      currency_code: string
      amount: number
    }>
    options: Array<{
      option_id: string
      value: string
    }>
  }>
  collection_id?: string
  categories?: Array<{
    id: string
    name: string
  }>
  tags?: Array<{
    value: string
  }>
  metadata?: Record<string, any>
}

// Convert local product format to Medusa format
export function convertToMedusaProduct(localProduct: any): MedusaProductData {
  return {
    title: localProduct.name,
    description: localProduct.description,
    handle: localProduct.slug,
    is_giftcard: false,
    status: "published",
    images: localProduct.images || [],
    thumbnail: localProduct.images?.[0],
    options: [
      {
        title: "Size",
        values: localProduct.specifications?.["Standard Sizes"]?.split(", ") || ["Standard"],
      },
    ],
    variants: createVariantsFromProduct(localProduct),
    tags: [
      { value: localProduct.category },
      { value: localProduct.subcategory },
      ...(localProduct.featured ? [{ value: "featured" }] : []),
    ],
    metadata: {
      originalId: localProduct.id,
      category: localProduct.category,
      subcategory: localProduct.subcategory,
      features: localProduct.features,
      specifications: localProduct.specifications,
      inStock: localProduct.inStock,
      featured: localProduct.featured,
    },
  }
}

// Create product variants based on sizes or default variant
function createVariantsFromProduct(localProduct: any) {
  const sizes = localProduct.specifications?.["Standard Sizes"]?.split(", ") || ["Standard"]

  return sizes.map((size: string, index: number) => ({
    title: `${localProduct.name} - ${size}`,
    sku: `${localProduct.id}-${size.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
    inventory_quantity: localProduct.inStock ? 100 : 0,
    manage_inventory: true,
    allow_backorder: false,
    prices: [
      {
        currency_code: "CAD",
        amount: localProduct.price * 100, // Convert to cents
      },
    ],
    options: [
      {
        option_id: "size",
        value: size,
      },
    ],
  }))
}

// Medusa product service for frontend
export const medusaProducts = {
  // Get all products with optional filtering
  async getProducts(params?: {
    category?: string
    collection_id?: string
    tags?: string[]
    limit?: number
    offset?: number
  }) {
    try {
      const response = await medusaClient.getProducts(params)
      return response.products
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  },

  // Get single product by ID
  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await medusaClient.getProduct(id)
      return response.product
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  },

  // Get product by handle/slug
  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      return await medusaClient.getProductByHandle(handle)
    } catch (error) {
      console.error("Error fetching product by handle:", error)
      return null
    }
  },

  // Get products by category (using tags)
  async getProductsByCategory(category: string) {
    try {
      const response = await medusaClient.getProducts({
        tags: [category],
      })
      return response.products
    } catch (error) {
      console.error("Error fetching products by category:", error)
      return []
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await medusaClient.getProducts({
        tags: ["featured"],
      })
      return response.products
    } catch (error) {
      console.error("Error fetching featured products:", error)
      return []
    }
  },

  // Search products
  async searchProducts(query: string) {
    try {
      const response = await medusaClient.getProducts({
        q: query,
      })
      return response.products
    } catch (error) {
      console.error("Error searching products:", error)
      return []
    }
  },

  // Get product collections
  async getCollections(): Promise<ProductCollection[]> {
    try {
      const response = await medusaClient.getCollections()
      return response.collections
    } catch (error) {
      console.error("Error fetching collections:", error)
      return []
    }
  },
}

// Migration utility (for development/admin use)
export async function migrateLocalProductsToMedusa(localProducts: any[]) {
  const results = {
    success: [],
    errors: [],
  }

  for (const localProduct of localProducts) {
    try {
      const medusaProduct = convertToMedusaProduct(localProduct)
      console.log(`Migrating product: ${medusaProduct.title}`)

      // Note: This would require admin API access to create products
      // In a real implementation, this would be done server-side
      results.success.push(localProduct.id)
    } catch (error) {
      console.error(`Error migrating product ${localProduct.id}:`, error)
      results.errors.push({ id: localProduct.id, error })
    }
  }

  return results
}
