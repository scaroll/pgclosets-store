# Size Guide Modal Component

A comprehensive, accessible modal component for displaying door sizing information, measuring instructions, and helpful tips for customers selecting closet doors.

## 📁 Location

`/home/user/pgclosets-store/components/products/size-guide-modal.tsx`

## ✨ Features

- **📊 Comprehensive Size Charts** - Displays size charts for sliding, bifold, and hinged doors
- **📏 Visual Measurement Diagram** - SVG illustration showing how to measure door openings
- **💡 Step-by-Step Instructions** - Clear, numbered steps for measuring closet openings
- **❓ Tips & FAQs** - Common questions and best practices
- **🎨 Apple-Style Design** - Follows the existing design system with rounded corners and clean aesthetics
- **📱 Responsive Layout** - Fully responsive, works on mobile, tablet, and desktop
- **♿ Accessible** - Built on Radix UI Dialog with proper ARIA attributes
- **🎯 Product-Specific Filtering** - Can show size charts for specific door types or all types

## 🚀 Quick Start

### Basic Usage

```tsx
import { SizeGuideTrigger } from "@/components/products/size-guide-modal"

export function ProductPage() {
  return (
    <div>
      <h1>Product Details</h1>
      {/* Simple trigger button */}
      <SizeGuideTrigger />
    </div>
  )
}
```

### Product-Specific Size Guide

```tsx
import { SizeGuideTrigger } from "@/components/products/size-guide-modal"

export function SlidingDoorProduct() {
  return (
    <SizeGuideTrigger
      productType="sliding"
      variant="outline"
    >
      View Sliding Door Sizes
    </SizeGuideTrigger>
  )
}
```

### Controlled Modal (Manual Control)

```tsx
import { SizeGuideModal } from "@/components/products/size-guide-modal"
import { useState } from "react"

export function CustomTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Need help choosing a size?
      </button>

      <SizeGuideModal
        open={open}
        onOpenChange={setOpen}
        productType="all"
      />
    </>
  )
}
```

## 📖 Component API

### `<SizeGuideModal />`

The main modal component with controlled open/close state.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | Required | Controls whether the modal is open |
| `onOpenChange` | `(open: boolean) => void` | Required | Callback when modal open state changes |
| `productType` | `"sliding" \| "bifold" \| "hinged" \| "all"` | `"all"` | Which door types to show in size chart |

**Example:**

```tsx
<SizeGuideModal
  open={isOpen}
  onOpenChange={setIsOpen}
  productType="sliding"
/>
```

### `<SizeGuideTrigger />`

Convenience component that combines a button trigger with the modal.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `productType` | `"sliding" \| "bifold" \| "hinged" \| "all"` | `"all"` | Which door types to show in size chart |
| `variant` | `"default" \| "outline" \| "link" \| "ghost"` | `"outline"` | Button variant style |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | "Size Guide" with icon | Custom button content |

**Example:**

```tsx
<SizeGuideTrigger
  productType="bifold"
  variant="default"
  className="w-full"
>
  Bifold Door Sizing
</SizeGuideTrigger>
```

## 📋 Modal Content

The modal includes three tabs:

### 1. Size Chart Tab

- **Standard sizes** for sliding, bifold, and hinged doors
- Opening width and height ranges
- Door configurations (2-panel, 4-panel, etc.)
- Recommended sizes for each opening range
- Special callouts for custom sizes

### 2. How to Measure Tab

- **Visual diagram** showing measurement points (width, height, diagonal)
- **5-step measurement guide**:
  1. Measure the Width
  2. Measure the Height
  3. Check the Depth
  4. Verify Squareness
  5. Account for Obstructions
- **Tools needed** checklist (tape measure, level, etc.)

### 3. Tips & FAQs Tab

- **Pro tips** with visual indicators:
  - Always round down
  - Measure twice, order once
  - Consider professional help
  - Watch for tolerances
- **Common questions**:
  - Custom sizing availability
  - Clearance requirements
  - Out-of-square openings
  - Professional measurement services

## 🎨 Design System Integration

The component follows the established design patterns:

- **Rounded corners** (`rounded-lg`, `rounded-2xl`) matching Apple-style aesthetics
- **Consistent spacing** using Tailwind space utilities
- **Color scheme** using design system tokens (`primary`, `muted-foreground`, etc.)
- **Icons** from lucide-react library
- **Responsive design** with mobile-first approach
- **Hover states** for interactive elements

## 🎯 Use Cases

### Product Detail Pages

```tsx
<div className="space-y-4">
  <label>Select Size</label>
  <select>
    <option>48" × 80"</option>
    <option>60" × 80"</option>
  </select>
  <SizeGuideTrigger
    productType="sliding"
    variant="link"
    className="text-sm"
  />
</div>
```

### Shopping Cart

```tsx
<div className="cart-item">
  <h3>Sliding Door - 72" × 80"</h3>
  <SizeGuideTrigger
    productType="sliding"
    variant="link"
    className="text-sm"
  >
    View size guide
  </SizeGuideTrigger>
</div>
```

### Product Cards

```tsx
<div className="product-card">
  <h3>Premium Sliding Door</h3>
  <div className="actions">
    <button>Add to Cart</button>
    <SizeGuideTrigger productType="sliding" />
  </div>
</div>
```

### Help Center / FAQ

```tsx
<div className="faq">
  <h3>What size door do I need?</h3>
  <p>Click to view our comprehensive sizing guide</p>
  <SizeGuideTrigger variant="default" />
</div>
```

## 🔧 Customization

### Custom Trigger Button

```tsx
<SizeGuideTrigger
  productType="sliding"
  variant="outline"
  className="w-full md:w-auto border-2 font-bold"
>
  📏 Find My Size
</SizeGuideTrigger>
```

### Custom Modal Control

```tsx
function CustomSizeGuide() {
  const [open, setOpen] = useState(false)

  // Open from anywhere in your component
  const handleNeedHelp = () => {
    setOpen(true)
  }

  return (
    <>
      <p>
        Not sure? <button onClick={handleNeedHelp}>Get help</button>
      </p>

      <SizeGuideModal
        open={open}
        onOpenChange={setOpen}
        productType="all"
      />
    </>
  )
}
```

## 📊 Size Chart Data

The component includes pre-configured size charts for:

### Sliding Doors
- 48" - 60" openings → 48" × 80" doors
- 60" - 72" openings → 60" × 80" doors
- 72" - 84" openings → 72" × 80" doors
- 84" - 96" openings → 96" × 80" doors
- 96" - 144" openings → Custom quote required

### Bifold Doors
- 24" - 36" openings → 30" × 80" doors (2-panel)
- 36" - 48" openings → 36" × 80" doors (2-panel)
- 48" - 72" openings → 60" × 80" doors (4-panel)
- 72" - 96" openings → 84" × 80" doors (4-6 panel)

### Hinged Doors
- 24" - 32" openings → 30" × 80" doors (single)
- 48" - 60" openings → 60" × 80" doors (double)
- 60" - 72" openings → 72" × 80" doors (double)

## 🔗 Related Links

The modal includes CTAs to:

- **Request Professional Measurement** - `/request-quote` page
- **View Full Installation Guide** - `/installation-guide` page
- **Contact Support** - Phone and contact page links

## ♿ Accessibility Features

- ✅ Keyboard navigation support (Radix UI Dialog)
- ✅ Focus management and focus trapping
- ✅ ARIA labels and descriptions
- ✅ Screen reader friendly
- ✅ ESC key to close
- ✅ Click outside to close
- ✅ Proper heading hierarchy
- ✅ Color contrast compliant

## 📱 Responsive Behavior

- **Mobile** (< 640px): Full-width modal, stacked layout, simplified tables
- **Tablet** (640px - 1024px): 2-column grid in measurement section
- **Desktop** (> 1024px): Full layout with max-width of 5xl (80rem)

## 🧪 Testing Recommendations

```tsx
// Example test cases
describe('SizeGuideModal', () => {
  test('opens when trigger is clicked')
  test('closes when close button is clicked')
  test('closes when ESC key is pressed')
  test('displays correct tab content')
  test('filters size chart by product type')
  test('renders measurement diagram')
  test('has proper ARIA attributes')
})
```

## 📝 Additional Examples

See `size-guide-modal-example.tsx` for 9 comprehensive usage examples including:

1. Basic usage with trigger button
2. Product-specific size guides
3. Manual control (controlled component)
4. Integration in product cards
5. Link in product descriptions
6. Product details page integration
7. Shopping cart integration
8. Mobile-optimized versions
9. FAQ integration

## 🚀 Future Enhancements

Potential improvements:

- [ ] Add print functionality for size guide
- [ ] Include measurement video tutorials
- [ ] Add AR measurement tool integration
- [ ] Support for metric measurements
- [ ] Downloadable PDF version
- [ ] Size calculator/recommendation tool
- [ ] Multi-language support
- [ ] Animation for tab transitions

## 📞 Support

For questions or issues:
- Check the examples in `size-guide-modal-example.tsx`
- Review the installation guide at `/installation-guide`
- Contact support for custom requirements

---

**Component Version:** 1.0.0
**Last Updated:** 2025-12-04
**Maintainer:** PG Closets Development Team
