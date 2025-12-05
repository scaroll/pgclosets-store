# Size Guide Modal - Integration Guide

Quick guide for integrating the Size Guide Modal into existing product pages.

## 🎯 Quick Integration Checklist

- [ ] Import the component
- [ ] Add trigger button to product page
- [ ] Configure product type (optional)
- [ ] Test on mobile and desktop
- [ ] Verify accessibility

## 📍 Where to Add the Size Guide

### 1. Product Detail Page (Recommended)

**File:** `/app/(shop)/products/[slug]/page.tsx`

**Location:** Near the size/variant selector

```tsx
import { SizeGuideTrigger } from "@/components/products/size-guide-modal"

// Inside your product detail component:
<div className="space-y-4">
  {/* Size Selection */}
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label htmlFor="size">Select Size</Label>
      <SizeGuideTrigger
        productType="sliding" // or "bifold", "hinged", "all"
        variant="link"
        className="text-sm"
      />
    </div>
    <Select>
      <SelectTrigger id="size">
        <SelectValue placeholder="Choose a size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="48x80">48" × 80"</SelectItem>
        <SelectItem value="60x80">60" × 80"</SelectItem>
        <SelectItem value="72x80">72" × 80"</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
```

### 2. Product Card (Collections/Category Pages)

**File:** `/components/products/product-card.tsx`

**Location:** In the product actions section

```tsx
import { SizeGuideTrigger } from "./size-guide-modal"

// Add to ProductCard component:
<div className="flex gap-2 mt-4">
  <AddToCartButton className="flex-1" />
  <SizeGuideTrigger
    productType={getProductType(product.category)}
    variant="outline"
    className="flex-shrink-0"
  >
    📏
  </SizeGuideTrigger>
</div>

// Helper function to determine product type:
function getProductType(category?: string): "sliding" | "bifold" | "hinged" | "all" {
  const cat = category?.toLowerCase() || ""
  if (cat.includes("sliding")) return "sliding"
  if (cat.includes("bifold")) return "bifold"
  if (cat.includes("hinged")) return "hinged"
  return "all"
}
```

### 3. Product Variants Component

**File:** `/components/products/product-variants.tsx`

**Location:** Above or below variant selection

```tsx
import { SizeGuideTrigger } from "./size-guide-modal"

// Add near variant selector:
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h3 className="font-semibold">Select Size</h3>
    <SizeGuideTrigger
      productType={productType}
      variant="link"
      className="text-sm"
    />
  </div>
  {/* Variant options */}
</div>
```

### 4. Shopping Cart Page

**File:** `/app/(shop)/cart/page.tsx`

**Location:** In cart item details

```tsx
import { SizeGuideTrigger } from "@/components/products/size-guide-modal"

// In cart item rendering:
<div className="text-sm text-muted-foreground">
  Size: {item.size}
  {" • "}
  <SizeGuideTrigger
    productType="all"
    variant="link"
    className="inline-flex items-center gap-1 text-sm p-0 h-auto"
  >
    View size guide
  </SizeGuideTrigger>
</div>
```

### 5. Product Quick View Modal

**File:** `/components/products/product-quick-view.tsx`

**Location:** In the product details section

```tsx
import { SizeGuideTrigger } from "./size-guide-modal"

// Add to quick view modal:
<div className="space-y-4">
  {/* Product info */}

  <div className="flex gap-2">
    <AddToCartButton className="flex-1" />
    <SizeGuideTrigger
      productType="sliding"
      variant="outline"
    />
  </div>

  <p className="text-xs text-muted-foreground text-center">
    Not sure which size?{" "}
    <SizeGuideTrigger
      productType="sliding"
      variant="link"
      className="text-xs p-0 h-auto inline"
    >
      View our sizing guide
    </SizeGuideTrigger>
  </p>
</div>
```

## 🎨 Styling Patterns

### As Primary Button

```tsx
<SizeGuideTrigger
  variant="default"
  className="w-full md:w-auto"
>
  View Size Guide
</SizeGuideTrigger>
```

### As Secondary/Outline Button

```tsx
<SizeGuideTrigger
  variant="outline"
  className="border-gray-300"
>
  Size Guide
</SizeGuideTrigger>
```

### As Text Link

```tsx
<SizeGuideTrigger
  variant="link"
  className="text-sm text-blue-600"
>
  Not sure? View size guide
</SizeGuideTrigger>
```

### As Icon-Only Button

```tsx
<SizeGuideTrigger
  variant="outline"
  className="w-10 h-10 p-0"
>
  📏
</SizeGuideTrigger>
```

### Inline with Text

```tsx
<p className="text-sm">
  Choose your size or{" "}
  <SizeGuideTrigger
    variant="link"
    className="inline p-0 h-auto text-sm"
  >
    view our size guide
  </SizeGuideTrigger>
  {" "}for help.
</p>
```

## 🔍 Product Type Mapping

Map your product categories to door types:

```tsx
// utils/product-helpers.ts
export function getProductDoorType(
  product: { category?: string; name?: string }
): "sliding" | "bifold" | "hinged" | "all" {
  const text = `${product.category} ${product.name}`.toLowerCase()

  if (text.includes("sliding")) return "sliding"
  if (text.includes("bifold") || text.includes("bi-fold")) return "bifold"
  if (text.includes("hinged") || text.includes("swing")) return "hinged"

  return "all"
}

// Usage:
<SizeGuideTrigger
  productType={getProductDoorType(product)}
/>
```

## 📱 Mobile Optimization

For mobile product pages, consider a full-width button:

```tsx
<div className="mt-4">
  <SizeGuideTrigger
    productType="sliding"
    variant="outline"
    className="w-full sm:w-auto"
  >
    📏 View Size Guide
  </SizeGuideTrigger>
</div>
```

## ⚡ Performance Tips

1. **Code Splitting**: The modal is already lazy-loaded via Dialog component
2. **Conditional Rendering**: Only show for products that need sizing
3. **SSR**: Component is client-side only (`"use client"` directive)

```tsx
// Only show for door products
{product.requiresSizing && (
  <SizeGuideTrigger productType={product.doorType} />
)}
```

## 🧪 Testing Integration

After integrating, test:

```tsx
// Test checklist
✅ Modal opens when button is clicked
✅ Correct door type is shown (sliding/bifold/hinged)
✅ Modal is responsive on mobile
✅ Close button works
✅ ESC key closes modal
✅ Click outside closes modal
✅ All tabs are accessible
✅ Links work correctly
✅ Keyboard navigation works
```

## 🎯 Common Integration Patterns

### Pattern 1: Size Selector with Guide

```tsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <Label>Size</Label>
    <SizeGuideTrigger
      productType="sliding"
      variant="link"
      className="text-sm"
    />
  </div>
  <Select>
    {/* size options */}
  </Select>
  <p className="text-xs text-muted-foreground">
    Measure your opening carefully before ordering
  </p>
</div>
```

### Pattern 2: Help Banner

```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <p className="text-sm text-blue-900 mb-2">
    <strong>Need help choosing the right size?</strong>
  </p>
  <SizeGuideTrigger
    productType="all"
    variant="default"
    className="w-full sm:w-auto"
  >
    View Size Guide & Measuring Tips
  </SizeGuideTrigger>
</div>
```

### Pattern 3: Two-Step Size Selection

```tsx
<div className="space-y-4">
  <div className="border rounded-lg p-4 bg-gray-50">
    <h3 className="font-semibold mb-2">Step 1: Measure Your Opening</h3>
    <SizeGuideTrigger
      productType="sliding"
      variant="outline"
      className="w-full"
    >
      View Measurement Guide
    </SizeGuideTrigger>
  </div>

  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-2">Step 2: Select Your Size</h3>
    <Select>
      {/* size options */}
    </Select>
  </div>
</div>
```

## 🔗 Next Steps

1. Add to your main product detail page
2. Integrate into product cards (optional)
3. Add to quick view modal (optional)
4. Test on various devices
5. Monitor user engagement with analytics

## 📞 Support

For integration help:
- Review examples in `size-guide-modal-example.tsx`
- Check the main README in `SIZE_GUIDE_MODAL_README.md`
- Test locally before deploying

---

**Quick Start:** Just import `SizeGuideTrigger` and add it near your size selector!
