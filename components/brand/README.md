# PG Closets Enhanced Logo Integration Components

Sophisticated logo integration components designed to elevate the PG Closets brand presence while maintaining the premium aesthetic of "Elevated Taste Without Pretense."

## Overview

This component library provides five main logo integration elements:

1. **AnimatedLogo** - Subtle entrance animations for premium brand reveals
2. **LogoLoadingStates** - Skeleton loaders that maintain brand consistency
3. **ResponsiveLogoVariants** - Context-aware sizing and responsive behavior
4. **LogoBackgroundPatterns** - Subtle brand elements for section backgrounds
5. **InteractiveLogo** - Sophisticated hover states and micro-interactions

## Installation & Setup

These components are designed for use within the PG Closets Next.js application and require:

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Framer Motion 11+
- Next.js 15+

```tsx
// Import individual components
import { AnimatedLogo, LogoLoadingStates } from '@/components/brand';

// Or import all components
import * as BrandComponents from '@/components/brand';
```

## Component Showcase

### 1. AnimatedLogo

Sophisticated entrance animations with multiple presets for different brand contexts.

```tsx
// Basic luxury animation (recommended)
<AnimatedLogo animation="luxury" />

// Hero section with custom timing
<AnimatedLogo
  animation="scale"
  width={300}
  height={60}
  delay={0.5}
  onAnimationComplete={() => console.log('Logo revealed!')}
/>

// Promotional badge variant
<AnimatedLogoWithBadge
  animation="luxury"
  badge={{
    text: "New Collection",
    color: "accent",
    position: "top-right"
  }}
/>
```

**Animation Types:**
- `luxury` - Premium easing with blur and scale (recommended)
- `fade` - Simple opacity transition
- `slide` - Horizontal slide entrance
- `scale` - Scale-based reveal

### 2. LogoLoadingStates

Brand-consistent loading animations that maintain visual hierarchy during content loading.

```tsx
// Luxury loading for premium experience
<LogoLoadingStates variant="luxury" size="lg" />

// Quick shimmer for fast transitions
<LogoLoadingStates
  variant="shimmer"
  size="md"
  speed="fast"
  withWordmark={true}
/>

// Full-screen loading overlay
<LogoLoadingOverlay
  variant="luxury"
  message="Preparing your personalized closet design..."
  timeout={15000}
  onTimeout={() => setShowFallback(true)}
/>
```

**Loading Variants:**
- `luxury` - Premium gradients with ambient glow (recommended)
- `skeleton` - Clean skeleton placeholder
- `pulse` - Gentle pulsing animation
- `shimmer` - Sophisticated shimmer effect
- `dots` - Playful dots animation

### 3. ResponsiveLogoVariants

Intelligent logo sizing and adaptation for different contexts and screen sizes.

```tsx
// Header navigation logo
<ResponsiveLogoVariants
  variant="header"
  theme="auto"
  animated={true}
  onLogoClick={() => router.push('/')}
/>

// Hero section logo
<ResponsiveLogoVariants
  variant="hero"
  theme="light"
  priority={true}
  className="mb-8"
/>

// Adaptive logo that scales with container
<AdaptiveLogo
  variant="signature"
  minWidth={80}
  maxWidth={250}
  autoScale={true}
/>
```

**Context Variants:**
- `header` - Navigation header (160x32)
- `footer` - Footer usage (140x28)
- `mobile` - Mobile compact (100x20)
- `hero` - Large hero sections (300x60)
- `compact` - Minimal usage (80x16)
- `signature` - Signature sizing (200x40)
- `favicon` - Icon usage (32x32)

### 4. LogoBackgroundPatterns

Subtle brand patterns that enhance sections without overwhelming content.

```tsx
// Subtle section background
<LogoPatternSection
  pattern="subtle"
  opacity={0.03}
  color="slate"
  containerClassName="py-16"
  contentClassName="container mx-auto px-4"
>
  <h2>Your Premium Content</h2>
</LogoPatternSection>

// Luxury hero background
<LogoBackgroundPatterns
  pattern="luxury"
  opacity={0.05}
  color="brand"
  animated={true}
  density="sparse"
/>

// Card with geometric pattern
<LogoPatternCard
  pattern="geometric"
  opacity={0.02}
  color="gray"
  padding="lg"
  shadow={true}
>
  <h3>Feature Card Content</h3>
</LogoPatternCard>
```

**Pattern Types:**
- `luxury` - Premium sophisticated patterns (recommended)
- `subtle` - Minimal repeating elements
- `geometric` - Angular geometric interpretation
- `scattered` - Randomly positioned elements
- `watermark` - Large centered watermark
- `constellation` - Connected network pattern

### 5. InteractiveLogo

Advanced interactive logo with multiple interaction patterns for enhanced user engagement.

```tsx
// Magnetic cursor-following logo
<InteractiveLogo
  interaction="magnetic"
  width={160}
  height={32}
  hapticFeedback={true}
  onClick={() => router.push('/')}
/>

// Luxury interaction for premium contexts
<InteractiveLogo
  interaction="luxury"
  onHover={(isHovering) => setNavHighlight(isHovering)}
/>

// Logo with contextual tooltip
<InteractiveLogoWithTooltip
  interaction="glow"
  tooltip={{
    text: "Return to PG Closets home",
    position: "bottom",
    delay: 300
  }}
/>
```

**Interaction Types:**
- `luxury` - Premium spring animations with shadows (recommended)
- `magnetic` - Advanced cursor-following effect
- `glow` - Sophisticated glow effect
- `hover` - Subtle scale animation
- `click` - Click feedback animation
- `playful` - Bouncy, fun interactions

## Accessibility Features

All components include comprehensive accessibility support:

### Screen Reader Support
```tsx
// Automatic ARIA labels
<AnimatedLogo /> // aria-label="PG Closets"

// Loading state announcements
<LogoLoadingStates /> // role="status" aria-label="Loading PG Closets content"
```

### Motion Preferences
```tsx
// Automatically respects prefers-reduced-motion
<AnimatedLogo animation="luxury" /> // Falls back to fade if motion reduced

// Manual motion control
<InteractiveLogo disabled={prefersReducedMotion} />
```

### Keyboard Navigation
```tsx
// Interactive logos are keyboard accessible
<InteractiveLogo
  interaction="luxury"
  onClick={() => router.push('/')}
  // Automatically includes focus states and keyboard handling
/>
```

## Brand Guidelines Integration

### Color Themes
```tsx
// Auto-detect user preference
<ResponsiveLogoVariants theme="auto" />

// Explicit theme control
<ResponsiveLogoVariants theme="dark" />

// Custom brand colors
<LogoBackgroundPatterns
  color="custom"
  customColor="#your-brand-color"
/>
```

### Premium Positioning
All components are designed to reinforce PG Closets' "Elevated Taste Without Pretense" positioning:

- Luxury animations with sophisticated easing
- Premium color palettes and gradients
- Subtle, non-intrusive brand presence
- Ottawa luxury market aesthetic
- Renin partnership brand integration

## Performance Optimizations

### Animation Performance
- Transform-only animations for 60fps performance
- Hardware acceleration enabled
- Efficient re-rendering with React.memo
- Minimal DOM manipulation

### Loading Optimization
```tsx
// Priority loading for above-the-fold logos
<ResponsiveLogoVariants priority={true} />

// Lazy loading for below-the-fold
<AnimatedLogo delay={0.5} />
```

### Bundle Size
- Tree-shakeable exports
- Optimized SVG generation
- CSS-based patterns where possible
- Efficient dependency usage

## Technical Implementation

### TypeScript Support
All components include full TypeScript definitions with comprehensive prop interfaces:

```tsx
interface AnimatedLogoProps {
  width?: number;
  height?: number;
  className?: string;
  withWordmark?: boolean;
  animation?: 'fade' | 'slide' | 'scale' | 'luxury' | 'none';
  delay?: number;
  duration?: number;
  onAnimationComplete?: () => void;
}
```

### Responsive Design
```tsx
// Mobile-first responsive breakpoints
const variantConfigs = {
  header: {
    breakpoints: {
      mobile: { width: 120, height: 24 },
      tablet: { width: 140, height: 28 },
      desktop: { width: 160, height: 32 }
    }
  }
};
```

### Error Handling
```tsx
// Graceful fallback for failed image loads
<LogoWithFallback
  brandImagePath="/brand/pg-logo-premium.png"
  // Automatically falls back to SVG if image fails
/>
```

## Usage Best Practices

### Navigation Implementation
```tsx
// Recommended header logo setup
<NavigationLogo
  size="md"
  theme="auto"
  onLogoClick={() => router.push('/')}
/>
```

### Loading States
```tsx
// Show loading state during data fetching
{isLoading ? (
  <LogoLoadingStates
    variant="luxury"
    size="lg"
    message="Loading your custom closet options..."
  />
) : (
  <YourContent />
)}
```

### Background Patterns
```tsx
// Use sparingly for premium effect
<LogoPatternSection
  pattern="luxury"
  opacity={0.03} // Keep opacity low for readability
  density="sparse" // Avoid overwhelming content
>
  <PremiumContent />
</LogoPatternSection>
```

### Interactive Elements
```tsx
// Use luxury interaction for premium contexts
<InteractiveLogo
  interaction="luxury"
  hapticFeedback={true} // Enhanced mobile experience
  onClick={handleNavigation}
/>
```

## Browser Support

- Chrome 91+
- Firefox 90+
- Safari 14+
- Edge 91+

## Testing

All components have been tested for:
- ✅ TypeScript compilation
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Performance optimization
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness
- ✅ Reduced motion preferences
- ✅ Screen reader compatibility

## License

These components are part of the PG Closets proprietary design system and are intended for use within the PG Closets website and related applications.

---

**Created by**: Visual Brand Designer
**Date**: September 2024
**Version**: 1.0.0
**Compatible with**: PG Closets Design System v2.0