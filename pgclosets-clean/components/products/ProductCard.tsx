'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ReninProduct } from '@/lib/renin-product-loader';
import { formatPrice, formatCADPrice } from '@/lib/utils/price';

interface ProductCardProps {
  product: ReninProduct;
  viewMode?: 'grid' | 'list';
  priority?: boolean;
  showQuickView?: boolean;
}

export default function ProductCard({
  product,
  viewMode = 'grid',
  priority = false,
  showQuickView = true
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [hoveredVariant, setHoveredVariant] = useState<number>(0);

  // Get price information
  const variants = product.variants.filter(v => v.price > 0);
  const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
  const maxPrice = variants.length > 0 ? Math.max(...variants.map(v => v.price)) : 0;
  const hasVariedPricing = minPrice !== maxPrice;

  // Get primary image
  const primaryImage = product.images?.[0];
  const hasMultipleImages = product.images.length > 1;

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  // Generate product URL
  const productUrl = `/products/${product.handle || product.id}`;

  // Determine if product is on sale or featured
  const isFeatured = product.tags.some(tag => tag.toLowerCase().includes('featured'));
  const isOnSale = product.tags.some(tag => tag.toLowerCase().includes('sale'));

  // Get category badge
  const category = product.product_type || 'Closet Door';

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="product-card p-6"
      >
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <Link href={productUrl} className="block relative w-full h-full group">
              <div className="product-image-container w-full h-full rounded-lg overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 shimmer rounded-lg"></div>
                )}

                {!imageError && primaryImage ? (
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt || product.title}
                    fill
                    className={`object-cover transition-all duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    } group-hover:scale-105`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority={priority}
                    sizes="(max-width: 768px) 192px, 192px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="product-image-overlay">
                  <div className="product-image-overlay-content">
                    Quick View
                  </div>
                </div>
              </div>
            </Link>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isFeatured && (
                <span className="product-badge product-badge--featured px-2 py-1 text-xs">
                  Featured
                </span>
              )}
              {isOnSale && (
                <span className="product-badge product-badge--sale px-2 py-1 text-xs">
                  Sale
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <span className="product-badge product-badge--category px-3 py-1 text-xs">
                  {category}
                </span>
              </div>

              <h3 className="product-title text-xl mb-2">
                <Link
                  href={productUrl}
                  className="hover:text-pg-navy transition-colors"
                >
                  {product.title}
                </Link>
              </h3>

              {product.description && (
                <div
                  className="product-description text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: product.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
                  }}
                />
              )}

              {/* Variants Preview */}
              {variants.length > 1 && (
                <div className="mb-4">
                  <span className="text-micro text-pg-gray mb-2 block">
                    {variants.length} Options Available
                  </span>
                  <div className="flex gap-2">
                    {variants.slice(0, 3).map((variant, index) => (
                      <div
                        key={variant.id}
                        className="w-8 h-8 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-xs font-medium"
                        title={variant.title}
                      >
                        {variant.title?.charAt(0) || 'V'}
                      </div>
                    ))}
                    {variants.length > 3 && (
                      <div className="w-8 h-8 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-500">
                        +{variants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="price-display">
                {hasVariedPricing ? (
                  <div className="flex items-baseline gap-1">
                    <span className="price-current text-lg font-semibold">
                      {formatCADPrice(minPrice)}
                    </span>
                    <span className="text-sm text-pg-gray">- {formatCADPrice(maxPrice)}</span>
                  </div>
                ) : (
                  <span className="price-current text-lg font-semibold">
                    {formatCADPrice(minPrice)}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Link
                  href={productUrl}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  View Details
                </Link>
                <button className="btn-primary px-4 py-2 text-sm">
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="product-card"
    >
      <Link href={productUrl} className="block group">
        {/* Product Image */}
        <div className="relative aspect-square mb-4">
          <div className="product-image-container w-full h-full rounded-lg overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 shimmer rounded-lg"></div>
            )}

            {!imageError && primaryImage ? (
              <Image
                src={primaryImage.src}
                alt={primaryImage.alt || product.title}
                fill
                className={`object-cover transition-all duration-500 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                } group-hover:scale-110`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {showQuickView && (
              <div className="product-image-overlay">
                <div className="product-image-overlay-content">
                  Quick View
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isFeatured && (
              <span className="product-badge product-badge--featured px-2 py-1 text-xs">
                Featured
              </span>
            )}
            {isOnSale && (
              <span className="product-badge product-badge--sale px-2 py-1 text-xs">
                Sale
              </span>
            )}
          </div>

          {/* Multiple Images Indicator */}
          {hasMultipleImages && (
            <div className="absolute top-3 right-3">
              <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                <svg className="w-4 h-4 text-pg-gray" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>
                  <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" fillOpacity="0.3"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="product-badge product-badge--category px-2 py-1 text-xs">
              {category}
            </span>
          </div>

          <h3 className="product-title text-lg mb-2 group-hover:text-pg-navy transition-colors">
            {product.title}
          </h3>

          {/* Variants Dots */}
          {variants.length > 1 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {variants.slice(0, 4).map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-pg-gray rounded-full opacity-60"
                  />
                ))}
                {variants.length > 4 && (
                  <span className="text-xs text-pg-gray ml-1">
                    +{variants.length - 4}
                  </span>
                )}
              </div>
              <span className="text-micro text-pg-gray">
                {variants.length} options
              </span>
            </div>
          )}

          {/* Price */}
          <div className="price-display mb-4">
            {hasVariedPricing ? (
              <div className="flex items-baseline gap-1">
                <span className="price-current font-semibold">
                  {formatCADPrice(minPrice)}
                </span>
                <span className="text-sm text-pg-gray">+</span>
              </div>
            ) : (
              <span className="price-current font-semibold">
                {formatCADPrice(minPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <Link
            href={productUrl}
            className="btn-secondary flex-1 text-sm py-2 text-center"
          >
            View Details
          </Link>
          <button className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
            Get Quote
          </button>
        </div>
      </div>
    </motion.div>
  );
}