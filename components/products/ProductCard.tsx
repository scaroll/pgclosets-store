"use client"

import Image from "next/image"
import type { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BadgeChip } from "@/components/ui/badge-chip"
import { CTALogoButton } from "@/components/conversion/LogoConversionOptimizer"
import { LogoConversionOptimizer } from "@/components/conversion/LogoConversionOptimizer"

interface ProductCardProps {
  product: Product
  onQuoteRequest: (product: Product) => void
  imageLoadingPriority?: "eager" | "lazy"
  className?: string
}

export function ProductCard({
  product,
  onQuoteRequest,
  imageLoadingPriority = "lazy",
  className,
}: ProductCardProps) {
  // Generate benefit line from metadata or features
  const benefitLine = (product.metadata?.benefits as string)
    || (product.metadata?.features as string[])?.slice(0, 2).join(" • ")
    || null;

  return (
    <Card
      variant="elevated"
      spacing="none"
      className={className}
    >
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden group rounded-t-xl">
        <Image
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading={imageLoadingPriority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
          quality={85}
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Chips - positioned in top-right */}
        <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
          {product.metadata?.bestseller && (
            <BadgeChip variant="bestseller">Bestseller</BadgeChip>
          )}
          {product.metadata?.inStockOttawa && (
            <BadgeChip variant="inStock">In Stock Ottawa</BadgeChip>
          )}
          {product.metadata?.isNew && (
            <BadgeChip variant="new">New</BadgeChip>
          )}
        </div>

        {/* Free Quote Badge - moved to bottom-left */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="default" size="default" className="bg-black text-white hover:bg-black/90 tracking-[0.2em] uppercase font-medium">
            Get Quote
          </Badge>
        </div>
      </div>

      {/* Product Details */}
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-light tracking-wide line-clamp-2">
          {product.title}
        </CardTitle>
        {/* Benefit line or price */}
        <CardDescription className="text-sm font-light">
          {benefitLine || `From ${formatPrice(product.variants[0]?.price)}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Action Buttons */}
        <div className="flex gap-2">
          <CTALogoButton
            onClick={() => onQuoteRequest(product)}
            variant="primary"
            size="sm"
            trackingContext="product_card_quote"
            className="add-to-cart flex-1 text-sm uppercase tracking-widest py-3"
          >
            Get Quote
          </CTALogoButton>
          <CTALogoButton
            href={`/products/${product.handle}`}
            variant="secondary"
            size="sm"
            showLogo={false}
            trackingContext="product_card_details"
            className="touch-target px-4 text-sm uppercase tracking-widest py-3"
          >
            Details
          </CTALogoButton>
        </div>
      </CardContent>

      {/* Trust Signals Footer */}
      <CardFooter className="flex-col items-start space-y-3 border-t pt-4">
        <LogoConversionOptimizer
          placement="pricing"
          variant="trust_signal"
          size="sm"
        />

        {/* Trust Badges Row */}
        <div className="flex items-center justify-between w-full text-xs">
          <Badge variant="success" size="sm" className="gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Licensed & Insured
          </Badge>
          <Badge variant="info" size="sm" className="gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Lifetime Warranty
          </Badge>
        </div>

        {/* Reviews Badge */}
        <div className="flex items-center justify-center w-full">
          <Badge variant="outline" size="sm" className="text-xs text-gray-600">
            ⭐⭐⭐⭐⭐ 5.0 (500+ Reviews)
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}