// Product type definitions

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  category?: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  inStock?: boolean;
  specifications?: Record<string, any>;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  products?: Product[];
  subcategories?: ProductCategory[];
  parent?: string;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  brand?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  tags?: string[];
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
  step?: number;
}