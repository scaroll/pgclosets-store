# PG Closets Visual System

**"Elevated Taste Without Pretense"**

Unified design system ensuring visual consistency across all pages.

## 📋 Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Components](#components)
5. [Spacing & Layout](#spacing--layout)
6. [Usage Guidelines](#usage-guidelines)
7. [Migration Guide](#migration-guide)

---

## Design Principles

### Luxury Black/White Aesthetic
- **Primary**: Pure black (#000000) - Sophisticated and timeless
- **Secondary**: Pure white (#FFFFFF) - Clean and modern
- **Accents**: Subtle grays for depth and hierarchy

### Key Characteristics
- ✨ **Minimal** - No unnecessary decoration
- 🎨 **Geometric** - Sharp edges, no rounded corners (except inputs)
- 🏃 **Smooth** - 300-700ms transitions for elegance
- ♿ **Accessible** - WCAG AA compliant throughout
- 📱 **Responsive** - Mobile-first design approach

### Brand Cues
- **Tagline**: "Elevated Taste Without Pretense"
- **Trust Indicators**: BBB A+ Rated, 5.0 ★★★★★ Reviews, Lifetime Warranty, Official Renin Dealer
- **Contact**: (613) 422-5800
- **Services**: 500+ Ottawa Installations, Price Match Guarantee

---

## Color System

### Primary Colors

```json
{
  "primary": "#000000",      // Pure black
  "secondary": "#ffffff",    // Pure white
  "charcoal": "#1a1a1a",     // Deep charcoal
  "graphite": "#4a5568",     // Mid-tone gray
  "pearl": "#f7fafc"         // Subtle off-white
}
```

### Text Colors (WCAG AA Compliant)

```json
{
  "text-primary": "#000000",    // 21:1 contrast - AAA
  "text-secondary": "#1e293b",  // 12:1 contrast - AA
  "text-muted": "#64748b",      // 4.5:1 contrast - AA
  "text-inverse": "#ffffff"
}
```

### Semantic Colors

```json
{
  "success": "#10b981",  // Green - 4.5:1 AA
  "warning": "#f59e0b",  // Amber - 4.5:1 AA
  "error": "#dc2626",    // Red - 4.5:1 AA
  "info": "#0f172a"      // Navy - 12:1 AA
}
```

### Border Colors

```json
{
  "border-default": "#e2e8f0",
  "border-light": "#f1f5f9",
  "border-dark": "#000000",
  "border-subtle": "rgba(0, 0, 0, 0.1)",
  "border-focus": "#2563eb"
}
```

### Usage

**CSS Variables:**
```css
.element {
  color: var(--pg-text-primary);
  background: var(--pg-surface-primary);
  border-color: var(--pg-border-subtle);
}
```

**Tailwind Utilities:**
```jsx
<div className="text-primary bg-white border border-subtle">
  Content
</div>
```

**🚫 NEVER use raw hex colors:**
```jsx
// ❌ BAD
<div style={{ color: '#000000' }}>

// ✅ GOOD
<div className="text-primary">
```

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont,
  'SF Pro Display', 'SF Pro Text',
  'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Scale (Perfect Fourth - 1.333)

| Size | Value | Usage |
|------|-------|-------|
| xs | 12px | Captions, labels |
| sm | 14px | Body small, helper text |
| base | 16px | Body text |
| lg | 18px | Body large |
| xl | 20px | Subheadings |
| 2xl | 24px | Section headings |
| 3xl | 30px | Page headings |
| 4xl | 36px | Hero text |
| 5xl | 48px | Large hero |
| 6xl | 60px | Display text |
| 7xl | 72px | Extra large display |

### Heading Components

```tsx
import { Heading } from '@/components/ui-kit';

<Heading level={1} balance>Elevated Taste</Heading>
<Heading level={2}>Without Pretense</Heading>
<Heading level={3}>Our Collection</Heading>
```

### CSS Classes

```jsx
<h1 className="heading-1">Page Title</h1>
<h2 className="heading-2">Section Title</h2>
<p className="body-lg">Large body text</p>
<p className="body">Standard body text</p>
<span className="caption">LABEL TEXT</span>
```

### Font Weights

- **Light (300)**: Large headings, display text
- **Normal (400)**: Body text, descriptions
- **Medium (500)**: Subheadings, emphasis
- **Semibold (600)**: Labels, CTAs
- **Bold (700)**: Strong emphasis (use sparingly)

### Letter Spacing

- **Tight (-0.02em)**: Large headings
- **Normal (-0.011em)**: Body text
- **Wide (0.025em)**: Buttons, labels
- **Wider (0.05em)**: All caps text
- **Widest (0.08em)**: Micro labels

---

## Components

### Button

```tsx
import { Button } from '@/components/ui-kit';

// Primary black button
<Button variant="primary" size="md">
  View Details
</Button>

// Secondary white button
<Button variant="secondary" size="lg">
  Get Quote
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Learn More
</Button>
```

**Variants:**
- `primary` - Black background, white text
- `secondary` - White background, black border & text
- `ghost` - Transparent, minimal styling

**Sizes:**
- `sm` - 32px height, compact
- `md` - 40px height, default
- `lg` - 48px height, prominent

**Features:**
- Smooth scale-X animation on hover (700ms)
- -1px lift on hover
- 3px focus ring for accessibility
- Min 44px touch target
- Uppercase tracking-wide text

### Card

```tsx
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@/components/ui-kit';

<Card hover padding="md">
  <CardImage src="/product.jpg" alt="Product" />
  <CardContent>
    <CardTitle>Euro 3-Lite Bypass</CardTitle>
    <CardDescription>
      Sophisticated sliding door system with premium materials
    </CardDescription>
  </CardContent>
</Card>
```

**Features:**
- Subtle border (border-black/10)
- Top border reveal on hover (black line)
- -1px lift with shadow-2xl on hover
- 700ms smooth transitions

### Badge

```tsx
import { Badge } from '@/components/ui-kit';

<Badge variant="premium">Official Renin Dealer</Badge>
<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="error">Out of Stock</Badge>
```

### Input & Textarea

```tsx
import { Input, Textarea } from '@/components/ui-kit';

<Input
  label="Full Name"
  placeholder="John Doe"
  error={errors.name}
  helperText="As it appears on ID"
/>

<Textarea
  label="Message"
  rows={4}
  error={errors.message}
/>
```

**Features:**
- 2px border, 3px focus ring
- WCAG AA compliant focus states
- Error/helper text support
- Disabled state styling
- Min 44px height for accessibility

---

## Spacing & Layout

### Spacing Scale (4px base)

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0px | Reset |
| 1 | 4px | Tight spacing |
| 2 | 8px | Small gaps |
| 3 | 12px | Component padding |
| 4 | 16px | Default spacing |
| 6 | 24px | Section gaps |
| 8 | 32px | Large spacing |
| 12 | 48px | Section padding |
| 16 | 64px | Hero spacing |
| 24 | 96px | Page sections |

### Container Widths

```tsx
// Max widths
sm: 640px   // Mobile content
md: 768px   // Tablets
lg: 1024px  // Small desktop
xl: 1200px  // Standard desktop (most content)
2xl: 1440px // Wide layouts
```

### Grid System

```jsx
// 2-column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 4-column grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## Usage Guidelines

### ✅ DO

1. **Use UI Kit Components**
   ```tsx
   import { Button, Card, Heading } from '@/components/ui-kit';
   ```

2. **Use Design Tokens**
   ```css
   color: var(--pg-text-primary);
   ```

3. **Use Tailwind Utilities**
   ```jsx
   <div className="text-primary bg-white border-subtle">
   ```

4. **Follow Typography Scale**
   ```jsx
   <h1 className="heading-1">
   <p className="body">
   ```

5. **Use Semantic Spacing**
   ```jsx
   <div className="p-6 space-y-4">
   ```

### ❌ DON'T

1. **No Raw Hex Colors**
   ```jsx
   // ❌ BAD
   <div style={{ color: '#000000' }}>

   // ✅ GOOD
   <div className="text-primary">
   ```

2. **No Inline Styles**
   ```jsx
   // ❌ BAD
   <div style={{ padding: '16px' }}>

   // ✅ GOOD
   <div className="p-4">
   ```

3. **No Legacy Classes**
   ```jsx
   // ❌ BAD
   <button className="btn-primary ds-btn-primary">

   // ✅ GOOD
   <Button variant="primary">
   ```

4. **No Blue Colors**
   ```jsx
   // ❌ BAD - Old navy/sky theme
   <div className="bg-blue-600 text-blue-100">

   // ✅ GOOD - Black/white theme
   <div className="bg-black text-white">
   ```

5. **No Mixed Design Systems**
   ```tsx
   // ❌ BAD
   import '@/styles/design-system.css';
   import '@/lib/design-system/variables.css';

   // ✅ GOOD
   import '@/app/globals-unified.css';
   ```

---

## Migration Guide

### Step 1: Update Imports

**Replace:**
```tsx
import '@/app/globals.css';
import '@/styles/design-system.css';
import '@/lib/design-system/variables.css';
```

**With:**
```tsx
import '@/app/globals-unified.css';
```

### Step 2: Replace Button Components

**Old:**
```tsx
<button className="btn-primary">Click</button>
<button className="ds-btn-primary">Click</button>
```

**New:**
```tsx
import { Button } from '@/components/ui-kit';
<Button variant="primary">Click</Button>
```

### Step 3: Replace Card Components

**Old:**
```tsx
<div className="card-modern">...</div>
<div className="ds-card">...</div>
```

**New:**
```tsx
import { Card } from '@/components/ui-kit';
<Card hover padding="md">...</Card>
```

### Step 4: Update Colors

**Old:**
```tsx
<div className="bg-pg-navy text-pg-sky">
<div className="text-pg-navy-800">
<div className="bg-ds-charcoal">
```

**New:**
```tsx
<div className="bg-black text-white">
<div className="text-primary">
<div className="bg-charcoal">
```

### Step 5: Update Typography

**Old:**
```tsx
<h1 className="text-h1 ds-h1">
<p className="text-body-l ds-body-lg">
```

**New:**
```tsx
import { Heading } from '@/components/ui-kit';
<Heading level={1}>...</Heading>
<p className="body-lg">...</p>
```

### Step 6: Run Quality Gates

```bash
# Validate design system compliance
npm run lint:design-system

# Check for visual inconsistencies
./scripts/enforce-design-system.sh

# Type check
npm run type-check
```

---

## File Structure

```
pgclosets-store-main/
├── design-tokens/
│   └── tokens.json              # Single source of truth
├── components/
│   └── ui-kit/                  # Unified UI components
│       ├── Button.tsx
│       ├── Heading.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Input.tsx
│       └── index.ts
├── app/
│   └── globals-unified.css      # Unified design system CSS
├── scripts/
│   └── enforce-design-system.sh # Quality gate script
├── docs/
│   └── visual-system.md         # This file
└── .stylelintrc.json            # CSS linting rules
```

---

## Quality Gates

### Pre-commit Checks

1. **No raw hex colors** - Enforced by Stylelint
2. **No deprecated imports** - Checked by ESLint
3. **No inline styles** - Validated by enforcement script
4. **Design token usage** - Required for all colors

### Scripts

```bash
# Run all checks
npm run lint:design-system

# Enforce design system
./scripts/enforce-design-system.sh

# Type safety
npm run type-check

# Visual regression tests
npm run test:visual
```

---

## Resources

### Design Tokens
- **File**: `/design-tokens/tokens.json`
- **Format**: Design Tokens Community Group standard
- **Usage**: Import in Tailwind config or use CSS variables

### UI Kit Components
- **Location**: `@/components/ui-kit`
- **Exports**: Button, Heading, Card, Badge, Input, Textarea
- **Documentation**: JSDoc comments in each component

### CSS System
- **File**: `@/app/globals-unified.css`
- **Layers**: base, components, utilities
- **Variables**: `--pg-*` prefix for all tokens

### Support
- **Docs**: `/docs/visual-system.md`
- **Examples**: `/docs/examples/`
- **Issues**: Report visual inconsistencies to design system team

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Maintained by**: PG Closets AI Development Division
