/**
 * Utility types and helper function interfaces
 */

import { type ClassValue } from "clsx";

// Class variance authority types
export interface VariantProps<T extends (...args: any) => any> {
  [key: string]: any;
}

// CVA function type
export interface CVAFunction {
  (...inputs: ClassValue[]): string;
  variants: Record<string, Record<string, string>>;
  compoundVariants?: Array<{
    [key: string]: any;
    class: string;
  }>;
  defaultVariants?: Record<string, any>;
}

// CN function type (className utility)
export interface CNFunction {
  (...inputs: ClassValue[]): string;
}

// Image carousel component types
export interface ImageCarouselProps {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  showControls?: boolean;
  aspectRatio?: string;
  onImageChange?: (index: number) => void;
}

// Video gallery component types
export interface VideoGalleryProps {
  videos: Array<{
    url: string;
    title: string;
    thumbnail?: string;
    duration?: string;
    description?: string;
  }>;
  layout?: 'grid' | 'carousel';
  autoPlay?: boolean;
  showControls?: boolean;
  onVideoSelect?: (video: any) => void;
}

// SEO types
export interface ProductJSONLD {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  image?: string | string[];
  brand?: {
    "@type": string;
    name: string;
  };
  offers?: {
    "@type": string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
  review?: Array<{
    "@type": string;
    author: {
      "@type": string;
      name: string;
    };
    reviewRating: {
      "@type": string;
      ratingValue: number;
    };
    reviewBody: string;
    datePublished: string;
  }>;
}

// Module declarations for external libraries
declare module '@medusajs/medusa' {
  export interface Cart {
    id: string;
    customer_id?: string;
    items: any[];
    subtotal: number;
    tax_total: number;
    shipping_total: number;
    total: number;
    created_at: string;
    updated_at: string;
  }

  export interface LineItem {
    id: string;
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    unit_price: number;
    total: number;
    title: string;
    description?: string;
    thumbnail?: string;
  }

  export interface Product {
    id: string;
    title: string;
    handle: string;
    description?: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
  }
}

// JSON file types
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

// Data directory imports
declare module '@/data/*' {
  const value: Record<string, unknown>;
  export default value;
}

// Global type augmentations
declare global {
  // Remove global any types - these should use proper interfaces
  type Product = import('./commerce').Product;
  type ProductStore = import('./products').ProductStore;

  interface ArcatProduct {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    manufacturer: string;
    model: string;
    price?: number;
    images: string[];
    specifications: Record<string, string | number>;
    availability: 'available' | 'unavailable' | 'discontinued';
    tags: string[];
    lastUpdated: string;
  }
}

export {};