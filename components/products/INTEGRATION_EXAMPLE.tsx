/**
 * INTEGRATION EXAMPLE
 *
 * This file shows how to integrate the Recently Viewed Products feature
 * into your existing product pages and homepage.
 *
 * DO NOT import this file directly - it's for reference only.
 * Copy the relevant code snippets into your actual pages.
 */

// ============================================================================
// Example 1: Product Detail Page with Tracking
// File: app/(shop)/products/[slug]/page.tsx
// ============================================================================

import { RecentlyViewed } from '@/components/products'
import { ProductPageClient } from './client-component'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Existing product page content */}
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} name={product.name} />
          {/* ... rest of product content ... */}
        </div>

        {/* Product Info Tabs */}
        {/* ... */}

        {/* Related Products */}
        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </div>

      {/* NEW: Recently Viewed Section - Add this before closing </main> */}
      <RecentlyViewed
        title="You Recently Viewed"
        maxItems={4}
        variant="grid"
        showClearButton={false}
        className="bg-gray-50"
      />

      {/* Client Component for Tracking (see below) */}
      <ProductPageClient product={product} />
    </main>
  )
}

// ============================================================================
// Example 2: Client Component for Tracking Product Views
// File: app/(shop)/products/[slug]/client-component.tsx
// ============================================================================

'use client'

import { useEffect } from 'react'
import { useTrackProductView } from '@/components/products'

interface ProductPageClientProps {
  product: {
    id: string
    slug: string
    name: string
    price: number
    salePrice?: number
    images: string[]
    category?: { name: string }
  }
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { trackView } = useTrackProductView()

  useEffect(() => {
    // Track this product view
    const cleanup = trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      image: product.images[0] || '/placeholder.jpg',
      category: product.category?.name,
    })

    // Cleanup on unmount
    return cleanup
  }, [product.id]) // Only re-track if product ID changes

  // This component doesn't render anything
  return null
}

// ============================================================================
// Example 3: Homepage Integration
// File: app/page.tsx
// ============================================================================

import { RecentlyViewed } from '@/components/products'

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Product Categories */}
      <ProductCategories />

      {/* NEW: Recently Viewed Products */}
      {/* This will only show if user has viewed products */}
      <RecentlyViewed
        title="Continue Where You Left Off"
        maxItems={6}
        variant="grid"
        showClearButton={true}
        className="py-16"
      />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </main>
  )
}

// ============================================================================
// Example 4: Products Listing Page
// File: app/(shop)/products/page.tsx
// ============================================================================

import { RecentlyViewed } from '@/components/products'

export default async function ProductsListingPage({ searchParams }) {
  const products = await getProducts(searchParams)

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <ProductFilters />

        {/* Products Grid */}
        <ProductsGrid products={products} />

        {/* Pagination */}
        <Pagination />
      </div>

      {/* Recently Viewed at bottom */}
      <RecentlyViewed
        title="Recently Viewed Products"
        maxItems={6}
        variant="horizontal"
        className="bg-white border-t"
      />
    </main>
  )
}

// ============================================================================
// Example 5: Sidebar Usage (Dashboard or Account Page)
// File: app/account/layout.tsx
// ============================================================================

import { RecentlyViewedCompact } from '@/components/products'

export default function AccountLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Account Navigation */}
          <AccountNav />

          {/* Recently Viewed Compact */}
          <div className="p-4 bg-white rounded-lg border">
            <RecentlyViewedCompact maxItems={3} />
          </div>
        </aside>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}

// ============================================================================
// Example 6: Manual Store Access (Advanced)
// ============================================================================

'use client'

import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store'

export function CustomRecentlyViewedComponent() {
  const { products, addProduct, removeProduct, clearAll } = useRecentlyViewedStore()

  const handleAddCustomProduct = () => {
    addProduct({
      id: 'custom-1',
      slug: 'custom-product',
      name: 'Custom Product',
      price: 99.99,
      image: '/custom-image.jpg',
    })
  }

  return (
    <div>
      <button onClick={handleAddCustomProduct}>
        Add Custom Product
      </button>

      <button onClick={clearAll}>
        Clear All
      </button>

      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => removeProduct(product.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 7: Conditional Display Based on Count
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store'
import { RecentlyViewed } from '@/components/products'

export function ConditionalRecentlyViewed() {
  const [mounted, setMounted] = useState(false)
  const products = useRecentlyViewedStore((state) => state.products)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show if user has viewed at least 3 products
  if (!mounted || products.length < 3) {
    return null
  }

  return (
    <RecentlyViewed
      title="Based on Your Browsing"
      maxItems={4}
    />
  )
}

// ============================================================================
// Example 8: With Analytics Tracking
// ============================================================================

'use client'

import { useEffect } from 'react'
import { useTrackProductView } from '@/components/products'

export function ProductWithAnalytics({ product }) {
  const { trackView } = useTrackProductView()

  useEffect(() => {
    // Track in recently viewed
    const cleanup = trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0],
      category: product.category?.name,
    })

    // Also track in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'CAD',
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category?.name,
            price: product.price,
          },
        ],
      })
    }

    return cleanup
  }, [product.id])

  return null
}

// ============================================================================
// Example 9: Custom Styling
// ============================================================================

export function StyledRecentlyViewed() {
  return (
    <RecentlyViewed
      title="You Might Be Interested In"
      maxItems={8}
      variant="grid"
      showClearButton={false}
      className="
        bg-gradient-to-b from-white to-gray-50
        py-20
        border-y border-gray-200
      "
    />
  )
}

// ============================================================================
// Example 10: Mobile-Optimized Horizontal Scroll
// ============================================================================

export function MobileRecentlyViewed() {
  return (
    <div className="md:hidden">
      <RecentlyViewed
        title="Recently Viewed"
        maxItems={10}
        variant="horizontal"
        showClearButton={false}
        className="py-8"
      />
    </div>
  )
}
