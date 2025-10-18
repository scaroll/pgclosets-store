# PG Closets Typography System

Complete typography design system for PG Closets with Kit and Ace product hierarchies.

## Quick Start

```typescript
import {
  typographyVariants,
  kitTypography,
  aceTypography,
  typographyToCSS,
} from '@/lib/design-system/typography';

// Use typography variants
<h1 style={typographyToCSS(typographyVariants.h1)}>
  Page Heading
</h1>

// Kit product typography
<div style={typographyToCSS(kitTypography.productName)}>
  Premium Kit
</div>

// Ace product typography
<div style={typographyToCSS(aceTypography.productName)}>
  Elegant Ace System
</div>
```

## Font Stack

### Primary Font Family
Uses system fonts for optimal performance and native feel:

```
-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif
```

**Why this stack?**
- Zero web font loading time
- Native OS rendering
- Excellent readability
- Supports all platforms
- Professional appearance

## Type Scale

Based on **1.25 ratio (major third)** with 16px base size:

| Size | Value | Usage |
|------|-------|-------|
| `6xl` | 64px | Hero headings |
| `5xl` | 56px | Major section headers |
| `4xl` | 48px | Primary page headers |
| `3xl` | 40px | Section headers |
| `2xl` | 32px | Subsection headers |
| `xl` | 24px | Card headers |
| `lg` | 18px | Large body text |
| `base` | 16px | Default body text |
| `sm` | 14px | Small body text |
| `xs` | 12px | Labels, metadata |
| `xxs` | 10px | Fine print |

## Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| `light` | 300 | Display headings |
| `regular` | 400 | Body text |
| `medium` | 500 | Emphasized text |
| `semibold` | 600 | Subheadings |
| `bold` | 700 | Strong emphasis |

## Line Heights

| Height | Value | Usage |
|--------|-------|-------|
| `tight` | 1.1 | Large display text |
| `snug` | 1.2 | Headings |
| `normal` | 1.5 | UI elements |
| `relaxed` | 1.6 | Body text |
| `loose` | 1.75 | Long-form content |

## Typography Variants

### Display Text
```typescript
typographyVariants.display
// 64px, light (300), tight line height
// Usage: Hero sections, major headings
```

### Headings (h1-h6)
```typescript
typographyVariants.h1  // 48px, light
typographyVariants.h2  // 40px, regular
typographyVariants.h3  // 32px, medium
typographyVariants.h4  // 24px, medium
typographyVariants.h5  // 18px, semibold
typographyVariants.h6  // 16px, semibold
```

### Body Text
```typescript
typographyVariants.bodyLarge  // 18px, relaxed
typographyVariants.body       // 16px, relaxed
typographyVariants.bodySmall  // 14px, normal
```

### Specialized Text
```typescript
typographyVariants.label    // 12px, uppercase, semibold
typographyVariants.caption  // 14px, regular
typographyVariants.overline // 12px, uppercase, medium
typographyVariants.button   // 14px, uppercase, medium
typographyVariants.link     // 16px, underline
typographyVariants.code     // 14px, monospace
```

## Kit Typography Hierarchy

Designed for **Kit product lines** (practical, bold, value-focused):

### Product Card
```typescript
kitTypography.categoryBadge    // Uppercase badge
kitTypography.productName      // 40px, bold
kitTypography.modelNumber      // 18px, medium
kitTypography.description      // 16px, regular
kitTypography.feature          // 16px, medium
kitTypography.specification    // 14px, regular
kitTypography.price            // 32px, semibold
```

### Example
```tsx
<div className="kit-product-card">
  <div style={typographyToCSS(kitTypography.categoryBadge)}>
    Kit Series
  </div>
  <h2 style={typographyToCSS(kitTypography.productName)}>
    Premium Walk-In Kit
  </h2>
  <div style={typographyToCSS(kitTypography.modelNumber)}>
    Model: KIT-WI-001
  </div>
  <p style={typographyToCSS(kitTypography.description)}>
    Complete walk-in closet solution...
  </p>
  <div style={typographyToCSS(kitTypography.price)}>
    $899.99
  </div>
</div>
```

## Ace Typography Hierarchy

Designed for **Ace product lines** (elegant, refined, premium):

### Product Card
```typescript
aceTypography.seriesBadge       // Uppercase badge
aceTypography.collectionName    // 24px, regular
aceTypography.productName       // 32px, light
aceTypography.description       // 18px, loose line height
aceTypography.technicalDetail   // 14px, regular
aceTypography.featureHighlight  // 16px, semibold
aceTypography.price             // 40px, regular
```

### Example
```tsx
<div className="ace-product-card">
  <div style={typographyToCSS(aceTypography.seriesBadge)}>
    Ace Collection
  </div>
  <div style={typographyToCSS(aceTypography.collectionName)}>
    Renin Originals
  </div>
  <h2 style={typographyToCSS(aceTypography.productName)}>
    Bypass Door System – Shaker White
  </h2>
  <p style={typographyToCSS(aceTypography.description)}>
    Elegant sliding door system...
  </p>
  <div style={typographyToCSS(aceTypography.price)}>
    $1,299.99
  </div>
</div>
```

## Responsive Typography

### Fluid Sizing
```typescript
import { getResponsiveFontSize } from '@/lib/design-system/typography';

<h1 style={{ fontSize: getResponsiveFontSize('display') }}>
  Responsive Heading
</h1>
```

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1023px
- **Desktop**: 1024px+

### Responsive Scale
```typescript
responsiveFontSizes.display
// Mobile: 40px → Desktop: 64px
// fluid: clamp(2.5rem, 5vw + 1rem, 4rem)

responsiveFontSizes.h1
// Mobile: 32px → Desktop: 48px
// fluid: clamp(2rem, 4vw + 1rem, 3rem)
```

## Utility Functions

### typographyToCSS
Convert typography object to CSS properties:

```typescript
const styles = typographyToCSS(typographyVariants.h1);
// Returns: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
```

### getResponsiveFontSize
Get fluid typography with clamp:

```typescript
const fluidSize = getResponsiveFontSize('h1');
// Returns: "clamp(2rem, 4vw + 1rem, 3rem)"
```

### generateFluidTypography
Create custom fluid typography:

```typescript
const customFluid = generateFluidTypography(
  14,    // min size (px)
  20,    // max size (px)
  320,   // min viewport (px)
  1200   // max viewport (px)
);
// Returns: "clamp(14px, calc(...)vw, 20px)"
```

### calculateLineHeight
Calculate optimal line height:

```typescript
const lineHeight = calculateLineHeight(48); // font size
// Returns: ~1.2 (optimized for size)
```

## CSS Variables

Import CSS variables for use in global styles:

```typescript
import { typographyCSSVariables } from '@/lib/design-system/typography';

// In CSS or styled-components
:root {
  ${Object.entries(typographyCSSVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')}
}
```

Variables include:
- `--font-family-primary`
- `--font-family-display`
- `--font-family-body`
- `--font-weight-light` through `--font-weight-bold`
- `--font-size-6xl` through `--font-size-xxs`
- `--line-height-tight` through `--line-height-extra`
- `--letter-spacing-tighter` through `--letter-spacing-widest`

## Tailwind Integration

Typography is integrated into Tailwind config:

```tsx
<h1 className="text-4xl font-light leading-tight tracking-tighter">
  Heading
</h1>
```

Or use custom utility classes from globals.css:

```tsx
<h1 className="text-h1">Heading</h1>
<p className="text-body-l">Large body text</p>
<span className="text-label">Label</span>
```

## Accessibility

### WCAG AA Compliance
- All font sizes meet minimum 14px for body text
- Line heights optimized for readability
- Letter spacing improves legibility
- High contrast color pairings (defined in color system)

### Focus States
All interactive text elements include proper focus indicators:

```css
*:focus-visible {
  outline: 3px solid var(--pg-focus);
  outline-offset: 2px;
}
```

### Screen Readers
Use semantic HTML with proper typography:

```tsx
<h1 style={typographyToCSS(typographyVariants.h1)}>
  Accessible Heading
</h1>

<span className="sr-only">
  Screen reader only text
</span>
```

## Best Practices

### 1. Semantic HTML
Always use proper heading hierarchy:

```tsx
// ✅ Good
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

// ❌ Bad
<div style={h1Styles}>Page Title</div>
<h3>Section</h3> {/* Skipped h2 */}
```

### 2. Text Wrapping
Use appropriate text-wrap values:

```tsx
// Headings - balance for even wrapping
<h1 style={{ ...typographyVariants.h1, textWrap: 'balance' }}>
  Long Heading Text
</h1>

// Body text - pretty for better paragraph flow
<p style={{ ...typographyVariants.body, textWrap: 'pretty' }}>
  Paragraph text...
</p>
```

### 3. Line Length
Maintain optimal reading length (45-75 characters):

```tsx
<div style={{ maxWidth: '65ch' }}>
  <p style={typographyToCSS(typographyVariants.body)}>
    Readable paragraph...
  </p>
</div>
```

### 4. Vertical Rhythm
Maintain consistent spacing:

```tsx
<div className="space-y-6"> {/* 24px gap */}
  <h2>Heading</h2>
  <p>Paragraph</p>
</div>
```

### 5. Performance
System fonts load instantly - no web font FOUT/FOIT:

```typescript
// ✅ Already optimal - system fonts
fontFamilies.primary

// ❌ Avoid - adds loading time
font-family: 'Custom Font', sans-serif;
```

## Migration Guide

### From Custom CSS

**Before:**
```css
.heading {
  font-family: Arial, sans-serif;
  font-size: 48px;
  font-weight: bold;
  line-height: 1.2;
}
```

**After:**
```tsx
import { typographyVariants, typographyToCSS } from '@/lib/design-system/typography';

<h1 style={typographyToCSS(typographyVariants.h1)}>
  Heading
</h1>
```

### From Inline Styles

**Before:**
```tsx
<h2 style={{
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: '1.3'
}}>
  Title
</h2>
```

**After:**
```tsx
<h2 style={typographyToCSS(typographyVariants.h2)}>
  Title
</h2>
```

## Examples

See `typography.examples.tsx` for 15 comprehensive examples including:

1. Basic typography usage
2. Kit product cards
3. Ace product cards
4. Responsive typography
5. Tailwind integration
6. Button typography
7. Form typography
8. Card hierarchy
9. Accessible typography
10. Mixed styles
11. Custom combinations
12. Navigation
13. E-commerce
14. Spacing utilities
15. Complete page implementation

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
  TypographyVariant,
  KitTypographyVariant,
  AceTypographyVariant,
} from '@/lib/design-system/typography';
```

## File Structure

```
lib/design-system/
├── typography.ts              # Main typography system
├── typography.examples.tsx    # 15 usage examples
└── typography.README.md       # This documentation
```

## Related Systems

- **Colors**: `/lib/design-system/colors.ts`
- **Spacing**: `/lib/design-system/spacing.ts`
- **Components**: `/components/ui/`

## Resources

- [Web Typography Best Practices](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals)
- [WCAG Typography Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Modular Scale Calculator](https://www.modularscale.com/)
- [Type Scale](https://type-scale.com/)

---

**Design System Version**: 1.0.0
**Last Updated**: October 2025
**Maintained By**: PG Closets Development Team
