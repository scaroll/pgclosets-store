/**
 * Size Guide Modal - Usage Examples
 *
 * This file demonstrates various ways to use the SizeGuideModal component
 * in your product pages and throughout the application.
 */

import React from "react"
import { SizeGuideModal, SizeGuideTrigger } from "./size-guide-modal"

// ============================================================================
// Example 1: Basic Usage with Trigger Button
// ============================================================================
export function BasicSizeGuideExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Product Details</h2>
      <p>View our comprehensive size guide to find the perfect fit.</p>

      {/* Simple trigger button - opens modal when clicked */}
      <SizeGuideTrigger />
    </div>
  )
}

// ============================================================================
// Example 2: Product-Specific Size Guide
// ============================================================================
export function ProductSpecificExample() {
  return (
    <div className="flex gap-4">
      {/* Show only sliding door sizes */}
      <SizeGuideTrigger
        productType="sliding"
        variant="default"
      >
        Sliding Door Sizes
      </SizeGuideTrigger>

      {/* Show only bifold door sizes */}
      <SizeGuideTrigger
        productType="bifold"
        variant="outline"
      >
        Bifold Door Sizes
      </SizeGuideTrigger>

      {/* Show only hinged door sizes */}
      <SizeGuideTrigger
        productType="hinged"
        variant="outline"
      >
        Hinged Door Sizes
      </SizeGuideTrigger>
    </div>
  )
}

// ============================================================================
// Example 3: Manual Control (Controlled Component)
// ============================================================================
export function ControlledExample() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 underline"
      >
        Not sure which size? Click here
      </button>

      <SizeGuideModal
        open={isOpen}
        onOpenChange={setIsOpen}
        productType="all"
      />
    </div>
  )
}

// ============================================================================
// Example 4: In Product Card
// ============================================================================
export function ProductCardExample() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold">Premium Sliding Closet Door</h3>
      <p className="text-sm text-gray-600">Starting at $299.99</p>

      <div className="flex gap-2">
        <button className="flex-1 bg-primary text-white py-2 rounded-md">
          Add to Cart
        </button>
        <SizeGuideTrigger
          productType="sliding"
          variant="outline"
          className="flex-shrink-0"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: As Link in Product Description
// ============================================================================
export function ProductDescriptionExample() {
  const [showSizeGuide, setShowSizeGuide] = React.useState(false)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Product Information</h3>
      <p className="text-sm text-gray-700">
        This premium sliding closet door system features smooth operation and
        elegant design. Available in multiple sizes to fit standard closet openings.{" "}
        <button
          onClick={() => setShowSizeGuide(true)}
          className="text-blue-600 hover:underline font-medium"
        >
          View size guide
        </button>
        {" "}to find the perfect fit for your space.
      </p>

      <SizeGuideModal
        open={showSizeGuide}
        onOpenChange={setShowSizeGuide}
        productType="sliding"
      />
    </div>
  )
}

// ============================================================================
// Example 6: In Product Details Page
// ============================================================================
export function ProductDetailsPageExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-lg" />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Modern Sliding Closet Door</h1>
            <p className="text-2xl font-semibold text-primary mt-2">$349.99</p>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Select Size</label>
              <SizeGuideTrigger
                productType="sliding"
                variant="link"
                className="text-sm"
              />
            </div>
            <select className="w-full p-2 border rounded-md">
              <option>48" × 80"</option>
              <option>60" × 80"</option>
              <option>72" × 80"</option>
              <option>96" × 80"</option>
            </select>
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-md font-semibold">
            Add to Cart
          </button>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              <strong>Need help choosing?</strong> Our size guide includes
              measuring tips and installation requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 7: In Shopping Cart
// ============================================================================
export function ShoppingCartExample() {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded" />
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold">Sliding Closet Door - 72" × 80"</h3>
          <p className="text-sm text-gray-600">
            <button className="text-blue-600 hover:underline">
              Change size
            </button>
            {" • "}
            <SizeGuideTrigger
              productType="sliding"
              variant="link"
              className="text-sm p-0 h-auto"
            >
              View size guide
            </SizeGuideTrigger>
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">$349.99</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 8: Mobile-Optimized Version
// ============================================================================
export function MobileOptimizedExample() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold">Select Your Door Size</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 mb-3">
          Not sure which size you need?
        </p>
        <SizeGuideTrigger
          productType="all"
          variant="default"
          className="w-full"
        >
          View Full Size Guide
        </SizeGuideTrigger>
      </div>

      <select className="w-full p-3 border rounded-lg text-base">
        <option>Choose a size...</option>
        <option>48" × 80" - Small Closet</option>
        <option>60" × 80" - Standard Closet</option>
        <option>72" × 80" - Large Closet</option>
      </select>
    </div>
  )
}

// ============================================================================
// Example 9: FAQ Integration
// ============================================================================
export function FAQIntegrationExample() {
  const [activeGuide, setActiveGuide] = React.useState<{
    open: boolean
    type: "sliding" | "bifold" | "hinged" | "all"
  }>({ open: false, type: "all" })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

      <div className="space-y-3">
        <div className="border-b pb-3">
          <h3 className="font-semibold mb-2">What size door do I need?</h3>
          <p className="text-sm text-gray-700 mb-2">
            The size you need depends on your closet opening dimensions.
            We offer standard sizes for most applications.
          </p>
          <button
            onClick={() => setActiveGuide({ open: true, type: "all" })}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View complete size guide →
          </button>
        </div>

        <div className="border-b pb-3">
          <h3 className="font-semibold mb-2">How do I measure my closet opening?</h3>
          <p className="text-sm text-gray-700 mb-2">
            Accurate measurements are crucial for a perfect fit.
            Our guide includes step-by-step instructions.
          </p>
          <button
            onClick={() => setActiveGuide({ open: true, type: "all" })}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            See measuring instructions →
          </button>
        </div>
      </div>

      <SizeGuideModal
        open={activeGuide.open}
        onOpenChange={(open) => setActiveGuide({ ...activeGuide, open })}
        productType={activeGuide.type}
      />
    </div>
  )
}
