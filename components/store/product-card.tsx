"use client";

import { trackCTAClick } from "@/lib/analytics/events";
import { formatPrice } from "@/lib/enhanced-renin-products";
import { useState } from "react";
import { BadgeChip } from "../ui/badge-chip";
import { Button } from "../ui/button";
import { OptimizedImage } from "../ui/optimized-image";

interface ProductCardProps {
  product: any;
  priority?: boolean; // For above-the-fold images
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
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
    <div className="bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden group relative">
      <div className="aspect-square overflow-hidden bg-gray-50 relative">
        {_isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        <OptimizedImage
          src={primaryImage || "/placeholder.svg"}
          alt={`${product.name} - Professional closet door by Renin - PG Closets`}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
        />

        {/* Chips - positioned in top-right */}
        <div className="absolute top-2 right-2 flex gap-1.5 flex-wrap justify-end">
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-5">
        {/* Title */}
        <h3 className="text-base font-semibold mb-2 text-black line-clamp-2 leading-tight">
          <a
            href={`/store/products/${product.slug}`}
            className="hover:text-black/70 transition-colors duration-200"
          >
            {product.name}
          </a>
        </h3>

        {/* Benefit line or From price */}
        <p className="text-sm text-gray-600 mb-4">
          {benefitLine || `From ${formatPrice(product.price)}`}
        </p>

        {/* Primary CTA */}
        <a href="/request-work" className="block mb-2">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-black hover:bg-white hover:text-black text-white font-medium py-2.5 text-xs uppercase tracking-wider border-2 border-black transition-all duration-300"
            onClick={() => trackCTAClick({ location: 'product-card', label: 'Get Quote', product: product.name })}
          >
            Get Quote
          </Button>
        </a>

        {/* Secondary CTA */}
        <a href={`/store/products/${product.slug}`} className="block">
          <Button
            variant="outline"
            size="sm"
            className="w-full border border-gray-300 text-black/70 hover:border-black hover:text-black py-2 text-xs uppercase tracking-wider transition-all duration-200"
            onClick={() => trackCTAClick({ location: 'product-card', label: 'Details', product: product.name })}
          >
            Details
          </Button>
        </a>
      </div>
    </div>
  );
}
