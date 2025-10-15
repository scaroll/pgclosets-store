# Agent #43: Product Comparison Implementation Guide

## Overview

Build a comprehensive product comparison system allowing customers to compare up to 4 products side-by-side with visual comparison, specification tables, and smart recommendations.

---

## Features

### Core Functionality
- Add/remove products to comparison (max 4)
- Side-by-side specification comparison
- Visual comparison with images
- Highlight differences and best values
- Mobile-optimized comparison view
- Export to PDF/email
- Share comparison
- Smart product recommendations
- Comparison analytics

---

## Implementation Plan

### Phase 1: Comparison Store (Week 1)

**File**: `/lib/customer-experience/comparison/comparison-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ComparisonProduct {
  id: string
  name: string
  category: string
  price: number
  image: string
  sku: string
  url: string

  // Specifications
  specifications: {
    size?: string
    material?: string
    finish?: string
    warranty?: string
    installation?: string
    features?: string[]
    [key: string]: any
  }

  // Metadata
  addedAt: Date
  rating?: number
  reviewCount?: number
  inStock?: boolean
}

interface ComparisonStore {
  products: ComparisonProduct[]
  maxProducts: number

  // Actions
  addProduct: (product: ComparisonProduct) => boolean
  removeProduct: (productId: string) => void
  clearComparison: () => void

  // Utilities
  canAddMore: () => boolean
  getProductCount: () => number
  isInComparison: (productId: string) => boolean

  // Export
  getComparisonData: () => ComparisonData
}

export interface ComparisonData {
  products: ComparisonProduct[]
  commonSpecs: string[]
  differences: Record<string, string[]>
  bestValue?: string
  createdAt: Date
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      products: [],
      maxProducts: 4,

      addProduct: (product) => {
        const { products, maxProducts } = get()

        if (products.length >= maxProducts) {
          return false
        }

        if (products.some(p => p.id === product.id)) {
          return false
        }

        set({
          products: [...products, { ...product, addedAt: new Date() }]
        })

        return true
      },

      removeProduct: (productId) => {
        set({
          products: get().products.filter(p => p.id !== productId)
        })
      },

      clearComparison: () => {
        set({ products: [] })
      },

      canAddMore: () => {
        return get().products.length < get().maxProducts
      },

      getProductCount: () => {
        return get().products.length
      },

      isInComparison: (productId) => {
        return get().products.some(p => p.id === productId)
      },

      getComparisonData: () => {
        const products = get().products

        return {
          products,
          commonSpecs: getCommonSpecs(products),
          differences: getDifferences(products),
          bestValue: calculateBestValue(products),
          createdAt: new Date()
        }
      }
    }),
    {
      name: 'pg-closets-comparison',
      skipHydration: true
    }
  )
)

// Helper functions
function getCommonSpecs(products: ComparisonProduct[]): string[] {
  if (products.length === 0) return []

  const firstProduct = products[0]
  const commonSpecs: string[] = []

  for (const [key, value] of Object.entries(firstProduct.specifications)) {
    const isCommon = products.every(p =>
      p.specifications[key] === value
    )

    if (isCommon) {
      commonSpecs.push(key)
    }
  }

  return commonSpecs
}

function getDifferences(products: ComparisonProduct[]): Record<string, string[]> {
  const differences: Record<string, string[]> = {}

  if (products.length === 0) return differences

  // Get all unique specification keys
  const allKeys = new Set<string>()
  products.forEach(p => {
    Object.keys(p.specifications).forEach(key => allKeys.add(key))
  })

  // Find differences
  allKeys.forEach(key => {
    const values = products.map(p => p.specifications[key] || 'N/A')
    const uniqueValues = new Set(values)

    if (uniqueValues.size > 1) {
      differences[key] = values
    }
  })

  return differences
}

function calculateBestValue(products: ComparisonProduct[]): string | undefined {
  if (products.length === 0) return undefined

  // Simple best value calculation based on price and rating
  const scored = products.map(p => ({
    id: p.id,
    score: (p.rating || 0) / (p.price / 100)
  }))

  scored.sort((a, b) => b.score - a.score)

  return scored[0].id
}
```

### Phase 2: Comparison Button Component (Week 1)

**File**: `/components/customer-experience/comparison/ComparisonButton.tsx`

```typescript
'use client'

import { useState } from 'react'
import { ArrowLeftRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useComparisonStore, ComparisonProduct } from '@/lib/customer-experience/comparison/comparison-store'

interface ComparisonButtonProps {
  product: ComparisonProduct
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showLabel?: boolean
}

export function ComparisonButton({
  product,
  variant = 'outline',
  size = 'default',
  showLabel = true
}: ComparisonButtonProps) {
  const { addProduct, removeProduct, isInComparison, canAddMore } = useComparisonStore()
  const inComparison = isInComparison(product.id)

  const handleClick = () => {
    if (inComparison) {
      removeProduct(product.id)
      toast.success('Removed from comparison')

      // Track analytics
      trackEvent('comparison_remove', {
        productId: product.id,
        productName: product.name
      })
    } else {
      const added = addProduct(product)

      if (added) {
        toast.success('Added to comparison')

        // Track analytics
        trackEvent('comparison_add', {
          productId: product.id,
          productName: product.name
        })
      } else if (!canAddMore()) {
        toast.error('You can compare up to 4 products at a time')
      } else {
        toast.error('Product already in comparison')
      }
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={inComparison ? 'default' : variant}
      size={size}
      className={inComparison ? 'bg-green-600 hover:bg-green-700' : ''}
    >
      {inComparison ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <ArrowLeftRight className="w-4 h-4 mr-2" />
      )}
      {showLabel && (inComparison ? 'In Comparison' : 'Compare')}
    </Button>
  )
}

function trackEvent(eventName: string, data: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, data)
  }
}
```

### Phase 3: Comparison Table (Week 2)

**File**: `/components/customer-experience/comparison/ComparisonTable.tsx`

```typescript
'use client'

import { X, Download, Share2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useComparisonStore } from '@/lib/customer-experience/comparison/comparison-store'

export function ComparisonTable() {
  const { products, removeProduct, getComparisonData, clearComparison } = useComparisonStore()
  const comparisonData = getComparisonData()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ArrowLeftRight className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No products to compare</h3>
        <p className="text-muted-foreground mb-4">
          Add products to your comparison to see them side-by-side
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Comparing {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </h2>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToPDF()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => shareComparison()}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={clearComparison}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left border-b font-semibold">Specification</th>
              {products.map(product => (
                <th key={product.id} className="p-4 border-b relative">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="128px"
                      />
                    </div>

                    <h3 className="font-semibold text-sm mb-2">{product.name}</h3>

                    <div className="text-xl font-bold text-primary mb-2">
                      ${product.price.toFixed(2)}
                    </div>

                    {product.id === comparisonData.bestValue && (
                      <Badge className="bg-green-600">Best Value</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Product Info */}
            <ComparisonRow
              label="SKU"
              values={products.map(p => p.sku)}
              highlight={false}
            />

            <ComparisonRow
              label="Category"
              values={products.map(p => p.category)}
              highlight={false}
            />

            <ComparisonRow
              label="In Stock"
              values={products.map(p => p.inStock ? 'Yes' : 'No')}
              highlight={true}
            />

            {/* Specifications */}
            {Object.keys(comparisonData.differences).map(key => (
              <ComparisonRow
                key={key}
                label={formatLabel(key)}
                values={comparisonData.differences[key]}
                highlight={true}
              />
            ))}

            {/* Rating */}
            <ComparisonRow
              label="Rating"
              values={products.map(p =>
                p.rating ? `${p.rating}/5 (${p.reviewCount} reviews)` : 'No reviews'
              )}
              highlight={true}
            />

            {/* Action Buttons */}
            <tr>
              <td className="p-4 border-t font-semibold">Actions</td>
              {products.map(product => (
                <td key={product.id} className="p-4 border-t text-center">
                  <div className="flex flex-col gap-2">
                    <Link href={product.url}>
                      <Button className="w-full">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Add to Cart
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ComparisonRow({
  label,
  values,
  highlight
}: {
  label: string
  values: string[]
  highlight: boolean
}) {
  const isDifferent = new Set(values).size > 1

  return (
    <tr className={isDifferent && highlight ? 'bg-yellow-50' : ''}>
      <td className="p-4 border-t font-medium">{label}</td>
      {values.map((value, index) => (
        <td
          key={index}
          className="p-4 border-t text-center"
        >
          {value}
        </td>
      ))}
    </tr>
  )
}

function formatLabel(key: string): string {
  return key
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/^./, str => str.toUpperCase())
}

async function exportToPDF() {
  // Implementation for PDF export
  toast.info('PDF export coming soon!')
}

async function shareComparison() {
  // Implementation for sharing
  toast.info('Sharing coming soon!')
}
```

### Phase 4: Mobile Comparison Drawer (Week 2)

**File**: `/components/customer-experience/comparison/ComparisonDrawer.tsx`

```typescript
'use client'

import { useState } from 'react'
import { X, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useComparisonStore } from '@/lib/customer-experience/comparison/comparison-store'
import Link from 'next/link'
import Image from 'next/image'

export function ComparisonDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { products, removeProduct, getProductCount } = useComparisonStore()
  const count = getProductCount()

  if (count === 0) return null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="font-semibold">Compare ({count})</span>
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Comparing {count} {count === 1 ? 'Product' : 'Products'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Products */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 relative"
                    >
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="relative w-full h-32 mb-2">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>

                      <h4 className="font-semibold text-sm mb-1 pr-6">
                        {product.name}
                      </h4>

                      <p className="text-primary font-bold">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t space-y-2">
                <Link href="/compare">
                  <Button className="w-full" size="lg">
                    View Full Comparison
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

## Routes & Pages

### /app/compare/page.tsx
Full comparison page with table view

```typescript
import { ComparisonTable } from '@/components/customer-experience/comparison/ComparisonTable'

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <ComparisonTable />
    </div>
  )
}
```

---

## Integration Points

### Product Card Integration
Add comparison button to all product cards

```typescript
// In ProductCard component
import { ComparisonButton } from '@/components/customer-experience/comparison/ComparisonButton'

<ComparisonButton
  product={{
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    sku: product.sku,
    url: product.url,
    specifications: product.specifications
  }}
/>
```

### Mobile Integration
Add comparison drawer to root layout

```typescript
// In app/layout.tsx
import { ComparisonDrawer } from '@/components/customer-experience/comparison/ComparisonDrawer'

<ComparisonDrawer />
```

---

## Analytics Events

```typescript
export const comparisonEvents = {
  ADD: 'comparison_add',
  REMOVE: 'comparison_remove',
  VIEW: 'comparison_view',
  EXPORT: 'comparison_export',
  SHARE: 'comparison_share',
  CONVERT: 'comparison_purchase'
}
```

---

## Success Metrics

- **Usage Rate**: >10% of PDP visitors
- **Products per Comparison**: Average 2.5-3
- **Conversion Rate**: >35% from comparison
- **Mobile Usage**: >40% of comparisons

---

## Testing Checklist

- [ ] Add products to comparison
- [ ] Remove products from comparison
- [ ] View comparison table (desktop)
- [ ] View comparison drawer (mobile)
- [ ] Export comparison to PDF
- [ ] Share comparison
- [ ] Clear comparison
- [ ] Best value calculation works
- [ ] Differences highlighted correctly
- [ ] Mobile drawer functions properly
- [ ] Analytics events fire
- [ ] LocalStorage persistence works

---

**Last Updated**: October 14, 2025
**Status**: Ready for Implementation
**Estimated Completion**: 2 weeks
