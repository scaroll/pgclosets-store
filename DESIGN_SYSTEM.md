# PG Closets Design System

**Version:** 2.0
**Last Updated:** 2025-10
**Philosophy:** Apple-inspired premium design with accessibility-first approach

---

## Quick Reference

| **Element** | **Primary** | **Usage** |
|------------|-------------|-----------|
| Font Display | SF Pro Display | Headlines ≥20px |
| Font Body | SF Pro Text | Body text <20px |
| Primary Color | `#0071e3` | CTAs, links, focus |
| Base Spacing | `8px` | All spacing increments |
| Border Radius | `10px` / `18px` / `980px` | Buttons / Cards / Pills |
| Touch Target | `44px` minimum | All interactive elements |
| Shadow Elevation | `shadow-sm` → `shadow-2xl` | 6-level system |

---

## 1. Color System

### Primary Palette - Apple Neutrals

```css
/* Light Mode */
--apple-gray-50: #fafafa      /* Subtle backgrounds */
--apple-gray-100: #f5f5f7     /* Secondary backgrounds */
--apple-gray-200: #e8e8ed     /* Separators */
--apple-gray-300: #d2d2d7     /* Borders */
--apple-gray-500: #86868b     /* Secondary text */
--apple-gray-900: #1d1d1f     /* Primary text */

/* Dark Mode */
--bg-primary: #000000         /* Pure black (OLED) */
--text-primary: #f5f5f7       /* High contrast text */
```

### Accent Colors

| Color | Value | Usage |
|-------|-------|-------|
| **Apple Blue** | `#0071e3` | Primary actions, links |
| **Success Green** | `#30d158` | Success states, confirmations |
| **Warning Orange** | `#ff9500` | Warnings, alerts |
| **Error Red** | `#ff3b30` | Errors, destructive actions |
| **Info Teal** | `#40c8e0` | Information, tips |

### Brand Colors - Closet Industry

```css
/* Woodgrain Collection */
--woodgrain-500: #8B7355    /* Medium walnut */
--woodgrain-700: #5A4836    /* Dark walnut */

/* Metal Accents */
--metal-DEFAULT: #A8A8A8    /* Brushed aluminum */
--metal-rose-gold: #B76E79  /* Premium hardware */
--metal-bronze: #CD7F32     /* Classic hardware */

/* Premium Finishes */
--premium-cream: #F5F1EA
--premium-marble: #F8F8F8
--premium-onyx: #1A1A1A
```

### Usage Guidelines

**✅ DO:**
- Use Apple Blue (`#0071e3`) for primary CTAs
- Use neutrals (`gray-50` to `gray-900`) for 90% of UI
- Apply brand colors sparingly for accent and context
- Maintain 4.5:1 contrast ratio (WCAG AA) minimum

**❌ DON'T:**
- Mix multiple accent colors in single component
- Use pure black `#000000` for text (use `gray-900`)
- Override semantic colors (success, error, etc.)
- Use woodgrain/metal colors for interactive elements

---

## 2. Typography System

### Font Families

```css
/* Headlines & Display Text (≥20px) */
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body & UI Text (<20px) */
font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale

| Class | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `apple-hero` | 80px | 1.0 | 600 | Hero sections |
| `apple-display` | 48px | 1.05 | 600 | Page titles |
| `apple-title-1` | 40px | 1.1 | 400 | Section headers |
| `apple-title-2` | 32px | 1.1 | 400 | Subsections |
| `apple-headline` | 24px | 1.2 | 600 | Card headers |
| `apple-body` | 17px | 1.47 | 400 | Default body text |
| `apple-subhead` | 15px | 1.33 | 400 | Secondary text |
| `apple-footnote` | 13px | 1.38 | 400 | Supporting text |
| `apple-caption-1` | 12px | 1.33 | 400 | Labels, metadata |

### Responsive Typography

```tsx
// Mobile: Scales down automatically
<h1 className="apple-hero">    // 48px on mobile
<h1 className="apple-display">  // 32px on mobile

// Desktop: Full size
<h1 className="apple-hero">    // 80px on desktop
```

### Usage Examples

```tsx
// Hero Section
<h1 className="apple-hero font-semibold text-apple-gray-900 dark:text-white">
  Premium Custom Closets
</h1>

// Body Text
<p className="apple-body text-apple-gray-600 dark:text-apple-gray-400">
  Transform your space with our custom storage solutions.
</p>

// Supporting Text
<span className="apple-footnote text-apple-gray-500">
  Free consultation • Ottawa area
</span>
```

---

## 3. Spacing System

**Base Unit:** 8px grid system

### Spacing Scale

```css
--space-1: 4px    (0.5× base)
--space-2: 8px    (1× base)
--space-3: 12px   (1.5× base)
--space-4: 16px   (2× base)
--space-6: 24px   (3× base)
--space-8: 32px   (4× base)
--space-12: 48px  (6× base)
--space-16: 64px  (8× base)
--space-24: 96px  (12× base)
```

### Component Spacing

| Context | Spacing | Usage |
|---------|---------|-------|
| Button padding | `px-6` (24px) | Horizontal padding |
| Card padding | `p-6 md:p-8` | 24px mobile, 32px desktop |
| Section padding | `py-16 md:py-24` | Vertical rhythm |
| Component gap | `gap-4` (16px) | Between elements |
| Stack spacing | `space-y-6` (24px) | Vertical content |

### Usage Examples

```tsx
// Card Component
<div className="p-6 md:p-8">  // Responsive padding

// Button Group
<div className="flex gap-4">  // 16px gap between buttons

// Section Spacing
<section className="py-16 md:py-24">  // 64px mobile, 96px desktop
```

---

## 4. Component Library

### AppleButton

**Variants:** `primary` | `secondary` | `tertiary` | `ghost` | `outline` | `destructive`
**Sizes:** `sm` (32px) | `md` (44px) | `lg` (56px)

```tsx
// Primary CTA
<AppleButton variant="primary" size="md">
  Book Consultation
</AppleButton>

// Secondary Action
<AppleButton variant="secondary" size="md" icon={<Calendar />}>
  Schedule Visit
</AppleButton>

// With Loading State
<AppleButton variant="primary" loading={isSubmitting}>
  Submit Quote
</AppleButton>

// Icon-Only (ensure 44px minimum)
<AppleButton variant="ghost" size="md" aria-label="Close">
  <X className="w-5 h-5" />
</AppleButton>
```

**Visual States:**
- **Default:** Subtle shadow, Apple blue gradient
- **Hover:** Lifts 1px, increases shadow
- **Active:** Scales to 98%, deepens color
- **Loading:** Shows spinner, content opacity 0
- **Disabled:** 40% opacity, no pointer events

### AppleCard

**Variants:** `default` | `elevated` | `glass` | `dark` | `gradient` | `featured` | `link`

```tsx
// Default Card
<AppleCard variant="default">
  <CardHeader>
    <CardTitle>Custom Closet Systems</CardTitle>
    <CardDescription>Transform your storage space</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Premium materials and expert installation...</p>
  </CardContent>
  <CardFooter>
    <AppleButton variant="primary">Learn More</AppleButton>
  </CardFooter>
</AppleCard>

// Glass Morphism Card
<AppleCard variant="glass" hover={true} glow={true}>
  <CardContent>
    Overlay content with backdrop blur
  </CardContent>
</AppleCard>

// Interactive Link Card
<AppleCard variant="link" tilt={true}>
  <a href="/products" className="block">
    <CardTitle>Browse Products</CardTitle>
  </a>
</AppleCard>
```

**Features:**
- `hover`: Lifts on hover (-4px)
- `glass`: Backdrop blur + transparency
- `tilt`: 3D rotation on mouse move
- `glow`: Border gradient animation
- `abVariant`: A/B test visual styles

---

## 5. Shadows & Elevation

**6-Level Shadow System**

```css
/* Light Mode */
shadow-xs:   0 1px 2px rgba(0,0,0,0.05)     // Subtle elements
shadow-sm:   0 2px 4px rgba(0,0,0,0.06)     // Cards, buttons
shadow-md:   0 4px 8px rgba(0,0,0,0.08)     // Dropdowns
shadow-lg:   0 8px 16px rgba(0,0,0,0.1)     // Modals
shadow-xl:   0 16px 32px rgba(0,0,0,0.12)   // Major surfaces
shadow-2xl:  0 24px 48px rgba(0,0,0,0.16)   // Maximum depth

/* Elevated (compound shadows) */
shadow-elevated: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)
```

**Usage Hierarchy:**
1. Buttons: `shadow-sm` → `hover:shadow-md`
2. Cards: `shadow-md` → `hover:shadow-lg`
3. Modals: `shadow-xl` or `shadow-elevated`
4. Popovers: `shadow-lg`

---

## 6. Border Radius

```css
/* Standard Radii */
--radius-sm: 4px      // Inputs, small elements
--radius-md: 8px      // Default components
--radius-lg: 12px     // Large components
--radius-xl: 16px     // Extra large

/* Apple Specific */
--apple-sm: 6px       // Compact buttons
--apple: 10px         // Standard buttons
--apple-lg: 16px      // Cards
--radius-full: 9999px // Pills (buttons)

/* Implementation */
rounded-[10px]        // Standard button
rounded-[18px]        // Small card
rounded-[24px]        // Large card
rounded-full          // Pill button
```

---

## 7. Animations & Transitions

### Apple Easing Functions

```typescript
export const EASING = {
  standard: [0.4, 0, 0.2, 1],          // Default ease-in-out
  applePhysics: {                       // Spring physics
    type: 'spring',
    stiffness: 300,
    damping: 30
  }
}

export const DURATION = {
  fast: 150,      // Instant feedback
  normal: 250,    // Standard transitions
  slow: 350,      // Emphasized motion
  slower: 500     // Major state changes
}
```

### Common Patterns

```tsx
// Hover Lift
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
>

// Button Press
<motion.button
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300 }}
>

// Fade In
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
>
```

---

## 8. Accessibility Standards

### WCAG Compliance

- **AA Level:** 4.5:1 contrast for normal text
- **AAA Level:** 7:1 contrast for enhanced readability
- **Touch Targets:** 44×44px minimum (iOS/Android standard)
- **Focus Indicators:** 2px solid ring, 2px offset

### Implementation

```tsx
// Focus Ring
className="focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2"

// Screen Reader Text
<span className="sr-only">Close menu</span>

// ARIA Labels
<button aria-label="Open navigation menu">
  <Menu className="w-6 h-6" />
</button>

// Semantic HTML
<nav aria-label="Main navigation">
<main id="main-content">
<aside aria-label="Sidebar">
```

### Color Contrast Examples

| **Combination** | **Ratio** | **Level** |
|-----------------|-----------|-----------|
| `gray-900` on `white` | 20.7:1 | AAA |
| `blue-500` on `white` | 4.8:1 | AA |
| `gray-600` on `white` | 7.4:1 | AAA |
| `white` on `blue-500` | 4.5:1 | AA |

---

## 9. Responsive Breakpoints

**Apple Device-Aligned Breakpoints**

```typescript
screens: {
  'sm': '430px',   // iPhone 14 Pro
  'md': '744px',   // iPad Mini / Navigation breakpoint
  'lg': '1068px',  // MacBook Air
  'xl': '1440px',  // iMac / Desktop standard
}
```

### Container Widths

```tsx
// Responsive Container
<div className="container-default">  // Max 1440px, auto padding

// Explicit Sizes
<div className="container-sm">       // Max 640px
<div className="container-lg">       // Max 1024px
<div className="container-2xl">      // Max 1440px
```

### Mobile-First Approach

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">

// Hide on mobile, show on desktop
<div className="hidden md:block">

// Responsive spacing
<section className="py-12 md:py-24">  // 48px mobile, 96px desktop
```

---

## 10. Common Patterns

### Hero Section

```tsx
<section className="py-16 md:py-24 bg-gradient-bg-light dark:bg-gradient-bg-dark">
  <div className="container-default">
    <h1 className="apple-hero font-semibold text-apple-gray-900 dark:text-white mb-6">
      Premium Custom Closets
    </h1>
    <p className="apple-body-large text-apple-gray-600 dark:text-apple-gray-400 mb-8 max-w-2xl">
      Transform your space with expertly crafted storage solutions.
    </p>
    <div className="flex gap-4">
      <AppleButton variant="primary" size="lg">Book Consultation</AppleButton>
      <AppleButton variant="secondary" size="lg">View Gallery</AppleButton>
    </div>
  </div>
</section>
```

### Product Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {products.map(product => (
    <AppleCard key={product.id} variant="default" hover>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={product.image} alt={product.name} className="rounded-lg" />
      </CardContent>
      <CardFooter>
        <AppleButton variant="primary" className="w-full">
          View Details
        </AppleButton>
      </CardFooter>
    </AppleCard>
  ))}
</div>
```

### Form Layout

```tsx
<form className="space-y-6 max-w-lg">
  <div className="space-y-2">
    <label htmlFor="name" className="apple-subhead font-medium">
      Full Name
    </label>
    <input
      id="name"
      type="text"
      className="input w-full"
      placeholder="John Smith"
    />
  </div>

  <div className="space-y-2">
    <label htmlFor="email" className="apple-subhead font-medium">
      Email Address
    </label>
    <input
      id="email"
      type="email"
      className="input w-full"
      placeholder="john@example.com"
    />
  </div>

  <AppleButton type="submit" variant="primary" className="w-full">
    Submit
  </AppleButton>
</form>
```

---

## 11. Anti-Patterns (DON'T)

**Typography:**
- ❌ Don't use multiple font families in single view
- ❌ Don't use font sizes outside the type scale
- ❌ Don't set line-height below 1.2 for body text
- ❌ Don't use all-caps for paragraphs (brief labels OK)

**Colors:**
- ❌ Don't use multiple accent colors in same component
- ❌ Don't use pure black `#000` for text (use `gray-900`)
- ❌ Don't ignore contrast ratios (4.5:1 minimum)
- ❌ Don't override semantic colors arbitrarily

**Spacing:**
- ❌ Don't use arbitrary spacing values (stick to 8px grid)
- ❌ Don't mix padding/margin units (`px` vs `rem`)
- ❌ Don't create touch targets smaller than 44px
- ❌ Don't stack multiple `space-y-*` utilities

**Components:**
- ❌ Don't nest multiple `AppleCard` components
- ❌ Don't use `variant="primary"` for destructive actions
- ❌ Don't override component internals with `!important`
- ❌ Don't disable hover effects on interactive elements

---

## 12. Migration Guide

### From Old Patterns → Design System

| **Old Pattern** | **New Pattern** | **Reason** |
|-----------------|-----------------|------------|
| `<button className="btn-primary">` | `<AppleButton variant="primary">` | Consistent animations, states |
| `<div className="card">` | `<AppleCard variant="default">` | Apple design language |
| `className="text-3xl font-bold"` | `className="apple-title-1"` | Standardized type scale |
| `className="p-4 shadow-md"` | `<AppleCard>` with default padding | Consistent card treatment |
| Custom blue colors | `text-apple-blue-500` | Brand consistency |
| `rounded-lg` | `rounded-[10px]` (buttons) | Apple precision |
| Arbitrary spacing | `gap-6`, `py-8` | 8px grid system |

### Step-by-Step Migration

1. **Audit Current Usage**
   ```bash
   # Find old button patterns
   grep -r "btn-primary" components/

   # Find arbitrary colors
   grep -r "bg-\[#" components/
   ```

2. **Replace Components**
   ```tsx
   // Before
   <button className="btn-primary px-6 py-3">Click Me</button>

   // After
   <AppleButton variant="primary" size="md">Click Me</AppleButton>
   ```

3. **Update Typography**
   ```tsx
   // Before
   <h1 className="text-5xl font-bold">Headline</h1>

   // After
   <h1 className="apple-display">Headline</h1>
   ```

4. **Standardize Spacing**
   ```tsx
   // Before
   <div className="p-5 mb-7">

   // After
   <div className="p-6 mb-8">  // 24px, 32px (8px grid)
   ```

5. **Test & Validate**
   - ✅ Run type checker: `npm run type-check`
   - ✅ Check contrast ratios in DevTools
   - ✅ Test touch targets on mobile (44px min)
   - ✅ Verify responsive breakpoints

---

## 13. Migration Checklist

### Pre-Migration
- [ ] Audit existing components for patterns
- [ ] Document custom implementations to preserve
- [ ] Set up design system imports in all files
- [ ] Review accessibility requirements

### Component Migration
- [ ] Replace `<button>` with `<AppleButton>`
- [ ] Replace card wrappers with `<AppleCard>`
- [ ] Update typography classes to Apple type scale
- [ ] Standardize spacing to 8px grid
- [ ] Replace custom colors with design tokens

### Testing
- [ ] Visual regression testing (Percy/Chromatic)
- [ ] Lighthouse accessibility audit (score >90)
- [ ] Mobile device testing (iOS/Android)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Keyboard navigation testing

### Post-Migration
- [ ] Remove old CSS files/utilities
- [ ] Update documentation
- [ ] Train team on new patterns
- [ ] Monitor analytics for UX impact

---

## 14. Resources

### File Locations

```
/tailwind.config.ts          # Design tokens, breakpoints
/app/globals.css             # Base styles, utilities
/styles/apple-typography.css # Typography system
/styles/apple-colors.css     # Color palette
/styles/apple-spacing.css    # Spacing system
/components/ui/AppleButton.tsx  # Button component
/components/ui/AppleCard.tsx    # Card component
```

### Quick Start

```bash
# Install dependencies
npm install framer-motion lucide-react

# Import components
import { AppleButton } from '@/components/ui/AppleButton'
import { AppleCard } from '@/components/ui/AppleCard'

# Use design tokens
className="text-apple-blue-500 bg-apple-gray-100"
```

### Support

- **Questions:** Check component source files for full API
- **Issues:** File in project repo with `design-system` label
- **Requests:** Propose new patterns in team design reviews

---

**Built with inspiration from Apple's Human Interface Guidelines**
**Optimized for Ottawa luxury market with premium, accessible design**
