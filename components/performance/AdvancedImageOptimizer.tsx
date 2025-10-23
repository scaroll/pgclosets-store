'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  blurHash?: string
  critical?: boolean
  webpSrc?: string
  avifSrc?: string
  onLoadCallback?: () => void
  performanceMode?: 'quality' | 'speed' | 'balanced'
}

/**
 * Advanced image optimizer with WebP/AVIF support and performance monitoring
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  blurHash,
  critical = false,
  webpSrc,
  avifSrc,
  onLoadCallback,
  performanceMode = 'balanced',
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Performance settings based on mode
  const qualitySettings = {
    quality: performanceMode === 'speed' ? 60 : performanceMode === 'quality' ? 90 : 75,
    unoptimized: performanceMode === 'speed',
    placeholder: blurHash ? 'blur' : 'empty' as const,
  }

  // Lazy loading for non-critical images
  useEffect(() => {
    if (critical || priority) return

    const img = imgRef.current
    if (!img) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src as string)
            observerRef.current?.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.01
      }
    )

    observerRef.current.observe(img)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [critical, priority, src])

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    onLoadCallback?.()

    // Performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      const loadTime = performance.now()
      console.debug(`Image loaded in ${loadTime.toFixed(2)}ms:`, src)
    }
  }, [onLoadCallback, src])

  // Handle image error
  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    console.error('Failed to load image:', src)
  }, [src])

  // Generate picture element sources for WebP/AVIF
  const renderPictureSources = () => {
    const sources = []

    if (avifSrc) {
      sources.push(
        <source
          key="avif"
          srcSet={avifSrc}
          type="image/avif"
        />
      )
    }

    if (webpSrc) {
      sources.push(
        <source
          key="webp"
          srcSet={webpSrc}
          type="image/webp"
        />
      )
    }

    return sources
  }

  // Determine the actual source to use
  const imageSrc = (critical || priority) ? src : currentSrc

  if (webpSrc || avifSrc) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <picture>
          {renderPictureSources()}
          <img
            ref={imgRef}
            src={imageSrc as string}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100',
              hasError && 'hidden',
              props.className
            )}
            loading={critical || priority ? 'eager' : 'lazy'}
            decoding="async"
            {...props}
          />
        </picture>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Fallback image */}
        {hasError && fallbackSrc && (
          <img
            src={fallbackSrc}
            alt={alt}
            className={cn('w-full h-full object-cover', props.className)}
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        ref={imgRef}
        src={imageSrc || ''}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'hidden'
        )}
        priority={critical || priority}
        quality={qualitySettings.quality}
        placeholder={qualitySettings.placeholder}
        blurDataURL={blurHash}
        {...props}
      />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Fallback image */}
      {hasError && fallbackSrc && (
        <Image
          src={fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
          {...props}
        />
      )}
    </div>
  )
}

export default OptimizedImage