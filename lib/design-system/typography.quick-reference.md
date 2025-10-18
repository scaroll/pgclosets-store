# Typography Quick Reference

## Import

```typescript
import {
  typographyVariants,
  kitTypography,
  aceTypography,
  typographyToCSS,
  getResponsiveFontSize,
} from '@/lib/design-system/typography';
```

## Common Usage

### Headings
```tsx
<h1 style={typographyToCSS(typographyVariants.h1)}>Main Heading</h1>
<h2 style={typographyToCSS(typographyVariants.h2)}>Section</h2>
<h3 style={typographyToCSS(typographyVariants.h3)}>Subsection</h3>
```

### Body Text
```tsx
<p style={typographyToCSS(typographyVariants.body)}>Paragraph</p>
<p style={typographyToCSS(typographyVariants.bodyLarge)}>Intro</p>
<p style={typographyToCSS(typographyVariants.bodySmall)}>Caption</p>
```

### Kit Products
```tsx
<div style={typographyToCSS(kitTypography.productName)}>Kit Name</div>
<div style={typographyToCSS(kitTypography.price)}>$899.99</div>
```

### Ace Products
```tsx
<div style={typographyToCSS(aceTypography.productName)}>Ace Name</div>
<div style={typographyToCSS(aceTypography.price)}>$1,299.99</div>
```

### Responsive
```tsx
<h1 style={{ fontSize: getResponsiveFontSize('h1') }}>Fluid Heading</h1>
```

## Size Reference

| Variant | Size | Weight | Use Case |
|---------|------|--------|----------|
| display | 64px | 300 | Hero |
| h1 | 48px | 300 | Page title |
| h2 | 40px | 400 | Section |
| h3 | 32px | 500 | Subsection |
| h4 | 24px | 500 | Card header |
| body | 16px | 400 | Default text |
| bodyLarge | 18px | 400 | Intro |
| bodySmall | 14px | 400 | Caption |

## Kit vs Ace

### Kit (Bold, Practical)
- **Name**: 40px, bold (700)
- **Price**: 32px, semibold (600)
- **Badge**: Uppercase, bold
- **Use**: Value-focused products

### Ace (Elegant, Refined)
- **Name**: 32px, light (300)
- **Price**: 40px, regular (400)
- **Badge**: Uppercase, medium
- **Use**: Premium products

## Tailwind Classes

```tsx
<h1 className="text-4xl font-light leading-tight">Heading</h1>
<p className="text-base font-normal leading-relaxed">Body</p>
```

Or use custom classes:
```tsx
<h1 className="text-h1">Heading</h1>
<p className="text-body-l">Body</p>
```

## Font Stack

```
-apple-system, BlinkMacSystemFont,
"SF Pro Display", "SF Pro Text",
"Helvetica Neue", Helvetica, Arial, sans-serif
```

**Zero web font loading time** ✨

## Accessibility

- ✅ WCAG AA compliant sizes
- ✅ Optimized line heights
- ✅ Proper focus states
- ✅ Semantic HTML support

## File Locations

- **System**: `/lib/design-system/typography.ts`
- **Examples**: `/lib/design-system/typography.examples.tsx`
- **Full Docs**: `/lib/design-system/typography.README.md`
