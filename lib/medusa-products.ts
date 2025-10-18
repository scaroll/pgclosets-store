import { reninProducts } from "./data/renin-products"

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

  return sizes.map((size: string, _index: number) => ({
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

// Stub for Medusa product service - now uses local data
export const medusaProducts = {
  // Get all products with optional filtering
  async getProducts(params?: {
    category?: string
    collection_id?: string
    tags?: string[]
    limit?: number
    offset?: number
    q?: string
  }) {
    // Filter local products based on params
    let products = reninProducts
    if (params?.tags?.includes("featured")) {
      // Assume no featured for now
      products = []
    }
    if (params?.tags?.length) {
      products = products.filter(p => params.tags!.includes(p.category.toLowerCase()))
    }
    if (params?.q) {
      products = products.filter(p => p.name.toLowerCase().includes(params.q!.toLowerCase()))
    }
    return products.slice(params?.offset || 0, (params?.offset || 0) + (params?.limit || products.length))
  },

  // Get single product by ID
  async getProduct(id: string): Promise<any | null> {
    return reninProducts.find(p => p.id === id) || null
  },

  // Get product by handle/slug
  async getProductByHandle(handle: string): Promise<any | null> {
    return reninProducts.find(p => p.id === handle) || null
  },

  // Get products by category (using tags)
  async getProductsByCategory(category: string) {
    return reninProducts.filter(p => p.category.toLowerCase() === category.toLowerCase())
  },

  // Get featured products
  async getFeaturedProducts() {
    // Return all for now
    return reninProducts.slice(0, 3)
  },

  // Search products
  async searchProducts(query: string) {
    return reninProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  },

  // Get product collections
  async getCollections(): Promise<any[]> {
    // Return unique categories as collections
    const categories = [...new Set(reninProducts.map(p => p.category))]
    return categories.map(cat => ({
      id: cat.toLowerCase(),
      title: cat,
      handle: cat.toLowerCase(),
    }))
  },
}

// Migration utility (for development/admin use)
export async function migrateLocalProductsToMedusa(localProducts: any[]) {
  const results: { success: string[], errors: { id: string, error: unknown }[] } = {
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
