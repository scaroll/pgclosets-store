/**
 * Product Type Definitions for PG Closets
 */

export type ProductCategory =
  | 'barn-doors'
  | 'bifold-doors'
  | 'bypass-doors'
  | 'pivot-doors'
  | 'room-dividers'
  | 'hardware'
  | 'mirrors';

export type ProductStyle =
  | 'Modern'
  | 'Traditional'
  | 'Contemporary'
  | 'Rustic'
  | 'Industrial'
  | 'Minimalist';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number; // in cents
  salePrice?: number; // in cents
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string | number>;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;

  // Additional metadata
  popularity?: number;
  createdAt?: string;
  updatedAt?: string;
  sku?: string;
  brand?: string;
  tags?: string[];

  // Inventory
  inventory?: {
    tracked: boolean;
    quantity: number;
    lowStockThreshold?: number;
    allowBackorder?: boolean;
  };

  // Variants
  variants?: ProductVariant[];
  options?: ProductOption[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number; // in cents
  compareAtPrice?: number;
  options: Record<string, string>; // e.g., { "Size": "36\"", "Finish": "White" }
  inventory: {
    quantity: number;
    tracked: boolean;
    allowBackorder: boolean;
  };
  imageId?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'inches' | 'cm';
  };
  active: boolean;
}

export interface ProductOption {
  id: string;
  name: string; // e.g., "Size", "Finish", "Material"
  values: string[];
  required?: boolean;
}

export interface ProductFilter {
  categories?: ProductCategory[];
  priceRange?: {
    min: number;
    max: number;
  };
  styles?: string[];
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  brand?: string[];
  tags?: string[];
  query?: string;
}

export interface ProductSort {
  field: 'price' | 'name' | 'date' | 'popularity' | 'rating' | 'featured';
  order: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  facets?: {
    categories: Array<{ id: string; name: string; count: number }>;
    brands: Array<{ value: string; count: number }>;
    priceRanges: Array<{
      range: string;
      count: number;
      min: number;
      max: number;
    }>;
    tags: Array<{ value: string; count: number }>;
    inStock: { available: number; outOfStock: number };
  };
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  options?: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  medium?: string;
  large?: string;
}