/**
 * Recently Viewed Demo Component
 *
 * This is a demo component to test the recently viewed feature.
 * You can add this to a test page to see it in action.
 *
 * Usage:
 * 1. Create a test page: app/test-recently-viewed/page.tsx
 * 2. Import and use this component
 * 3. Click buttons to simulate product views
 * 4. See the recently viewed section update
 */

'use client'

import { useState } from 'react'
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store'
import { RecentlyViewed, RecentlyViewedCompact } from './recently-viewed'
import { Button } from '@/ui/button'

// Sample products for demo
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    slug: 'luxury-wardrobe-system',
    name: 'Luxury Wardrobe System',
    price: 2499.99,
    salePrice: 1999.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'Wardrobes',
  },
  {
    id: '2',
    slug: 'modern-shoe-rack',
    name: 'Modern Shoe Rack',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    category: 'Storage',
  },
  {
    id: '3',
    slug: 'custom-closet-organizer',
    name: 'Custom Closet Organizer',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'Organizers',
  },
  {
    id: '4',
    slug: 'pull-out-drawer-system',
    name: 'Pull-Out Drawer System',
    price: 899.99,
    salePrice: 799.99,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    category: 'Accessories',
  },
  {
    id: '5',
    slug: 'led-closet-lighting',
    name: 'LED Closet Lighting',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'Lighting',
  },
  {
    id: '6',
    slug: 'jewelry-drawer-insert',
    name: 'Jewelry Drawer Insert',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    category: 'Accessories',
  },
  {
    id: '7',
    slug: 'closet-door-mirror',
    name: 'Closet Door Mirror',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'Mirrors',
  },
  {
    id: '8',
    slug: 'hanging-rod-system',
    name: 'Hanging Rod System',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    category: 'Hardware',
  },
]

export function RecentlyViewedDemo() {
  const { products, addProduct, clearAll } = useRecentlyViewedStore()
  const [showCompact, setShowCompact] = useState(false)

  const simulateView = (product: typeof SAMPLE_PRODUCTS[0]) => {
    addProduct(product)
  }

  const simulateRandomViews = () => {
    // Simulate viewing 5 random products
    const shuffled = [...SAMPLE_PRODUCTS].sort(() => Math.random() - 0.5)
    shuffled.slice(0, 5).forEach((product, index) => {
      setTimeout(() => {
        addProduct(product)
      }, index * 300)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Recently Viewed Feature Demo</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Click on products below to simulate views and see the recently viewed section update
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={simulateRandomViews}>
              Simulate 5 Random Views
            </Button>
            <Button onClick={clearAll} variant="destructive">
              Clear All History
            </Button>
            <Button
              onClick={() => setShowCompact(!showCompact)}
              variant="outline"
            >
              {showCompact ? 'Show Full' : 'Show Compact'}
            </Button>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm font-medium">
              Current History: {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Sample Products Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample Products (Click to View)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SAMPLE_PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => simulateView(product)}
                className="group text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="font-bold text-primary">
                        ${product.salePrice}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold">${product.price}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {product.category}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recently Viewed Display */}
        {showCompact ? (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Compact View</h2>
            <RecentlyViewedCompact maxItems={6} />
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No products viewed yet. Click on products above to get started.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Grid Variant */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 px-4">Grid Variant</h2>
              <RecentlyViewed
                title="Recently Viewed Products (Grid)"
                maxItems={6}
                variant="grid"
                showClearButton={true}
              />
            </div>

            {/* Horizontal Variant */}
            <div className="bg-gray-100 py-8 -mx-4 px-4 mb-8">
              <h2 className="text-2xl font-semibold mb-4 px-4">Horizontal Variant</h2>
              <RecentlyViewed
                title="Recently Viewed Products (Horizontal)"
                maxItems={8}
                variant="horizontal"
                showClearButton={false}
              />
            </div>
          </>
        )}

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Total Products Viewed:</strong> {products.length}
            </p>
            <p className="text-sm">
              <strong>Storage Key:</strong> recently-viewed-storage
            </p>
            <p className="text-sm">
              <strong>Max Capacity:</strong> 10 products
            </p>
          </div>
          {products.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Product IDs in history:</p>
              <code className="text-xs bg-gray-100 p-3 rounded block overflow-x-auto">
                {JSON.stringify(products.map(p => ({ id: p.id, name: p.name })), null, 2)}
              </code>
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Usage Instructions</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Click on any product card above to simulate a product view</p>
            <p>2. Watch the "Recently Viewed" sections update automatically</p>
            <p>3. Try viewing the same product twice - it moves to the top</p>
            <p>4. View more than 10 products to see automatic pruning</p>
            <p>5. Use "Clear All History" to reset</p>
            <p>6. Refresh the page to see localStorage persistence</p>
            <p>7. Toggle between full and compact views</p>
          </div>
        </div>
      </div>
    </div>
  )
}
