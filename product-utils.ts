import type React from "react"
export interface ProductImageMapping {
  slug: string
  blobImages: string[]
  primaryBlobImage?: string
}

// Mock storage for product mappings - in real app this would come from database
const productMappings: Record<string, ProductImageMapping> = {}

export function getProductImages(product: any): string[] {
  const mapping = productMappings[product.slug]

  // If we have blob images mapped, use those
  if (mapping && mapping.blobImages.length > 0) {
    return mapping.blobImages
  }

  // Fallback to static images or generate placeholder images
  if (product.images && product.images.length > 0) {
    return product.images
  }

  // Generate default placeholder images
  return [
    product.image || `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Main`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Detail`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Hardware`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Installation`,
    `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(product.title)}+Finished`,
  ]
}

export function getPrimaryProductImage(product: any): string {
  const mapping = productMappings[product.slug]

  // Use primary blob image if set
  if (mapping && mapping.primaryBlobImage) {
    return mapping.primaryBlobImage
  }

  // Use first blob image if available
  if (mapping && mapping.blobImages.length > 0) {
    return mapping.blobImages[0]
  }

  // Fallback to static image
  return product.image || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(product.title)}`
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
