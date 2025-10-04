"use client";

import { formatPrice } from "@/lib/enhanced-renin-products";
import { Button } from "../ui/button";
import { AddToCartButton } from "../ui/add-to-cart-button";
import { RequestQuoteButton } from "../ui/request-quote-button";
import { OptimizedImage } from "../ui/optimized-image";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-500 overflow-hidden group relative"
    >
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
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          fallbackSrc={fallbackImage}
          placeholder="blur"
        />

        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Stock badge */}
        {!product.inStock && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            SOLD OUT
          </div>
        )}

        {product.inStock && (
          <div className="absolute top-4 right-4 bg-green-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            IN STOCK
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-black line-clamp-1 group-hover:text-pg-navy transition-colors duration-300">
            <a
              href={`/store/products/${product.slug}`}
              className="hover:underline decoration-2 underline-offset-4"
            >
              {product.name}
            </a>
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline justify-between mb-5 pb-5 border-b border-gray-200">
          <span className="text-2xl font-bold text-black">
            {formatPrice(product.price)}
          </span>
          {product.inStock && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs text-green-700 uppercase tracking-wide font-semibold bg-green-50 px-2.5 py-1 rounded-full"
            >
              Available
            </motion.span>
          )}
        </div>

        <div className="space-y-3">
          {product.inStock ? (
            <AddToCartButton
              product={product}
              variant="default"
              size="sm"
              className="w-full bg-black hover:bg-pg-navy text-white font-semibold py-3 text-sm uppercase tracking-wide border-2 border-black hover:border-pg-navy transition-all duration-300 hover:shadow-lg"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="w-full py-3 text-sm uppercase tracking-wide opacity-40 cursor-not-allowed border-2 border-gray-300"
            >
              Sold Out
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              href={`/store/products/${product.slug}`}
              className="border-2 border-gray-300 text-black hover:border-pg-navy hover:text-pg-navy hover:bg-pg-navy/5 py-2.5 text-xs uppercase tracking-wide transition-all duration-300 font-medium"
            >
              Details
            </Button>

            <RequestQuoteButton
              product={product}
              variant="outline"
              size="sm"
              className="border-2 border-gray-300 text-black hover:border-pg-sky hover:text-pg-sky hover:bg-pg-sky/5 py-2.5 text-xs uppercase tracking-wide transition-all duration-300 font-medium"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
