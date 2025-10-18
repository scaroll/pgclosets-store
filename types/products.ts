/**
 * Product-specific types and interfaces
 */

import type { Product, ProductImage } from './commerce';

// Product data transformation types
export interface ProductStore {
  items: Product[];
  categories: ProductCategory[];
  tags: string[];
  total: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
  image?: string;
  parent_id?: string;
  children?: ProductCategory[];
}

// Renin-specific product types
export interface ReninProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  model: string;
  sku: string;
  price: number;
  images: string[];
  specifications: Record<string, string | number>;
  features: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    weight?: number;
    unit?: 'inches' | 'cm' | 'mm';
  };
  material?: string;
  color?: string;
  finish?: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'discontinued';
  tags: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// Product transformation utilities
export interface ProductTransformConfig {
  includeImages?: boolean;
  includeVariants?: boolean;
  includeMetadata?: boolean;
  priceMultiplier?: number;
  defaultCurrency?: string;
}

export interface ProductSpec {
  label: string;
  value: string | number;
  unit?: string;
  category?: 'basic' | 'detailed' | 'technical';
}

export interface ProductSpecGroup {
  title: string;
  specs: ProductSpec[];
}

// Medusa integration types
export interface MedusaProductData {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  is_giftcard?: boolean;
  status?: 'draft' | 'proposed' | 'published' | 'rejected';
  thumbnail?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  collection_id?: string;
  type_id?: string;
  tags?: Array<{ value: string }>;
  discountable?: boolean;
  external_id?: string;
  images?: Array<{
    url: string;
    metadata?: Record<string, unknown>;
  }>;
  options?: Array<{
    title: string;
    values: Array<{ value: string }>;
  }>;
  variants?: Array<{
    title: string;
    sku?: string;
    ean?: string;
    upc?: string;
    barcode?: string;
    hs_code?: string;
    inventory_quantity?: number;
    allow_backorder?: boolean;
    manage_inventory?: boolean;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    origin_country?: string;
    mid_code?: string;
    material?: string;
    metadata?: Record<string, unknown>;
    prices?: Array<{
      currency_code: string;
      amount: number;
      min_quantity?: number;
      max_quantity?: number;
    }>;
    options?: Array<{ value: string }>;
  }>;
  metadata?: Record<string, unknown>;
}

// Product filtering and search types
export interface ProductFilter {
  category?: string[];
  tags?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  brand?: string[];
  collection?: string[];
  material?: string[];
  color?: string[];
}

export interface ProductSort {
  field: 'title' | 'price' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}

export interface ProductSearchParams {
  query?: string;
  filters?: ProductFilter;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters?: {
    categories: Array<{ value: string; count: number }>;
    brands: Array<{ value: string; count: number }>;
    priceRange: { min: number; max: number };
    tags: Array<{ value: string; count: number }>;
  };
}

// Cart product types
export interface CartProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  price: number;
  variants: CartProductVariant[];
  metadata?: Record<string, string | number>;
}

export interface CartProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory_quantity?: number;
  image?: ProductImage;
}

// Product utility types
export interface ProductImageUtilResult {
  primary: string;
  gallery: string[];
  thumbnails: string[];
}

export interface ProductPriceInfo {
  base: number;
  sale?: number;
  currency: string;
  formatted: {
    base: string;
    sale?: string;
  };
  discount?: {
    amount: number;
    percentage: number;
  };
}

export interface ProductAvailability {
  isInStock: boolean;
  quantity?: number;
  backorderAllowed?: boolean;
  estimatedRestock?: string;
  maxOrderQuantity?: number;
  minOrderQuantity?: number;
}

// Product validation types
export interface ProductValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ProductValidationResult {
  isValid: boolean;
  errors: ProductValidationError[];
  warnings: ProductValidationError[];
}

// Migration and sync types
export interface ProductMigrationResult {
  success: Product[];
  errors: Array<{
    id: string | number;
    error: unknown;
    input?: unknown;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
  };
}

export interface ProductSyncConfig {
  dryRun?: boolean;
  batchSize?: number;
  validateOnly?: boolean;
  updateExisting?: boolean;
  createMissing?: boolean;
  skipImages?: boolean;
}

// Product metadata types
export interface ProductMetadata {
  source?: 'renin' | 'manual' | 'import';
  lastSync?: string;
  externalId?: string;
  customFields?: Record<string, unknown>;
  seoOptimized?: boolean;
  featured?: boolean;
  promotions?: string[];
}