/**
 * Loading States Implementation Examples
 *
 * Practical examples showing how to use the PG Closets loading states system
 * in real-world scenarios.
 *
 * Agent #13 Deliverable
 */

import React, { useEffect, useState } from 'react'
import { ProductGridSkeleton, ProductCardSkeleton, ProductDetailSkeleton } from '@/components/ui/skeletons'
import { PremiumSpinner, PremiumSpinnerWithText, PulseLoader } from '@/components/ui/loaders'
import { ErrorBoundary, NetworkError } from '@/components/ui/error-states'
import { useLoadingState, useDelayedLoading, useOptimistic } from '@/lib/loading'

// ============================================================================
// Example 1: Product List with Loading State
// ============================================================================

export function ProductListExample() {
  const { state, data, error, execute, retry } = useLoadingState<Product[]>({
    minLoadingTime: 400,
    autoRetry: true,
    maxRetries: 3
  })

  useEffect(() => {
    execute(
      fetch('/api/products').then(res => res.json())
    )
  }, [])

  // Show skeleton during loading
  if (state === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold mb-8">Our Products</h1>
        <ProductGridSkeleton count={12} />
      </div>
    )
  }

  // Show error with retry
  if (state === 'error') {
    return (
      <div className="container mx-auto px-4 py-12">
        <NetworkError
          onRetry={retry}
          message="We couldn't load the products. Please try again."
        />
      </div>
    )
  }

  // Show actual products
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 2: Product Detail Page
// ============================================================================

export function ProductDetailExample({ slug }: { slug: string }) {
  const { state, data, error, execute, retry } = useLoadingState<Product>({
    minLoadingTime: 400,
    maxLoadingTime: 10000
  })

  useEffect(() => {
    execute(
      fetch(`/api/products/${slug}`).then(res => res.json())
    )
  }, [slug])

  if (state === 'loading') {
    return <ProductDetailSkeleton showGallery showReviews showRelated />
  }

  if (state === 'error') {
    return (
      <div className="container mx-auto px-4 py-12">
        <NetworkError
          onRetry={retry}
          title="Product Not Found"
          message="We couldn't find this product. It may have been removed or the URL is incorrect."
        />
      </div>
    )
  }

  return <ProductDetail product={data!} />
}

// ============================================================================
// Example 3: Search with Delayed Loading
// ============================================================================

export function SearchExample() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Only show skeleton after 200ms to prevent flash on fast searches
  const showSkeleton = useDelayedLoading(isSearching, 200)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const searchProducts = async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
      } finally {
        setIsSearching(false)
      }
    }

    // Debounce search
    const timer = setTimeout(searchProducts, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Results */}
      {showSkeleton ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 4: Form Submission
// ============================================================================

export function QuoteFormExample() {
  const { execute, isLoading, isSuccess } = useLoadingState()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await execute(
      fetch('/api/quotes', {
        method: 'POST',
        body: formData
      }).then(res => res.json())
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="h-16 w-16 text-green-600 mx-auto" /* checkmark icon */ />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
        <p className="text-gray-600">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Form fields */}
      <input name="name" placeholder="Your Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />

      {/* Submit Button with Loading State */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-charcoal-900 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <PremiumSpinner size="sm" variant="copper" />
            Submitting...
          </span>
        ) : (
          'Get Free Quote'
        )}
      </button>
    </form>
  )
}

// ============================================================================
// Example 5: Infinite Scroll
// ============================================================================

export function InfiniteScrollExample() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const { execute, isLoading } = useLoadingState()
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    if (!hasMore || isLoading) return

    const newProducts = await execute(
      fetch(`/api/products?page=${page}`).then(res => res.json())
    )

    if (newProducts.length === 0) {
      setHasMore(false)
    } else {
      setProducts(prev => [...prev, ...newProducts])
      setPage(prev => prev + 1)
    }
  }

  // Load more when scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500
      if (bottom) loadMore()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page, hasMore])

  // Initial load
  useEffect(() => {
    loadMore()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8">All Products</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Loading More Indicator */}
      {isLoading && (
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      )}

      {/* End of Results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-12 text-gray-600">
          You've reached the end!
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 6: Optimistic UI Update
// ============================================================================

export function AddToCartExample({ product }: { product: Product }) {
  const [cart, updateCart, isPending] = useOptimistic(
    [] as CartItem[],
    async (newCart: CartItem[]) => {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        body: JSON.stringify(newCart),
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    }
  )

  const addToCart = () => {
    // Instant UI update - automatically rolls back if API fails
    updateCart([...cart, { productId: product.id, quantity: 1 }])
  }

  return (
    <button
      onClick={addToCart}
      disabled={isPending}
      className="px-6 py-3 bg-charcoal-900 text-white rounded-lg font-medium disabled:opacity-50"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <PulseLoader size="sm" color="white" />
          Adding...
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}

// ============================================================================
// Example 7: Error Boundary Usage
// ============================================================================

export function ErrorBoundaryExample() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error('Error caught by boundary:', error, errorInfo)
      }}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {/* Your app components */}
      <ProductListExample />
    </ErrorBoundary>
  )
}

// ============================================================================
// Example 8: Page Transition Loading
// ============================================================================

export function PageTransitionExample({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Hook into Next.js router events (pseudo-code)
  useEffect(() => {
    // router.events.on('routeChangeStart', () => setIsTransitioning(true))
    // router.events.on('routeChangeComplete', () => setIsTransitioning(false))
  }, [])

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PremiumSpinnerWithText
          text="Loading page..."
          size="lg"
          variant="luxury"
        />
      </div>
    )
  }

  return children
}

// ============================================================================
// Type Definitions (for reference)
// ============================================================================

interface Product {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface CartItem {
  productId: string
  quantity: number
}

// Placeholder components referenced in examples
const ProductCard = (props: Product) => <div>Product Card</div>
const ProductDetail = (props: { product: Product }) => <div>Product Detail</div>
