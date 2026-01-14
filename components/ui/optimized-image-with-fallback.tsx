"use client"

import React, { useState } from "react"
import Image, { ImageProps } from "next/image"
import { ImageErrorBoundary } from "./error-boundary"
import { AlertTriangle } from "lucide-react"

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
  showErrorState?: boolean
  errorMessage?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  showErrorState = true,
  errorMessage = "Image failed to load",
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    } else {
      setHasError(true)
    }
  }

  if (hasError && showErrorState) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-500 p-4 ${props.className || ""}`}>
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <ImageErrorBoundary>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        placeholder={props.placeholder || "blur"}
        blurDataURL={props.blurDataURL || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAABBQEBAQEBAQAAAAAAAAAEAQIDBQAGByETIv/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEQMSkf/aAAwDAQACEQMRAD8A0+yeuwiG+4lk5Y3N5YhZFpnelduG0cR7w3Pz0SudECH/2Q=="}
      />
    </ImageErrorBoundary>
  )
}

// Pre-configured variants for common use cases
export function ProductImage({ 
  src, 
  alt, 
  priority = false, 
  ...props 
}: OptimizedImageProps & { priority?: boolean }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      {...props}
    />
  )
}

export function HeroImage({ 
  src, 
  alt, 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      sizes="100vw"
      {...props}
    />
  )
}

export function ThumbnailImage({ 
  src, 
  alt, 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      loading="lazy"
      sizes="(max-width: 768px) 50vw, 25vw"
      {...props}
    />
  )
}