"use client"

import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { formatPrice } from "../../lib/enhanced-renin-products"
import { Button } from "../ui/button"
import { RequestQuoteButton } from "../ui/request-quote-button"
import { OptimizedImage } from "../ui/optimized-image"
import { useState } from "react"

interface ProductCardProps {
  product: ArcatProduct
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(true)

  const getImageSources = () => {
    const sources = []

    if (product.arcatImages && product.arcatImages.length > 0) {
      sources.push(...product.arcatImages)
    }

    if (product.homeDepotImage) {
      sources.push(product.homeDepotImage)
    }

    sources.push(`/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`)

    return sources
  }

  const imageSources = getImageSources()
  const primaryImage = imageSources[0]
  const fallbackImage = imageSources[1]

  return (
    <article className="card card-product group">
      {/* Image Container */}
      <div className="card-product-image relative">
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-shimmer" />
        )}

        <OptimizedImage
          src={primaryImage || "/placeholder.svg"}
          alt={`${product.name} - Professional closet door by Renin`}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
          onLoad={() => setIsLoading(false)}
        />

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <span className="badge badge-success">In Stock</span>
          ) : (
            <span className="badge badge-destructive">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card-product-body">
        {/* Category */}
        <p className="text-overline text-muted-foreground mb-2">
          {product.category}
        </p>

        {/* Title */}
        <h3 className="text-h4 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <a href={`/store/products/${product.slug}`} className="focus:outline-none">
            {product.name}
          </a>
        </h3>

        {/* Description */}
        <p className="text-body-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-h3 text-foreground">
            {formatPrice(product.price)}
          </span>
          <span className="text-body-sm text-muted-foreground">CAD</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="default"
            size="default"
            href={`/store/products/${product.slug}`}
            className="w-full"
          >
            View Details
          </Button>

          <RequestQuoteButton
            product={product}
            variant="outline"
            size="default"
            className="w-full"
          />
        </div>
      </div>
    </article>
  )
}
