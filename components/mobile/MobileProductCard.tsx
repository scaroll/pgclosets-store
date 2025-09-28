'use client'

"use client";

import { formatPrice } from "@/lib/enhanced-renin-products";
import { Button } from "../ui/button";
import { AddToCartButton } from "../ui/add-to-cart-button";
import { RequestQuoteButton } from "../ui/request-quote-button";
import { OptimizedImage } from "../ui/optimized-image";
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

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100",
      "mobile-optimized-card", // Custom mobile optimization class
      className
    )}>
      {/* Mobile-optimized image container with larger aspect ratio */}
      <div className="aspect-[4/3] md:aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 relative">
        {_isLoading && (
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

        {/* Mobile-specific quick action overlay */}
        <div className="absolute top-2 right-2 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
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
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Mobile-optimized price and stock */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
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
              className="w-full bg-pg-navy hover:bg-navy text-white font-medium py-3 sm:py-2.5 rounded-lg transition-colors duration-200 min-h-[48px] sm:min-h-[44px] active:bg-pg-navy/90"
            />
          ) : (
            <Button
              variant="outline"
              size="default"
              disabled
              className="w-full py-3 sm:py-2.5 rounded-lg opacity-50 cursor-not-allowed min-h-[48px] sm:min-h-[44px]"
            >
              Out of Stock
            </Button>
          )}

          {/* Mobile-stacked secondary actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="default"
              href={`/store/products/${product.slug}`}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 sm:py-2.5 rounded-lg transition-colors duration-200 min-h-[48px] sm:min-h-[44px] active:bg-gray-100"
            >
              View Details
            </Button>

            <RequestQuoteButton
              product={product}
              variant="outline"
              size="default"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 sm:py-2.5 rounded-lg transition-colors duration-200 min-h-[48px] sm:min-h-[44px] active:bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}