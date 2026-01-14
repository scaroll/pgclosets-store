"use client"

import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { formatPrice } from "../../lib/enhanced-renin-products"
import { Button } from "../ui/button"
import dynamic from "next/dynamic"
import Link from "next/link"
import { OptimizedImage } from "../ui/optimized-image"
import { useState } from "react"

// Dynamically import AddToCartButton to avoid SSR issues with cart context
const AddToCartButton = dynamic(() => import("../ui/add-to-cart-button").then(mod => ({ default: mod.AddToCartButton })), {
  loading: () => <Button disabled className="w-full">Loading...</Button>,
  ssr: false
})

interface ProductCardProps {
  product: ArcatProduct
  priority?: boolean // For above-the-fold images
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const getImageSources = () => {
    const sources = []

    // Priority 1: Local ARCAT images
    if (product.arcatImages && product.arcatImages.length > 0) {
      sources.push(...product.arcatImages)
    }

    // Priority 2: External Home Depot image
    if (product.homeDepotImage) {
      sources.push(product.homeDepotImage)
    }

    // Priority 3: Final fallback placeholder
    sources.push(`/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`)

    return sources
  }

  const imageSources = getImageSources()
  const primaryImage = imageSources[0]
  const fallbackImage = imageSources[1]

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 touch-manipulation">
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 relative swipe-gallery">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        <OptimizedImage
          src={primaryImage || "/placeholder.svg"}
          alt={`${product.name} - Professional closet door by Renin - PG Closets Ottawa`}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 touch-pan-y"
          priority={priority}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
        />

        {/* Touch-friendly tap indicator for mobile */}
        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            <a
              href={`/store/products/${product.slug}`}
              className="hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label={`View ${product.name} details - Ottawa closet doors`}
            >
              {product.name}
            </a>
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl md:text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.inStock ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 md:px-3 py-1 rounded-full font-medium">In Stock</span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2 md:px-3 py-1 rounded-full font-medium">Out of Stock</span>
          )}
        </div>

        <div className="space-y-2 md:space-y-3">
          <AddToCartButton
            product={product}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white font-medium py-3 md:py-2.5 rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] text-base"
          />

          <Link href={`/store/products/${product.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 py-3 md:py-2.5 rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] text-base"
              aria-label={`View ${product.name} details and specifications`}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}