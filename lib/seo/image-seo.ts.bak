/**
 * AGENT 11-12: Image SEO Agents - Image Optimization & Alt Text Generation
 * Comprehensive image SEO utilities for better search visibility
 */

/**
 * Generate SEO-optimized alt text for product images
 */
export function generateProductAltText(params: {
  productName: string
  category?: string
  color?: string
  style?: string
  material?: string
  room?: string
  index?: number
}): string {
  const parts: string[] = []

  // Primary description
  parts.push(params.productName)

  // Add category context
  if (params.category) {
    parts.push(params.category.toLowerCase())
  }

  // Add distinguishing features
  if (params.color) parts.push(params.color.toLowerCase())
  if (params.material) parts.push(params.material.toLowerCase())
  if (params.style) parts.push(params.style.toLowerCase())

  // Add context
  if (params.room) {
    parts.push(`for ${params.room.toLowerCase()}`)
  }

  // Add image number for multiple images
  if (params.index !== undefined && params.index > 0) {
    parts.push(`- view ${params.index + 1}`)
  }

  // Add location for local SEO
  parts.push('Ottawa')

  return parts.join(' ')
}

/**
 * Generate SEO-optimized alt text for lifestyle/room images
 */
export function generateRoomAltText(params: {
  room: string
  style?: string
  feature?: string
  productType?: string
}): string {
  const parts: string[] = []

  // Room type
  if (params.style) {
    parts.push(params.style)
  }
  parts.push(params.room)

  // Feature
  if (params.feature) {
    parts.push(`with ${params.feature}`)
  }

  // Product type
  if (params.productType) {
    parts.push(`featuring ${params.productType}`)
  }

  parts.push('in Ottawa home')

  return parts.join(' ')
}

/**
 * Image metadata for better SEO
 */
export interface ImageMetadata {
  src: string
  alt: string
  title?: string
  width: number
  height: number
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
}

/**
 * Generate optimized image metadata
 */
export function generateImageMetadata(params: {
  src: string
  alt: string
  width: number
  height: number
  isPriority?: boolean
  isAboveFold?: boolean
  productName?: string
}): ImageMetadata {
  return {
    src: params.src,
    alt: params.alt,
    title: params.productName,
    width: params.width,
    height: params.height,
    loading: params.isAboveFold ? 'eager' : 'lazy',
    fetchPriority: params.isPriority ? 'high' : 'auto',
    sizes: generateImageSizes(),
  }
}

/**
 * Generate responsive image sizes attribute
 */
export function generateImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}

/**
 * Generate image srcset for responsive images
 */
export function generateImageSrcSet(baseSrc: string, widths: number[]): string {
  return widths
    .map(width => {
      const url = optimizeImageUrl(baseSrc, width)
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Optimize image URL with query parameters
 * (Works with services like Vercel Image Optimization, Cloudinary, etc.)
 */
export function optimizeImageUrl(src: string, width?: number, quality = 85): string {
  const url = new URL(src, 'https://www.pgclosets.com')

  if (width) {
    url.searchParams.set('w', width.toString())
  }

  url.searchParams.set('q', quality.toString())
  url.searchParams.set('auto', 'format')

  return url.toString()
}

/**
 * Common image widths for responsive images
 */
export const IMAGE_WIDTHS = {
  thumbnail: [100, 200, 300],
  product: [400, 600, 800, 1000],
  hero: [640, 750, 828, 1080, 1200, 1920],
  gallery: [320, 640, 960, 1280, 1600]
}

/**
 * Image compression guidelines
 */
export const IMAGE_QUALITY = {
  thumbnail: 70,
  product: 85,
  hero: 90,
  gallery: 85
}

/**
 * Validate image for SEO best practices
 */
export interface ImageValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  recommendations: string[]
}

export function validateImageSEO(params: {
  alt?: string
  src: string
  width?: number
  height?: number
  fileSize?: number
}): ImageValidation {
  const errors: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []

  // Alt text validation
  if (!params.alt) {
    errors.push('Missing alt text - critical for accessibility and SEO')
  } else {
    if (params.alt.length < 10) {
      warnings.push('Alt text too short - should be descriptive (10-125 characters)')
    }
    if (params.alt.length > 125) {
      warnings.push('Alt text too long - keep under 125 characters')
    }
    if (params.alt.toLowerCase().includes('image of') || params.alt.toLowerCase().includes('picture of')) {
      recommendations.push('Remove redundant phrases like "image of" or "picture of"')
    }
  }

  // Dimension validation
  if (!params.width || !params.height) {
    errors.push('Missing width/height - causes layout shift (CLS)')
  }

  // File size validation
  if (params.fileSize) {
    const sizeMB = params.fileSize / (1024 * 1024)
    if (sizeMB > 0.5) {
      warnings.push(`Large file size (${sizeMB.toFixed(2)}MB) - compress to under 500KB`)
    }
  }

  // Format validation
  const ext = params.src.split('.').pop()?.toLowerCase()
  if (ext && !['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) {
    warnings.push('Use modern formats like WebP or AVIF for better performance')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations
  }
}

/**
 * Generate structured data for images
 */
export function generateImageObject(params: {
  url: string
  caption?: string
  width: number
  height: number
  description?: string
}) {
  return {
    '@type': 'ImageObject',
    url: params.url,
    width: params.width,
    height: params.height,
    caption: params.caption,
    description: params.description,
    contentUrl: params.url,
  }
}

/**
 * Batch process images for SEO optimization
 */
export interface ImageBatchInput {
  src: string
  productName?: string
  category?: string
  index?: number
}

export function batchOptimizeImages(images: ImageBatchInput[]): ImageMetadata[] {
  return images.map((img, idx) => {
    const alt = img.productName
      ? generateProductAltText({
          productName: img.productName,
          category: img.category,
          index: img.index ?? idx
        })
      : `Image ${idx + 1}`

    return generateImageMetadata({
      src: img.src,
      alt,
      width: 800,
      height: 600,
      isPriority: idx === 0, // First image is priority
      isAboveFold: idx === 0
    })
  })
}
