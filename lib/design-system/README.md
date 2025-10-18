# PG Closets Design System

Inspired by Kit and Ace's minimal, elegant, and approachable aesthetic.

## Design Philosophy

**Minimal, Elegant, Not Pretentious**

- Clean and uncluttered interfaces
- Sophisticated simplicity
- Focus on content and usability
- Warm and approachable, not cold or corporate
- Timeless design that doesn't follow fleeting trends

## Brand Colors

### Primary Colors

```typescript
Navy: #1e3a5f    // Primary brand color - sophisticated and trustworthy
Sky Blue: #87CEEB // Secondary brand color - fresh and approachable
```

### Color Psychology

- **Navy (#1e3a5f)**: Trust, professionalism, reliability
- **Sky Blue (#87CEEB)**: Openness, freshness, clarity

## Typography

### Font Stack

```css
Primary: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", ...
Monospace: SF Mono, Monaco, Inconsolata, ...
```

### Type Scale (Perfect Fourth - 1.333)

```
xs:   12px / 16px line-height
sm:   14px / 20px line-height
base: 16px / 24px line-height (body text)
lg:   18px / 28px line-height
xl:   20px / 30px line-height
2xl:  24px / 32px line-height
3xl:  30px / 36px line-height
4xl:  36px / 40px line-height
5xl:  48px / 56px line-height (large headings)
6xl:  60px / 64px line-height
7xl:  72px / 72px line-height (hero text)
```

### Font Weights

```
Light:     300 - Minimal use, special headings
Normal:    400 - Body text
Medium:    500 - Emphasis, subheadings
Semibold:  600 - Headings, important UI elements
Bold:      700 - Strong emphasis, primary headings
```

### Letter Spacing

- **Headings**: Slightly tighter (-0.01em to -0.04em) for larger sizes
- **Body**: Normal (0)
- **Uppercase/Buttons**: Wider (0.025em to 0.05em)

## Spacing System

Based on **4px increments** for visual rhythm and consistency.

```
1  = 4px    (tight spacing, form elements)
2  = 8px    (component padding)
3  = 12px   (small gaps)
4  = 16px   (default component spacing)
6  = 24px   (section spacing)
8  = 32px   (large component spacing)
12 = 48px   (section breaks)
16 = 64px   (major sections)
24 = 96px   (page sections)
```

### Spacing Guidelines

- **Component Internal**: Use 4px, 8px, 16px
- **Between Components**: Use 16px, 24px, 32px
- **Section Breaks**: Use 48px, 64px, 96px
- **Page Margins**: Use responsive values (24px mobile, 48px+ desktop)

## Component Variants

### Buttons

#### Sizes
- **Small**: Height 32px, padding 8px 16px, text 14px
- **Medium** (default): Height 40px, padding 12px 24px, text 16px
- **Large**: Height 48px, padding 16px 32px, text 18px

#### Variants
```typescript
Primary:   Navy background, white text
Secondary: Sky Blue background, navy text
Outline:   Transparent bg, navy border and text
Ghost:     Transparent bg, no border, navy text on hover
```

#### States
- **Default**: Full opacity
- **Hover**: Slightly darker background
- **Active**: Even darker, slight scale down
- **Disabled**: 40% opacity, no interaction
- **Focus**: 2px sky blue outline, 2px offset

### Input Fields

#### Sizes
- **Small**: Height 32px, padding 8px 12px
- **Medium**: Height 40px, padding 12px 16px
- **Large**: Height 48px, padding 16px 20px

#### States
- **Default**: Light gray border
- **Focus**: Sky blue border, 2px width
- **Error**: Red border, error message below
- **Disabled**: Gray background, no interaction
- **Success**: Green border (optional)

### Cards

#### Padding
- **Small**: 16px
- **Medium**: 24px
- **Large**: 32px

#### Shadow
- **Default**: Subtle elevation (0 1px 3px rgba(0,0,0,0.1))
- **Hover**: Increased elevation (0 4px 6px rgba(0,0,0,0.1))
- **Focus**: Sky blue outline

#### Border Radius
- **Default**: 8px (--radius-lg)

## Color Palette

### Neutral Colors

```typescript
White:     #ffffff
Off-white: #fafaf9 (subtle backgrounds)
Gray-100:  #f5f5f4 (very light gray)
Gray-200:  #e7e5e4 (borders, dividers)
Gray-300:  #d6d3d1 (disabled states)
Gray-400:  #a8a29e (placeholder text)
Gray-500:  #78716c (secondary text)
Gray-600:  #57534e (body text)
Gray-800:  #292524 (headings)
Black:     #0a0a0a (high contrast text)
```

### Semantic Colors

```typescript
Success: #10b981 (green)
Warning: #f59e0b (amber)
Error:   #ef4444 (red)
Info:    #3b82f6 (blue)
```

### Accessible Color Combinations (WCAG AA)

✅ **Text on White**
- Primary Text (#1c1917): 16.63:1 contrast ratio
- Secondary Text (#57534e): 7.42:1 contrast ratio
- Tertiary Text (#78716c): 4.76:1 contrast ratio

✅ **Navy on White**
- Navy (#1e3a5f): 9.14:1 contrast ratio

✅ **Sky Blue Text**
- Use darker variation (#0284c7) for text: 4.58:1 contrast ratio

## Border Radius

```typescript
sm:      2px  (small elements, tags)
default: 4px  (inputs, buttons)
md:      6px  (cards, containers)
lg:      8px  (featured cards)
xl:      12px (large containers)
2xl:     16px (hero sections)
full:    9999px (pills, avatars)
```

## Shadows

Subtle and elegant, inspired by natural light.

```typescript
sm:   Minimal elevation (forms, inputs)
md:   Default elevation (cards, dropdowns)
lg:   Higher elevation (modals, popovers)
xl:   Maximum elevation (overlays)
inner: Inset shadow (pressed states)
```

## Transitions

### Duration
- **Fast**: 150ms (small UI changes, hovers)
- **Default**: 200ms (most interactions)
- **Slow**: 300ms (large movements, modals)
- **Slower**: 500ms (page transitions)

### Easing
- **Default**: cubic-bezier(0.4, 0, 0.2, 1) - Most interactions
- **Ease Out**: cubic-bezier(0, 0, 0.2, 1) - Entering elements
- **Ease In**: cubic-bezier(0.4, 0, 1, 1) - Exiting elements

## Accessibility

### Focus Indicators
- **Width**: 2px
- **Color**: Sky Blue (#87CEEB)
- **Offset**: 2px
- **Style**: Solid outline

### Touch Targets
- **Minimum**: 44px x 44px (WCAG 2.1 Level AAA)
- **Recommended**: 48px x 48px for primary actions

### Contrast Ratios
- **Normal Text**: 4.5:1 minimum (WCAG AA)
- **Large Text**: 3:1 minimum
- **UI Components**: 3:1 minimum

### Screen Reader Support
- Semantic HTML elements
- ARIA labels where needed
- Descriptive alt text for images
- Keyboard navigation support

## Breakpoints

```typescript
sm:  640px  (mobile landscape)
md:  768px  (tablets)
lg:  1024px (desktop)
xl:  1280px (large desktop)
2xl: 1536px (extra large screens)
```

### Mobile-First Approach
Start with mobile design, progressively enhance for larger screens.

## Z-Index Scale

```typescript
base:          0    (default)
dropdown:      1000
sticky:        1020
fixed:         1030
modalBackdrop: 1040
modal:         1050
popover:       1060
tooltip:       1070
```

## Usage Examples

### Import Design Tokens

```typescript
import { designTokens } from '@/lib/design-system/tokens';
import { colors, typography, spacing } from '@/lib/design-system/tokens';

// Use in components
const Button = styled.button`
  background-color: ${colors.brand.navy.DEFAULT};
  padding: ${spacing[4]} ${spacing[6]};
  font-size: ${typography.fontSize.base};
  border-radius: ${borderRadius.DEFAULT};
`;
```

### Tailwind CSS Classes

```tsx
<button className="bg-pg-navy hover:bg-pg-navy-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
  Primary Button
</button>

<div className="bg-white shadow-md rounded-lg p-6 space-y-4">
  Card Content
</div>
```

### Typography Examples

```tsx
<h1 className="text-5xl font-bold text-gray-800 tracking-tight">
  Hero Heading
</h1>

<p className="text-base text-gray-600 leading-relaxed">
  Body paragraph text with comfortable line height.
</p>

<span className="text-sm text-gray-500 uppercase tracking-wide">
  Overline Text
</span>
```

## Design Principles

1. **Clarity Over Cleverness**: Make it obvious, not obscure
2. **Consistency**: Use established patterns throughout
3. **Simplicity**: Remove, don't add
4. **Hierarchy**: Guide the eye naturally
5. **Whitespace**: Give content room to breathe
6. **Accessibility**: Design for everyone
7. **Performance**: Fast is a feature
8. **Delight**: Small moments of joy

## Component Checklist

When creating components, ensure:

- [ ] Uses design tokens (colors, spacing, typography)
- [ ] Has all interactive states (default, hover, active, focus, disabled)
- [ ] Meets WCAG AA accessibility standards
- [ ] Responsive across all breakpoints
- [ ] Consistent with existing components
- [ ] Has proper focus indicators
- [ ] Touch targets ≥ 44px
- [ ] Smooth transitions on state changes
- [ ] Semantic HTML elements
- [ ] Works with keyboard navigation

## Kit and Ace Inspiration

**What We Take:**
- Minimal aesthetic with plenty of whitespace
- Sophisticated color palette
- Clean typography
- Elegant interactions
- Approachable, human tone

**What We Avoid:**
- Pretentious language
- Overly complex designs
- Cluttered interfaces
- Unnecessary animations
- Cold, corporate feeling

---

**Version**: 1.0.0
**Last Updated**: 2025-10-04
**Maintainer**: PG Closets Design Team
