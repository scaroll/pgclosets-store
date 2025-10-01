import type React from "react"
import type { Product } from "@/types/commerce"

export interface ProductImageMapping {
  slug: string
  blobImages: string[]
  primaryBlobImage?: string
}

type ProductLike = Product | {
  slug: string;
  title: string;
  image?: string;
  images?: string[];
  arcatImages?: string[];
}

// Mock storage for product mappings - in real app this would come from database
const productMappings: Record<string, ProductImageMapping> = {}

export function getProductImages(product: ProductLike): string[] {
  const mapping = productMappings[product.slug]

  // If we have blob images mapped, use those
  if (mapping && mapping.blobImages.length > 0) {
    return mapping.blobImages
  }

  // Priority 1: Use arcatImages if available (from enhanced database)
  if ('arcatImages' in product && product.arcatImages && Array.isArray(product.arcatImages) && product.arcatImages.length > 0) {
    return product.arcatImages
  }

  // Priority 2: Use images array if available
  if (product.images && product.images.length > 0) {
    return product.images
  }

  // Priority 3: Use single image if available
  if (product.image) {
    return [product.image]
  }

  // Final fallback: Generate placeholder images
  return [
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Main`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Detail`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Hardware`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Installation`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Finished`,
  ]
}

export function getPrimaryProductImage(product: ProductLike): string {
  const mapping = productMappings[product.slug]

  // Use primary blob image if set
  if (mapping && mapping.primaryBlobImage) {
    return mapping.primaryBlobImage
  }

  // Use first blob image if available
  if (mapping && mapping.blobImages.length > 0) {
    return mapping.blobImages[0]
  }

  // Priority 1: Use first arcatImage if available
  if ('arcatImages' in product && product.arcatImages && Array.isArray(product.arcatImages) && product.arcatImages.length > 0) {
    return product.arcatImages[0]
  }

  // Priority 2: Use first image from images array
  if (product.images && product.images.length > 0) {
    return product.images[0]
  }

  // Priority 3: Use single image property
  if (product.image) {
    return product.image
  }

  // Final fallback
  return `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(product.title)}`
}

export function updateProductMapping(slug: string, mapping: Partial<ProductImageMapping>) {
  if (!productMappings[slug]) {
    productMappings[slug] = { slug, blobImages: [] }
  }

  Object.assign(productMappings[slug], mapping)
}

export function getProductMapping(slug: string): ProductImageMapping | null {
  return productMappings[slug] || null
}

// Function to check if image URL is from Blob storage
export function isBlobImage(url: string): boolean {
  return url.includes("blob.vercel-storage.com") || url.includes("vercel-storage.com")
}

// Enhanced image error handling
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>, fallbackSrc?: string) {
  const target = e.target as HTMLImageElement
  if (fallbackSrc && target.src !== fallbackSrc) {
    target.src = fallbackSrc
  } else {
    target.src = "/placeholder.svg"
  }
}
