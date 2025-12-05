"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ============================================================================
// ProductCardSkeleton - Standard grid card skeleton
// ============================================================================
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("group relative", className)}>
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
        <Skeleton className="h-full w-full" />

        {/* Badges Skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        {/* Category */}
        <Skeleton className="h-4 w-24" />

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Color Variants */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ProductCardCompactSkeleton - Smaller card skeleton for grids
// ============================================================================
export function ProductCardCompactSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("group relative", className)}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Skeleton className="h-full w-full" />

        {/* Mini Badge */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-2 space-y-1">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

// ============================================================================
// ProductCardFeaturedSkeleton - Large featured card skeleton
// ============================================================================
export function ProductCardFeaturedSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100", className)}>
      <div className="grid md:grid-cols-2 gap-8 p-8">
        {/* Image Section */}
        <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
          <Skeleton className="h-full w-full" />

          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>

          {/* Discount Badge */}
          <div className="absolute top-4 right-4">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Gallery Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Skeleton className="h-2 w-6 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-6">
          <Skeleton className="h-6 w-32 rounded-full" />

          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-12 w-28" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Color Variants */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ProductCardHorizontalSkeleton - List view card skeleton
// ============================================================================
export function ProductCardHorizontalSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white border border-gray-200",
      className
    )}>
      {/* Image Section */}
      <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Skeleton className="h-full w-full" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="space-y-3">
          {/* Category */}
          <Skeleton className="h-5 w-20 rounded-full" />

          {/* Title */}
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />

          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Color Variants */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t mt-4">
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ProductGallerySkeleton - Product gallery skeleton
// ============================================================================
export function ProductGallerySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
        <Skeleton className="h-full w-full" />

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Navigation Arrows */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="aspect-square rounded-lg" />
      </div>
    </div>
  )
}

// ============================================================================
// ProductDetailSkeleton - Full product detail page skeleton
// ============================================================================
export function ProductDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery Section */}
        <ProductGallerySkeleton />

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Category Badge */}
          <Skeleton className="h-6 w-32 rounded-full" />

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-4/5" />
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Price */}
          <div className="py-4 border-y">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            {/* Color Variants */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </div>

            {/* Size Variants */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-16 rounded-lg" />
                <Skeleton className="h-12 w-16 rounded-lg" />
                <Skeleton className="h-12 w-16 rounded-lg" />
                <Skeleton className="h-12 w-16 rounded-lg" />
                <Skeleton className="h-12 w-16 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Skeleton className="h-14 flex-1 rounded-xl" />
            <Skeleton className="h-14 w-14 rounded-xl" />
            <Skeleton className="h-14 w-14 rounded-xl" />
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>

          {/* Accordion/Tabs */}
          <div className="space-y-3 pt-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6 pt-8 border-t">
        <Skeleton className="h-8 w-48" />

        {/* Review Summary */}
        <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
          <div className="space-y-3">
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-6 pt-8 border-t">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCardCompactSkeleton />
          <ProductCardCompactSkeleton />
          <ProductCardCompactSkeleton />
          <ProductCardCompactSkeleton />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ProductListSkeleton - Product list/grid skeleton
// ============================================================================
export function ProductListSkeleton({
  count = 12,
  layout = "grid",
  className
}: {
  count?: number
  layout?: "grid" | "list"
  className?: string
}) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 space-y-6">
          <Skeleton className="h-10 w-full rounded-lg" />

          {/* Filter Groups */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Product Grid/List */}
        <div className="flex-1">
          {/* Results Count and Sort */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>

          {/* Products */}
          {layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(count)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[...Array(count)].map((_, i) => (
                <ProductCardHorizontalSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ProductQuickViewSkeleton - Quick view modal skeleton
// ============================================================================
export function ProductQuickViewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-6", className)}>
      {/* Gallery Section */}
      <div className="space-y-4">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex items-baseline gap-3 py-4 border-y">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

// ============================================================================
// ProductComparisonSkeleton - Product comparison skeleton
// ============================================================================
export function ProductComparisonSkeleton({ count = 3, className }: { count?: number, className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <Skeleton className="h-8 w-48" />

      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-8 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
