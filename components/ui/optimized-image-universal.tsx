"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  type?: 'hero' | 'product' | 'gallery' | 'thumbnail' | 'logo' | 'lifestyle'
  aspectRatio?: number
  onLoad?: () => void
  onError?: () => void
}

// Image type configurations
const IMAGE_CONFIGS = {
  hero: {
    sizes: "100vw",
    quality: 90,
    priority: true,
    placeholder: true
  },
  product: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    quality: 85,
    priority: false,
    placeholder: true
  },
  gallery: {
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
    quality: 85,
    priority: false,
    placeholder: true
  },
  thumbnail: {
    sizes: "(max-width: 768px) 50vw, 25vw",
    quality: 75,
    priority: false,
    placeholder: false
  },
  logo: {
    sizes: "200px",
    quality: 90,
    priority: true,
    placeholder: false
  },
  lifestyle: {
    sizes: "(max-width: 768px) 100vw, 50vw",
    quality: 85,
    priority: false,
    placeholder: true
  }
}

// Default blur placeholder (low-quality gradient)
const DEFAULT_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

/**
 * Get optimized image URL from manifest or fallback to original
 */
function getOptimizedImageUrl(src: string, type: string): string {
  // TODO: Load from manifest when available
  // For now, use Next.js Image optimization
  return src
}

/**
 * Get blur data URL from manifest or use default
 */
function getBlurDataURL(src: string): string {
  // TODO: Load from manifest when available
  return DEFAULT_BLUR_DATA_URL
}

/**
 * Universal OptimizedImage component with automatic format selection,
 * responsive variants, lazy loading, and blur placeholders
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  sizes,
  quality,
  type = 'product',
  aspectRatio,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Get type-specific configuration
  const config = IMAGE_CONFIGS[type] || IMAGE_CONFIGS.product

  // Determine final values (props override config)
  const finalSizes = sizes || config.sizes
  const finalQuality = quality || config.quality
  const finalPriority = priority !== undefined ? priority : config.priority
  const useBlur = config.placeholder

  // Get optimized URL and blur data
  const optimizedSrc = getOptimizedImageUrl(src, type)
  const blurDataURL = useBlur ? getBlurDataURL(src) : undefined

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Handle image error with fallback
  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  // Error state
  if (hasError) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center",
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <div className="text-gray-400 text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={finalPriority}
        quality={finalQuality}
        sizes={finalSizes}
        placeholder={useBlur ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={cn(
          "transition-opacity duration-300 ease-out",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite'
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Specialized product image component with square aspect ratio
 */
export function ProductImage({
  src,
  alt,
  priority = false,
  className,
  ...props
}: Omit<OptimizedImageProps, 'type' | 'aspectRatio'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="product"
      aspectRatio={1}
      priority={priority}
      className={className}
      {...props}
    />
  )
}

/**
 * Specialized hero image component with full viewport sizing
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'type' | 'priority'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="hero"
      priority={true}
      className={className}
      {...props}
    />
  )
}

/**
 * Specialized gallery image component
 */
export function GalleryImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="gallery"
      className={className}
      {...props}
    />
  )
}

/**
 * Specialized thumbnail component with smaller sizing
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="thumbnail"
      className={className}
      {...props}
    />
  )
}

/**
 * Specialized logo component
 */
export function LogoImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="logo"
      className={className}
      {...props}
    />
  )
}
