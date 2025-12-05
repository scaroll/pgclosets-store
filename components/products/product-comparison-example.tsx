"use client"

/**
 * Product Comparison Component - Usage Examples
 *
 * This file demonstrates how to use the ProductComparison component
 * in different scenarios.
 */

import { ProductComparison, ProductComparisonCompact } from "./product-comparison"
import type { Product } from "@/types/product"

// ============================================================================
// Example Product Data
// ============================================================================

const exampleProducts: Product[] = [
  {
    id: "1",
    name: "Modern Barn Door - White Oak",
    slug: "modern-barn-door-white-oak",
    category: "barn-doors",
    price: 45900, // $459.00
    salePrice: 39900, // $399.00
    images: [
      "/images/products/barn-door-white-oak.jpg",
      "/images/products/barn-door-white-oak-2.jpg",
    ],
    description: "Premium white oak barn door with modern design",
    features: [
      "Solid white oak construction",
      "Smooth-glide hardware included",
      "Pre-finished with protective coating",
      "Easy installation process",
      "5-year warranty",
    ],
    specifications: {
      Material: "White Oak",
      Thickness: '1.75"',
      Width: '36"',
      Height: '84"',
      Weight: "75 lbs",
      Finish: "Natural",
      Hardware: "Included",
    },
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Contemporary Bifold Door - Espresso",
    slug: "contemporary-bifold-door-espresso",
    category: "bifold-doors",
    price: 35900, // $359.00
    images: [
      "/images/products/bifold-door-espresso.jpg",
      "/images/products/bifold-door-espresso-2.jpg",
    ],
    description: "Space-saving bifold door with rich espresso finish",
    features: [
      "Space-efficient design",
      "Rich espresso finish",
      "Smooth folding mechanism",
      "Pre-drilled for hardware",
      "3-year warranty",
    ],
    specifications: {
      Material: "MDF Core",
      Thickness: '1.375"',
      Width: '32"',
      Height: '80"',
      Weight: "45 lbs",
      Finish: "Espresso",
      Hardware: "Sold Separately",
    },
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    isFeatured: false,
  },
  {
    id: "3",
    name: "Industrial Bypass Door - Black Steel",
    slug: "industrial-bypass-door-black-steel",
    category: "bypass-doors",
    price: 52900, // $529.00
    salePrice: 47900, // $479.00
    images: [
      "/images/products/bypass-door-black-steel.jpg",
      "/images/products/bypass-door-black-steel-2.jpg",
    ],
    description: "Industrial-style bypass door with black steel frame",
    features: [
      "Durable black steel frame",
      "Tempered glass panels",
      "Dual-track system included",
      "Modern industrial aesthetic",
      "10-year warranty",
    ],
    specifications: {
      Material: "Steel & Glass",
      Thickness: '2"',
      Width: '72"',
      Height: '84"',
      Weight: "120 lbs",
      Finish: "Matte Black",
      Hardware: "Included",
    },
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
]

// ============================================================================
// Example 1: Basic Comparison (2-3 products)
// ============================================================================

export function BasicComparisonExample() {
  return (
    <div className="container mx-auto py-12 px-4">
      <ProductComparison
        initialProducts={exampleProducts}
        maxProducts={3}
        onProductSelect={(products) => {
          console.log("Selected products:", products)
        }}
      />
    </div>
  )
}

// ============================================================================
// Example 2: Limited Comparison (2 products only)
// ============================================================================

export function TwoProductComparisonExample() {
  return (
    <div className="container mx-auto py-12 px-4">
      <ProductComparison
        initialProducts={exampleProducts.slice(0, 2)}
        maxProducts={2}
        onProductSelect={(products) => {
          console.log("Comparing two products:", products)
        }}
      />
    </div>
  )
}

// ============================================================================
// Example 3: Mobile-Friendly Compact View
// ============================================================================

export function CompactComparisonExample() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">
        Compare Products (Mobile View)
      </h2>
      <ProductComparisonCompact
        initialProducts={exampleProducts.slice(0, 2)}
      />
    </div>
  )
}

// ============================================================================
// Example 4: Responsive Comparison
// (Desktop: Full table, Mobile: Compact view)
// ============================================================================

export function ResponsiveComparisonExample() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <ProductComparison
          initialProducts={exampleProducts}
          maxProducts={3}
        />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <h2 className="text-2xl font-bold mb-6">Compare Products</h2>
        <ProductComparisonCompact
          initialProducts={exampleProducts.slice(0, 2)}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Integration with Product List
// ============================================================================

export function ProductListWithComparisonExample() {
  // In a real app, you would manage this state and allow users to select
  // products from a list to add to comparison

  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      {/* Product Selection Area */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Select Products to Compare</h2>
        <p className="text-muted-foreground mb-6">
          Click on products to add them to comparison (max 3)
        </p>
        {/* Product grid would go here */}
      </div>

      {/* Comparison Area */}
      <div>
        <ProductComparison
          initialProducts={exampleProducts}
          maxProducts={3}
          onProductSelect={(products) => {
            // Handle product selection changes
            console.log("Comparison updated:", products)
          }}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Default Export
// ============================================================================

export default BasicComparisonExample
