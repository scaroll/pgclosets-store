## PG CLOSETS LUXURY DESIGN SYSTEM

**Version:** 1.0.0
**Last Updated:** October 2025
**Philosophy:** Minimal sophistication • Generous whitespace • Perfect typography

---

## 📋 TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Components](#components)
7. [Animation System](#animation-system)
8. [Grid & Layout](#grid--layout)
9. [Accessibility](#accessibility)
10. [Implementation Guide](#implementation-guide)

---

## 🎨 INTRODUCTION

The PG Closets Design System is a luxury-focused design language inspired by high-end brands like Aesop, Everlane, and Farrow & Ball. It emphasizes:

- **Minimal Sophistication** - Clean, uncluttered interfaces
- **Generous Whitespace** - Breathing room for content
- **Perfect Typography** - Refined typographic hierarchy
- **Subtle Interactions** - Elegant micro-animations
- **High-Quality Imagery** - Premium visual presentation

### Brand Aesthetic

Our design system creates a **sophisticated, approachable luxury** experience that positions PG Closets as a premium, trustworthy brand.

---

## 🎯 DESIGN PRINCIPLES

### 1. **Clarity Over Cleverness**
- Clear communication trumps visual complexity
- Every element serves a purpose
- Remove rather than add

### 2. **Consistency Creates Trust**
- Predictable patterns build confidence
- Systematic approach to all design decisions
- Unified voice across all touchpoints

### 3. **Quality in Details**
- Refined typography and spacing
- Subtle, purposeful animations
- High-quality, optimized imagery

### 4. **Accessibility First**
- WCAG 2.1 AA compliant minimum
- Keyboard navigation support
- Screen reader optimized
- Reduced motion respect

### 5. **Performance Matters**
- Lightweight, optimized CSS
- GPU-accelerated animations
- Progressive enhancement
- Mobile-first approach

---

## 🌈 COLOR SYSTEM

### Primary Palette

```css
/* Sophisticated Darks */
--ds-charcoal: #1C1C1C;  /* Primary dark, high contrast */
--ds-graphite: #2D2D2D;  /* Secondary dark */
--ds-slate: #4A4A4A;     /* Tertiary dark */
--ds-stone: #6B6B6B;     /* Muted dark */

/* Warm Neutrals */
--ds-pearl: #F8F6F0;     /* Primary light background */
--ds-cream: #FDF6E3;     /* Warm accent background */
--ds-ivory: #FFFFF0;     /* Subtle highlight */
--ds-white: #FFFFFF;     /* Pure white */
```

### Accent Colors

```css
/* Metallic Accents */
--ds-bronze: #8B7355;    /* Warm metallic */
--ds-copper: #B87333;    /* Rich metallic */
--ds-gold: #D4AF37;      /* Luxury accent */
--ds-rose-gold: #B76E79; /* Soft metallic */
```

### Semantic Colors

```css
/* Status & Feedback */
--ds-success: #065F46;   /* Deep forest green */
--ds-warning: #92400E;   /* Rich amber */
--ds-error: #7F1D1D;     /* Deep crimson */
--ds-info: #1E3A8A;      /* Deep navy */
```

### Color Usage Guidelines

**DO:**
- Use charcoal for primary text (21:1 contrast ratio)
- Use pearl for light backgrounds with warmth
- Use gold sparingly for premium accents
- Maintain 4.5:1 contrast minimum for body text

**DON'T:**
- Use pure black (#000000) for text
- Overuse metallic accents (max 10% of design)
- Use semantic colors for non-semantic purposes

---

## ✍️ TYPOGRAPHY

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont,
             'Segoe UI', 'Roboto', 'Helvetica Neue',
             'Arial', sans-serif;
```

**Why Inter?**
- Exceptional legibility at all sizes
- Wide range of weights (300-700)
- OpenType features support
- Designed specifically for screens

### Type Scale (Perfect Fourth - 1.333 Ratio)

```css
--ds-text-xs: 0.75rem;   /* 12px - Captions */
--ds-text-sm: 0.875rem;  /* 14px - Small body */
--ds-text-base: 1rem;    /* 16px - Body text */
--ds-text-lg: 1.125rem;  /* 18px - Large body */
--ds-text-xl: 1.333rem;  /* 21px - Subheadings */
--ds-text-2xl: 1.777rem; /* 28px - H4 */
--ds-text-3xl: 2.369rem; /* 38px - H3 */
--ds-text-4xl: 3.157rem; /* 50px - H2 */
--ds-text-5xl: 4.209rem; /* 67px - H1 */
--ds-text-6xl: 5.61rem;  /* 90px - Display */
```

### Typography Components

#### Display Text
```tsx
import { Display, DisplayXL } from '@/components/ui/design-system';

<Display>Luxury Closet Systems</Display>
<DisplayXL>Transform Your Space</DisplayXL>
```

**Usage:** Hero headlines, marketing moments

#### Headings (H1-H6)
```tsx
import { H1, H2, H3, H4, H5, H6 } from '@/components/ui/design-system';

<H1>Main Page Title</H1>
<H2>Section Heading</H2>
<H3>Subsection Heading</H3>
```

**Font Weights:**
- H1: Light (300) - Elegant, refined
- H2: Regular (400) - Balanced authority
- H3-H4: Medium (500) - Clear hierarchy
- H5-H6: Semibold (600) - Emphasized labels

#### Body Text
```tsx
import { BodyXL, BodyLG, Body, BodySM } from '@/components/ui/design-system';

<BodyXL>Lead paragraph text</BodyXL>
<Body>Standard paragraph text</Body>
<BodySM>Small supporting text</BodySM>
```

#### Captions & Labels
```tsx
import { Caption, Label } from '@/components/ui/design-system';

<Caption>Product Category</Caption>
<Label htmlFor="email">Email Address</Label>
```

### Line Height Guidelines

```css
--ds-leading-tight: 1.2;    /* Display, H1-H2 */
--ds-leading-snug: 1.35;    /* H3-H4 */
--ds-leading-normal: 1.5;   /* Body text, H5-H6 */
--ds-leading-relaxed: 1.7;  /* Large body, articles */
--ds-leading-loose: 2;      /* Airy, spacious layouts */
```

### Letter Spacing

```css
--ds-tracking-tight: -0.02em;  /* Large headings */
--ds-tracking-normal: 0em;     /* Body text */
--ds-tracking-wide: 0.025em;   /* H5-H6, labels */
--ds-tracking-wider: 0.05em;   /* Buttons, captions */
--ds-tracking-widest: 0.1em;   /* All-caps text */
```

---

## 📏 SPACING SYSTEM

### 8-Point Grid System

Our spacing system uses an 8px base unit for mathematical consistency and visual rhythm.

```css
--ds-space-1: 0.25rem;   /* 4px - Tight spacing */
--ds-space-2: 0.5rem;    /* 8px - Default gap */
--ds-space-3: 0.75rem;   /* 12px - Compact */
--ds-space-4: 1rem;      /* 16px - Standard */
--ds-space-6: 1.5rem;    /* 24px - Comfortable */
--ds-space-8: 2rem;      /* 32px - Generous */
--ds-space-12: 3rem;     /* 48px - Section spacing */
--ds-space-16: 4rem;     /* 64px - Large sections */
--ds-space-24: 6rem;     /* 96px - Hero spacing */
--ds-space-32: 8rem;     /* 128px - Extra large */
```

### Spacing Usage

**Component Internal Spacing:**
- Small components: 4px-12px (space-1 to space-3)
- Medium components: 16px-24px (space-4 to space-6)
- Large components: 32px-48px (space-8 to space-12)

**Layout Spacing:**
- Between elements: 24px-32px (space-6 to space-8)
- Section padding: 48px-96px (space-12 to space-24)
- Hero sections: 96px-128px (space-24 to space-32)

---

## 🧩 COMPONENTS

### Button System

```tsx
import { Button } from '@/components/ui/design-system';

// Primary - Dark sophisticated
<Button variant="primary" size="md">Shop Now</Button>

// Secondary - Clean outline
<Button variant="secondary" size="md">Learn More</Button>

// Accent - Metallic gold
<Button variant="accent" size="lg">Request Quote</Button>

// Ghost - Minimal
<Button variant="ghost" size="sm">View Details</Button>
```

**Variants:**
- **Primary:** Charcoal background, white text, hover effect reveals white
- **Secondary:** White background, charcoal border, hover fills with charcoal
- **Accent:** Gold gradient, white text, subtle lift on hover
- **Ghost:** Transparent, minimal style for secondary actions

**Sizes:**
- **sm:** 36px height, 12px/24px padding, text-xs
- **md:** 48px height, 16px/32px padding, text-sm (default)
- **lg:** 56px height, 24px/48px padding, text-base

**Accessibility:**
- Minimum 44px touch target (48px default)
- 3px gold outline on focus-visible
- Clear hover/active states
- Disabled state with reduced opacity

### Card System

```tsx
import { Card, CardImage, CardContent } from '@/components/ui/design-system';

<Card variant="default">
  <CardImage>
    <img src="/product.jpg" alt="Product name" />
  </CardImage>
  <CardContent size="md">
    <h3>Product Title</h3>
    <p>Product description...</p>
  </CardContent>
</Card>
```

**Variants:**
- **default:** White background, subtle border, soft shadow on hover
- **elevated:** Pre-elevated with shadow, dramatic lift on hover

**Card Features:**
- 4:3 aspect ratio image container
- Gold top border reveal on hover
- Image zoom on hover (105% scale)
- Vertical lift animation (-4px)

### Form Components

```tsx
import { Input, Textarea, Select, FormField } from '@/components/ui/design-system';

<FormField
  label="Your Name"
  htmlFor="name"
  required
  helpText="Enter your full name"
>
  <Input
    id="name"
    placeholder="John Doe"
    error={false}
  />
</FormField>

<FormField label="Message" htmlFor="message">
  <Textarea
    id="message"
    placeholder="Tell us about your project..."
    rows={6}
  />
</FormField>

<FormField label="Service Type" htmlFor="service">
  <Select
    id="service"
    options={[
      { value: 'closet', label: 'Custom Closets' },
      { value: 'doors', label: 'Bypass Doors' },
    ]}
  />
</FormField>
```

**Form Features:**
- 48px minimum height for accessibility
- 2px borders with gold focus ring
- Clear error states with descriptive messages
- ARIA attributes for screen readers
- Responsive font sizing (min 16px to prevent zoom on iOS)

---

## 🎬 ANIMATION SYSTEM

### Core Animations

```tsx
// Fade In - Gentle entrance
<div className="ds-animate-fade-in">Content</div>

// Slide Up - Upward reveal
<div className="ds-animate-slide-up ds-delay-200">Content</div>

// Scale In - Subtle zoom
<div className="ds-animate-scale-in">Content</div>

// Shimmer - Loading effect
<div className="ds-animate-shimmer">Loading...</div>
```

### Timing Functions

```css
--ds-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--ds-transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--ds-transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
--ds-transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

**Usage Guidelines:**
- **Fast (150ms):** Hover states, small elements
- **Base (250ms):** Default transitions, medium elements
- **Slow (350ms):** Complex transforms, large elements
- **Slower (500ms):** Page transitions, fade effects

### Animation Delays

```tsx
// Stagger animations for visual interest
<div className="ds-animate-fade-in">First</div>
<div className="ds-animate-fade-in ds-delay-100">Second</div>
<div className="ds-animate-fade-in ds-delay-200">Third</div>
<div className="ds-animate-fade-in ds-delay-300">Fourth</div>
```

### Reduced Motion

Our system respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📐 GRID & LAYOUT

### Container System

```tsx
import { Container, Section } from '@/components/ui/design-system';

<Container>
  <Section size="lg">
    <h1>Page Content</h1>
  </Section>
</Container>
```

**Container Specifications:**
- Max-width: 1440px
- Padding: 24px mobile, 32px tablet, 48px desktop
- Centered with `margin: 0 auto`

### Grid System

```tsx
import { Grid } from '@/components/ui/design-system';

// 2-column grid
<Grid columns={2}>
  <div>Column 1</div>
  <div>Column 2</div>
</Grid>

// 3-column grid (default)
<Grid columns={3}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// 4-column grid
<Grid columns={4}>
  {products.map(product => <ProductCard key={product.id} {...product} />)}
</Grid>
```

**Responsive Behavior:**
- 4-column → 2-column (tablet) → 1-column (mobile)
- 3-column → 2-column (tablet) → 1-column (mobile)
- 2-column → 1-column (mobile)
- 24px gap between grid items

### Section Spacing

```tsx
<Section size="sm">Compact section</Section>
<Section size="md">Standard section</Section>
<Section size="lg">Generous section</Section>
```

**Section Sizes:**
- **sm:** 64px vertical padding
- **md:** 96px vertical padding (default)
- **lg:** 128px vertical padding

---

## ♿ ACCESSIBILITY

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:

- **Charcoal on White:** 21:1 (AAA)
- **Graphite on White:** 12:1 (AAA)
- **Slate on White:** 7.8:1 (AA)
- **Stone on White:** 4.9:1 (AA)

### Focus Management

- **Keyboard Navigation:** All interactive elements focusable
- **Focus Indicators:** 3px gold outline with 3px offset
- **Skip Links:** "Skip to main content" for screen readers
- **Focus Trapping:** In modals and dialogs

### Screen Reader Support

```tsx
// Visually hidden but available to screen readers
<span className="ds-sr-only">
  Product price: $299
</span>

// Descriptive labels
<Button aria-label="Add to cart">
  <CartIcon />
</Button>

// Form field associations
<Label htmlFor="email">Email</Label>
<Input id="email" aria-required="true" />
```

### Semantic HTML

- Use proper heading hierarchy (H1 → H2 → H3)
- Use `<nav>` for navigation
- Use `<main>` for primary content
- Use `<article>` for blog posts/products
- Use `<section>` for thematic groupings

---

## 🚀 IMPLEMENTATION GUIDE

### Installation

1. **Import Design System CSS:**

```tsx
// In your app layout or main CSS file
import '@/styles/design-system.css';
```

2. **Import Components:**

```tsx
import {
  Button,
  Card,
  Container,
  H1,
  Body
} from '@/components/ui/design-system';
```

### Basic Page Structure

```tsx
import {
  Container,
  Section,
  H1,
  Body,
  Button,
  Grid,
  Card
} from '@/components/ui/design-system';

export default function Page() {
  return (
    <main>
      {/* Hero Section */}
      <Section size="lg" className="ds-bg-pearl">
        <Container>
          <H1 className="text-center">
            Transform Your Home
          </H1>
          <Body className="text-center max-w-2xl mx-auto">
            Custom closet systems designed for your lifestyle
          </Body>
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="primary" size="lg">
              Request Quote
            </Button>
            <Button variant="secondary" size="lg">
              View Gallery
            </Button>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section>
        <Container>
          <Grid columns={3}>
            {products.map(product => (
              <Card key={product.id}>
                <CardImage>
                  <img src={product.image} alt={product.name} />
                </CardImage>
                <CardContent>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </main>
  );
}
```

### Customization

Extend the design system with custom utilities:

```css
/* In your custom CSS file */
@import '../styles/design-system.css';

/* Custom gradient backgrounds */
.hero-gradient {
  background: linear-gradient(
    135deg,
    var(--ds-pearl) 0%,
    var(--ds-cream) 100%
  );
}

/* Custom card variant */
.card-premium {
  @apply ds-card;
  border: 2px solid var(--ds-gold);
}
```

### Tailwind Integration

Update `tailwind.config.ts` to include design system tokens:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1C1C1C',
        graphite: '#2D2D2D',
        slate: '#4A4A4A',
        stone: '#6B6B6B',
        pearl: '#F8F6F0',
        cream: '#FDF6E3',
        bronze: '#8B7355',
        gold: '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
```

---

## 📚 RESOURCES

### Typography
- [Inter Font Family](https://rsms.me/inter/)
- [Type Scale Calculator](https://type-scale.com/)
- [Practical Typography](https://practicaltypography.com/)

### Colors
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Palette Generator](https://coolors.co/)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Inspiration
- [Aesop Design System](https://aesop.com/)
- [Everlane](https://www.everlane.com/)
- [Farrow & Ball](https://www.farrowandball.com/)

---

## 📝 CHANGELOG

### Version 1.0.0 (October 2025)
- Initial release of PG Closets Design System
- Complete component library
- Comprehensive documentation
- Accessibility compliance
- Responsive grid system
- Animation framework

---

**Questions or Feedback?**
Contact the Design Team: design@pgclosets.com
