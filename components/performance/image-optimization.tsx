'use client'

import Image from 'next/image'
import { useState } from 'react'

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
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  loading?: 'lazy' | 'eager'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Generate fallback placeholder if none provided
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli/lFlFfzcecbhj7wEi1R1V2hP7Dcp6vLi+c8qN5Cl/2wcdD++8n7GiEBmONBGNVGb3S+A="

  if (hasError) {
    return (
      <div 
        className={`bg-slate-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-slate-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={fill ? {} : { width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-slate-200 animate-pulse"
          style={fill ? {} : { width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover'
        }}
      />
    </div>
  )
}

// Higher-order component for lazy loading images
export function LazyImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} loading="lazy" />
}

// Product image with automatic AVIF/WebP optimization
export function ProductImage({
  src,
  alt,
  ...props
}: Omit<OptimizedImageProps, 'quality' | 'placeholder'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      quality={90}
      placeholder="blur"
      {...props}
    />
  )
}

// Hero image with priority loading
export function HeroImage({
  src,
  alt,
  ...props
}: Omit<OptimizedImageProps, 'priority' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      quality={95}
      {...props}
    />
  )
}