"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
      "animate-shimmer",
      className
    )}
    style={{
      animationDuration: "2s",
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
    }}
  />
)

// Individual Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="group bg-white shadow-2xl overflow-hidden border-l-4 border-[#87ceeb] animate-fade-in">
      {/* Image skeleton */}
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        <Skeleton className="w-full h-full" />
        {/* Badge skeleton */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-12" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Specifications skeleton */}
        <div className="p-4 bg-gray-50 border-l-4 border-[#87ceeb] space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>

        {/* Price and category skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-12" />
          <Skeleton className="h-12 w-24" />
        </div>
      </div>
    </div>
  )
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Product Page Header Skeleton
export function ProductPageHeaderSkeleton() {
  return (
    <div className="text-center mb-12 space-y-6">
      <Skeleton className="h-12 w-80 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
    </div>
  )
}

// Filter Controls Skeleton
export function FilterControlsSkeleton() {
  return (
    <div className="mb-12 bg-white shadow-2xl p-8 border-l-4 border-[#87ceeb]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Product Detail Modal Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="bg-white max-w-4xl max-h-full overflow-y-auto p-8 border-4 border-[#1e3a8a]">
      <div className="flex justify-between items-start mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square" />
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border-b border-[#87ceeb]/30 pb-2">
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Price and category */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Skeleton className="flex-1 h-12" />
            <Skeleton className="h-12 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
      <ProductGridSkeleton count={9} />
    </div>
  )
}

// Category Filter Skeleton
export function CategoryFilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20" />
      ))}
    </div>
  )
}

// Performance optimized lazy loading skeleton
export function LazyProductSkeleton() {
  return (
    <div className="group bg-white shadow-lg overflow-hidden border border-gray-200 transition-all duration-300">
      <div className="aspect-square relative bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    </div>
  )
}

// Complete Page Loading Skeleton
export function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header is shown normally since it's in layout */}

      <div className="pt-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <ProductPageHeaderSkeleton />
          <FilterControlsSkeleton />
          <ProductGridSkeleton count={9} />

          {/* Load more button skeleton */}
          <div className="text-center">
            <Skeleton className="h-12 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}