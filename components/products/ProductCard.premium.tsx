'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppleButton } from '@/components/ui/AppleButton'
import { EASING } from '@/lib/animations'

/**
 * ProductCard - Premium E-commerce Card
 * Features:
 * - 3D tilt effect on hover (parallax)
 * - Lazy loading images with blur placeholder
 * - Price formatting with currency
 * - Stock indicators
 * - Rating displays
 * - Variant selection preview
 * - Wishlist integration
 * - Quick view modal trigger
 * - Apple-inspired design language
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={{
 *     id: '1',
 *     name: 'Premium Closet Door',
 *     slug: 'premium-closet-door',
 *     price: 29999,
 *     compareAtPrice: 34999,
 *     rating: 4.8,
 *     reviewCount: 124,
 *     images: ['/door1.jpg', '/door2.jpg'],
 *     inStock: true,
 *     stockCount: 15,
 *     variants: [...]
 *   }}
 *   onQuickView={(id) => openQuickView(id)}
 *   onWishlistToggle={(id) => toggleWishlist(id)}
 * />
 * ```
 */

export interface ProductVariant {
  id: string
  name: string
  inStock: boolean
  image?: string
}

export interface ProductCardData {
  id: string
  name: string
  slug: string
  description?: string
  price: number // in cents
  compareAtPrice?: number // original price in cents
  currency?: string
  images: string[]
  category?: string
  rating?: number // 0-5
  reviewCount?: number
  inStock: boolean
  stockCount?: number
  variants?: ProductVariant[]
  tags?: string[]
  isNew?: boolean
  isSale?: boolean
  isFeatured?: boolean
}

interface ProductCardProps {
  product: ProductCardData
  onQuickView?: (productId: string) => void
  onWishlistToggle?: (productId: string) => void
  isWishlisted?: boolean
  className?: string
}

export function ProductCard({
  product,
  onQuickView,
  onWishlistToggle,
  isWishlisted = false,
  className
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 3D Tilt Effect - Apple-style parallax
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  // Format price
  const formatPrice = (cents: number, currency = product.currency || 'USD') => {
    const dollars = cents / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(dollars)
  }

  // Calculate discount percentage
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  // Stock status
  const stockStatus = () => {
    if (!product.inStock) return { text: 'Out of Stock', color: 'text-red-600' }
    if (product.stockCount && product.stockCount <= 5) {
      return { text: `Only ${product.stockCount} left`, color: 'text-warning-600' }
    }
    return { text: 'In Stock', color: 'text-success-600' }
  }

  const stock = stockStatus()

  // Handle mouse move for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn(
        'group relative bg-white dark:bg-apple-dark-bg-secondary',
        'rounded-2xl overflow-hidden',
        'border border-apple-gray-200 dark:border-apple-dark-border',
        'transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={EASING.applePhysics}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* 3D Card Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        transition={EASING.applePhysics}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-apple-blue-600 text-white text-xs font-semibold rounded-full">
              New
            </span>
          )}
          {product.isSale && discountPercent > 0 && (
            <span className="px-3 py-1 bg-error-600 text-white text-xs font-semibold rounded-full">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-3 py-1 bg-warning-600 text-white text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={() => onWishlistToggle?.(product.id)}
          className={cn(
            'absolute top-3 right-3 z-10',
            'w-10 h-10 rounded-full',
            'bg-white/90 dark:bg-black/30 backdrop-blur-xl',
            'border border-black/10 dark:border-white/10',
            'flex items-center justify-center',
            'transition-all duration-200',
            'hover:scale-110',
            'active:scale-95'
          )}
          whileTap={{ scale: 0.9 }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-all',
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-apple-gray-700 dark:text-apple-gray-400'
            )}
          />
        </motion.button>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square">
          <div className="relative w-full h-full bg-apple-gray-100 dark:bg-apple-dark-bg-tertiary">
            <Image
              src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 430px) 100vw, (max-width: 744px) 50vw, (max-width: 1068px) 33vw, 25vw"
              className={cn(
                'object-cover transition-all duration-500',
                imageLoaded ? 'blur-0 scale-100' : 'blur-lg scale-105'
              )}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              quality={85}
            />

            {/* Image thumbnails on hover */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {product.images.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentImageIndex(index)
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      currentImageIndex === index
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    )}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick View Button - Shows on Hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <AppleButton
              variant="secondary"
              size="md"
              icon={<Eye className="w-4 h-4" />}
              onClick={(e) => {
                e.preventDefault()
                onQuickView?.(product.id)
              }}
            >
              Quick View
            </AppleButton>
          </motion.div>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          {product.category && (
            <p className="text-xs uppercase tracking-wider text-apple-gray-600 dark:text-apple-gray-400 font-medium">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-apple-17 text-apple-gray-900 dark:text-apple-dark-text line-clamp-2 hover:text-apple-blue-600 dark:hover:text-apple-blue-dark transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && product.reviewCount && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.floor(product.rating!)
                        ? 'fill-warning-500 text-warning-500'
                        : 'text-apple-gray-300 dark:text-apple-gray-600'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-apple-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p className={cn('text-sm font-medium', stock.color)}>
            {stock.text}
          </p>

          {/* Variant Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-apple-gray-600 dark:text-apple-gray-400">
                {product.variants.length} variants
              </span>
              <div className="flex gap-1">
                {product.variants.slice(0, 4).map((variant) => (
                  <div
                    key={variant.id}
                    className="w-6 h-6 rounded-full bg-apple-gray-200 dark:bg-apple-gray-700 border border-apple-gray-300 dark:border-apple-gray-600"
                    title={variant.name}
                  />
                ))}
                {product.variants.length > 4 && (
                  <span className="text-xs text-apple-gray-500">
                    +{product.variants.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <AppleButton
            variant="primary"
            size="md"
            className="w-full"
            icon={<ShoppingCart className="w-4 h-4" />}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </AppleButton>
        </div>
      </motion.div>

      {/* 3D Shadow Effect */}
      <div className="absolute inset-0 rounded-2xl shadow-apple-lg group-hover:shadow-apple-xl transition-shadow duration-300 pointer-events-none -z-10" />
    </motion.div>
  )
}

export default ProductCard
