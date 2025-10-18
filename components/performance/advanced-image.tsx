'use client'

"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePerformanceTracking } from "./performance-monitor"

interface AdvancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  fallbackSrc?: string
  lazy?: boolean
  eager?: boolean
  onLoad?: () => void
  onError?: () => void
  preload?: boolean
  critical?: boolean
  fadeIn?: boolean
  aspectRatio?: number
}

// Generate a simple blur placeholder
const generateBlurDataURL = (width = 10, height = 10): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(0.5, 'var(--color-border-default)')
    gradient.addColorStop(1, '#d1d5db')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  return canvas.toDataURL('image/jpeg', 0.1)
}

// Intersection Observer hook for lazy loading
function useIntersectionObserver() {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isIntersected, setIsIntersected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || isIntersected) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          setIsIntersected(true)
          observer.disconnect()
        }
      },
      {
        root: null,
        rootMargin: '50px', // Start loading 50px before element enters viewport
        threshold: 0.1
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [isIntersected])

  return { ref, isIntersecting: isIntersecting || isIntersected }
}

export function AdvancedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = "blur",
  blurDataURL,
  fallbackSrc,
  lazy = true,
  eager = false,
  onLoad,
  onError,
  preload = false,
  critical = false,
  fadeIn = true,
  aspectRatio,
  ...props
}: AdvancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [loadStartTime, setLoadStartTime] = useState<number>(0)
  const { ref, isIntersecting } = useIntersectionObserver()
  const { trackEvent, markStart, markEnd } = usePerformanceTracking()

  // Generate blur data URL if not provided
  const blurDataURLToUse = blurDataURL || (typeof window !== 'undefined' ? generateBlurDataURL() : undefined)

  // Determine if image should load
  const shouldLoad = priority || critical || eager || !lazy || isIntersecting

  // Preload critical images
  useEffect(() => {
    if ((preload || critical) && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)

      return () => {
        try {
          document.head.removeChild(link)
        } catch (_e) {
          // Link may hav_e alr_eady b_e_en r_emov_ed
        }
      }
    }
  }, [src, preload, critical])

  const handleImageLoad = () => {
    if (loadStartTime) {
      const loadTime = performance.now() - loadStartTime
      trackEvent('image_load', loadTime, {
        image_src: src,
        image_alt: alt,
        image_size: width && height ? `${width}x${height}` : 'responsive',
        was_lazy: lazy && !priority && !critical
      })
    }

    setIsLoading(false)
    onLoad?.()
    markEnd(`image-load-${alt}`)
  }

  const handleImageError = () => {
    trackEvent('image_error', 0, {
      image_src: src,
      fallback_available: !!fallbackSrc
    })

    if (!hasError) {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        setIsLoading(true)
      } else {
        setHasError(true)
        setIsLoading(false)
      }
    }
    onError?.()
  }

  const handleImageLoadStart = () => {
    setLoadStartTime(performance.now())
    markStart(`image-load-${alt}`)
  }

  // Error state
  if (hasError) {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-center",
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <div className="text-gray-500 p-4">
          <div className="w-8 h-8 mx-auto mb-2 opacity-50">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      </div>
    )
  }

  // Placeholder for lazy loading
  if (!shouldLoad) {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse",
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
        aria-label={`Loading image: ${alt}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-400 opacity-50">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority || critical}
        quality={quality}
        sizes={
          sizes ||
          "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        }
        placeholder={placeholder}
        blurDataURL={blurDataURLToUse}
        className={cn(
          "transition-all duration-500 ease-out",
          fadeIn && isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
          "hover:scale-105 transition-transform duration-300"
        )}
        onLoad={handleImageLoad}
        onLoadStart={handleImageLoadStart}
        onError={handleImageError}
        aria-describedby={isLoading ? `image-loading-${alt}` : undefined}
        {...props}
      />

      {/* Loading overlay */}
      {isLoading && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            />
          </div>
          <span id={`image-loading-${alt}`} className="sr-only">
            Loading image: {alt}
          </span>

          {/* Loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        </>
      )}

      {/* Image loaded indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && !isLoading && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-75">
          ✓
        </div>
      )}
    </div>
  )
}

// Product-specific optimized image component
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: Omit<AdvancedImageProps, 'aspectRatio' | 'sizes'> & {
  productName?: string
}) {
  return (
    <AdvancedImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      aspectRatio={1} // Square aspect ratio for products
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={90} // Higher quality for product images
      fadeIn={true}
      preload={priority}
      critical={priority}
      {...props}
    />
  )
}

// Hero image component with optimizations
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<AdvancedImageProps, 'priority' | 'critical' | 'lazy'>) {
  return (
    <AdvancedImage
      src={src}
      alt={alt}
      className={className}
      priority={true}
      critical={true}
      lazy={false}
      quality={95}
      sizes="100vw"
      preload={true}
      {...props}
    />
  )
}