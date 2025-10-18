# Visual System Rules - PG Closets

## Design Token Reference

All visual styles must use design tokens from `styles/tokens.css` instead of hardcoded values.

### Color System

#### Brand Colors
```css
--color-primary: #1B4A9C;      /* Deep blue - primary brand color */
--color-secondary: #9BC4E2;    /* Light blue - accents and highlights */
--color-accent: #4A5F8A;       /* Medium blue - hover states and details */
```

#### Text Colors
```css
--color-text-primary: #000000;    /* Black - main body text */
--color-text-secondary: #1B4A9C;  /* Brand blue - headings and emphasis */
--color-text-muted: #6B7280;      /* Gray - secondary text */
```

#### Background Colors
```css
--color-bg-primary: #ffffff;   /* White - main background */
--color-bg-secondary: #F5F5F5; /* Light gray - alternate sections */
```

#### Border Colors
```css
--color-border-default: #E0E0E0;        /* Light gray - standard borders */
--color-border-subtle: rgba(0, 0, 0, 0.1); /* Subtle borders */
```

### Typography System

#### Font Family
```css
--font-family: Inter, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

#### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */
--font-size-6xl: 3.75rem;   /* 60px */
```

#### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

## Component Usage

### Buttons

Use the standardized Button component:

```tsx
import { Button } from '@/components/ui/button';

// Primary CTA
<Button variant="primary">Get Quote</Button>

// Secondary action
<Button variant="secondary">Learn More</Button>

// Ghost/subtle action
<Button variant="ghost">View Details</Button>
```

### Headings

Use the Heading component for all headings:

```tsx
import { Heading } from '@/components/ui/Heading';

<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection</Heading>
```

### Text

Use the Text component for body copy:

```tsx
import { Text } from '@/components/ui/Text';

<Text size="lg">Large body text</Text>
<Text>Default body text</Text>
<Text size="sm" muted>Small muted text</Text>
```

### Sections

Use the Section component for page sections:

```tsx
import { Section } from '@/components/ui/Section';

<Section spacing="lg">
  {/* Content */}
</Section>
```

## Rules

### ✅ DO

1. **Use design tokens for all colors**
   ```tsx
   // Good
   className="bg-[var(--color-primary)]"
   style={{ color: 'var(--color-text-primary)' }}
   ```

2. **Use typography CSS classes**
   ```tsx
   // Good
   <h1 className="heading-1">Title</h1>
   <p className="body">Paragraph</p>
   ```

3. **Use UI components for common patterns**
   ```tsx
   // Good
   <Button variant="primary">Click Me</Button>
   ```

### ❌ DON'T

1. **Don't use hardcoded hex colors**
   ```tsx
   // Bad
   className="bg-[#1B4A9C]"
   style={{ color: '#9BC4E2' }}
   ```

2. **Don't use inline font sizes**
   ```tsx
   // Bad
   className="text-3xl"
   style={{ fontSize: '48px' }}
   ```

3. **Don't create one-off button styles**
   ```tsx
   // Bad
   <button className="bg-blue-500 px-4 py-2">Click Me</button>
   ```

## Migration Guide

### Replacing Hardcoded Colors

**Before:**
```tsx
<div className="bg-[#1B4A9C] text-[#9BC4E2]">
  Content
</div>
```

**After:**
```tsx
<div className="bg-[var(--color-primary)] text-[var(--color-secondary)]">
  Content
</div>
```

### Converting to UI Components

**Before:**
```tsx
<button className="bg-[#1B4A9C] text-white px-6 py-3 hover:bg-[#153A7E]">
  Get Quote
</button>
```

**After:**
```tsx
<Button variant="primary" size="lg">
  Get Quote
</Button>
```

## Validation

Run these commands to ensure compliance:

```bash
# Check for hardcoded colors (should return minimal results)
npm run lint:design-system

# Validate design system usage
npm run validate:design
```

## Maintenance

- **Tokens Location**: `design-tokens/tokens.json`
- **CSS Variables**: `styles/tokens.css`
- **Typography**: `styles/typography.css`
- **UI Components**: `components/ui/`

### Regenerating Tokens

If brand colors change, regenerate tokens from the live site:

```bash
node scripts/scrape-style-tokens.js --urls https://pgclosets.com
```

Then refactor the codebase:

```bash
node scripts/refactor-to-tokens.js --src ./app ./components
```

## Questions?

Contact the development team or refer to the component documentation in `components/ui/README.md`.

---

**Last Updated**: 2025-10-06
**Version**: 2.0.0
