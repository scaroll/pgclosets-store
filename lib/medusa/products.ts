import { medusaClient, HttpTypes } from "./config"
import { cache } from "react"

/**
 * Get all products with optional filters
 */
export const getProducts = cache(async (
  queryParams?: {
    limit?: number
    offset?: number
    category_id?: string[]
    collection_id?: string[]
    region_id?: string
    q?: string
  }
): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
  offset: number
  limit: number
}> => {
  try {
    const response = await medusaClient.store.product.list(queryParams)
    return response
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: [],
      count: 0,
      offset: 0,
      limit: 0
    }
  }
})

/**
 * Get a single product by handle/id
 */
export const getProductByHandle = cache(async (
  handle: string,
  regionId?: string
): Promise<HttpTypes.StoreProduct | null> => {
  try {
    const response = await medusaClient.store.product.retrieve(handle, {
      region_id: regionId,
    })
    return response.product
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error)
    return null
  }
})

/**
 * Get product variants
 */
export const getProductVariants = cache(async (
  productId: string,
  regionId?: string
): Promise<HttpTypes.StoreProductVariant[]> => {
  try {
    const response = await medusaClient.store.product.retrieve(productId, {
      region_id: regionId,
    })
    return response.product?.variants || []
  } catch (error) {
    console.error(`Error fetching variants for product ${productId}:`, error)
    return []
  }
})

/**
 * Search products
 */
export const searchProducts = cache(async (
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
}> => {
  try {
    const response = await medusaClient.store.product.list({
      q: query,
      limit,
      offset,
    })
    return {
      products: response.products,
      count: response.count
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return {
      products: [],
      count: 0
    }
  }
})

/**
 * Get products by category
 */
export const getProductsByCategory = cache(async (
  categoryId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{
  products: HttpTypes.StoreProduct[]
  count: number
}> => {
  try {
    const response = await medusaClient.store.product.list({
      category_id: [categoryId],
      limit,
      offset,
    })
    return {
      products: response.products,
      count: response.count
    }
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    return {
      products: [],
      count: 0
    }
  }
})

/**
 * Get related products
 */
export const getRelatedProducts = cache(async (
  productId: string,
  limit: number = 4
): Promise<HttpTypes.StoreProduct[]> => {
  try {
    // For now, we'll get products from the same category
    const product = await getProductByHandle(productId)
    if (!product?.categories?.length) {
      return []
    }

    const categoryId = product.categories[0]?.id
    if (!categoryId) {
      return []
    }

    const response = await getProductsByCategory(categoryId, limit + 1)
    // Filter out the current product and limit results
    return response.products
      .filter(p => p.id !== productId)
      .slice(0, limit)
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error)
    return []
  }
})