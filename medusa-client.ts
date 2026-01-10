// @ts-nocheck - Medusa client stub with dynamic types
// Simple fallback client for any remaining references
export const medusaClient = {
  // Fallback methods that return empty data
  async getProducts() {
    return { products: [] }
  },

  async getProduct(_id: string) {
    return null
  },

  async getProductByHandle(_handle: string) {
    return null
  },

  async getCollections() {
    return { collections: [] }
  },
}

export default medusaClient
