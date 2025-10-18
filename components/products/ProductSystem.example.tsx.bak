'use client'

/**
 * Product Display System - Complete Example
 *
 * This file demonstrates how to use all the premium product components together
 * to create a complete e-commerce product listing and detail experience.
 */

import { useState } from 'react'
import { ProductCard, type ProductCardData } from './ProductCard.premium'
import { ProductGallery, type GalleryImage } from './ProductGallery.premium'
import { ProductQuickView, type QuickViewProduct } from './ProductQuickView.premium'
import { ProductFilter, type FilterGroup, type ActiveFilters } from './ProductFilter.premium'
import { ProductSort, type SortOption } from './ProductSort.premium'

// Mock data for demonstration
const mockProducts: ProductCardData[] = [
  {
    id: '1',
    name: 'Premium Sliding Closet Door',
    slug: 'premium-sliding-door',
    description: 'High-quality sliding door with smooth glide system',
    price: 29999,
    compareAtPrice: 34999,
    currency: 'USD',
    images: [
      '/products/door1.jpg',
      '/products/door2.jpg',
      '/products/door3.jpg'
    ],
    category: 'Sliding Doors',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 15,
    variants: [
      { id: 'white', name: 'White', inStock: true },
      { id: 'black', name: 'Black', inStock: true },
      { id: 'natural', name: 'Natural Wood', inStock: false }
    ],
    tags: ['premium', 'sliding', 'modern'],
    isNew: true,
    isSale: true,
    isFeatured: false
  },
  {
    id: '2',
    name: 'Classic Bi-Fold Door',
    slug: 'classic-bifold-door',
    description: 'Traditional bi-fold door perfect for any closet',
    price: 19999,
    currency: 'USD',
    images: ['/products/bifold1.jpg', '/products/bifold2.jpg'],
    category: 'Bi-Fold Doors',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    stockCount: 8,
    isNew: false,
    isSale: false,
    isFeatured: true
  }
  // Add more products as needed
]

// Filter configuration
const filterGroups: FilterGroup[] = [
  {
    id: 'categories',
    label: 'Category',
    type: 'checkbox',
    options: [
      { value: 'sliding', label: 'Sliding Doors', count: 24 },
      { value: 'bifold', label: 'Bi-Fold Doors', count: 18 },
      { value: 'hinged', label: 'Hinged Doors', count: 12 },
      { value: 'pocket', label: 'Pocket Doors', count: 6 }
    ]
  },
  {
    id: 'colors',
    label: 'Color',
    type: 'checkbox',
    options: [
      { value: 'white', label: 'White', count: 32 },
      { value: 'black', label: 'Black', count: 28 },
      { value: 'natural', label: 'Natural Wood', count: 20 },
      { value: 'gray', label: 'Gray', count: 15 }
    ]
  },
  {
    id: 'materials',
    label: 'Material',
    type: 'checkbox',
    options: [
      { value: 'wood', label: 'Wood', count: 35 },
      { value: 'metal', label: 'Metal', count: 18 },
      { value: 'glass', label: 'Glass', count: 12 },
      { value: 'composite', label: 'Composite', count: 10 }
    ]
  }
]

// Sort options
const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name-asc', label: 'Name: A to Z' }
]

export function ProductSystemExample() {
  // State management
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  const [sortBy, setSortBy] = useState('featured')
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  // Handlers
  const handleQuickView = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (product) {
      // Convert ProductCardData to QuickViewProduct
      const quickViewData: QuickViewProduct = {
        ...product,
        images: product.images.map((url) => ({ url, alt: product.name })),
        variants: product.variants
          ? [
              {
                type: 'Color',
                options: product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  value: v.name,
                  inStock: v.inStock
                }))
              }
            ]
          : undefined,
        features: [
          'Premium quality materials',
          'Easy installation',
          '10-year warranty',
          'Customizable dimensions'
        ]
      }
      setQuickViewProduct(quickViewData)
    }
  }

  const handleWishlistToggle = (productId: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleAddToCart = (productId: string, variantId: string | null, quantity: number) => {
    console.log('Add to cart:', { productId, variantId, quantity })
    // Implement your cart logic here
  }

  const handleClearFilters = () => {
    setActiveFilters({})
  }

  return (
    <div className="min-h-screen bg-apple-gray-100 dark:bg-apple-dark-bg">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-apple-48 font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
            Our Products
          </h1>
          <p className="text-apple-17 text-apple-gray-600 dark:text-apple-gray-400">
            Discover our premium collection of closet doors and accessories
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <ProductFilter
                filterGroups={filterGroups}
                priceRange={{ min: 0, max: 100000, step: 1000 }}
                activeFilters={activeFilters}
                onChange={setActiveFilters}
                onClear={handleClearFilters}
                isMobile
              />
            </div>

            {/* Results Count */}
            <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
              Showing {mockProducts.length} products
            </p>
          </div>

          {/* Sort Dropdown */}
          <ProductSort options={sortOptions} value={sortBy} onChange={setSortBy} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <ProductFilter
                filterGroups={filterGroups}
                priceRange={{ min: 0, max: 100000, step: 1000 }}
                activeFilters={activeFilters}
                onChange={setActiveFilters}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                  onWishlistToggle={handleWishlistToggle}
                  isWishlisted={wishlist.has(product.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {mockProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-apple-21 text-apple-gray-600 dark:text-apple-gray-400">
                  No products found
                </p>
                <p className="text-apple-15 text-apple-gray-500 mt-2">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
          isWishlisted={wishlist.has(quickViewProduct.id)}
        />
      )}
    </div>
  )
}

/**
 * Individual Component Examples
 */

// Example 1: Standalone Product Card
export function ProductCardExample() {
  const sampleProduct: ProductCardData = {
    id: '1',
    name: 'Premium Sliding Door',
    slug: 'premium-sliding-door',
    price: 29999,
    compareAtPrice: 34999,
    images: ['/door1.jpg', '/door2.jpg'],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 15,
    isNew: true,
    isSale: true
  }

  return (
    <div className="max-w-sm">
      <ProductCard
        product={sampleProduct}
        onQuickView={(id) => console.log('Quick view:', id)}
        onWishlistToggle={(id) => console.log('Wishlist toggle:', id)}
      />
    </div>
  )
}

// Example 2: Product Gallery
export function ProductGalleryExample() {
  const sampleImages: GalleryImage[] = [
    { url: '/door1.jpg', alt: 'Front view' },
    { url: '/door2.jpg', alt: 'Side view' },
    { url: '/door3.jpg', alt: 'Detail shot' },
    { url: '/door4.jpg', alt: 'Installation example' }
  ]

  return (
    <div className="max-w-2xl">
      <ProductGallery images={sampleImages} productName="Premium Sliding Door" />
    </div>
  )
}

// Example 3: Filter Sidebar
export function ProductFilterExample() {
  const [filters, setFilters] = useState<ActiveFilters>({})

  return (
    <div className="max-w-sm">
      <ProductFilter
        filterGroups={filterGroups}
        priceRange={{ min: 0, max: 100000, step: 1000 }}
        activeFilters={filters}
        onChange={setFilters}
        onClear={() => setFilters({})}
      />
    </div>
  )
}

export default ProductSystemExample
