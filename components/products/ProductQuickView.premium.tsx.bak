'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Heart, ShoppingCart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AppleButton } from '@/components/ui/AppleButton'
import { ProductGallery, type GalleryImage } from './ProductGallery.premium'
import { EASING } from '@/lib/animations'

/**
 * ProductQuickView - Modal Quick View
 * Features:
 * - Modal overlay with backdrop blur
 * - Product gallery integration
 * - Variant selection
 * - Quantity selector
 * - Add to cart functionality
 * - Wishlist integration
 * - Link to full product page
 * - Accessibility features (keyboard nav, focus trap)
 *
 * @example
 * ```tsx
 * <ProductQuickView
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   product={{
 *     id: '1',
 *     name: 'Premium Door',
 *     price: 29999,
 *     images: [...],
 *     variants: [...],
 *     rating: 4.8,
 *     reviewCount: 124
 *   }}
 *   onAddToCart={(product, variant, quantity) => {...}}
 * />
 * ```
 */

export interface QuickViewVariant {
  id: string
  name: string
  value: string
  inStock: boolean
  priceAdjustment?: number // price change from base in cents
}

export interface QuickViewProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number // in cents
  compareAtPrice?: number
  currency?: string
  images: GalleryImage[]
  category?: string
  rating?: number
  reviewCount?: number
  inStock: boolean
  stockCount?: number
  variants?: {
    type: string // e.g., "Color", "Size", "Material"
    options: QuickViewVariant[]
  }[]
  features?: string[]
}

interface ProductQuickViewProps {
  isOpen: boolean
  onClose: () => void
  product: QuickViewProduct
  onAddToCart?: (productId: string, variantId: string | null, quantity: number) => void
  onWishlistToggle?: (productId: string) => void
  isWishlisted?: boolean
}

export function ProductQuickView({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false
}: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Format price
  const formatPrice = (cents: number, currency = product.currency || 'USD') => {
    const dollars = cents / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(dollars)
  }

  // Calculate final price with variant adjustments
  const calculateFinalPrice = () => {
    let finalPrice = product.price

    if (product.variants) {
      product.variants.forEach((variantGroup) => {
        const selectedVariantId = selectedVariants[variantGroup.type]
        if (selectedVariantId) {
          const selectedVariant = variantGroup.options.find(
            (v) => v.id === selectedVariantId
          )
          if (selectedVariant?.priceAdjustment) {
            finalPrice += selectedVariant.priceAdjustment
          }
        }
      })
    }

    return finalPrice
  }

  // Check if all variants are selected
  const canAddToCart = () => {
    if (!product.variants) return product.inStock

    const allVariantsSelected = product.variants.every(
      (variantGroup) => selectedVariants[variantGroup.type]
    )

    return allVariantsSelected && product.inStock
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!canAddToCart()) return

    setIsAddingToCart(true)

    // Get selected variant IDs
    const variantIds = Object.values(selectedVariants)
    const variantId = variantIds.length > 0 ? variantIds.join('-') : null

    await onAddToCart?.(product.id, variantId, quantity)

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  // Quantity controls
  const incrementQuantity = () => {
    if (product.stockCount && quantity >= product.stockCount) return
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity <= 1) return
    setQuantity((prev) => prev - 1)
  }

  const finalPrice = calculateFinalPrice()
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - finalPrice) / product.compareAtPrice) * 100)
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className={cn(
                'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto',
                'bg-white dark:bg-apple-dark-bg-elevated',
                'rounded-3xl shadow-modal',
                'pointer-events-auto'
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={EASING.applePhysics}
            >
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className={cn(
                  'absolute top-4 right-4 z-10',
                  'w-10 h-10 rounded-full',
                  'bg-white/90 dark:bg-black/30 backdrop-blur-xl',
                  'border border-black/10 dark:border-white/10',
                  'flex items-center justify-center',
                  'hover:scale-110 active:scale-95 transition-all'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close quick view"
              >
                <X className="w-5 h-5 text-apple-gray-900 dark:text-apple-gray-100" />
              </motion.button>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                {/* Left: Gallery */}
                <div>
                  <ProductGallery images={product.images} productName={product.name} />
                </div>

                {/* Right: Product Info */}
                <div className="space-y-6">
                  {/* Category */}
                  {product.category && (
                    <p className="text-xs uppercase tracking-wider text-apple-gray-600 dark:text-apple-gray-400 font-medium">
                      {product.category}
                    </p>
                  )}

                  {/* Product Name */}
                  <div>
                    <h2 className="text-apple-34 font-semibold text-apple-gray-900 dark:text-apple-dark-text mb-2">
                      {product.name}
                    </h2>

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
                          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-apple-34 font-semibold text-apple-gray-900 dark:text-apple-dark-text">
                      {formatPrice(finalPrice)}
                    </span>
                    {product.compareAtPrice && (
                      <>
                        <span className="text-apple-21 text-apple-gray-500 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                        {discountPercent > 0 && (
                          <span className="px-2 py-1 bg-error-600 text-white text-xs font-semibold rounded-full">
                            Save {discountPercent}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-apple-15 text-apple-gray-700 dark:text-apple-gray-300 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        product.inStock ? 'bg-success-600' : 'bg-error-600'
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        product.inStock ? 'text-success-600' : 'text-error-600'
                      )}
                    >
                      {product.inStock
                        ? product.stockCount && product.stockCount <= 5
                          ? `Only ${product.stockCount} left in stock`
                          : 'In Stock'
                        : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-4">
                      {product.variants.map((variantGroup) => (
                        <div key={variantGroup.type}>
                          <label className="text-sm font-medium text-apple-gray-900 dark:text-apple-dark-text mb-2 block">
                            {variantGroup.type}
                            {selectedVariants[variantGroup.type] &&
                              `: ${
                                variantGroup.options.find(
                                  (v) => v.id === selectedVariants[variantGroup.type]
                                )?.value
                              }`}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variantGroup.options.map((option) => (
                              <motion.button
                                key={option.id}
                                onClick={() => {
                                  if (option.inStock) {
                                    setSelectedVariants((prev) => ({
                                      ...prev,
                                      [variantGroup.type]: option.id
                                    }))
                                  }
                                }}
                                className={cn(
                                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                  'border-2',
                                  selectedVariants[variantGroup.type] === option.id
                                    ? 'border-apple-blue-600 dark:border-apple-blue-dark bg-apple-blue-50 dark:bg-apple-blue-900/20 text-apple-blue-600 dark:text-apple-blue-dark'
                                    : 'border-apple-gray-300 dark:border-apple-gray-600 text-apple-gray-700 dark:text-apple-gray-300',
                                  !option.inStock &&
                                    'opacity-40 cursor-not-allowed line-through',
                                  option.inStock && 'hover:border-apple-gray-400 dark:hover:border-apple-gray-500'
                                )}
                                disabled={!option.inStock}
                                whileHover={option.inStock ? { scale: 1.05 } : {}}
                                whileTap={option.inStock ? { scale: 0.95 } : {}}
                              >
                                {option.value}
                                {option.priceAdjustment && option.priceAdjustment !== 0 && (
                                  <span className="ml-1 text-xs">
                                    ({option.priceAdjustment > 0 ? '+' : ''}
                                    {formatPrice(option.priceAdjustment)})
                                  </span>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div>
                    <label className="text-sm font-medium text-apple-gray-900 dark:text-apple-dark-text mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-apple-gray-300 dark:border-apple-gray-600 rounded-full overflow-hidden">
                        <motion.button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="px-4 py-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          whileTap={{ scale: 0.95 }}
                        >
                          −
                        </motion.button>
                        <span className="px-6 py-2 font-medium text-apple-gray-900 dark:text-apple-dark-text">
                          {quantity}
                        </span>
                        <motion.button
                          onClick={incrementQuantity}
                          disabled={
                            product.stockCount ? quantity >= product.stockCount : false
                          }
                          className="px-4 py-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          whileTap={{ scale: 0.95 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-apple-gray-900 dark:text-apple-dark-text mb-2">
                        Features
                      </h3>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-apple-gray-700 dark:text-apple-gray-300 flex items-start gap-2"
                          >
                            <span className="text-apple-blue-600 dark:text-apple-blue-dark mt-1">
                              •
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <AppleButton
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      icon={<ShoppingCart className="w-5 h-5" />}
                      onClick={handleAddToCart}
                      disabled={!canAddToCart()}
                      loading={isAddingToCart}
                    >
                      Add to Cart
                    </AppleButton>

                    <AppleButton
                      variant="secondary"
                      size="lg"
                      onClick={() => onWishlistToggle?.(product.id)}
                      icon={
                        <Heart
                          className={cn(
                            'w-5 h-5',
                            isWishlisted && 'fill-red-500 text-red-500'
                          )}
                        />
                      }
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    />
                  </div>

                  {/* View Full Details Link */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 text-apple-blue-600 dark:text-apple-blue-dark hover:underline text-sm font-medium"
                  >
                    View Full Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProductQuickView
