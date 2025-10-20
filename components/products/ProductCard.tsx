"use client"

import Image from "next/image"
import type { Product } from "@/types/commerce"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
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
      className={cn("group/card hover:shadow-2xl transition-all duration-300", className)}
    >
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden rounded-t-xl bg-gray-100">
        <Image
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
          loading={imageLoadingPriority}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
          quality={85}
          onError={(e) => {
            // Fallback to placeholder on error
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Chips - positioned in top-right */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-1.5 flex-wrap justify-end pointer-events-none">
          {product.metadata?.bestseller && (
            <BadgeChip variant="bestseller" className="text-xs sm:text-sm">Bestseller</BadgeChip>
          )}
          {product.metadata?.inStockOttawa && (
            <BadgeChip variant="inStock" className="text-xs sm:text-sm">In Stock Ottawa</BadgeChip>
          )}
          {product.metadata?.isNew && (
            <BadgeChip variant="new" className="text-xs sm:text-sm">New</BadgeChip>
          )}
        </div>

        {/* Free Quote Badge - bottom-left */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 pointer-events-none">
          <Badge variant="default" size="sm" className="bg-black/90 text-white hover:bg-black text-xs sm:text-sm tracking-[0.1em] uppercase font-medium backdrop-blur-sm">
            Get Quote
          </Badge>
        </div>
      </div>

      {/* Product Details */}
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-light tracking-wide line-clamp-2 leading-tight">
          {product.title}
        </CardTitle>
        {/* Benefit line or price */}
        <CardDescription className="text-sm font-light leading-relaxed">
          {benefitLine || (product.variants?.[0]?.price ? `From ${formatPrice(product.variants[0].price)}` : 'Price on request')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <CTALogoButton
            onClick={() => onQuoteRequest(product)}
            variant="primary"
            size="lg"
            trackingContext="product_card_quote"
            className="flex-1 text-xs sm:text-sm uppercase tracking-[0.1em] py-3 sm:py-3.5 min-h-[44px] sm:min-h-[48px] font-medium"
          >
            Get Quote
          </CTALogoButton>
          <CTALogoButton
            href={`/products/${product.handle}`}
            variant="secondary"
            size="lg"
            showLogo={false}
            trackingContext="product_card_details"
            className="text-xs sm:text-sm uppercase tracking-[0.1em] py-3 sm:py-3.5 min-h-[44px] sm:min-h-[48px] font-medium min-w-[80px] sm:min-w-[100px]"
          >
            Details
          </CTALogoButton>
        </div>
      </CardContent>

      {/* Trust Signals Footer */}
      <CardFooter className="flex-col items-start space-y-3 border-t pt-4 p-4 sm:p-6">
        <LogoConversionOptimizer
          placement="pricing"
          variant="trust_signal"
          size="sm"
        />

        {/* Trust Badges Row */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between w-full gap-2 text-xs">
          <Badge variant="success" size="sm" className="gap-1 text-[10px] xs:text-xs">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
            <span className="truncate">Licensed & Insured</span>
          </Badge>
          <Badge variant="info" size="sm" className="gap-1 text-[10px] xs:text-xs">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
            <span className="truncate">Lifetime Warranty</span>
          </Badge>
        </div>

        {/* Reviews Badge */}
        <div className="flex items-center justify-center w-full">
          <Badge variant="outline" size="sm" className="text-[10px] xs:text-xs text-gray-600 px-2 py-1">
            <span className="hidden xs:inline">⭐⭐⭐⭐⭐ 5.0 (500+ Reviews)</span>
            <span className="xs:hidden">⭐ 5.0 (500+)</span>
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}