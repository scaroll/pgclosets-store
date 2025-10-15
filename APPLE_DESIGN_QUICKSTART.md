# Apple Design System - Quick Start Guide

Get up and running with the Apple Design System in 5 minutes.

## 🚀 Installation

### 1. Import CSS Files

Add to your `app/layout.tsx` or `app/globals.css`:

```typescript
// In app/layout.tsx
import '../styles/apple-typography.css';
import '../styles/apple-colors.css';
import '../styles/apple-spacing.css';
import '../styles/apple-glass.css';
```

Or in your main CSS file:

```css
/* In app/globals.css */
@import '../styles/apple-typography.css';
@import '../styles/apple-colors.css';
@import '../styles/apple-spacing.css';
@import '../styles/apple-glass.css';
```

### 2. Import TypeScript Tokens (Optional)

```typescript
import { appleDesignSystem } from '@/lib/design-system/apple-tokens';
```

## 📚 Essential Classes

### Typography

```tsx
// Headings
<h1 className="text-hero font-semibold">Hero Text</h1>
<h2 className="text-display">Display Text</h2>
<h3 className="text-title-1">Title 1</h3>

// Body
<p className="text-body">Default body text (17px)</p>
<p className="text-body-large">Large body text (21px)</p>
<small className="text-footnote">Small text (13px)</small>
```

### Colors

```tsx
// Text
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>

// Backgrounds
<div className="bg-primary">White background</div>
<div className="bg-secondary">Light gray</div>

// Apple Blue
<button className="bg-[#0071e3] text-white">Primary Button</button>
```

### Spacing

```tsx
// Margin & Padding
<div className="m-4 p-6">Margin 16px, Padding 24px</div>

// Section Spacing
<section className="section-md">96px vertical padding</section>

// Container
<div className="container-default">1440px centered container</div>
```

### Glass Effects

```tsx
// Basic Glass
<div className="glass">Frosted glass</div>

// Glass Card
<div className="glass-card">Card with glass background</div>

// Glass Button
<button className="glass-button">Glass Button</button>
```

### Elevation

```tsx
<div className="elevation-1">Subtle shadow</div>
<div className="elevation-3">Prominent shadow</div>
```

## 🎯 Common Patterns

### Hero Section

```tsx
<section className="section-xl bg-gradient-to-b from-white to-gray-50">
  <div className="container-default">
    <h1 className="text-hero font-semibold text-primary mb-6">
      Transform Your Space
    </h1>
    <p className="text-body-large text-secondary max-w-2xl mb-8">
      Premium custom closets for Ottawa homes.
    </p>
    <button className="apple-button-primary">
      Get Started
    </button>
  </div>
</section>
```

### Product Card

```tsx
<div className="glass-card hover:elevation-3 transition-all">
  <img
    src="/product.jpg"
    alt="Product"
    className="w-full aspect-square object-cover rounded-lg mb-4"
  />
  <h3 className="text-headline font-semibold mb-2">
    Product Name
  </h3>
  <p className="text-subhead text-secondary mb-4">
    Product description
  </p>
  <button className="apple-button-primary w-full">
    Add to Cart
  </button>
</div>
```

### Navigation

```tsx
<nav className="glass-nav">
  <div className="container-default flex items-center justify-between py-4">
    <div className="text-headline font-semibold">Logo</div>
    <div className="flex gap-6">
      <a href="#" className="text-body font-medium text-secondary hover:text-primary">
        Products
      </a>
      <a href="#" className="text-body font-medium text-secondary hover:text-primary">
        About
      </a>
    </div>
  </div>
</nav>
```

### Apple Button

```tsx
// Primary
<button className="apple-button-primary">
  Primary Action
</button>

// Secondary
<button className="apple-button-secondary">
  Secondary Action
</button>

// Glass Style
<button className="glass-button">
  Glass Button
</button>
```

### Card with Hover Effect

```tsx
<div className="
  apple-card
  hover:shadow-elevated-hover
  hover:-translate-y-1
  transition-all
  duration-300
">
  <h3 className="text-headline font-semibold mb-3">
    Card Title
  </h3>
  <p className="text-body text-secondary">
    Card content goes here
  </p>
</div>
```

## 🎨 Color Reference

```tsx
// Primary Colors
--apple-blue-500: #0071e3    // Primary accent
--apple-gray-900: #1d1d1f    // Near black
--apple-gray-500: #86868b    // Mid gray
--apple-gray-100: #f5f5f7    // Light gray

// Semantic Colors
--color-success: #30d158
--color-warning: #ff9500
--color-error: #ff3b30

// Glass Colors
--glass-white: rgba(255, 255, 255, 0.72)
--glass-dark: rgba(29, 29, 31, 0.72)
```

## 📐 Spacing Scale

```tsx
// 8px base unit
space-2:  8px
space-4:  16px
space-6:  24px
space-8:  32px
space-12: 48px
space-16: 64px
```

## 🔤 Font Sizes

```tsx
text-hero:        80px (5rem)
text-display:     48px (3rem)
text-title-1:     40px (2.5rem)
text-headline:    24px (1.5rem)
text-body:        17px (1.0625rem)
text-footnote:    13px (0.8125rem)
```

## 💡 Pro Tips

1. **Use SF Pro classes** for authentic Apple feel
2. **Combine glass + elevation** for modern cards
3. **Apply section-* classes** for consistent page rhythm
4. **Use container-default** for centered, padded content
5. **Test glass effects** on various backgrounds

## 🎯 Next Steps

- Read full documentation: `APPLE_DESIGN_SYSTEM.md`
- View design tokens: `lib/design-system/apple-tokens.ts`
- Explore CSS files: `styles/apple-*.css`

## 🆘 Need Help?

Common issues:
- **Glass not working?** Check browser support for backdrop-filter
- **Fonts look different?** SF Pro loads natively on Apple devices only
- **Dark mode broken?** Ensure `[data-theme="dark"]` is set correctly
- **Spacing inconsistent?** Always use defined space classes

---

**Ready to build?** Start with the Hero Section pattern and expand from there!
