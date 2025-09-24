import type { Cart, Product } from "@/types/medusa"
import { medusaClient } from "./medusa-client"

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
  }
}

/**
 * Product service for handling product data
 */
export const productService = {
  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      const { products } = await medusaClient.getProducts({ q: handle })
      return products.find(p => p.handle === handle) || null
    } catch (error) {
      console.error("Error getting product by handle:", error)
      return null
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const { product } = await medusaClient.getProduct(id)
      return product
    } catch (error) {
      console.error("Error getting product by id:", error)
      return null
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await medusaClient.getProducts({ q: query })
      return response.products
    } catch (error) {
      console.error("Error searching products:", error)
      return []
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await medusaClient.getProducts()
      const products = response.products
      return [...new Set(products.flatMap(p => p.tags))]
    } catch (error) {
      console.error("Error getting categories:", error)
      return []
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await medusaClient.getProducts({ tags: [category] })
      return response.products
    } catch (error) {
      console.error("Error getting products by category:", error)
      return []
    }
  }
}

/**
 * Cart service for handling shopping cart data
 */
export const cartService = {
  async getCart(cartId: string): Promise<Cart> {
    const response = await medusaClient.getCart(cartId)
    return response.cart
  },

  async createCart(): Promise<Cart> {
    const response = await medusaClient.createCart()
    return response.cart
  },

  async addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const response = await medusaClient.addToCart(cartId, variantId, quantity)
    return response.cart
  },

  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const response = await medusaClient.updateCartItem(cartId, itemId, quantity)
    return response.cart
  },

  async removeFromCart(cartId: string, itemId: string): Promise<Cart> {
    const response = await medusaClient.removeFromCart(cartId, itemId)
    return response.cart
  }
}