'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ShimmerOverlay } from '../loaders/ShimmerOverlay'

interface ProductDetailSkeletonProps {
  className?: string
  showGallery?: boolean
  showReviews?: boolean
  showRelated?: boolean
}

/**
 * ProductDetailSkeleton - Product detail page (PDP) loading placeholder
 *
 * Comprehensive loading state for product detail pages with:
 * - Image gallery skeleton
 * - Product info section
 * - Specifications/details
 * - Add to cart actions
 * - Optional reviews and related products sections
 *
 * Matches exact PDP layout to prevent cumulative layout shift (CLS).
 *
 * @example
 * ```tsx
 * <ProductDetailSkeleton showGallery showReviews />
 * ```
 */
export function ProductDetailSkeleton({
  className,
  showGallery = true,
  showReviews = true,
  showRelated = true
}: ProductDetailSkeletonProps) {
  return (
    <div
      className={cn("animate-fade-in", className)}
      role="status"
      aria-label="Loading product details"
    >
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div className="relative h-4 w-20 overflow-hidden rounded">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay />
              </div>
              {i < 4 && <span className="text-gray-400">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        {showGallery && (
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-md"
                >
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay duration={1500 + i * 100} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="relative h-6 w-32 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="relative h-10 w-full overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-10 w-3/4 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="relative h-5 w-32 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-4 w-24 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>

          {/* Price */}
          <div className="border-y border-gray-200 py-6">
            <div className="relative h-12 w-48 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "relative h-5 overflow-hidden rounded",
                  i === 4 ? "w-2/3" : "w-full"
                )}
              >
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay duration={1500 + i * 50} />
              </div>
            ))}
          </div>

          {/* Key Features */}
          <div className="space-y-4 rounded-lg bg-gray-50 p-6">
            <div className="relative h-6 w-40 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="relative mt-1 h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1200 + i * 100} />
                  </div>
                  <div className="relative h-5 flex-1 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1500 + i * 80} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Variants/Options */}
          <div className="space-y-4">
            <div className="relative h-5 w-24 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative h-12 w-16 overflow-hidden rounded-md"
                >
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay duration={1300 + i * 100} />
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <div className="relative h-5 w-20 overflow-hidden rounded">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="relative h-12 w-32 overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="relative h-14 w-full overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay />
            </div>
            <div className="flex gap-3">
              <div className="relative h-12 flex-1 overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay />
              </div>
              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay />
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="relative h-8 w-8 mx-auto overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay duration={1400 + i * 100} />
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay duration={1600 + i * 80} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications Tabs */}
      <div className="mt-16 space-y-8">
        {/* Tab Headers */}
        <div className="flex gap-6 border-b border-gray-200">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-6 w-32 mb-4 overflow-hidden rounded"
            >
              <div className="absolute inset-0 bg-gray-200" />
              <ShimmerOverlay duration={1300 + i * 100} />
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-8 py-4 border-b border-gray-100">
              <div className="relative h-5 w-48 overflow-hidden rounded flex-shrink-0">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay duration={1400 + i * 80} />
              </div>
              <div className="relative h-5 flex-1 overflow-hidden rounded">
                <div className="absolute inset-0 bg-gray-200" />
                <ShimmerOverlay duration={1500 + i * 100} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      {showReviews && (
        <div className="mt-16 space-y-8">
          <div className="relative h-8 w-64 overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <div className="absolute inset-0 bg-gray-200" />
                      <ShimmerOverlay duration={1300 + i * 100} />
                    </div>
                    <div className="space-y-2">
                      <div className="relative h-5 w-32 overflow-hidden rounded">
                        <div className="absolute inset-0 bg-gray-200" />
                        <ShimmerOverlay duration={1400 + i * 80} />
                      </div>
                      <div className="relative h-4 w-24 overflow-hidden rounded">
                        <div className="absolute inset-0 bg-gray-200" />
                        <ShimmerOverlay duration={1500 + i * 100} />
                      </div>
                    </div>
                  </div>
                  <div className="relative h-5 w-20 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative h-4 w-full overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1600 + i * 80} />
                  </div>
                  <div className="relative h-4 w-full overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1700 + i * 100} />
                  </div>
                  <div className="relative h-4 w-3/4 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1800 + i * 80} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {showRelated && (
        <div className="mt-16 space-y-8">
          <div className="relative h-8 w-56 overflow-hidden rounded">
            <div className="absolute inset-0 bg-gray-200" />
            <ShimmerOverlay />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gray-200" />
                  <ShimmerOverlay duration={1500 + i * 100} />
                </div>
                <div className="space-y-2">
                  <div className="relative h-5 w-full overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1600 + i * 80} />
                  </div>
                  <div className="relative h-4 w-2/3 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-gray-200" />
                    <ShimmerOverlay duration={1700 + i * 100} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <span className="sr-only">Loading product details, please wait</span>
    </div>
  )
}
