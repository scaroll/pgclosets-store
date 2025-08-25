// Main Medusa integration exports
export { medusaClient } from "./config"
export type { HttpTypes } from "./config"

// Product functions
export {
  getProducts,
  getProductByHandle,
  getProductVariants,
  searchProducts,
  getProductsByCategory,
  getRelatedProducts,
} from "./products"

// Cart functions
export {
  createCart,
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  completeCart,
} from "./cart"

// Region functions
export {
  getRegions,
  getRegion,
  getRegionByCountryCode,
  getDefaultRegion,
} from "./regions"