import { ReninProduct } from '../renin-product-loader';

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: ResponseMeta;
}

// Response Metadata
export interface ResponseMeta {
  timestamp: string;
  version: string;
  cached: boolean;
  cacheExpiry?: string;
  executionTime?: number;
}

// Pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
}

// Search Parameters
export interface SearchParams extends PaginationParams {
  query?: string;
  search?: string;
  type?: string;
  category?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  fields?: string[]; // For field selection
}

export type SortField =
  | 'title'
  | 'price'
  | 'created_at'
  | 'updated_at'
  | 'popularity'
  | 'inventory_quantity'
  | 'relevance';

export type SortOrder = 'asc' | 'desc';

// Product API Responses
export interface ProductsResponse extends ApiResponse<ReninProduct[]> {
  data: ReninProduct[];
  pagination: PaginationMeta;
  filters?: AppliedFilters;
  stats?: ProductStats;
}

export interface ProductResponse extends ApiResponse<ReninProduct> {
  data: ReninProduct;
  relatedProducts?: ReninProduct[];
}

export interface AppliedFilters {
  query?: string;
  category?: string;
  tags?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

// Product Statistics
export interface ProductStats {
  totalProducts: number;
  totalVariants: number;
  categories: number;
  tags: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  inStockCount: number;
  outOfStockCount: number;
}

// Category API
export interface ProductCategory {
  name: string;
  count: number;
  slug: string;
  description?: string;
  image?: string;
  children?: ProductCategory[];
}

export interface CategoriesResponse extends ApiResponse<ProductCategory[]> {
  data: ProductCategory[];
  hierarchy?: CategoryHierarchy;
}

export interface CategoryHierarchy {
  [key: string]: {
    children: string[];
    parent?: string;
    level: number;
  };
}

// Featured Products
export interface FeaturedProductsParams {
  limit?: number;
  category?: string;
  algorithm?: FeaturedAlgorithm;
  excludeIds?: string[];
}

export type FeaturedAlgorithm =
  | 'popular'
  | 'recent'
  | 'high_rated'
  | 'best_selling'
  | 'random'
  | 'curated';

export interface FeaturedProductsResponse extends ApiResponse<ReninProduct[]> {
  data: ReninProduct[];
  algorithm: FeaturedAlgorithm;
  criteria?: string;
}

// Search Facets
export interface SearchFacet {
  field: string;
  label: string;
  values: FacetValue[];
  type: FacetType;
}

export interface FacetValue {
  value: string;
  label: string;
  count: number;
  selected?: boolean;
}

export type FacetType = 'list' | 'range' | 'boolean' | 'hierarchy';

export interface SearchResponse extends ProductsResponse {
  facets?: SearchFacet[];
  suggestions?: string[];
  correctedQuery?: string;
  searchTime: number;
}

// Cache Control
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string;
  tags?: string[];
  revalidate?: boolean;
}

// Error Types
export interface ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, any>;
}

// Request Context
export interface RequestContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
  requestId: string;
}

// Analytics
export interface SearchAnalytics {
  query: string;
  resultsCount: number;
  clickedResults?: string[];
  filters: AppliedFilters;
  timestamp: Date;
  sessionId?: string;
}

// Export Configuration
export interface ExportConfig {
  format: 'csv' | 'json' | 'xml';
  includeImages: boolean;
  includeVariants: boolean;
  includeMetafields: boolean;
  fields?: string[];
  filters?: SearchParams;
}

// Health Check
export interface HealthCheckResponse extends ApiResponse {
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    checks: {
      database: boolean;
      cache: boolean;
      filesystem: boolean;
    };
    stats: {
      totalProducts: number;
      cacheHitRate: number;
      averageResponseTime: number;
    };
  };
}

// Rate Limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// API Key/Authentication
export interface ApiKeyInfo {
  keyId: string;
  permissions: string[];
  rateLimit: RateLimitInfo;
  lastUsed?: Date;
}