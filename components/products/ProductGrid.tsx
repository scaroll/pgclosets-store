'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { reninProducts, type Product } from '@/data/renin-products'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Eye,
  ShoppingCart,
  Filter,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react'

// Dynamically import heavy components (only loaded when needed)
const ProductQuickView = dynamic(
  () => import('./ProductQuickView').then(mod => ({ default: mod.ProductQuickView })),
  { ssr: false }
)
const ProductFiltersSidebar = dynamic(
  () => import('./ProductFiltersSidebar').then(mod => ({ default: mod.ProductFiltersSidebar })),
  { ssr: false }
)

export interface ProductGridProps {
  /** Initial category filter */
  initialCategory?: string
  /** Grid layout style */
  layout?: 'masonry' | 'grid' | 'list'
  /** Items per page */
  itemsPerPage?: number
  /** Show filters sidebar */
  showFilters?: boolean
  /** Custom class name */
  className?: string
}

export function ProductGrid({
  initialCategory,
  layout = 'masonry',
  itemsPerPage = 12,
  showFilters = true,
  className
}: ProductGridProps) {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All')
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured')
  const [searchQuery, setSearchQuery] = useState('')

  // UI states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(showFilters)
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(reninProducts.map(p => p.category))]
    return cats
  }, [])

  // Get unique finishes
  const allFinishes = useMemo(() => {
    const finishes = new Set<string>()
    reninProducts.forEach(p => p.finishes.forEach(f => finishes.add(f)))
    return Array.from(finishes).sort()
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = reninProducts

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.features.some(f => f.toLowerCase().includes(query))
      )
    }

    // Finish filter
    if (selectedFinishes.length > 0) {
      filtered = filtered.filter(p =>
        p.finishes.some(f => selectedFinishes.includes(f))
      )
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Featured order (default)
        break
    }

    return filtered
  }, [selectedCategory, searchQuery, selectedFinishes, priceRange, sortBy])

  // Visible products with pagination
  const visibleProducts = useMemo(() =>
    filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  )

  // Handle image load
  const handleImageLoad = useCallback((productId: string) => {
    setLoadedImages(prev => new Set([...prev, productId]))
  }, [])

  // Load more
  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + itemsPerPage)
  }, [itemsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setVisibleCount(itemsPerPage)
  }, [selectedCategory, selectedFinishes, priceRange, sortBy, searchQuery, itemsPerPage])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedCategory('All')
    setSelectedFinishes([])
    setPriceRange([0, 2000])
    setSearchQuery('')
    setSortBy('featured')
  }, [])

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedFinishes.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 2000 ||
    searchQuery !== ''

  return (
    <div className={cn('w-full', className)}>
      {/* Header with filters toggle and sort */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {selectedFinishes.length + (selectedCategory !== 'All' ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex gap-8">
        {/* Filters sidebar */}
        <AnimatePresence mode="wait">
          {filtersOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="hidden w-64 shrink-0 lg:block"
            >
              <ProductFiltersSidebar
                categories={categories}
                finishes={allFinishes}
                selectedCategory={selectedCategory}
                selectedFinishes={selectedFinishes}
                priceRange={priceRange}
                searchQuery={searchQuery}
                onCategoryChange={setSelectedCategory}
                onFinishesChange={setSelectedFinishes}
                onPriceRangeChange={setPriceRange}
                onSearchChange={setSearchQuery}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters to see more results
                </p>
              </div>
              <Button onClick={handleClearFilters} variant="outline">
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* Masonry Grid */}
              <div
                className={cn(
                  'grid gap-6',
                  layout === 'masonry' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                  layout === 'grid' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                  layout === 'list' && 'grid-cols-1'
                )}
              >
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      layout={layout}
                      isHovered={hoveredProductId === product.id}
                      isLoaded={loadedImages.has(product.id)}
                      onHoverChange={(hovered) =>
                        setHoveredProductId(hovered ? product.id : null)
                      }
                      onImageLoad={() => handleImageLoad(product.id)}
                      onQuickView={() => setQuickViewProduct(product)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Load more button */}
              {visibleCount < filteredProducts.length && (
                <div className="mt-12 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    variant="outline"
                    className="gap-2"
                  >
                    Load more products
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick view modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          open={!!quickViewProduct}
          onOpenChange={(open) => !open && setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  index: number
  layout: 'masonry' | 'grid' | 'list'
  isHovered: boolean
  isLoaded: boolean
  onHoverChange: (hovered: boolean) => void
  onImageLoad: () => void
  onQuickView: () => void
}

function ProductCard({
  product,
  index,
  layout,
  isHovered,
  isLoaded,
  onHoverChange,
  onImageLoad,
  onQuickView
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        layout: { duration: 0.3 }
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <Card
        variant="interactive"
        className={cn(
          'group relative overflow-hidden border-0 bg-white shadow-sm transition-all duration-300',
          'hover:shadow-lg hover:shadow-black/5',
          layout === 'list' && 'flex flex-row'
        )}
      >
        {/* Image container */}
        <div
          className={cn(
            'relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100',
            layout === 'list' ? 'w-48 shrink-0' : 'aspect-[4/5]'
          )}
        >
          {/* Lazy loaded image */}
          <div className="relative h-full w-full">
            {!imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={cn(
                  'object-cover transition-all duration-500',
                  isHovered && 'scale-110',
                  !isLoaded && 'blur-sm'
                )}
                onLoad={onImageLoad}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Sparkles className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {/* Loading skeleton */}
            {!isLoaded && !imageError && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
            )}

            {/* Hover overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300',
                isHovered && 'opacity-100'
              )}
            />

            {/* Quick actions */}
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4 transition-all duration-300',
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
            >
              <Button
                size="sm"
                onClick={onQuickView}
                className="gap-2 bg-white text-black shadow-lg hover:bg-gray-100"
              >
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
              <Button
                size="sm"
                className="gap-2 shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Category badge */}
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm"
          >
            {product.category}
          </Badge>

          {/* Price badge (optional - shown on hover) */}
          <Badge
            className={cn(
              'absolute right-3 top-3 bg-black/80 text-white backdrop-blur-sm transition-opacity',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            ${product.price}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className={cn('p-4', layout === 'list' && 'flex-1')}>
          <div className="space-y-2">
            <h3 className="line-clamp-1 font-semibold tracking-tight">
              {product.name}
            </h3>

            <p className="text-2xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>

            {/* Finishes */}
            <div className="flex flex-wrap gap-1">
              {product.finishes.slice(0, 3).map((finish, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs"
                >
                  {finish}
                </Badge>
              ))}
              {product.finishes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.finishes.length - 3}
                </Badge>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-1 text-sm text-muted-foreground">
              {product.features.slice(0, 2).map((feature, i) => (
                <li key={i} className="line-clamp-1">• {feature}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
