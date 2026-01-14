"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fallbackSrc?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
  variant?: "card" | "hero" | "thumbnail" | "gallery";
  showHoverEffect?: boolean;
  showOverlay?: boolean;
  overlayContent?: React.ReactNode;
  onImageError?: () => void;
  onImageLoad?: () => void;
}

// Aspect ratio configurations
const aspectRatios = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]"
};

// Variant-specific styles
const variantStyles = {
  card: {
    container: "overflow-hidden bg-slate-50",
    image: "object-cover transition-transform duration-300 group-hover:scale-105",
    overlay: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
  },
  hero: {
    container: "overflow-hidden bg-slate-100",
    image: "object-cover transition-transform duration-500 hover:scale-102",
    overlay: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
  },
  thumbnail: {
    container: "overflow-hidden bg-slate-50 border border-slate-200",
    image: "object-cover transition-all duration-200 hover:brightness-110",
    overlay: "absolute inset-0 ring-0 hover:ring-2 hover:ring-pg-sky transition-all duration-200"
  },
  gallery: {
    container: "overflow-hidden bg-white border border-slate-100 hover:border-slate-200 hover:shadow-medium",
    image: "object-cover transition-all duration-300 hover:scale-105",
    overlay: "absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"
  }
};

// Default blur data URL for loading states
const defaultBlurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

function ProductImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  quality = 85,
  fallbackSrc = "/placeholder-door.jpg",
  aspectRatio = "square",
  variant = "card",
  showHoverEffect = true,
  showOverlay = true,
  overlayContent,
  onImageError,
  onImageLoad,
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const containerRef = useRef<HTMLDivElement>(null);

  const styles = variantStyles[variant];

  // Handle image loading completion
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    onImageLoad?.();
  }, [onImageLoad]);

  // Handle image loading errors with fallback
  const handleImageError = useCallback(() => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
    onImageError?.();
  }, [hasError, fallbackSrc, currentSrc, onImageError]);

  // Reset state when src changes
  useEffect(() => {
    if (src !== currentSrc && !hasError) {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, currentSrc, hasError]);

  // Error state fallback
  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex items-center justify-center bg-slate-100 text-slate-400",
          aspectRatios[aspectRatio],
          styles.container,
          className
        )}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <svg
            className="w-8 h-8 mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-light">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        aspectRatios[aspectRatio],
        styles.container,
        className
      )}
    >
      {/* Loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
      )}

      {/* Main product image */}
      <Image
        src={currentSrc}
        alt={alt}
        fill={!width && !height}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={
          sizes ||
          "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        }
        placeholder="blur"
        blurDataURL={defaultBlurDataURL}
        className={cn(
          styles.image,
          !showHoverEffect && "group-hover:scale-100 hover:scale-100",
          isLoading ? "opacity-0" : "opacity-100",
          "transition-opacity duration-300"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Hover overlay */}
      {showOverlay && (
        <div className={cn(styles.overlay)}>
          {overlayContent && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                {overlayContent}
              </div>
            </div>
          )}

          {/* Default overlay content for card variant */}
          {!overlayContent && variant === "card" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-light text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-medium">
                View Details
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Development mode format indicator */}
      {process.env.NODE_ENV === "development" && !isLoading && !hasError && (
        <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded font-mono">
          {currentSrc?.includes('.webp') ? 'WebP' :
           currentSrc?.includes('.avif') ? 'AVIF' : 'Original'}
        </div>
      )}
    </div>
  );
}

export { ProductImage };