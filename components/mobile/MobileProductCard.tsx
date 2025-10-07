'use client'

"use client";

import { formatPrice } from "@/lib/enhanced-renin-products";
import { Button } from "../ui/button";
import { AddToCartButton } from "../ui/add-to-cart-button";
import { RequestQuoteButton } from "../ui/request-quote-button";
import { OptimizedImage } from "../ui/optimized-image";
import { BadgeChip } from "../ui/badge-chip";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileProductCardProps {
  product: any;
  priority?: boolean;
  className?: string;
}

export function MobileProductCard({
  product,
  priority = false,
  className
}: MobileProductCardProps) {
  const [_currentImageIndex, _setCurrentImageIndex] = useState(0);
  const [_isLoading, _setIsLoading] = useState(true);

  const getImageSources = () => {
    const sources = [];

    // Priority 1: Local ARCAT images
    if (product.arcatImages && product.arcatImages.length > 0) {
      sources.push(...product.arcatImages);
    }

    // Priority 3: Final fallback placeholder
    sources.push(
      `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`
    );

    return sources;
  };

  const imageSources = getImageSources();
  const primaryImage = imageSources[0];
  const fallbackImage = imageSources[1];

  // Generate benefit line from features or benefits
  const benefitLine = product.benefits
    || (product.features?.slice(0, 2).join(" • "))
    || null;

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100",
      "mobile-optimized-card", // Custom mobile optimization class
      className
    )}>
      {/* Mobile-optimized image container */}
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 relative">
        {_isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        <OptimizedImage
          src={primaryImage || "/placeholder.svg"}
          alt={`${product.name} - Professional closet door by Renin - PG Closets`}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
        />

        {/* Chips - positioned in top-right */}
        <div className="absolute top-2 right-2 flex gap-1.5 flex-wrap justify-end max-w-[60%]">
          {product.bestseller && (
            <BadgeChip variant="bestseller">Bestseller</BadgeChip>
          )}
          {product.inStockOttawa && (
            <BadgeChip variant="inStock">In Stock Ottawa</BadgeChip>
          )}
          {product.isNew && (
            <BadgeChip variant="new">New</BadgeChip>
          )}
        </div>
      </div>

      {/* Mobile-optimized content with better spacing */}
      <div className="p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
            <a
              href={`/store/products/${product.slug}`}
              className="hover:underline active:text-blue-700"
            >
              {product.name}
            </a>
          </h3>
          {/* Benefit line or price */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {benefitLine || `From ${formatPrice(product.price)}`}
          </p>
        </div>

        {/* Mobile-optimized stock status */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {product.inStock ? (
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">
              In Stock
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Mobile-optimized action buttons with larger touch targets */}
        <div className="space-y-2 sm:space-y-3">
          {product.inStock ? (
            <AddToCartButton
              product={product}
              variant="default"
              size="default"
              className="w-full bg-pg-navy hover:bg-navy text-white font-medium py-4 sm:py-2.5 rounded-lg transition-colors duration-200 min-h-[52px] sm:min-h-[44px] active:bg-pg-navy/90 touch-manipulation"
            />
          ) : (
            <Button
              variant="outline"
              size="default"
              disabled
              className="w-full py-4 sm:py-2.5 rounded-lg opacity-50 cursor-not-allowed min-h-[52px] sm:min-h-[44px]"
            >
              Out of Stock
            </Button>
          )}

          {/* Mobile-stacked secondary actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
            <Button
              variant="outline"
              size="default"
              href={`/store/products/${product.slug}`}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-4 sm:py-2.5 rounded-lg transition-colors duration-200 min-h-[52px] sm:min-h-[44px] active:bg-gray-100 touch-manipulation"
            >
              View Details
            </Button>

            <RequestQuoteButton
              product={product}
              variant="outline"
              size="default"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-4 sm:py-2.5 rounded-lg transition-colors duration-200 min-h-[52px] sm:min-h-[44px] active:bg-gray-100 touch-manipulation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}