# Apple Design System for PG Closets

A comprehensive, production-ready design system inspired by Apple's design language, featuring SF Pro typography, sophisticated color palette, glass morphism effects, and precise spacing system.

## 🎨 Overview

This design system brings Apple's minimalist sophistication and attention to detail to PG Closets, creating a premium user experience that reflects the quality of your products.

### Design Philosophy

1. **Minimalist Sophistication** - Clean, uncluttered interfaces with purposeful white space
2. **Precision Typography** - SF Pro font system with optical sizing and precise tracking
3. **Refined Color Palette** - Sophisticated neutrals with Apple Blue as primary accent
4. **Glass Morphism** - Frosted glass effects with backdrop blur for depth
5. **Consistent Spacing** - 8px base unit grid for perfect visual rhythm

## 📁 File Structure

```
styles/
├── apple-typography.css   # SF Pro typography system
├── apple-colors.css        # Color palette and semantic colors
├── apple-spacing.css       # Spacing, grid, and containers
└── apple-glass.css         # Glass morphism and depth system

lib/design-system/
└── apple-tokens.ts         # TypeScript design tokens
```

## 🔤 Typography System

### Font Families

- **SF Pro Display**: For large text (≥20px) - headlines, titles
- **SF Pro Text**: For small text (<20px) - body, UI elements

### Type Scale

```css
/* Hero & Display */
--font-size-80: 5rem;       /* 80px - Hero */
--font-size-56: 3.5rem;     /* 56px - Large Display */
--font-size-48: 3rem;       /* 48px - Display */

/* Titles */
--font-size-40: 2.5rem;     /* 40px - Title 1 */
--font-size-32: 2rem;       /* 32px - Title 2 */
--font-size-28: 1.75rem;    /* 28px - Title 3 */

/* Body & UI */
--font-size-24: 1.5rem;     /* 24px - Headline */
--font-size-17: 1.0625rem;  /* 17px - Body (default) */
--font-size-15: 0.9375rem;  /* 15px - Subheadline */
--font-size-13: 0.8125rem;  /* 13px - Footnote */
--font-size-12: 0.75rem;    /* 12px - Caption */
```

### Usage Examples

```tsx
// React/TSX
<h1 className="text-hero font-semibold">Transform Your Space</h1>
<h2 className="text-display">Custom Closets</h2>
<p className="text-body">Premium storage solutions for Ottawa homes.</p>

// CSS Classes
.text-hero          /* 80px hero text */
.text-display-large /* 56px large display */
.text-display       /* 48px display */
.text-title-1       /* 40px primary titles */
.text-body          /* 17px body text */
.text-caption-1     /* 12px captions */
```

### Font Weights

```css
.font-light      /* 300 */
.font-regular    /* 400 */
.font-medium     /* 500 */
.font-semibold   /* 600 - Apple's preferred bold */
.font-bold       /* 700 */
```

### Responsive Typography

Typography automatically scales on mobile:
- Hero: 80px → 48px on mobile
- Display Large: 56px → 40px on mobile
- Display: 48px → 32px on mobile

## 🎨 Color System

### Primary Colors

```typescript
// Apple Blue (Primary Accent)
--apple-blue-500: #0071e3  /* Primary Apple Blue */
--apple-blue-600: #0066cc  /* Hover state */

// System Grays
--apple-gray-50: #fafafa   /* Lightest */
--apple-gray-500: #86868b  /* Mid-tone */
--apple-gray-900: #1d1d1f  /* Near black */
```

### Usage Examples

```tsx
// Text Colors
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>
<p className="text-tertiary">Tertiary text</p>

// Background Colors
<div className="bg-primary">White background</div>
<div className="bg-secondary">Light gray background</div>

// Semantic Colors
<button className="bg-[#0071e3] text-white">Primary Button</button>
<span className="text-success">Success message</span>
<span className="text-error">Error message</span>
```

### Dark Mode

Dark mode is automatically handled via `[data-theme="dark"]` or `.dark` class:

```tsx
// Automatically adapts to dark mode
<div className="bg-primary text-primary">
  Content adapts to theme
</div>
```

## 📏 Spacing System

### 8px Base Unit Grid

```css
--space-2: 8px    /* 1x base */
--space-4: 16px   /* 2x base */
--space-6: 24px   /* 3x base */
--space-8: 32px   /* 4x base */
--space-12: 48px  /* 6x base */
--space-16: 64px  /* 8x base */
```

### Usage Examples

```tsx
// Margin
<div className="m-4">Margin 16px</div>
<div className="mt-8 mb-6">Top 32px, Bottom 24px</div>

// Padding
<div className="p-6">Padding 24px</div>
<div className="px-8 py-4">Horizontal 32px, Vertical 16px</div>

// Gap (Flexbox/Grid)
<div className="flex gap-4">Gap 16px between items</div>
```

### Container System

```tsx
// Standard container (1440px max-width)
<div className="container-default">
  Content with responsive padding
</div>

// Custom max-width
<div className="container container-xl">
  1280px max-width container
</div>
```

### Section Spacing

```tsx
// Vertical section padding
<section className="section-md">96px top/bottom padding</section>
<section className="section-lg">128px top/bottom padding</section>
```

## 🪟 Glass Morphism

### Basic Glass Effect

```tsx
// Light glass with blur
<div className="glass">
  Frosted glass effect
</div>

// Dark glass
<div className="glass-dark">
  Dark frosted glass
</div>
```

### Glass Components

```tsx
// Glass Card
<div className="glass-card">
  <h3>Card Title</h3>
  <p>Card content with glass background</p>
</div>

// Glass Button
<button className="glass-button">
  Glass Button
</button>

// Glass Navigation
<nav className="glass-nav">
  Sticky navigation with blur
</nav>
```

### Blur Levels

```css
.backdrop-blur-sm   /* 8px blur */
.backdrop-blur-md   /* 20px blur */
.backdrop-blur-lg   /* 40px blur */
.backdrop-blur-xl   /* 64px blur */
```

## 📦 Elevation & Shadows

### Elevation System

5 levels of elevation following Apple's design:

```tsx
<div className="elevation-1">Subtle lift (cards)</div>
<div className="elevation-2">Standard lift (elevated cards)</div>
<div className="elevation-3">Prominent lift (modals)</div>
<div className="elevation-4">Strong lift (dropdowns)</div>
<div className="elevation-5">Maximum lift (dialogs)</div>
```

### Interactive Depth

```tsx
<div className="elevation-2 depth-interactive">
  Lifts on hover with smooth animation
</div>
```

## 🎯 Component Examples

### Apple Card

```tsx
<div className="apple-card">
  <h3 className="text-headline font-semibold mb-4">
    Custom Walk-In Closet
  </h3>
  <p className="text-body text-secondary">
    Transform your master bedroom with a luxury walk-in closet system.
  </p>
</div>
```

### Apple Button

```tsx
// Primary Button
<button className="apple-button-primary">
  Get Free Quote
</button>

// Secondary Button
<button className="apple-button-secondary">
  Learn More
</button>

// Glass Button
<button className="glass-button">
  Explore Products
</button>
```

### Hero Section

```tsx
<section className="section-xl bg-gradient-to-b from-white to-gray-50">
  <div className="container-default">
    <h1 className="text-hero font-semibold text-primary mb-6">
      Transform Your Space
    </h1>
    <p className="text-body-large text-secondary max-w-2xl">
      Premium custom closets and storage solutions for Ottawa homes.
    </p>
    <button className="apple-button-primary mt-8">
      Start Your Project
    </button>
  </div>
</section>
```

### Product Card with Glass

```tsx
<div className="glass-card hover:shadow-elevated-hover transition-all">
  <img
    src="/product.jpg"
    alt="Product"
    className="w-full aspect-square object-cover rounded-lg mb-4"
  />
  <h3 className="text-headline font-semibold mb-2">
    Renin Sliding Door
  </h3>
  <p className="text-subhead text-secondary mb-4">
    Premium barn door system with soft-close mechanism
  </p>
  <div className="flex items-center justify-between">
    <span className="text-title-2 font-semibold">$899</span>
    <button className="apple-button-primary">Add to Cart</button>
  </div>
</div>
```

## 📱 Responsive Breakpoints

```typescript
xs: 320px   // Mobile small
sm: 640px   // Mobile large
md: 768px   // Tablet portrait
lg: 1024px  // Tablet landscape / Small desktop
xl: 1280px  // Desktop
2xl: 1440px // Large desktop (Apple standard)
max: 1920px // Extra large
```

### Responsive Usage

```tsx
// Mobile-first approach
<div className="
  text-body           /* 17px default */
  md:text-body-large  /* 21px on tablet+ */
  p-4                 /* 16px default */
  md:p-6              /* 24px on tablet+ */
  lg:p-8              /* 32px on desktop+ */
">
  Responsive content
</div>
```

## 🎨 Tailwind Integration

The Apple Design System is fully integrated with Tailwind CSS. Update your `tailwind.config.ts`:

```typescript
import { appleDesignSystem } from './lib/design-system/apple-tokens';

export default {
  theme: {
    extend: {
      fontFamily: appleDesignSystem.typography.fontFamily,
      fontSize: appleDesignSystem.typography.fontSize,
      colors: {
        'apple-blue': appleDesignSystem.colors.blue,
        'apple-gray': appleDesignSystem.colors.gray,
      },
      spacing: appleDesignSystem.spacing,
      borderRadius: appleDesignSystem.borderRadius,
      boxShadow: appleDesignSystem.shadows,
    },
  },
};
```

## 🚀 Getting Started

### 1. Import CSS Files

Add to your `app/layout.tsx` or main CSS file:

```typescript
import '../styles/apple-typography.css';
import '../styles/apple-colors.css';
import '../styles/apple-spacing.css';
import '../styles/apple-glass.css';
```

### 2. Use Design Tokens in TypeScript

```typescript
import { appleDesignSystem } from '@/lib/design-system/apple-tokens';

// Access tokens
const primaryColor = appleDesignSystem.colors.blue[500];
const heroSize = appleDesignSystem.typography.fontSize.hero;
const spacing = appleDesignSystem.spacing[6];
```

### 3. Apply Classes in Components

```tsx
export default function Hero() {
  return (
    <section className="section-xl bg-primary">
      <div className="container-default">
        <h1 className="text-hero font-semibold mb-6">
          Your Headline
        </h1>
        <p className="text-body-large text-secondary">
          Your description
        </p>
      </div>
    </section>
  );
}
```

## 📐 Design Principles

### 1. Typography Hierarchy

- Use SF Pro Display for headlines (≥20px)
- Use SF Pro Text for body copy (<20px)
- Maintain clear size relationships (3:2 ratio between levels)
- Apply proper letter-spacing (tracking) for each size

### 2. Color Usage

- Use Apple Blue (#0071e3) sparingly for primary actions
- Rely on grays (50-900) for most UI elements
- Maintain WCAG AAA contrast ratios (7:1 for normal text)
- Support both light and dark modes

### 3. Spacing Consistency

- Always use 8px base unit multiples
- Apply consistent vertical rhythm
- Use section spacing for major page divisions
- Maintain breathing room around content

### 4. Glass Morphism Best Practices

- Use for navigation bars and overlays
- Apply appropriate blur levels (md for most cases)
- Ensure sufficient contrast for text on glass
- Test across different backgrounds

### 5. Elevation & Depth

- Start with elevation-1 for cards
- Use elevation-2 for hover states
- Reserve elevation-4 and 5 for modals/dialogs
- Combine with glass effects for modern feel

## 🎯 Best Practices

### Do's ✅

- Use SF Pro font system for authentic Apple feel
- Apply 8px grid system consistently
- Leverage glass morphism for modern, premium look
- Maintain clear typography hierarchy
- Support both light and dark modes
- Use semantic color names (primary, secondary, success, error)
- Apply proper elevation for interactive elements
- Test on actual devices for glass effects

### Don'ts ❌

- Don't mix font systems (stick to SF Pro)
- Don't break the 8px grid
- Don't overuse glass effects (use purposefully)
- Don't use too many font sizes on one page
- Don't ignore dark mode
- Don't use arbitrary values outside the system
- Don't forget hover/focus states
- Don't sacrifice accessibility for aesthetics

## 🔧 Customization

### Extending Colors

```typescript
// In apple-tokens.ts
export const customColors = {
  brand: {
    copper: '#e38446',
    bronze: '#8b7355',
  },
};

// Use in components
<div className="bg-[#e38446]">Custom color</div>
```

### Custom Components

```tsx
// Create your own glass component
export function CustomGlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      glass-light
      elevation-2
      p-6
      rounded-lg
      hover:elevation-3
      transition-all
      duration-300
    ">
      {children}
    </div>
  );
}
```

## 📚 Resources

- [SF Pro Font Family](https://developer.apple.com/fonts/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [CSS Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

## 🐛 Troubleshooting

### SF Pro Fonts Not Loading

The system uses system fonts as fallback. SF Pro will load automatically on Apple devices. For other platforms, the system gracefully falls back to system fonts.

### Glass Effects Not Working

Backdrop blur requires browser support. Check:
```css
@supports (backdrop-filter: blur(20px)) {
  /* Glass effects will work */
}
```

### Dark Mode Not Switching

Ensure your theme provider sets `[data-theme="dark"]` or `.dark` class on the root element.

### Spacing Not Consistent

Always use the predefined spacing classes (m-4, p-6, gap-8) rather than arbitrary values.

## 📊 Performance

- All CSS is optimized and purged in production
- Glass effects use hardware acceleration
- Typography scales smoothly with viewport
- Dark mode has no flash of unstyled content (FOUC)
- System fonts load instantly on Apple devices

## 🎉 Conclusion

This Apple Design System provides everything you need to create beautiful, sophisticated interfaces that reflect the premium quality of PG Closets products. By following Apple's design principles and using these tokens consistently, you'll deliver an exceptional user experience across all devices.

---

**Version:** 1.0.0
**Last Updated:** 2025
**Maintained by:** PG Closets Development Team
