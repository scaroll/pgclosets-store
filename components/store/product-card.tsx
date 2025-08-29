"use client"

import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { formatPrice } from "../../lib/enhanced-renin-products"
import { Button } from "../ui/button"
import { RequestQuoteButton } from "../ui/request-quote-button"
import { OptimizedImage } from "../ui/optimized-image"
import { useState } from "react"

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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        <OptimizedImage
          src={primaryImage || "/placeholder.svg"}
          alt={`${product.name} - Professional closet door by Renin - PG Closets`}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
        />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            <a href={`/store/products/${product.slug}`} className="hover:underline">
              {product.name}
            </a>
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.inStock ? (
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">In Stock</span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">Out of Stock</span>
          )}
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="sm"
            href={`/store/products/${product.slug}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
          >
            View Details
          </Button>

          <RequestQuoteButton
            product={product}
            variant="outline"
            size="sm"
            className="w-full justify-center border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  )
}
