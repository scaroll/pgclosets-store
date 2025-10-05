/**
 * Optimized Product Data Architecture for PG Closets
 *
 * Performance-optimized product data system with:
 * - Normalized schema for efficient queries
 * - Search indexing with full-text and faceted search
 * - Category taxonomy with hierarchical structure
 * - Advanced filtering system
 * - SKU management and inventory tracking
 * - Price calculation with variants
 * - Image optimization and lazy loading
 */

import type { Product, ProductImage, ProductVariant, ProductOption } from '@/types/commerce';

// ============================================================================
// CORE TYPES - Normalized Schema
// ============================================================================

/**
 * Normalized product schema optimized for performance
 */
export interface NormalizedProduct {
  // Core identifiers
  id: string;
  sku: string;
  handle: string; // URL-friendly slug

  // Basic info
  title: string;
  description: string;
  shortDescription?: string;

  // Taxonomy
  categoryId: string;
  subcategoryId?: string;
  collectionIds: string[];

  // Pricing (in cents for precision)
  basePrice: number;
  salePrice?: number;
  msrp?: number;

  // Media
  thumbnailId: string;
  imageIds: string[];

  // Product attributes
  brand: string;
  manufacturer: string;

  // Inventory
  inventory: {
    tracked: boolean;
    quantity: number;
    lowStockThreshold?: number;
    allowBackorder: boolean;
  };

  // Variants
  variantIds: string[];
  optionIds: string[];

  // Metadata
  tags: string[];
  features: string[];
  specifications: Record<string, string | number>;

  // SEO
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };

  // Status
  status: 'draft' | 'active' | 'archived' | 'discontinued';
  featured: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // Performance metrics
  viewCount?: number;
  salesCount?: number;
  averageRating?: number;
  reviewCount?: number;
}

/**
 * Category with hierarchical structure
 */
export interface ProductCategory {
  id: string;
  handle: string;
  name: string;
  description: string;

  // Hierarchy
  parentId?: string;
  level: number;
  path: string[]; // Array of ancestor IDs

  // Media
  thumbnailId?: string;
  heroImageId?: string;

  // Metadata
  productCount: number;
  displayOrder: number;

  // SEO
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };

  // Status
  active: boolean;
}

/**
 * Product collection (e.g., "New Arrivals", "Best Sellers")
 */
export interface ProductCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;

  // Product membership
  productIds: string[];

  // Display
  thumbnailId?: string;
  displayOrder: number;

  // Rules for dynamic collections
  rules?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number;
  }[];

  active: boolean;
}

/**
 * Media asset with optimization metadata
 */
export interface MediaAsset {
  id: string;
  url: string;
  altText: string;

  // Dimensions
  width: number;
  height: number;
  aspectRatio: number;

  // Optimization
  formats: {
    webp?: string;
    avif?: string;
    thumbnail?: string;
    medium?: string;
    large?: string;
  };

  // Metadata
  size: number; // bytes
  mimeType: string;
  blurhash?: string; // For progressive loading

  createdAt: string;
}

/**
 * Normalized variant
 */
export interface NormalizedVariant {
  id: string;
  productId: string;
  sku: string;

  // Pricing
  price: number; // in cents
  compareAtPrice?: number;

  // Options (e.g., { "Size": "36\"", "Finish": "White" })
  options: Record<string, string>;

  // Inventory
  inventory: {
    quantity: number;
    tracked: boolean;
    allowBackorder: boolean;
  };

  // Media
  imageId?: string;

  // Physical properties
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'inches' | 'cm';
  };

  active: boolean;
}

/**
 * Product option definition
 */
export interface NormalizedOption {
  id: string;
  productId: string;
  name: string; // e.g., "Size", "Finish"

  // Values
  values: {
    value: string;
    displayOrder: number;
  }[];

  displayOrder: number;
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

/**
 * Search index entry for full-text search
 */
export interface SearchIndexEntry {
  productId: string;

  // Searchable fields with weights
  title: string; // weight: 3
  description: string; // weight: 2
  tags: string[]; // weight: 2
  features: string[]; // weight: 1
  sku: string; // weight: 3

  // Normalized for search
  searchText: string; // Combined lowercase text

  // Facets for filtering
  categoryId: string;
  categoryPath: string[];
  brand: string;
  priceRange: 'under-300' | '300-500' | '500-700' | 'over-700';
  inStock: boolean;
  tags: string[];

  // Sorting fields
  price: number;
  salesCount: number;
  averageRating: number;
  createdAt: string;
}

/**
 * Filter configuration
 */
export interface ProductFilter {
  // Category
  categoryIds?: string[];
  categoryPath?: string[]; // Include subcategories

  // Collections
  collectionIds?: string[];

  // Price range
  priceMin?: number;
  priceMax?: number;

  // Attributes
  brand?: string[];
  tags?: string[];

  // Availability
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;

  // Custom attributes
  specifications?: Record<string, string | number>;

  // Text search
  query?: string;

  // Status
  status?: Array<'draft' | 'active' | 'archived' | 'discontinued'>;
}

/**
 * Sort options
 */
export type ProductSort =
  | 'relevance' // Default for search queries
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest'
  | 'bestselling'
  | 'rating'
  | 'featured';

/**
 * Pagination configuration
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number; // Alternative to page
}

/**
 * Search/filter result
 */
export interface ProductSearchResult {
  products: NormalizedProduct[];

  // Pagination
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;

  // Facets for filter UI
  facets: {
    categories: Array<{ id: string; name: string; count: number }>;
    brands: Array<{ value: string; count: number }>;
    priceRanges: Array<{
      range: 'under-300' | '300-500' | '500-700' | 'over-700';
      count: number;
      min: number;
      max: number;
    }>;
    tags: Array<{ value: string; count: number }>;
    inStock: { available: number; outOfStock: number };
  };

  // Applied filters
  appliedFilters: ProductFilter;
  appliedSort: ProductSort;
}

// ============================================================================
// SKU MANAGEMENT
// ============================================================================

/**
 * SKU generation configuration
 */
export interface SKUConfig {
  prefix: string; // e.g., "REN" for Renin
  separator: string; // e.g., "-"
  includeCategory?: boolean;
  includeYear?: boolean;
  sequenceLength: number; // e.g., 4 for "0001"
}

/**
 * SKU structure
 */
export interface SKUStructure {
  full: string; // e.g., "REN-BARN-2025-0001-36-WHT"
  prefix: string; // "REN"
  category?: string; // "BARN"
  year?: string; // "2025"
  sequence: string; // "0001"
  variantCode?: string; // "36-WHT"
}

/**
 * Inventory tracking
 */
export interface InventoryRecord {
  variantId: string;
  sku: string;

  // Stock levels
  quantity: number;
  available: number; // quantity - reserved
  reserved: number; // In carts/orders

  // Thresholds
  lowStockThreshold: number;
  reorderPoint: number;

  // Location (for multi-warehouse)
  location?: string;

  // Tracking
  lastRestocked?: string;
  lastSold?: string;

  // Status
  allowBackorder: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

// ============================================================================
// PRICE CALCULATION
// ============================================================================

/**
 * Price calculation context
 */
export interface PriceContext {
  variantId: string;
  quantity: number;

  // Customer context
  customerType?: 'retail' | 'contractor' | 'wholesale';
  customerTier?: string;

  // Promotions
  appliedPromotions?: string[];
  couponCode?: string;

  // Location
  region?: string;
  taxRate?: number;
}

/**
 * Calculated price breakdown
 */
export interface PriceBreakdown {
  // Base pricing
  basePrice: number;
  listPrice: number; // MSRP

  // Discounts
  discounts: Array<{
    type: 'sale' | 'volume' | 'customer_tier' | 'promotion' | 'coupon';
    amount: number;
    percentage?: number;
    label: string;
  }>;
  totalDiscount: number;

  // Final pricing
  subtotal: number;
  tax?: number;
  total: number;

  // Savings
  savings: number;
  savingsPercentage: number;

  // Display
  formatted: {
    basePrice: string;
    listPrice: string;
    subtotal: string;
    tax: string;
    total: string;
    savings: string;
  };
}

// ============================================================================
// DATA STORE
// ============================================================================

/**
 * In-memory product store optimized for reads
 */
export class ProductDataStore {
  private products: Map<string, NormalizedProduct>;
  private categories: Map<string, ProductCategory>;
  private collections: Map<string, ProductCollection>;
  private variants: Map<string, NormalizedVariant>;
  private media: Map<string, MediaAsset>;
  private searchIndex: Map<string, SearchIndexEntry>;

  // Lookup indexes for O(1) access
  private productsByHandle: Map<string, string>; // handle -> id
  private productsBySKU: Map<string, string>; // sku -> id
  private productsByCategory: Map<string, Set<string>>; // categoryId -> Set<productId>
  private productsByCollection: Map<string, Set<string>>; // collectionId -> Set<productId>
  private variantsByProduct: Map<string, Set<string>>; // productId -> Set<variantId>

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.collections = new Map();
    this.variants = new Map();
    this.media = new Map();
    this.searchIndex = new Map();

    this.productsByHandle = new Map();
    this.productsBySKU = new Map();
    this.productsByCategory = new Map();
    this.productsByCollection = new Map();
    this.variantsByProduct = new Map();
  }

  // ============================================================================
  // PRODUCT OPERATIONS
  // ============================================================================

  /**
   * Add or update a product
   */
  setProduct(product: NormalizedProduct): void {
    this.products.set(product.id, product);
    this.productsByHandle.set(product.handle, product.id);
    this.productsBySKU.set(product.sku, product.id);

    // Update category index
    if (!this.productsByCategory.has(product.categoryId)) {
      this.productsByCategory.set(product.categoryId, new Set());
    }
    this.productsByCategory.get(product.categoryId)!.add(product.id);

    // Update collection indexes
    product.collectionIds.forEach(collectionId => {
      if (!this.productsByCollection.has(collectionId)) {
        this.productsByCollection.set(collectionId, new Set());
      }
      this.productsByCollection.get(collectionId)!.add(product.id);
    });

    // Update search index
    this.updateSearchIndex(product);
  }

  /**
   * Get product by ID
   */
  getProduct(id: string): NormalizedProduct | undefined {
    return this.products.get(id);
  }

  /**
   * Get product by handle (slug)
   */
  getProductByHandle(handle: string): NormalizedProduct | undefined {
    const id = this.productsByHandle.get(handle);
    return id ? this.products.get(id) : undefined;
  }

  /**
   * Get product by SKU
   */
  getProductBySKU(sku: string): NormalizedProduct | undefined {
    const id = this.productsBySKU.get(sku);
    return id ? this.products.get(id) : undefined;
  }

  /**
   * Get all products in a category
   */
  getProductsByCategory(categoryId: string, includeSubcategories = false): NormalizedProduct[] {
    const productIds = new Set<string>();

    if (this.productsByCategory.has(categoryId)) {
      this.productsByCategory.get(categoryId)!.forEach(id => productIds.add(id));
    }

    if (includeSubcategories) {
      const category = this.categories.get(categoryId);
      if (category) {
        // Find all subcategories
        this.categories.forEach(cat => {
          if (cat.path.includes(categoryId)) {
            this.productsByCategory.get(cat.id)?.forEach(id => productIds.add(id));
          }
        });
      }
    }

    return Array.from(productIds)
      .map(id => this.products.get(id))
      .filter((p): p is NormalizedProduct => p !== undefined);
  }

  /**
   * Get all products in a collection
   */
  getProductsByCollection(collectionId: string): NormalizedProduct[] {
    const productIds = this.productsByCollection.get(collectionId);
    if (!productIds) return [];

    return Array.from(productIds)
      .map(id => this.products.get(id))
      .filter((p): p is NormalizedProduct => p !== undefined);
  }

  // ============================================================================
  // SEARCH & FILTER
  // ============================================================================

  /**
   * Update search index for a product
   */
  private updateSearchIndex(product: NormalizedProduct): void {
    const category = this.categories.get(product.categoryId);

    const indexEntry: SearchIndexEntry = {
      productId: product.id,
      title: product.title,
      description: product.description,
      tags: product.tags,
      features: product.features,
      sku: product.sku,
      searchText: [
        product.title,
        product.description,
        ...product.tags,
        ...product.features,
        product.sku,
      ].join(' ').toLowerCase(),
      categoryId: product.categoryId,
      categoryPath: category?.path || [],
      brand: product.brand,
      priceRange: this.getPriceRange(product.basePrice),
      inStock: product.inventory.quantity > 0,
      price: product.basePrice,
      salesCount: product.salesCount || 0,
      averageRating: product.averageRating || 0,
      createdAt: product.createdAt,
    };

    this.searchIndex.set(product.id, indexEntry);
  }

  /**
   * Get price range bucket
   */
  private getPriceRange(price: number): 'under-300' | '300-500' | '500-700' | 'over-700' {
    const dollars = price / 100;
    if (dollars < 300) return 'under-300';
    if (dollars < 500) return '300-500';
    if (dollars < 700) return '500-700';
    return 'over-700';
  }

  /**
   * Search products with filters
   */
  search(
    filter: ProductFilter,
    sort: ProductSort = 'relevance',
    pagination: PaginationParams = { page: 1, limit: 24 }
  ): ProductSearchResult {
    // Start with all products
    let results = Array.from(this.products.values());

    // Apply filters
    results = this.applyFilters(results, filter);

    // Apply sorting
    results = this.applySorting(results, sort, filter.query);

    // Calculate facets before pagination
    const facets = this.calculateFacets(results);

    // Apply pagination
    const total = results.length;
    const offset = (pagination.page - 1) * pagination.limit;
    const paginatedResults = results.slice(offset, offset + pagination.limit);

    return {
      products: paginatedResults,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
      hasMore: offset + pagination.limit < total,
      facets,
      appliedFilters: filter,
      appliedSort: sort,
    };
  }

  /**
   * Apply filters to product list
   */
  private applyFilters(products: NormalizedProduct[], filter: ProductFilter): NormalizedProduct[] {
    let filtered = products;

    // Category filter
    if (filter.categoryIds && filter.categoryIds.length > 0) {
      filtered = filtered.filter(p => filter.categoryIds!.includes(p.categoryId));
    }

    // Category path (includes subcategories)
    if (filter.categoryPath && filter.categoryPath.length > 0) {
      const validCategoryIds = new Set<string>();
      this.categories.forEach(cat => {
        if (filter.categoryPath!.some(pathId => cat.path.includes(pathId))) {
          validCategoryIds.add(cat.id);
        }
      });
      filtered = filtered.filter(p => validCategoryIds.has(p.categoryId));
    }

    // Collection filter
    if (filter.collectionIds && filter.collectionIds.length > 0) {
      filtered = filtered.filter(p =>
        p.collectionIds.some(id => filter.collectionIds!.includes(id))
      );
    }

    // Price range
    if (filter.priceMin !== undefined) {
      filtered = filtered.filter(p => p.basePrice >= filter.priceMin!);
    }
    if (filter.priceMax !== undefined) {
      filtered = filtered.filter(p => p.basePrice <= filter.priceMax!);
    }

    // Brand filter
    if (filter.brand && filter.brand.length > 0) {
      filtered = filtered.filter(p => filter.brand!.includes(p.brand));
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(p =>
        filter.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Stock filter
    if (filter.inStock === true) {
      filtered = filtered.filter(p => p.inventory.quantity > 0);
    }

    // Sale filter
    if (filter.onSale === true) {
      filtered = filtered.filter(p => p.salePrice !== undefined && p.salePrice < p.basePrice);
    }

    // Featured filter
    if (filter.featured === true) {
      filtered = filtered.filter(p => p.featured === true);
    }

    // Status filter
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(p => filter.status!.includes(p.status));
    }

    // Text search
    if (filter.query) {
      const query = filter.query.toLowerCase();
      filtered = filtered.filter(p => {
        const indexEntry = this.searchIndex.get(p.id);
        return indexEntry?.searchText.includes(query);
      });
    }

    // Custom specifications
    if (filter.specifications) {
      filtered = filtered.filter(p => {
        return Object.entries(filter.specifications!).every(([key, value]) => {
          return p.specifications[key] === value;
        });
      });
    }

    return filtered;
  }

  /**
   * Apply sorting to product list
   */
  private applySorting(
    products: NormalizedProduct[],
    sort: ProductSort,
    query?: string
  ): NormalizedProduct[] {
    const sorted = [...products];

    switch (sort) {
      case 'relevance':
        // If there's a query, sort by relevance
        if (query) {
          const queryLower = query.toLowerCase();
          sorted.sort((a, b) => {
            const aIndex = this.searchIndex.get(a.id)!;
            const bIndex = this.searchIndex.get(b.id)!;

            // Calculate relevance score
            const aScore = this.calculateRelevance(aIndex, queryLower);
            const bScore = this.calculateRelevance(bIndex, queryLower);

            return bScore - aScore;
          });
        } else {
          // Default to featured + newest
          sorted.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
        break;

      case 'price-asc':
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;

      case 'price-desc':
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;

      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case 'newest':
        sorted.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;

      case 'bestselling':
        sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;

      case 'rating':
        sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;

      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.salesCount || 0) - (a.salesCount || 0);
        });
        break;
    }

    return sorted;
  }

  /**
   * Calculate relevance score for search
   */
  private calculateRelevance(indexEntry: SearchIndexEntry, query: string): number {
    let score = 0;

    // Title match (weight: 3)
    if (indexEntry.title.toLowerCase().includes(query)) {
      score += 3;
      if (indexEntry.title.toLowerCase().startsWith(query)) score += 2;
    }

    // SKU exact match (weight: 3)
    if (indexEntry.sku.toLowerCase() === query) score += 3;

    // Description match (weight: 2)
    if (indexEntry.description.toLowerCase().includes(query)) score += 2;

    // Tags match (weight: 2)
    if (indexEntry.tags.some(tag => tag.toLowerCase().includes(query))) score += 2;

    // Features match (weight: 1)
    if (indexEntry.features.some(f => f.toLowerCase().includes(query))) score += 1;

    return score;
  }

  /**
   * Calculate facets for filter UI
   */
  private calculateFacets(products: NormalizedProduct[]): ProductSearchResult['facets'] {
    const categoryCount = new Map<string, number>();
    const brandCount = new Map<string, number>();
    const priceRangeCount = new Map<string, number>();
    const tagCount = new Map<string, number>();
    let inStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(product => {
      // Category count
      categoryCount.set(
        product.categoryId,
        (categoryCount.get(product.categoryId) || 0) + 1
      );

      // Brand count
      brandCount.set(
        product.brand,
        (brandCount.get(product.brand) || 0) + 1
      );

      // Price range count
      const range = this.getPriceRange(product.basePrice);
      priceRangeCount.set(range, (priceRangeCount.get(range) || 0) + 1);

      // Tag count
      product.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });

      // Stock count
      if (product.inventory.quantity > 0) {
        inStockCount++;
      } else {
        outOfStockCount++;
      }
    });

    return {
      categories: Array.from(categoryCount.entries())
        .map(([id, count]) => ({
          id,
          name: this.categories.get(id)?.name || id,
          count,
        }))
        .sort((a, b) => b.count - a.count),

      brands: Array.from(brandCount.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),

      priceRanges: [
        { range: 'under-300', count: priceRangeCount.get('under-300') || 0, min: 0, max: 299 },
        { range: '300-500', count: priceRangeCount.get('300-500') || 0, min: 300, max: 499 },
        { range: '500-700', count: priceRangeCount.get('500-700') || 0, min: 500, max: 699 },
        { range: 'over-700', count: priceRangeCount.get('over-700') || 0, min: 700, max: Infinity },
      ] as any,

      tags: Array.from(tagCount.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20), // Top 20 tags

      inStock: {
        available: inStockCount,
        outOfStock: outOfStockCount,
      },
    };
  }

  // ============================================================================
  // CATEGORY OPERATIONS
  // ============================================================================

  /**
   * Add or update a category
   */
  setCategory(category: ProductCategory): void {
    this.categories.set(category.id, category);
  }

  /**
   * Get category by ID
   */
  getCategory(id: string): ProductCategory | undefined {
    return this.categories.get(id);
  }

  /**
   * Get category by handle
   */
  getCategoryByHandle(handle: string): ProductCategory | undefined {
    return Array.from(this.categories.values()).find(c => c.handle === handle);
  }

  /**
   * Get category tree (hierarchical structure)
   */
  getCategoryTree(): ProductCategory[] {
    const rootCategories = Array.from(this.categories.values())
      .filter(c => !c.parentId)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return rootCategories;
  }

  /**
   * Get subcategories of a category
   */
  getSubcategories(parentId: string): ProductCategory[] {
    return Array.from(this.categories.values())
      .filter(c => c.parentId === parentId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // ============================================================================
  // VARIANT OPERATIONS
  // ============================================================================

  /**
   * Add or update a variant
   */
  setVariant(variant: NormalizedVariant): void {
    this.variants.set(variant.id, variant);

    if (!this.variantsByProduct.has(variant.productId)) {
      this.variantsByProduct.set(variant.productId, new Set());
    }
    this.variantsByProduct.get(variant.productId)!.add(variant.id);
  }

  /**
   * Get variant by ID
   */
  getVariant(id: string): NormalizedVariant | undefined {
    return this.variants.get(id);
  }

  /**
   * Get all variants for a product
   */
  getProductVariants(productId: string): NormalizedVariant[] {
    const variantIds = this.variantsByProduct.get(productId);
    if (!variantIds) return [];

    return Array.from(variantIds)
      .map(id => this.variants.get(id))
      .filter((v): v is NormalizedVariant => v !== undefined);
  }

  // ============================================================================
  // MEDIA OPERATIONS
  // ============================================================================

  /**
   * Add or update a media asset
   */
  setMedia(media: MediaAsset): void {
    this.media.set(media.id, media);
  }

  /**
   * Get media by ID
   */
  getMedia(id: string): MediaAsset | undefined {
    return this.media.get(id);
  }

  /**
   * Get optimized image URL for context
   */
  getOptimizedImageUrl(
    mediaId: string,
    context: 'thumbnail' | 'card' | 'hero' | 'zoom' = 'card'
  ): string | undefined {
    const media = this.media.get(mediaId);
    if (!media) return undefined;

    switch (context) {
      case 'thumbnail':
        return media.formats.thumbnail || media.url;
      case 'card':
        return media.formats.medium || media.url;
      case 'hero':
        return media.formats.large || media.url;
      case 'zoom':
        return media.url; // Full resolution
      default:
        return media.url;
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate SKU based on configuration
 */
export function generateSKU(
  config: SKUConfig,
  sequence: number,
  category?: string,
  variantCode?: string
): string {
  const parts: string[] = [config.prefix];

  if (config.includeCategory && category) {
    parts.push(category.toUpperCase().substring(0, 4));
  }

  if (config.includeYear) {
    parts.push(new Date().getFullYear().toString());
  }

  parts.push(sequence.toString().padStart(config.sequenceLength, '0'));

  if (variantCode) {
    parts.push(variantCode);
  }

  return parts.join(config.separator);
}

/**
 * Parse SKU structure
 */
export function parseSKU(sku: string, config: SKUConfig): SKUStructure {
  const parts = sku.split(config.separator);
  let index = 0;

  return {
    full: sku,
    prefix: parts[index++] || '',
    category: config.includeCategory ? parts[index++] : undefined,
    year: config.includeYear ? parts[index++] : undefined,
    sequence: parts[index++] || '',
    variantCode: parts.slice(index).join(config.separator) || undefined,
  };
}

/**
 * Format price for display
 */
export function formatPrice(cents: number, locale = 'en-CA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Calculate price with discounts
 */
export function calculatePrice(
  basePrice: number,
  context: PriceContext
): PriceBreakdown {
  const discounts: PriceBreakdown['discounts'] = [];
  let currentPrice = basePrice;

  // Volume discount
  if (context.quantity >= 10) {
    const volumeDiscount = Math.floor(basePrice * 0.10); // 10% for 10+ items
    discounts.push({
      type: 'volume',
      amount: volumeDiscount,
      percentage: 10,
      label: 'Volume Discount (10+)',
    });
    currentPrice -= volumeDiscount;
  }

  // Customer tier discount
  if (context.customerType === 'contractor') {
    const tierDiscount = Math.floor(basePrice * 0.15); // 15% contractor discount
    discounts.push({
      type: 'customer_tier',
      amount: tierDiscount,
      percentage: 15,
      label: 'Contractor Pricing',
    });
    currentPrice -= tierDiscount;
  } else if (context.customerType === 'wholesale') {
    const tierDiscount = Math.floor(basePrice * 0.20); // 20% wholesale discount
    discounts.push({
      type: 'customer_tier',
      amount: tierDiscount,
      percentage: 20,
      label: 'Wholesale Pricing',
    });
    currentPrice -= tierDiscount;
  }

  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
  const savings = totalDiscount;
  const savingsPercentage = basePrice > 0 ? (savings / basePrice) * 100 : 0;

  // Calculate tax if provided
  const tax = context.taxRate ? Math.floor(currentPrice * context.taxRate) : 0;

  return {
    basePrice,
    listPrice: basePrice,
    discounts,
    totalDiscount,
    subtotal: currentPrice,
    tax,
    total: currentPrice + tax,
    savings,
    savingsPercentage,
    formatted: {
      basePrice: formatPrice(basePrice),
      listPrice: formatPrice(basePrice),
      subtotal: formatPrice(currentPrice),
      tax: formatPrice(tax),
      total: formatPrice(currentPrice + tax),
      savings: formatPrice(savings),
    },
  };
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Global product data store instance
 */
export const productDataStore = new ProductDataStore();

/**
 * Initialize store with data
 */
export function initializeProductStore(data: {
  products: NormalizedProduct[];
  categories: ProductCategory[];
  collections: ProductCollection[];
  variants: NormalizedVariant[];
  media: MediaAsset[];
}): void {
  // Clear existing data
  productDataStore['products'].clear();
  productDataStore['categories'].clear();
  productDataStore['collections'].clear();
  productDataStore['variants'].clear();
  productDataStore['media'].clear();

  // Load categories first
  data.categories.forEach(category => productDataStore.setCategory(category));

  // Load media
  data.media.forEach(media => productDataStore.setMedia(media));

  // Load products
  data.products.forEach(product => productDataStore.setProduct(product));

  // Load variants
  data.variants.forEach(variant => productDataStore.setVariant(variant));

  // Load collections
  data.collections.forEach(collection => {
    productDataStore['collections'].set(collection.id, collection);
  });
}
