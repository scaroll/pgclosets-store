/**
 * Product Data System - Main Entry Point
 *
 * High-performance product data architecture with:
 * - Normalized schema for efficient queries
 * - Full-text search with relevance scoring
 * - Faceted filtering system
 * - Category taxonomy
 * - SKU management
 * - Price calculations
 * - Image optimization
 */

// ============================================================================
// EXPORTS
// ============================================================================

// Core data structures
export {
  productDataStore,
  initializeProductStore,
  ProductDataStore,
} from './product-data';

// Types
export type {
  NormalizedProduct,
  ProductCategory,
  ProductCollection,
  NormalizedVariant,
  NormalizedOption,
  MediaAsset,
  SearchIndexEntry,
  ProductFilter,
  ProductSort,
  PaginationParams,
  ProductSearchResult,
  SKUConfig,
  SKUStructure,
  InventoryRecord,
  PriceContext,
  PriceBreakdown,
} from './product-data';

// Utilities
export {
  generateSKU,
  parseSKU,
  formatPrice,
  calculatePrice,
} from './product-data';

// Transformation
export {
  transformReninProduct,
  buildCategoryHierarchy,
  createDefaultCollections,
  RENIN_SKU_CONFIG,
  RENIN_CATEGORY_TAXONOMY,
} from './transform-renin-data';

// Migration
export {
  migrateReninData,
  initializeStore,
  exportMigratedData,
} from './migrate-renin-data';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

import { productDataStore } from './product-data';
import type {
  NormalizedProduct,
  ProductFilter,
  ProductSort,
  PaginationParams,
  ProductSearchResult,
} from './product-data';

/**
 * Get product by ID
 */
export function getProduct(id: string): NormalizedProduct | undefined {
  return productDataStore.getProduct(id);
}

/**
 * Get product by handle (slug)
 */
export function getProductByHandle(handle: string): NormalizedProduct | undefined {
  return productDataStore.getProductByHandle(handle);
}

/**
 * Get product by SKU
 */
export function getProductBySKU(sku: string): NormalizedProduct | undefined {
  return productDataStore.getProductBySKU(sku);
}

/**
 * Get all products in a category
 */
export function getProductsByCategory(
  categoryId: string,
  includeSubcategories = false
): NormalizedProduct[] {
  return productDataStore.getProductsByCategory(categoryId, includeSubcategories);
}

/**
 * Get all products in a collection
 */
export function getProductsByCollection(collectionId: string): NormalizedProduct[] {
  return productDataStore.getProductsByCollection(collectionId);
}

/**
 * Search products
 */
export function searchProducts(
  filter: ProductFilter,
  sort?: ProductSort,
  pagination?: PaginationParams
): ProductSearchResult {
  return productDataStore.search(filter, sort, pagination);
}

/**
 * Get featured products
 */
export function getFeaturedProducts(limit = 8): NormalizedProduct[] {
  return productDataStore.search(
    { featured: true, status: ['active'] },
    'featured',
    { page: 1, limit }
  ).products;
}

/**
 * Get new arrivals
 */
export function getNewArrivals(limit = 12): NormalizedProduct[] {
  return productDataStore.search(
    { status: ['active'] },
    'newest',
    { page: 1, limit }
  ).products;
}

/**
 * Get best sellers
 */
export function getBestSellers(limit = 12): NormalizedProduct[] {
  return productDataStore.search(
    { status: ['active'] },
    'bestselling',
    { page: 1, limit }
  ).products;
}

/**
 * Get related products
 */
export function getRelatedProducts(
  productId: string,
  limit = 4
): NormalizedProduct[] {
  const product = productDataStore.getProduct(productId);
  if (!product) return [];

  // Find products in same category
  return productDataStore.search(
    {
      categoryIds: [product.categoryId],
      status: ['active'],
    },
    'relevance',
    { page: 1, limit: limit + 1 }
  ).products.filter(p => p.id !== productId).slice(0, limit);
}

/**
 * Get category
 */
export function getCategory(id: string) {
  return productDataStore.getCategory(id);
}

/**
 * Get category by handle
 */
export function getCategoryByHandle(handle: string) {
  return productDataStore.getCategoryByHandle(handle);
}

/**
 * Get category tree
 */
export function getCategoryTree() {
  return productDataStore.getCategoryTree();
}

/**
 * Get subcategories
 */
export function getSubcategories(parentId: string) {
  return productDataStore.getSubcategories(parentId);
}

/**
 * Get product variants
 */
export function getProductVariants(productId: string) {
  return productDataStore.getProductVariants(productId);
}

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(
  mediaId: string,
  context?: 'thumbnail' | 'card' | 'hero' | 'zoom'
) {
  return productDataStore.getOptimizedImageUrl(mediaId, context);
}
