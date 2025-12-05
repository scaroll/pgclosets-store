# Product Comparison - Quick Start Guide

Get started with the Product Comparison component in 5 minutes.

## Installation

The component is already part of the project. No additional installation needed.

## Basic Usage

### Step 1: Import the Component

```tsx
import { ProductComparison } from "@/components/products"
```

### Step 2: Prepare Your Products

```tsx
const products = [
  {
    id: "1",
    name: "Modern Barn Door",
    slug: "modern-barn-door",
    category: "barn-doors",
    price: 45900, // $459.00 in cents
    images: ["/images/door1.jpg"],
    features: ["Solid oak", "Hardware included", "Easy install"],
    specifications: {
      Material: "Oak",
      Width: "36 inches",
      Height: "84 inches",
    },
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  // Add 1-2 more products...
]
```

### Step 3: Use the Component

```tsx
export default function ComparePage() {
  return (
    <div className="container mx-auto py-12">
      <ProductComparison
        initialProducts={products}
        maxProducts={3}
      />
    </div>
  )
}
```

## Complete Example

Here's a complete working page:

```tsx
"use client"

import { ProductComparison } from "@/components/products"
import type { Product } from "@/types/product"

// Sample products (replace with your data)
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Modern Barn Door - White Oak",
    slug: "modern-barn-door-white-oak",
    category: "barn-doors",
    price: 45900,
    salePrice: 39900,
    images: ["/products/door1.jpg"],
    description: "Premium white oak barn door",
    features: [
      "Solid white oak construction",
      "Smooth-glide hardware included",
      "Pre-finished with protective coating",
    ],
    specifications: {
      Material: "White Oak",
      Thickness: "1.75 inches",
      Width: "36 inches",
      Height: "84 inches",
    },
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Contemporary Bifold Door",
    slug: "contemporary-bifold-door",
    category: "bifold-doors",
    price: 35900,
    images: ["/products/door2.jpg"],
    description: "Space-saving bifold door",
    features: [
      "Space-efficient design",
      "Rich espresso finish",
      "Smooth folding mechanism",
    ],
    specifications: {
      Material: "MDF Core",
      Thickness: "1.375 inches",
      Width: "32 inches",
      Height: "80 inches",
    },
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    isFeatured: false,
  },
]

export default function ProductComparisonPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <ProductComparison
          initialProducts={sampleProducts}
          maxProducts={3}
          onProductSelect={(products) => {
            console.log("Selected products:", products)
          }}
        />
      </div>
    </main>
  )
}
```

## Mobile-Friendly Version

For mobile devices, use the compact version:

```tsx
"use client"

import { ProductComparisonCompact } from "@/components/products"

export default function MobileComparePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <ProductComparisonCompact
        initialProducts={products}
      />
    </div>
  )
}
```

## Responsive Layout

For the best experience on all devices:

```tsx
export default function ResponsiveComparePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Show full table on desktop */}
      <div className="hidden lg:block">
        <ProductComparison initialProducts={products} maxProducts={3} />
      </div>

      {/* Show compact version on mobile */}
      <div className="lg:hidden">
        <ProductComparisonCompact initialProducts={products.slice(0, 2)} />
      </div>
    </div>
  )
}
```

## Props Reference

### ProductComparison

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialProducts` | `Product[]` | `[]` | Products to display initially |
| `maxProducts` | `2 \| 3` | `3` | Maximum products to compare |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onProductSelect` | `(products: Product[]) => void` | `undefined` | Callback when products change |

### ProductComparisonCompact

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialProducts` | `Product[]` | `[]` | Products to display initially |
| `className` | `string` | `undefined` | Additional CSS classes |

## Customization

### Custom Styling

Add custom classes:

```tsx
<ProductComparison
  className="bg-white shadow-2xl rounded-3xl"
  initialProducts={products}
/>
```

### Custom Actions

Handle product selection:

```tsx
<ProductComparison
  initialProducts={products}
  onProductSelect={(selectedProducts) => {
    // Save to local storage
    localStorage.setItem('comparison', JSON.stringify(selectedProducts))

    // Track analytics
    trackEvent('products_compared', {
      count: selectedProducts.length,
      ids: selectedProducts.map(p => p.id)
    })
  }}
/>
```

## Common Use Cases

### 1. Compare from Product List

```tsx
"use client"

import { useState } from "react"
import { ProductComparison } from "@/components/products"
import { ProductCard } from "@/components/products"

export default function CompareFromList({ allProducts }) {
  const [compareList, setCompareList] = useState<Product[]>([])

  const addToComparison = (product: Product) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === product.id)) {
      setCompareList([...compareList, product])
    }
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {allProducts.map(product => (
          <div key={product.id}>
            <ProductCard product={product} />
            <button onClick={() => addToComparison(product)}>
              Add to Compare
            </button>
          </div>
        ))}
      </div>

      {/* Comparison */}
      {compareList.length > 0 && (
        <ProductComparison
          initialProducts={compareList}
          onProductSelect={setCompareList}
        />
      )}
    </div>
  )
}
```

### 2. Shareable Comparison URLs

```tsx
"use client"

import { useSearchParams } from "next/navigation"
import { ProductComparison } from "@/components/products"

export default function ShareableComparison({ allProducts }) {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []
  const products = allProducts.filter(p => ids.includes(p.id))

  return (
    <ProductComparison initialProducts={products} />
  )
}

// URL: /compare?ids=1,2,3
```

### 3. Category Comparison

```tsx
export default function CategoryComparison({ category }) {
  // Filter products by category
  const categoryProducts = allProducts.filter(
    p => p.category === category
  )

  return (
    <div>
      <h1>Compare {category}</h1>
      <ProductComparison
        initialProducts={categoryProducts.slice(0, 3)}
        maxProducts={3}
      />
    </div>
  )
}
```

## Troubleshooting

### Products not showing?
- Check that `initialProducts` is an array
- Verify each product has all required fields
- Check console for errors

### Images not loading?
- Verify image paths are correct
- Check Next.js image domains in `next.config.js`
- Use placeholder images for testing

### Styling looks broken?
- Ensure Tailwind CSS is configured
- Check that shadcn/ui components are installed
- Verify all dependencies are installed

## Next Steps

- See `PRODUCT_COMPARISON_README.md` for full documentation
- Check `product-comparison-example.tsx` for more examples
- Explore customization options
- Add analytics tracking
- Implement product selection UI

## Need Help?

- Check the full README
- Review the example file
- Inspect existing product components
- Verify type definitions in `/types/product.ts`
