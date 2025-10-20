'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductCardData } from '@/types/product-enhanced'
import { formatPrice, getPriceRangeDisplay } from '@/lib/renin-catalog'

interface EnhancedProductCardProps {
  product: Product | ProductCardData
  onQuoteRequest?: (productId: string) => void
  onQuickView?: (productId: string) => void
  onCompare?: (productId: string) => void
  showCompare?: boolean
  showQuickView?: boolean
  className?: string
  imageLoadingPriority?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

export function EnhancedProductCard({
  product,
  onQuoteRequest,
  onQuickView,
  onCompare,
  showCompare = true,
  showQuickView = true,
  className = '',
  imageLoadingPriority = false,
  variant = 'default'
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Handle both Product and ProductCardData
  const id = 'id' in product ? product.id : product.id
  const slug = 'slug' in product ? product.slug : product.slug
  const name = 'name' in product ? product.name : product.name
  const tagline = 'tagline' in product ? product.tagline : product.tagline
  const brand = 'brand' in product ? product.brand : (product as any).brand || 'PG Closets'
  const badges = 'badges' in product ? product.badges : product.badges
  const isFeatured = 'isFeatured' in product ? product.isFeatured : (product as any).isFeatured
  const isNew = 'isNew' in product ? product.isNew : (product as any).isNew
  const isBestSeller = 'isBestSeller' in product ? product.isBestSeller : (product as any).isBestSeller
  const madeInCanada = 'attributes' in product ? product.attributes.madeInCanada : (product as any).madeInCanada

  // Get image and price data
  const heroImage = 'heroImage' in product
    ? product.heroImage
    : ('media' in product ? (product.media.find((m: any) => m.role === 'hero') || product.media[0]) : { url: '/images/products/placeholder.jpg', alt: name })

  const priceDisplay = 'priceFrom' in product
    ? formatPrice(product.priceFrom)
    : getPriceRangeDisplay(product as Product)

  const availability = 'availability' in product ? product.availability :
    ('variants' in product ? (product.variants.some((v: any) => v.availability === 'InStock') ? 'InStock' : 'OutOfStock') : 'InStock')

  const category = 'category' in product ? product.category : ('attributes' in product ? product.attributes.type : 'door')

  const handleImageError = () => {
    setImageError(true)
  }

  const handleQuoteRequest = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuoteRequest?.(id)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onCompare?.(id)
  }

  const getStockStatusColor = () => {
    switch (availability) {
      case 'InStock':
        return 'text-green-600 bg-green-50'
      case 'OutOfStock':
        return 'text-red-600 bg-red-50'
      case 'MadeToOrder':
        return 'text-blue-600 bg-blue-50'
      case 'Mixed':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStockStatusText = () => {
    switch (availability) {
      case 'InStock':
        return 'In Stock'
      case 'OutOfStock':
        return 'Out of Stock'
      case 'MadeToOrder':
        return 'Made to Order'
      case 'Mixed':
        return 'Limited Stock'
      default:
        return 'Available'
    }
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 ${className}`}>
        <Link href={`/products/${slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
            {!imageError && heroImage ? (
              <Image
                src={heroImage.url}
                alt={heroImage.alt || name}
                fill
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoadingPriority ? 'priority' : 'lazy'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Image Not Available</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  New
                </span>
              )}
              {isBestSeller && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Best Seller
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-600 mb-2">{priceDisplay}</p>
            <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getStockStatusColor()}`}>
              {getStockStatusText()}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
        <Link href={`/products/${slug}`} className="block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
            {!imageError && heroImage ? (
              <Image
                src={heroImage.url}
                alt={heroImage.alt || name}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoadingPriority ? 'priority' : 'lazy'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">Image Not Available</span>
              </div>
            )}

            {/* Featured badge */}
            {isFeatured && (
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                  Featured
                </span>
              </div>
            )}

            {/* Quick actions overlay */}
            <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="bg-white text-gray-900 p-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                  aria-label="Quick view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
              {showCompare && (
                <button
                  onClick={handleCompare}
                  className="bg-white text-gray-900 p-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                  aria-label="Add to compare"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">{brand}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{tagline}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{priceDisplay}</p>
                <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full mt-2 ${getStockStatusColor()}`}>
                  {getStockStatusText()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {madeInCanada && (
                  <span className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                    🍁 Made in Canada
                  </span>
                )}
                {isNew && (
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                )}
                {isBestSeller && (
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                    Best Seller
                  </span>
                )}
              </div>

              <button
                onClick={handleQuoteRequest}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Get Quote
              </button>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          {!imageError && heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.alt || name}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoadingPriority ? 'priority' : 'lazy'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Not Available</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {isBestSeller && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Best Seller
              </span>
            )}
            {isFeatured && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Quick actions overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center gap-2">
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="bg-white text-gray-900 p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Quick view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
              {showCompare && (
                <button
                  onClick={handleCompare}
                  className="bg-white text-gray-900 p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Add to compare"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">{brand}</p>
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{name}</h3>
              {tagline && (
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">{tagline}</p>
              )}
            </div>
            {madeInCanada && (
              <span className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full font-medium ml-2">
                🍁
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-gray-900">{priceDisplay}</p>
            <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getStockStatusColor()}`}>
              {getStockStatusText()}
            </div>
          </div>

          <button
            onClick={handleQuoteRequest}
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 text-sm"
          >
            Get Quote
          </button>
        </div>
      </Link>
    </div>
  )
}