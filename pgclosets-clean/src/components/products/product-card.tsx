"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, memo } from "react";
import { ReninProduct } from "@/lib/renin-product-loader";

interface ProductCardProps {
  product: ReninProduct;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get the primary image
  const primaryImage = product.images?.[0];
  const imageUrl = primaryImage?.src || "/placeholder-door.jpg";
  const imageAlt = primaryImage?.alt || product.title;

  // Get price information from variants
  const prices = product.variants
    ?.map((v) => v.price)
    .filter((price) => price > 0) || [];

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Format price display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const priceDisplay = () => {
    if (minPrice === 0) return "Contact for Price";
    if (minPrice === maxPrice) return formatPrice(minPrice);
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  // Check if product is on sale
  const compareAtPrices = product.variants
    ?.map((v) => v.compare_at_price)
    .filter((price) => price && price > 0) || [];
  const isOnSale = compareAtPrices.length > 0 && compareAtPrices.some((price, index) => price && prices[index] && price > prices[index]);

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
        {/* Image container */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          {/* Sale badge */}
          {isOnSale && (
            <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white px-3 py-1 text-xs font-medium rounded">
              Sale
            </div>
          )}

          {/* Loading shimmer */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}

          {/* Product image */}
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : (
            // Fallback when image fails to load
            <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover overlay - matching homepage style */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white text-slate-900 px-6 py-3 font-light text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              View Details
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="p-6">
          {/* Category */}
          <div className="text-xs uppercase tracking-widest text-slate-500 font-light mb-2">
            {product.product_type}
          </div>

          {/* Product title */}
          <h3 className="text-xl font-light text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
            {product.title}
          </h3>

          {/* Short description */}
          <p className="text-sm text-slate-600 font-light mb-4 line-clamp-2 leading-relaxed">
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </p>

          {/* Price and status */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-medium text-slate-900">
                {priceDisplay()}
              </div>
              {isOnSale && compareAtPrices[0] && (
                <div className="text-sm text-slate-500 line-through">
                  {formatPrice(compareAtPrices[0])}
                </div>
              )}
            </div>

            {/* Arrow icon - matching homepage style */}
            <div className="text-slate-400 group-hover:text-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Options info */}
          {product.variants && product.variants.length > 1 && (
            <div className="text-xs text-slate-500 font-light mb-4">
              {product.variants.length} option{product.variants.length !== 1 ? "s" : ""} available
            </div>
          )}

          {/* Tags - more subtle */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 bg-slate-50 text-slate-600 text-xs font-light rounded"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 2 && (
                <span className="inline-block px-2 py-1 bg-slate-50 text-slate-500 text-xs font-light rounded">
                  +{product.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});