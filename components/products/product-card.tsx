// @ts-nocheck
'use client'

import { LuxuryQuoteForm } from '@/components/ui/luxury-quote-form'
import { useCartStore } from '@/lib/stores/cart-store'
import { cn, formatPrice } from '@/lib/utils'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { motion } from 'framer-motion'
import { Eye, FileText, Heart, ShoppingBag, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  images: string[]
  description?: string
  category?: { name: string }
  rating?: number
  reviewCount?: number
  inStock: boolean
  featured?: boolean
  bestseller?: boolean
  variants?: Array<{
    id: string
    color: string
    colorHex: string
  }>
}

interface ProductCardProps {
  product: Product
  className?: string
}

// ============================================================================
// ProductCard - Standard grid card
// ============================================================================
export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity: 1,
    })
    setIsAdding(false)
    openCart()
  }

  return (
    <motion.div
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100"
      >
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className={cn('object-cover transition-transform duration-500', isHovered && 'scale-105')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.featured && (
            <Badge variant="brand-primary" size="sm">
              Featured
            </Badge>
          )}
          {product.bestseller && (
            <Badge variant="brand-accent" size="sm">
              Bestseller
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" size="sm">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="absolute bottom-3 left-3 right-3 flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="sm"
            className="flex-1 rounded-full shadow-lg"
            disabled={!product.inStock || isAdding}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Unavailable'}
          </Button>
          <Button
            size="icon-sm"
            variant="secondary"
            className="rounded-full shadow-lg"
            onClick={e => {
              e.preventDefault()
              setQuoteModalOpen(true)
            }}
            title="Request Quote"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button size="icon-sm" variant="secondary" className="rounded-full shadow-lg">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon-sm" variant="secondary" className="rounded-full shadow-lg">
            <Heart className="h-4 w-4" />
          </Button>
        </motion.div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        {product.category && (
          <p className="text-sm font-medium text-muted-foreground">{product.category.name}</p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.floor(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            {product.reviewCount && (
              <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Color Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-2">
            {product.variants.slice(0, 5).map(variant => (
              <button
                key={variant.id}
                className="h-6 w-6 rounded-full border-2 border-gray-300 transition-colors hover:border-gray-600"
                style={{ backgroundColor: variant.colorHex }}
                title={variant.color}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-xs text-muted-foreground">+{product.variants.length - 5}</span>
            )}
          </div>
        )}
      </div>

      {/* Quote Form Modal */}
      <LuxuryQuoteForm
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        product={{
          name: product.name,
          price: product.salePrice || product.price,
        }}
      />
    </motion.div>
  )
}

// ============================================================================
// ProductCardCompact - Smaller card for grids
// ============================================================================
export function ProductCardCompact({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0

  return (
    <motion.div
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Mini Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge variant="destructive" size="sm">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" size="sm">
                Out
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button size="sm" className="rounded-full shadow-lg" disabled={!product.inStock}>
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-2 space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

// ============================================================================
// ProductCardFeatured - Large featured card
// ============================================================================
export function ProductCardFeatured({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity: 1,
    })
    setIsAdding(false)
    openCart()
  }

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-8 p-8 md:grid-cols-2">
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-lg md:aspect-square">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-all duration-700',
              isHovered && 'rotate-2 scale-110'
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Featured Badge */}
          <div className="absolute left-4 top-4">
            <Badge variant="brand-gradient" size="lg" className="text-base">
              Featured Product
            </Badge>
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute right-4 top-4">
              <Badge variant="destructive" size="lg" className="text-base">
                Save {discount}%
              </Badge>
            </div>
          )}

          {/* Image Gallery Dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {product.images.slice(0, 4).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    i === 0 ? 'w-6 bg-white' : 'bg-white/60'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-6">
          {product.category && (
            <Badge variant="brand-accent" size="default" className="w-fit">
              {product.category.name}
            </Badge>
          )}

          <div className="space-y-3">
            <Link href={`/products/${product.slug}`}>
              <h2 className="text-3xl font-bold text-foreground transition-colors md:text-4xl hover:text-primary">
                {product.name}
              </h2>
            </Link>

            {product.description && (
              <p className="line-clamp-3 text-lg text-muted-foreground">{product.description}</p>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            {product.salePrice ? (
              <>
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Color Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Available Colors</p>
              <div className="flex items-center gap-3">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    className="h-8 w-8 rounded-full border-2 border-gray-300 transition-all hover:scale-110 hover:border-gray-600"
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              variant="brand-primary"
              className="flex-1"
              disabled={!product.inStock || isAdding}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={e => {
                e.preventDefault()
                setQuoteModalOpen(true)
              }}
            >
              <FileText className="mr-2 h-5 w-5" />
              Quote
            </Button>
            <Button size="icon-lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {!product.inStock && (
            <p className="text-sm text-muted-foreground">Currently unavailable. Check back soon!</p>
          )}
        </div>
      </div>

      {/* Quote Form Modal */}
      <LuxuryQuoteForm
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        product={{
          name: product.name,
          price: product.salePrice || product.price,
        }}
      />
    </motion.div>
  )
}

// ============================================================================
// ProductCardHorizontal - List view card
// ============================================================================
export function ProductCardHorizontal({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity: 1,
    })
    setIsAdding(false)
    openCart()
  }

  return (
    <motion.div
      className={cn(
        'group relative flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 sm:flex-row hover:border-gray-300 hover:shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Section */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-48"
      >
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className={cn('object-cover transition-transform duration-500', isHovered && 'scale-110')}
          sizes="(max-width: 640px) 100vw, 192px"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="brand-primary" size="sm">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" size="sm">
              -{discount}%
            </Badge>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="space-y-3">
          {/* Category */}
          {product.category && (
            <Badge variant="outline" size="sm" className="w-fit">
              {product.category.name}
            </Badge>
          )}

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="line-clamp-2 text-xl font-bold text-foreground transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.description && (
            <p className="line-clamp-2 text-muted-foreground">{product.description}</p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {/* Color Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Colors:</span>
              {product.variants.slice(0, 6).map(variant => (
                <button
                  key={variant.id}
                  className="h-5 w-5 rounded-full border-2 border-gray-300 transition-colors hover:border-gray-600"
                  style={{ backgroundColor: variant.colorHex }}
                  title={variant.color}
                />
              ))}
              {product.variants.length > 6 && (
                <span className="text-xs text-muted-foreground">
                  +{product.variants.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="mt-4 flex flex-col justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
          <div className="flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="default"
              disabled={!product.inStock || isAdding}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              size="default"
              variant="outline"
              onClick={e => {
                e.preventDefault()
                setQuoteModalOpen(true)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Quote
            </Button>
            <Button size="icon" variant="outline">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      <LuxuryQuoteForm
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        product={{
          name: product.name,
          price: product.salePrice || product.price,
        }}
      />
    </motion.div>
  )
}
