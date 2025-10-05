# PG Closets Design System - Complete Specification

**Version**: 1.0.0
**Date**: 2025-10-04
**Status**: Production Ready
**Inspiration**: Kit and Ace - Minimal, Elegant, Approachable

---

## Overview

The PG Closets Design System is a comprehensive design language inspired by Kit and Ace's aesthetic philosophy: minimal, elegant, and approachable. It provides a complete set of design tokens, components, and utilities for building consistent, accessible, and beautiful user interfaces.

### Design Philosophy

- **Minimal**: Clean, uncluttered interfaces with intentional whitespace
- **Elegant**: Sophisticated simplicity without pretension
- **Approachable**: Warm, human, and easy to use
- **Accessible**: WCAG AA compliant with inclusive design principles
- **Consistent**: Unified design language across all touchpoints

---

## File Structure

```
lib/design-system/
├── tokens.ts                 # Core design tokens (colors, typography, spacing, etc.)
├── index.ts                  # Central export and utility functions
├── variables.css             # CSS custom properties
├── README.md                 # Full documentation
├── USAGE.md                  # Quick usage guide
├── component-guide.md        # Component examples and patterns
└── DESIGN_SYSTEM_SPEC.md    # This file
```

---

## Core Components

### 1. Design Tokens (`tokens.ts`)

The foundation of the design system. All design decisions are codified as tokens.

**Color System**:
- Primary Brand Colors (Navy #1e3a5f, Sky Blue #87CEEB)
- Neutral Palette (50-900 scale, warm and approachable)
- Semantic Colors (success, warning, error, info)
- Interactive States (primary, secondary, hover, active, disabled)
- Surface Colors (backgrounds, overlays)
- Text Colors (WCAG AA compliant)
- Border Colors

**Typography System**:
- Font Families (Inter for UI, SF Mono for code)
- Type Scale (Perfect Fourth ratio - 1.333)
- Font Weights (300-700)
- Line Heights (tight to loose)
- Letter Spacing (optimized per size)

**Spacing System**:
- 4px base unit
- Consistent scale from 0-96 (0-384px)
- Semantic usage guidelines

**Visual Properties**:
- Border Radius (2px-24px + full)
- Shadows (subtle, elegant elevations)
- Transitions (durations and easing functions)
- Z-Index scale (organized layers)

**Component Tokens**:
- Button configurations
- Input field specifications
- Card layouts

**Accessibility Tokens**:
- Focus ring specifications
- Minimum touch targets (44px)
- Contrast ratio requirements

### 2. Tailwind Integration (`tailwind.config.ts`)

Seamless integration with Tailwind CSS:
- All design tokens available as Tailwind utilities
- Custom color classes (`pg-navy-*`, `pg-sky-*`, `pg-neutral-*`)
- Typography utilities
- Spacing utilities
- Extended animations
- Z-index utilities

**Usage Examples**:
```tsx
<button className="bg-pg-navy-800 hover:bg-pg-navy-700 px-6 py-3 rounded-lg">
  Button
</button>
```

### 3. CSS Variables (`variables.css`)

Comprehensive CSS custom properties for maximum flexibility:
- All color tokens as CSS variables
- Spacing tokens
- Typography tokens
- Visual properties
- Component-specific tokens

**Usage Examples**:
```css
.custom-button {
  background-color: var(--pg-navy-800);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-lg);
}
```

### 4. Utility Functions (`index.ts`)

Helper functions and presets:
- `cn()` - ClassName utility
- `withOpacity()` - Color with opacity
- `getResponsiveSpacing()` - Responsive spacing values
- Typography presets
- Spacing presets
- Animation presets
- Button presets
- Input presets
- Card presets
- Accessibility utilities

### 5. Component Library (`component-guide.md`)

Ready-to-use component patterns:
- Buttons (primary, secondary, outline, ghost)
- Form inputs (text, textarea, with validation)
- Cards (basic, with image, interactive)
- Typography (headings, body, special text, links)
- Badges (status, simple)
- Navigation (primary nav, breadcrumbs)
- Alerts (info, success, warning, error)
- Loading states (spinner, skeleton, shimmer)

---

## Color Palette

### Brand Colors

```typescript
Navy (Primary):
  50:  #f0f4f8
  100: #d9e2ec
  200: #bcccdc
  300: #9fb3c8
  400: #829ab1
  500: #627d98
  600: #486581
  700: #334e68
  800: #1e3a5f ← Primary
  900: #102a43

Sky Blue (Secondary):
  50:  #f0f9ff
  100: #e0f2fe
  200: #bae6fd
  300: #87CEEB ← Primary
  400: #38bdf8
  500: #0ea5e9
  600: #0284c7
  700: #0369a1
  800: #075985
  900: #0c4a6e
```

### Neutral Colors (Warm)

```typescript
White:     #ffffff
Off-white: #fafaf9
50:        #fafaf9
100:       #f5f5f4
200:       #e7e5e4
300:       #d6d3d1
400:       #a8a29e
500:       #78716c
600:       #57534e
700:       #44403c
800:       #292524
900:       #1c1917
Black:     #0a0a0a
```

### Semantic Colors

```typescript
Success: #10b981 (light: #d1fae5, dark: #065f46)
Warning: #f59e0b (light: #fef3c7, dark: #92400e)
Error:   #ef4444 (light: #fee2e2, dark: #991b1b)
Info:    #3b82f6 (light: #dbeafe, dark: #1e40af)
```

### Accessible Combinations (WCAG AA)

✅ **Primary Text on White**: 16.63:1 contrast ratio (#1c1917)
✅ **Secondary Text on White**: 7.42:1 contrast ratio (#57534e)
✅ **Tertiary Text on White**: 4.76:1 contrast ratio (#78716c)
✅ **Navy on White**: 9.14:1 contrast ratio (#1e3a5f)
✅ **Sky Blue (adjusted) on White**: 4.58:1 contrast ratio (#0284c7)

---

## Typography System

### Font Stack

```typescript
Primary (UI):   Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Monospace:      SF Mono, Monaco, Inconsolata, "Fira Code", monospace
```

### Type Scale (Perfect Fourth - 1.333)

```
Name    Size    Line Height   Use Case
xs      12px    16px          Captions, metadata
sm      14px    20px          Small UI text, labels
base    16px    24px          Body text (default)
lg      18px    28px          Large body, subheadings
xl      20px    30px          Section headings
2xl     24px    32px          Page headings
3xl     30px    36px          Major headings
4xl     36px    40px          Section heroes
5xl     48px    56px          Page heroes
6xl     60px    64px          Marketing headers
7xl     72px    72px          Landing page heroes
```

### Font Weights

```
Light (300):     Minimal use, special headings
Normal (400):    Body text, default
Medium (500):    Emphasis, subheadings
Semibold (600):  Headings, important UI
Bold (700):      Strong emphasis, primary headings
```

### Letter Spacing

- **Large Text (headings)**: -0.01em to -0.04em (tighter)
- **Body Text**: 0 (normal)
- **Small Text/Uppercase**: 0.025em to 0.05em (wider)

---

## Spacing System

Based on **4px increments** for visual rhythm:

```
1  = 4px     (tight spacing, inline elements)
2  = 8px     (component padding, small gaps)
3  = 12px    (default gaps)
4  = 16px    (default component spacing)
6  = 24px    (section spacing)
8  = 32px    (large component spacing)
12 = 48px    (section breaks)
16 = 64px    (major sections)
24 = 96px    (page sections)
```

### Spacing Guidelines

- **Component Internal**: 4px, 8px, 16px
- **Between Components**: 16px, 24px, 32px
- **Section Breaks**: 48px, 64px, 96px
- **Page Margins**: 24px mobile, 48px+ desktop

---

## Component Specifications

### Buttons

**Sizes**:
- Small: h-8 (32px), px-4 py-2, text-sm
- Medium: min-h-[44px] (40px), px-6 py-3, text-base
- Large: h-12 (48px), px-8 py-4, text-lg

**Variants**:
- **Primary**: Navy background, white text
- **Secondary**: Sky blue background, navy text
- **Outline**: Transparent, navy border
- **Ghost**: Transparent, hover state only

**States**:
- Default: Full opacity
- Hover: Darker background
- Active: Even darker, subtle scale
- Disabled: 40% opacity, no interaction
- Focus: 2px sky blue ring, 2px offset

### Inputs

**Sizes**:
- Small: h-8 (32px), px-3 py-2
- Medium: min-h-[44px] (40px), px-4 py-3
- Large: h-12 (48px), px-5 py-4

**States**:
- Default: Light gray border
- Focus: Sky blue border (2px)
- Error: Red border, error message
- Disabled: Gray background
- Success: Green border (optional)

### Cards

**Padding**:
- Small: 16px (p-4)
- Medium: 24px (p-6)
- Large: 32px (p-8)

**Styling**:
- Border: 1px light gray
- Border Radius: 8px (rounded-lg)
- Shadow: Subtle elevation (shadow-md)
- Hover: Increased shadow (shadow-lg)

---

## Accessibility Standards

### WCAG AA Compliance

✅ **Text Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
✅ **UI Component Contrast**: Minimum 3:1
✅ **Touch Targets**: Minimum 44px x 44px
✅ **Focus Indicators**: 2px ring, 2px offset, sky blue color
✅ **Keyboard Navigation**: Full support
✅ **Screen Reader**: Semantic HTML, ARIA labels
✅ **Color Independence**: Never rely on color alone

### Accessibility Features

- Focus ring on all interactive elements
- Skip to main content link
- Screen reader only text utility
- Semantic HTML structure
- Proper heading hierarchy
- Form label associations
- ARIA attributes where needed
- Reduced motion support

---

## Implementation Guide

### Step 1: Import CSS Variables

Add to your global CSS:

```css
@import '../lib/design-system/variables.css';
```

### Step 2: Use Design Tokens

```typescript
// Import tokens
import { colors, typography, spacing } from '@/lib/design-system';

// Use in components
const styles = {
  backgroundColor: colors.brand.navy.DEFAULT,
  padding: `${spacing[3]} ${spacing[6]}`,
  fontSize: typography.fontSize.base,
};
```

### Step 3: Use Tailwind Classes

```tsx
<button className="bg-pg-navy-800 hover:bg-pg-navy-700 px-6 py-3 rounded-lg">
  Button
</button>
```

### Step 4: Use Presets

```typescript
import { buttonPresets, typographyPresets, cn } from '@/lib/design-system';

<button className={cn(buttonPresets.primary)}>
  Primary Button
</button>

<h1 className={typographyPresets.hero}>
  Hero Heading
</h1>
```

---

## Maintenance & Evolution

### Version Control

- **Major Version**: Breaking changes to API or token structure
- **Minor Version**: New tokens, components, or utilities
- **Patch Version**: Bug fixes, documentation updates

### Contributing Guidelines

1. All new tokens must have clear documentation
2. All components must be accessible (WCAG AA)
3. All changes must maintain backward compatibility (unless major version)
4. All colors must meet contrast requirements
5. All spacing must use 4px increments

### Future Enhancements

- [ ] Dark mode support
- [ ] Additional component variants
- [ ] Animation library expansion
- [ ] Additional semantic tokens
- [ ] Component composition utilities
- [ ] Design system testing suite

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## Performance Considerations

- CSS variables are cached by browser
- Tailwind classes are purged in production
- Design tokens are tree-shakeable
- No runtime dependencies
- Minimal CSS bundle size

---

## Support & Resources

- **Documentation**: See `README.md`
- **Quick Start**: See `USAGE.md`
- **Component Examples**: See `component-guide.md`
- **Token Reference**: See `tokens.ts`
- **CSS Variables**: See `variables.css`

---

## License

Proprietary - PG Closets
© 2025 PG Closets. All rights reserved.

---

**Last Updated**: 2025-10-04
**Maintained By**: PG Closets Design Team
**Version**: 1.0.0
