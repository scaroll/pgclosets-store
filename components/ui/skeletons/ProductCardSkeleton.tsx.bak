'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ShimmerOverlay } from '../loaders/ShimmerOverlay'

interface ProductCardSkeletonProps {
  className?: string
  variant?: 'grid' | 'list' | 'featured'
  showImage?: boolean
  showPrice?: boolean
  showActions?: boolean
}

/**
 * ProductCardSkeleton - Premium product card loading placeholder
 *
 * Matches the exact layout of product cards to prevent layout shift.
 * Features elegant shimmer animation and warm gray tones.
 *
 * @example
 * ```tsx
 * <ProductCardSkeleton variant="grid" />
 * <ProductCardSkeleton variant="list" />
 * <ProductCardSkeleton variant="featured" showActions={false} />
 * ```
 */
export function ProductCardSkeleton({
  className,
  variant = 'grid',
  showImage = true,
  showPrice = true,
  showActions = true
}: ProductCardSkeletonProps) {

  if (variant === 'list') {
    return (
      <div
        className={cn(
          "flex gap-6 p-6 bg-white border border-gray-100 rounded-lg",
          "animate-fade-in",
          className
        )}
        role="status"
        aria-label="Loading product information"
      >
        {showImage && (
          <div className="relative flex-shrink-0 w-48 h-48 overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>
        )}

        <div className="flex-1 space-y-4">
          {/* Title */}
          <div className="relative h-7 w-3/4 overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>

          {/* Description lines */}
          <div className="space-y-2">
            <div className="relative h-4 w-full overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-4 w-5/6 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-4 w-2/3 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>

          {/* Price and actions */}
          <div className="flex items-center justify-between pt-2">
            {showPrice && (
              <div className="relative h-8 w-32 overflow-hidden rounded">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay />
              </div>
            )}
            {showActions && (
              <div className="flex gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay />
                </div>
                <div className="relative h-10 w-32 overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay />
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="sr-only">Loading product details, please wait</span>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg",
          "animate-fade-in",
          className
        )}
        role="status"
        aria-label="Loading featured product"
      >
        {showImage && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Badge */}
          <div className="relative h-6 w-24 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>

          {/* Title */}
          <div className="relative h-10 w-full overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="relative h-5 w-full overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-5 w-full overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-5 w-3/4 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay />
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay />
                </div>
              </div>
            ))}
          </div>

          {showPrice && (
            <div className="relative h-12 w-48 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          )}

          {showActions && (
            <div className="flex gap-4 pt-4">
              <div className="relative h-14 flex-1 overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay />
              </div>
              <div className="relative h-14 w-14 overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay />
              </div>
            </div>
          )}
        </div>

        <span className="sr-only">Loading featured product information, please wait</span>
      </div>
    )
  }

  // Default grid variant
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white border border-gray-100 rounded-lg shadow-md",
        "animate-fade-in",
        className
      )}
      role="status"
      aria-label="Loading product"
    >
      {showImage && (
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gray-200" />
          <ShimmerOverlay />
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="relative h-6 w-3/4 overflow-hidden rounded">
          <div className="absolute inset-0 bg-gray-200" />
          <ShimmerOverlay />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="relative h-4 w-full overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>
          <div className="relative h-4 w-2/3 overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>
        </div>

        {showPrice && (
          <div className="relative h-6 w-1/3 overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <div className="relative h-12 flex-1 overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-12 w-12 overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>
        )}
      </div>

      <span className="sr-only">Loading product information, please wait</span>
    </div>
  )
}

/**
 * ProductGridSkeleton - Loading state for product grids
 *
 * Displays multiple product card skeletons in a responsive grid layout.
 * Includes stagger animation for elegant appearance.
 *
 * @example
 * ```tsx
 * <ProductGridSkeleton count={12} />
 * <ProductGridSkeleton count={8} variant="list" />
 * ```
 */
export function ProductGridSkeleton({
  count = 12,
  variant = 'grid',
  className
}: {
  count?: number
  variant?: 'grid' | 'list'
  className?: string
}) {
  const gridClass = variant === 'list'
    ? "space-y-6"
    : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

  return (
    <div
      className={cn(gridClass, className)}
      role="status"
      aria-label={`Loading ${count} products`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton
          key={index}
          variant={variant === 'list' ? 'list' : 'grid'}
          style={{
            animationDelay: `${index * 50}ms`
          } as React.CSSProperties}
        />
      ))}
      <span className="sr-only">Loading product grid, please wait</span>
    </div>
  )
}
