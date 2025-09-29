"use client";

import { formatPrice } from "@/lib/enhanced-renin-products";
import { Button } from "../ui/button";
import { AddToCartButton } from "../ui/add-to-cart-button";
import { RequestQuoteButton } from "../ui/request-quote-button";
import { OptimizedImage } from "../ui/optimized-image";
import { useState } from "react";

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

  return (
    <div className="bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden group relative">
      <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
        {_isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        <OptimizedImage
          src={primaryImage || "/placeholder.svg"}
          alt={`${product.name} - Professional closet door by Renin - PG Closets`}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-base font-medium mb-1.5 text-black line-clamp-1">
            <a
              href={`/store/products/${product.slug}`}
              className="hover:text-black/70 transition-colors duration-200"
            >
              {product.name}
            </a>
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <span className="text-xl font-light text-black">
            {formatPrice(product.price)}
          </span>
          {product.inStock ? (
            <span className="text-[10px] text-black/60 uppercase tracking-wider font-medium">
              Available
            </span>
          ) : (
            <span className="text-[10px] text-red-600/60 uppercase tracking-wider font-medium">
              Sold Out
            </span>
          )}
        </div>

        <div className="space-y-2">
          {product.inStock ? (
            <AddToCartButton
              product={product}
              variant="default"
              size="sm"
              className="w-full bg-black hover:bg-white hover:text-black text-white font-medium py-2.5 text-xs uppercase tracking-wider border-2 border-black transition-all duration-300"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="w-full py-2.5 text-xs uppercase tracking-wider opacity-30 cursor-not-allowed border-2 border-gray-300"
            >
              Sold Out
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              href={`/store/products/${product.slug}`}
              className="border border-gray-300 text-black/70 hover:border-black hover:text-black py-2 text-xs uppercase tracking-wider transition-all duration-200"
            >
              View
            </Button>

            <RequestQuoteButton
              product={product}
              variant="outline"
              size="sm"
              className="border border-gray-300 text-black/70 hover:border-black hover:text-black py-2 text-xs uppercase tracking-wider transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
