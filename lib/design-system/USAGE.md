# Design System Usage Guide

Quick start guide for using the PG Closets Design System.

## Installation & Setup

### 1. Import CSS Variables

Add to your global CSS or `app/globals.css`:

```css
@import '../lib/design-system/variables.css';
```

### 2. Import Design Tokens

Import tokens in your TypeScript/JavaScript files:

```typescript
// Import everything
import { designTokens } from '@/lib/design-system';

// Import specific tokens
import { colors, typography, spacing } from '@/lib/design-system';

// Import presets
import { buttonPresets, typographyPresets } from '@/lib/design-system';
```

## Quick Examples

### Using Button Presets

```tsx
import { buttonPresets, cn } from '@/lib/design-system';

function MyComponent() {
  return (
    <button className={cn(buttonPresets.primary)}>
      Primary Button
    </button>
  );
}
```

### Using Typography Presets

```tsx
import { typographyPresets } from '@/lib/design-system';

function MyComponent() {
  return (
    <div>
      <h1 className={typographyPresets.hero}>
        Hero Heading
      </h1>
      <p className={typographyPresets.body}>
        Body text with comfortable line height.
      </p>
    </div>
  );
}
```

### Using Spacing Presets

```tsx
import { spacingPresets } from '@/lib/design-system';

function MyComponent() {
  return (
    <section className={cn(
      spacingPresets.sectionVertical,
      spacingPresets.sectionHorizontal
    )}>
      <div className={spacingPresets.containerMaxWidth}>
        <div className={spacingPresets.stack.default}>
          {/* Content */}
        </div>
      </div>
    </section>
  );
}
```

### Using Design Tokens Directly

```tsx
import { colors, spacing, borderRadius } from '@/lib/design-system';

// In styled-components or CSS-in-JS
const Button = styled.button`
  background-color: ${colors.brand.navy.DEFAULT};
  padding: ${spacing[3]} ${spacing[6]};
  border-radius: ${borderRadius.lg};
`;

// In Tailwind CSS classes
<button className="bg-pg-navy-800 px-6 py-3 rounded-lg">
  Button
</button>
```

### Using Card Presets

```tsx
import { cardPresets, cn } from '@/lib/design-system';

function ProductCard({ product }) {
  return (
    <div className={cn(cardPresets.default)}>
      <h3 className="text-xl font-semibold text-pg-text-primary mb-2">
        {product.name}
      </h3>
      <p className="text-base text-pg-text-secondary">
        {product.description}
      </p>
    </div>
  );
}
```

### Responsive Spacing

```tsx
import { getResponsiveSpacing } from '@/lib/design-system';

function MyComponent() {
  // Different spacing for mobile, tablet, desktop
  const padding = getResponsiveSpacing(4, 8, 12);

  return (
    <div className={padding}>
      Content
    </div>
  );
}
```

### Accessibility

```tsx
import { a11y } from '@/lib/design-system';

function MyComponent() {
  return (
    <>
      {/* Skip to main content link */}
      <a href="#main" className={a11y.skipLink}>
        Skip to main content
      </a>

      {/* Screen reader only text */}
      <span className={a11y.srOnly}>
        Accessible description
      </span>

      {/* Focus ring for keyboard navigation */}
      <button className={cn(
        'px-6 py-3 rounded-lg',
        a11y.focusRing
      )}>
        Accessible Button
      </button>
    </>
  );
}
```

## Common Patterns

### Form Layout

```tsx
import { spacingPresets, inputPresets, buttonPresets, cn } from '@/lib/design-system';

function ContactForm() {
  return (
    <form className={cn('max-w-md', spacingPresets.stack.relaxed)}>
      <div className={spacingPresets.stack.tight}>
        <label htmlFor="name" className="block text-sm font-medium text-pg-text-primary">
          Name
        </label>
        <input
          id="name"
          type="text"
          className={cn(inputPresets.default)}
        />
      </div>

      <div className={spacingPresets.stack.tight}>
        <label htmlFor="email" className="block text-sm font-medium text-pg-text-primary">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={cn(inputPresets.default)}
        />
      </div>

      <button type="submit" className={cn(buttonPresets.primary, 'w-full')}>
        Submit
      </button>
    </form>
  );
}
```

### Page Section

```tsx
import { spacingPresets, typographyPresets, cn } from '@/lib/design-system';

function HeroSection() {
  return (
    <section className={cn(
      spacingPresets.sectionVertical,
      spacingPresets.sectionHorizontal,
      'bg-pg-neutral-offwhite'
    )}>
      <div className={spacingPresets.containerMaxWidth}>
        <div className={cn(spacingPresets.stack.relaxed, 'text-center')}>
          <h1 className={typographyPresets.hero}>
            Welcome to PG Closets
          </h1>
          <p className={cn(typographyPresets.body, 'max-w-2xl mx-auto')}>
            Premium closet organization systems designed for your space.
          </p>
          <button className={cn(buttonPresets.primary)}>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
```

### Product Grid

```tsx
import { spacingPresets, cardPresets, cn } from '@/lib/design-system';

function ProductGrid({ products }) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      spacingPresets.sectionVertical
    )}>
      {products.map(product => (
        <a
          key={product.id}
          href={`/products/${product.id}`}
          className={cn(cardPresets.interactive)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-pg-text-primary mb-2 group-hover:text-pg-navy-800">
            {product.name}
          </h3>
          <p className="text-base text-pg-text-secondary">
            ${product.price}
          </p>
        </a>
      ))}
    </div>
  );
}
```

## CSS Variable Usage

You can also use CSS variables directly in your stylesheets:

```css
/* Using in CSS */
.custom-button {
  background-color: var(--pg-navy-800);
  color: var(--pg-text-inverse);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: background-color var(--duration-default) var(--ease);
}

.custom-button:hover {
  background-color: var(--pg-navy-700);
}

.custom-button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

## Tailwind CSS Classes

The design system is fully integrated with Tailwind CSS:

```tsx
// Navy colors
<div className="bg-pg-navy-800 text-white">Navy background</div>

// Sky blue colors
<div className="bg-pg-sky-300 text-pg-navy-800">Sky blue background</div>

// Neutral colors
<div className="bg-pg-neutral-50 text-pg-text-primary">Light background</div>

// Semantic colors
<div className="bg-pg-semantic-success-light text-pg-semantic-success-dark">
  Success message
</div>

// Typography
<h1 className="font-sans text-5xl font-bold tracking-tight">Heading</h1>

// Spacing (4px base)
<div className="p-6 space-y-4">Content with spacing</div>

// Shadows
<div className="shadow-md hover:shadow-lg">Card with shadow</div>

// Transitions
<button className="transition-colors duration-200">Smooth transition</button>
```

## Best Practices

### 1. Use Presets When Possible
Presets ensure consistency and reduce code duplication.

```tsx
// Good
<button className={buttonPresets.primary}>Submit</button>

// Also fine for custom needs
<button className="bg-pg-navy-800 hover:bg-pg-navy-700 px-6 py-3 rounded-lg">
  Submit
</button>
```

### 2. Combine with `cn()` Utility

```tsx
import { cn, buttonPresets } from '@/lib/design-system';

// Combine preset with custom classes
<button className={cn(buttonPresets.primary, 'w-full')}>
  Full Width Button
</button>

// Conditional classes
<button className={cn(
  buttonPresets.primary,
  isLoading && 'opacity-50 cursor-not-allowed'
)}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### 3. Maintain Accessibility

Always include:
- Focus states (built into presets)
- Minimum 44px touch targets
- Proper ARIA labels
- Screen reader text where needed
- Semantic HTML

### 4. Responsive Design

```tsx
<div className="
  px-6 md:px-12 lg:px-24
  py-12 md:py-16 lg:py-24
  text-base md:text-lg lg:text-xl
">
  Responsive spacing and typography
</div>
```

### 5. Use Semantic Color Tokens

```tsx
// Good - semantic
<div className="text-pg-text-primary">Main text</div>
<div className="text-pg-text-secondary">Secondary text</div>

// Avoid - specific color values in markup
<div className="text-gray-800">Text</div>
```

## Component Examples

See `component-guide.md` for complete component examples including:
- Buttons (all variants)
- Form inputs
- Cards
- Typography
- Navigation
- Alerts
- Loading states
- And more

## Token Reference

See `tokens.ts` for the complete design token specification including:
- Color palette
- Typography system
- Spacing scale
- Border radius
- Shadows
- Transitions
- Breakpoints
- Z-index scale
- Component variants

## Need Help?

- **Full Documentation**: See `README.md`
- **Component Examples**: See `component-guide.md`
- **Design Tokens**: See `tokens.ts`
- **CSS Variables**: See `variables.css`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-04
