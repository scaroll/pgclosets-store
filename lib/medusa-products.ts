import { medusaClient } from "./medusa-client"
import type { Product } from "@/types/medusa"

interface LocalProduct {
  id: string
  name: string
  description: string
  slug: string
  price: number
  images: string[]
  category: string
  tags: string[]
}

interface ConvertResult {
  success: string[]
  errors: Array<{
    id: string
    error: unknown
  }>
}

export function convertToProduct(localProduct: LocalProduct): Product {
  return {
    id: localProduct.id,
    title: localProduct.name,
    handle: localProduct.slug,
    description: localProduct.description,
    images: localProduct.images.map(url => ({ url })),
    variants: [{
      id: localProduct.id,
      title: localProduct.name,
      sku: localProduct.id,
      price: localProduct.price,
      inventory_quantity: 999
    }],
    tags: [localProduct.category, ...localProduct.tags],
    collection: undefined,
    metadata: {
      category: localProduct.category
    }
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
