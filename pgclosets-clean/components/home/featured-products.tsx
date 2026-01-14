'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Heart } from 'lucide-react'

interface Product {
  id: string
  title: string
  product_type: string
  description: string
  price: {
    base_price: number
    compare_at_price?: number
  }
  images: Array<{
    src: string
    alt: string
  }>
  tags: string[]
  average_rating?: number
  review_count?: number
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=6')

        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }

        const data = await response.json()

        if (data.success && data.data) {
          setProducts(data.data)
        } else {
          throw new Error(data.error || 'No featured products found')
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const calculateSavings = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-apple p-0 overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-pg-gray">No featured products available at the moment.</p>
        <Link href="/products" className="btn-primary mt-4">
          Browse All Products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="card-apple p-0 overflow-hidden group cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Link href={`/products/${product.id}`} className="block">

            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-pg-offwhite">
              <Image
                src={product.images?.[0]?.src || '/placeholder-door.jpg'}
                alt={product.images?.[0]?.alt || product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.tags.includes('featured') && (
                  <span className="product-badge product-badge--featured px-3 py-1">
                    Featured
                  </span>
                )}

                {product.price.compare_at_price && product.price.compare_at_price > product.price.base_price && (
                  <span className="product-badge product-badge--sale px-3 py-1">
                    Save {calculateSavings(product.price.base_price, product.price.compare_at_price)}%
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-white transition-colors duration-200"
                  aria-label={`Add ${product.title} to wishlist`}
                  onClick={(e) => {
                    e.preventDefault()
                    // Wishlist functionality
                  }}
                >
                  <Heart className="w-4 h-4 text-pg-gray hover:text-red-500 transition-colors duration-200" />
                </button>
              </div>

              {/* Hover Overlay */}
              <div className="product-image-overlay">
                <div className="product-image-overlay-content">
                  Quick View
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">

              {/* Category */}
              <div className="mb-2">
                <span className="product-badge product-badge--category px-3 py-1 text-xs">
                  {product.product_type}
                </span>
              </div>

              {/* Title */}
              <h3 className="product-title text-lg font-semibold mb-2 line-clamp-2">
                {product.title}
              </h3>

              {/* Description */}
              <p className="product-description text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Rating */}
              {(product.average_rating ?? 0) > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.average_rating ?? 0)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-pg-gray">
                    {(product.average_rating ?? 0).toFixed(1)} ({product.review_count || 0})
                  </span>
                </div>
              )}

              {/* Pricing */}
              <div className="flex items-center justify-between">
                <div className="price-display">
                  <div className="flex items-center space-x-2">
                    <span className="price-current text-lg font-semibold">
                      {formatPrice(product.price.base_price)}
                    </span>
                    {product.price.compare_at_price && product.price.compare_at_price > product.price.base_price && (
                      <span className="price-compare text-sm">
                        {formatPrice(product.price.compare_at_price)}
                      </span>
                    )}
                  </div>
                  {product.price.compare_at_price && product.price.compare_at_price > product.price.base_price && (
                    <div className="price-savings text-xs mt-1">
                      Save {formatPrice(product.price.compare_at_price - product.price.base_price)}
                    </div>
                  )}
                </div>

                <ArrowRight className="w-5 h-5 text-pg-gray group-hover:text-pg-navy transition-colors duration-200" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default FeaturedProducts