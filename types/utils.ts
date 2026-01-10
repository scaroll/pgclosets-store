/**
 * Utility types and helper function interfaces
 */

import type { ClassValue } from "clsx";

// Class variance authority types
export interface VariantProps<_T extends (...args: any[]) => any> {
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

// JSON file types
declare module '*.json' {
  const value: Record<string, unknown>;
}

// Data directory imports
declare module '@/data/*' {
  const value: Record<string, unknown>;
}

// Arcat Product interface
export interface ArcatProduct {
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