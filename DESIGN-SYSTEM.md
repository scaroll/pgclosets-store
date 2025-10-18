# PG Closets Unified Design System

## Overview

A production-optimized design system built for the PG Closets premium closet and storage solutions brand. Inspired by Apple's design philosophy with a focus on minimalism, clarity, and luxury.

## Quick Start

### 1. Wrap Your App

```tsx
// app/layout.tsx
import { DesignSystemProvider } from '@/lib/design-system-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DesignSystemProvider defaultTheme="light">
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
```

### 2. Use Design Tokens

```tsx
import { ds } from '@/lib/design-utils';

// Access tokens programmatically
const primaryColor = ds.color.primary();
const spacingLg = ds.spacing.lg();

// Use in styles
const styles = {
  padding: ds.spacing.md(),
  color: ds.color.text('primary'),
  boxShadow: ds.shadow.lg(),
};
```

### 3. Use Hooks

```tsx
import { useDesignSystem, useResponsive, useAnimation } from '@/lib/design-system-provider';

function Component() {
  const { theme, setTheme } = useDesignSystem();
  const { isMobile, isDesktop } = useResponsive();
  const { className } = useAnimation('slow');

  return <div className={className}>...</div>;
}
```

## Design Tokens

### Colors

```css
/* Brand Foundation */
--pg-black: #0f1419;
--pg-charcoal: #1a1a1a;
--pg-slate: #2d3748;
--pg-graphite: #4a5568;
--pg-silver: #cbd5e0;
--pg-pearl: #f7fafc;
--pg-white: #ffffff;

/* Semantic Colors */
--color-primary: var(--pg-black);
--color-secondary: var(--pg-white);
--color-accent: var(--pg-navy);
--text-primary: var(--pg-black);
--bg-primary: var(--pg-white);
--border-default: #e2e8f0;
```

### Spacing

8-point grid system for consistent spacing:

```css
--spacing-xs: 4px;    /* 0.25rem */
--spacing-sm: 8px;    /* 0.5rem */
--spacing-md: 16px;   /* 1rem */
--spacing-lg: 24px;   /* 1.5rem */
--spacing-xl: 32px;   /* 2rem */
--spacing-2xl: 48px;  /* 3rem */
--spacing-3xl: 64px;  /* 4rem */
--spacing-4xl: 96px;  /* 6rem */
```

### Typography

Modular scale with SF Pro-inspired system:

```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
--text-5xl: 3rem;     /* 48px */
--text-6xl: 4rem;     /* 64px */
```

### Shadows

Apple-style subtle depth system:

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.12);
--shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.15);
```

### Animations

Smooth, professional timing:

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;
--ease-apple: cubic-bezier(0.23, 1, 0.32, 1);
```

## Component Classes

### Buttons

```html
<!-- Primary Button -->
<button class="btn-primary">Get Quote</button>

<!-- Secondary Button -->
<button class="btn-secondary">Learn More</button>

<!-- Ghost Button -->
<button class="btn-ghost">Cancel</button>
```

### Typography

```html
<!-- Headings -->
<h1 class="heading-1">Premium Closet Solutions</h1>
<h2 class="heading-2">Transform Your Space</h2>
<h3 class="heading-3">Our Services</h3>

<!-- Body Text -->
<p class="body-large">Large body text for emphasis</p>
<p class="body-regular">Standard paragraph text</p>
<p class="body-small">Small supporting text</p>
<span class="caption">Caption or label text</span>
```

### Cards

```html
<!-- Standard Card -->
<div class="card">
  <div class="p-6">Card content</div>
</div>

<!-- Interactive Card -->
<div class="card-interactive">
  <div class="p-6">Clickable card content</div>
</div>

<!-- Flat Card -->
<div class="card-flat">
  Minimal card without shadows
</div>
```

### Forms

```html
<!-- Input -->
<input type="text" class="input" placeholder="Enter text">

<!-- Select -->
<select class="select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea class="textarea" placeholder="Enter message"></textarea>

<!-- Checkbox -->
<input type="checkbox" class="checkbox">

<!-- Radio -->
<input type="radio" class="radio">
```

## Utility Functions

### Color Utilities

```ts
import { ds } from '@/lib/design-utils';

// Get colors
const primary = ds.color.primary();
const textColor = ds.color.text('secondary');
const bgColor = ds.color.bg('primary');
const borderColor = ds.color.border('light');
const errorColor = ds.color.status('error');
```

### Spacing Utilities

```ts
// Get spacing values
const spacingMd = ds.spacing.md();
const customSpacing = ds.spacing.get('2xl');

// Build spacing styles
const styles = ds.style.spacing('md', 'lg', 'md', 'lg');
```

### Typography Utilities

```ts
// Get typography values
const fontSize = ds.typography.size('lg');
const fontWeight = ds.typography.weight('semibold');
const lineHeight = ds.typography.lineHeight('relaxed');
const fontFamily = ds.typography.font('sans');
```

### Animation Utilities

```ts
// Get animation values
const duration = ds.animation.duration('slow');
const easing = ds.animation.easing('apple');

// Build transition
const transition = ds.animation.transition('opacity', 'fast', 'out');
```

### Responsive Utilities

```ts
// Media queries
const mobileQuery = ds.mq.up('sm');
const tabletQuery = ds.mq.between('sm', 'lg');
const desktopQuery = ds.mq.up('lg');

// Use in CSS-in-JS
const styles = {
  padding: ds.spacing.md(),
  [ds.mq.up('lg')]: {
    padding: ds.spacing.xl(),
  }
};
```

### Theme Utilities

```ts
// Check and toggle theme
const isDark = ds.theme.isDark();
ds.theme.toggle();
ds.theme.set('dark');
```

### Class Name Utility

```ts
// Combine classes conditionally
const className = ds.cn(
  'base-class',
  isActive && 'active-class',
  isPrimary ? 'primary' : 'secondary',
  null, // ignored
  undefined // ignored
);
```

## Responsive Design

### Breakpoints

```ts
sm: 430px   // Mobile (iPhone 14 Pro)
md: 744px   // Tablet (iPad Mini)
lg: 1068px  // Desktop (MacBook Air)
xl: 1440px  // Large Desktop (iMac)
```

### Using Responsive Hook

```tsx
import { useResponsive } from '@/lib/design-system-provider';

function Component() {
  const { breakpoint, isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

## Dark Mode

### Automatic Dark Mode

The design system automatically detects system preferences and applies the appropriate theme.

### Manual Theme Control

```tsx
import { useDesignSystem } from '@/lib/design-system-provider';

function ThemeToggle() {
  const { theme, setTheme } = useDesignSystem();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### Dark Mode Styles

```css
/* Automatic dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: var(--pg-white);
    --color-secondary: var(--pg-black);
    --text-primary: var(--pg-white);
    --bg-primary: #0f1419;
  }
}
```

## Accessibility

### Focus Styles

All interactive elements have visible focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

### Screen Reader Support

```html
<!-- Screen reader only content -->
<span class="sr-only">Description for screen readers</span>

<!-- Skip to content link -->
<a href="#main" class="skip-to-content">Skip to main content</a>
```

### Reduced Motion

Animations are automatically disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance

### Optimizations

1. **CSS Variables**: Dynamic theming without JavaScript overhead
2. **Token Caching**: Design tokens are cached in memory
3. **Lazy Loading**: Components load on demand
4. **GPU Acceleration**: Animations use transform and opacity
5. **Tree Shaking**: Unused utilities are removed in production

### Bundle Size

- Design System Provider: ~2KB gzipped
- Design Utils: ~3KB gzipped
- Total overhead: <5KB gzipped

## Best Practices

1. **Use Design Tokens**: Always use tokens instead of hardcoded values
2. **Semantic Names**: Use semantic color names (primary, secondary) not visual (red, blue)
3. **Consistent Spacing**: Use the 8-point grid system
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Accessibility First**: Ensure all interactions are keyboard accessible
6. **Performance**: Use CSS transforms for animations
7. **Documentation**: Document custom components and patterns

## Migration Guide

### From Inline Styles

```tsx
// Before
<div style={{ padding: '16px', color: '#0f1419' }}>

// After
<div style={{ padding: ds.spacing.md(), color: ds.color.primary() }}>
```

### From Hardcoded Classes

```tsx
// Before
<div className="p-4 text-black shadow-lg">

// After
<div className="p-[var(--spacing-md)] text-[var(--text-primary)] shadow-[var(--shadow-lg)]">
```

### From Custom CSS

```css
/* Before */
.custom-card {
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* After */
.custom-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

## Examples

### Product Card Component

```tsx
import { ds } from '@/lib/design-utils';

function ProductCard({ product }) {
  return (
    <div className="card-interactive">
      <img src={product.image} alt={product.name} />
      <div className="p-6">
        <h3 className="heading-3">{product.name}</h3>
        <p className="body-regular text-[var(--text-secondary)]">
          {product.description}
        </p>
        <button className="btn-primary mt-4">
          View Details
        </button>
      </div>
    </div>
  );
}
```

### Responsive Layout

```tsx
import { useResponsive } from '@/lib/design-system-provider';

function Layout({ children }) {
  const { isMobile } = useResponsive();

  return (
    <div
      className={ds.cn(
        'container-max',
        isMobile ? 'px-4' : 'px-8'
      )}
    >
      {children}
    </div>
  );
}
```

### Animated Component

```tsx
import { useAnimation } from '@/lib/design-system-provider';

function AnimatedCard({ children }) {
  const animation = useAnimation('slow');

  return (
    <div
      className={ds.cn('card', animation.className)}
      style={{
        transform: 'translateY(0)',
      }}
    >
      {children}
    </div>
  );
}
```

## Resources

- [Design Token Reference](./lib/design-utils.ts)
- [Provider Implementation](./lib/design-system-provider.tsx)
- [Global Styles](./app/globals.css)
- [Tailwind Config](./tailwind.config.ts)