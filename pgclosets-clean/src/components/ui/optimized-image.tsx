"use client"

import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"

interface OptimizedImageProps {
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
  webpSrc?: string
  avifSrc?: string
  loading?: "lazy" | "eager"
  onLoad?: () => void
  onError?: () => void
}

// Image format detection utilities
const supportsWebP = () => {
  if (typeof window === 'undefined') return false
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

const supportsAVIF = () => {
  if (typeof window === 'undefined') return false
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
}

// Intersection observer hook for lazy loading
const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLDivElement | null>,
  { threshold = 0.1, rootMargin = '50px' } = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, hasIntersected])

  return { isIntersecting, hasIntersected }
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function OptimizedImage({
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
  webpSrc,
  avifSrc,
  loading = "lazy",
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [formatSupport, setFormatSupport] = useState<{
    webp: boolean
    avif: boolean
  }>({ webp: false, avif: false })

  const containerRef = useRef<HTMLDivElement>(null)
  const { hasIntersected } = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  const defaultBlurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

  // Detect format support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormatSupport({
        webp: supportsWebP(),
        avif: supportsAVIF()
      })
    }
  }, [])

  // Determine optimal image source based on format support
  const getOptimalSrc = useCallback(() => {
    if (formatSupport.avif && avifSrc) {
      return avifSrc
    }
    if (formatSupport.webp && webpSrc) {
      return webpSrc
    }
    return src
  }, [src, webpSrc, avifSrc, formatSupport])

  // Update source when format support is detected
  useEffect(() => {
    const optimalSrc = getOptimalSrc()
    if (optimalSrc !== currentSrc) {
      setCurrentSrc(optimalSrc)
      setIsLoading(true)
      setHasError(false)
    }
  }, [getOptimalSrc, currentSrc])

  const handleImageError = useCallback(() => {
    if (!hasError) {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        setIsLoading(true)
        setHasError(false)
      } else {
        setHasError(true)
        setIsLoading(false)
      }
    }
    onError?.()
  }, [hasError, fallbackSrc, currentSrc, onError])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn("bg-gray-100 flex items-center justify-center text-center p-4", className)}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <div className="text-gray-500">
          <div className="w-8 h-8 mx-auto mb-2 opacity-50">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    )
  }

  // Don't render image until it's visible (unless priority is true)
  const shouldLoad = priority || hasIntersected

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {shouldLoad ? (
        <>
          <Image
            src={currentSrc || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            priority={priority}
            quality={quality}
            loading={priority ? "eager" : loading}
            sizes={
              sizes ||
              "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            }
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            className={cn(
              "transition-all duration-500 ease-out",
              isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            aria-describedby={isLoading ? "image-loading" : undefined}
            {...props}
          />
          {isLoading && (
            <>
              <div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite linear"
                }}
              />
              <span id="image-loading" className="sr-only">
                Loading image: {alt}
              </span>
            </>
          )}

          {/* Performance hint: Display format being used */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
              {currentSrc?.includes('.avif') ? 'AVIF' :
               currentSrc?.includes('.webp') ? 'WebP' : 'Original'}
            </div>
          )}
        </>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          aria-label="Image placeholder"
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}