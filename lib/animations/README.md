# PG Closets Animation Library

Subtle, refined animations inspired by Kit and Ace design principles. Built with Framer Motion for smooth, performant animations.

## Features

- 🎨 **Refined Motion**: Subtle animations that enhance without overwhelming
- ⚡ **Performance**: Optimized for 60fps with GPU-accelerated transforms
- ♿ **Accessible**: Respects `prefers-reduced-motion` settings
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 📦 **Modular**: Import only what you need

## Installation

```bash
npm install framer-motion
```

## Usage

### Page Transitions

```tsx
import { motion } from 'framer-motion';
import { fadeTransition, slideUpTransition } from '@/lib/animations';

export default function Page() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeTransition}
    >
      {/* Page content */}
    </motion.div>
  );
}
```

### Hover Effects

```tsx
import { motion } from 'framer-motion';
import { liftHover, scaleHover } from '@/lib/animations';

export function Button() {
  return (
    <motion.button
      {...liftHover}
      className="px-4 py-2 bg-black text-white"
    >
      Click me
    </motion.button>
  );
}
```

### Scroll Animations

```tsx
import { motion } from 'framer-motion';
import { slideUpScroll, defaultViewport } from '@/lib/animations';

export function Card() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={slideUpScroll}
    >
      {/* Card content */}
    </motion.div>
  );
}
```

### Loading States

```tsx
import { motion } from 'framer-motion';
import { spinnerVariants, skeletonVariants } from '@/lib/animations';

export function LoadingSpinner() {
  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className="w-8 h-8 border-2 border-t-transparent rounded-full"
    />
  );
}
```

### Micro-Interactions

```tsx
import { motion } from 'framer-motion';
import { buttonPressEffect, tooltipVariants } from '@/lib/animations';

export function InteractiveButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.button
        {...buttonPressEffect}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        Hover me
      </motion.button>

      {showTooltip && (
        <motion.div
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-full mt-2"
        >
          Tooltip content
        </motion.div>
      )}
    </div>
  );
}
```

## Available Animations

### Page Transitions
- `fadeTransition` - Subtle fade in/out
- `slideUpTransition` - Elegant upward entrance
- `slideDownTransition` - Gentle downward exit
- `slideLeftTransition` - Forward navigation
- `slideRightTransition` - Backward navigation
- `scaleTransition` - Subtle zoom effect
- `modalTransition` - Centered scale + fade
- `drawerTransition` - Slide from edge

### Hover Effects
- `liftHover` - Subtle upward lift
- `scaleHover` - Scale up interaction
- `subtleScaleHover` - Minimal feedback
- `glowHover` - Premium glow effect
- `shadowLiftHover` - Elevated shadow
- `brightnessHover` - Image brightness
- `rotateHover` - Playful rotation
- `pulseHover` - Continuous pulse

### Scroll Animations
- `fadeInScroll` - Simple fade in
- `slideUpScroll` - Slide up reveal
- `slideLeftScroll` / `slideRightScroll` - Horizontal slides
- `scaleUpScroll` - Zoom in effect
- `staggerChildrenScroll` - Sequential children
- `blurFocusScroll` - Blur to focus
- `rotateInScroll` - Rotate entrance
- `flipInScroll` - 3D flip

### Loading States
- `spinnerVariants` - Circular spinner
- `pulseVariants` - Breathing pulse
- `dotsVariants` - Three dot loading
- `skeletonVariants` - Shimmer placeholder
- `progressBarVariants` - Progress indicator
- `waveVariants` - Wave motion
- `fadeLoadingVariants` - Pulsing fade

### Micro-Interactions
- `buttonPressEffect` - Button feedback
- `checkboxVariants` - Smooth checkbox
- `toggleSwitchVariants` - Switch animation
- `tooltipVariants` - Tooltip appearance
- `dropdownVariants` - Menu reveal
- `accordionVariants` - Height expand
- `toastVariants` - Notification slide
- `likeAnimationVariants` - Heart pop
- `successCheckmarkVariants` - Success feedback
- `errorShakeVariants` - Error shake

## Utility Functions

```tsx
import { fade, slide, scale, staggerContainer, combineVariants } from '@/lib/animations';

// Create custom fade
const customFade = fade({ duration: 0.5, delay: 0.2 });

// Create directional slide
const slideFromLeft = slide({ direction: 'left', distance: 30 });

// Combine animations
const fadeAndSlide = combineVariants(
  fade({ from: 0, to: 1 }),
  slide({ direction: 'up', distance: 20 })
);

// Create stagger container
const staggerList = staggerContainer({ staggerChildren: 0.1 });
```

## Constants

Access animation constants for consistency:

```tsx
import { DURATION, EASING, SPRING, SCALE } from '@/lib/animations';

// Use in custom animations
const customTransition = {
  duration: DURATION.normal,
  ease: EASING.decelerate,
};

// Spring animations
const springConfig = SPRING.subtle;
```

## Accessibility

All animations respect user preferences:

```tsx
import { prefersReducedMotion, withReducedMotion } from '@/lib/animations';

// Check preference
if (prefersReducedMotion()) {
  // Skip animation
}

// Auto-adapt variant
const accessibleVariant = withReducedMotion(slideUpTransition);
```

## Best Practices

### Performance
- Use `transform` and `opacity` for smooth animations (GPU-accelerated)
- Avoid animating `width`, `height`, or `top/left` when possible
- Use `will-change` sparingly and only during animation
- Implement layout animations with `layout` prop for automatic FLIP animations

### Timing
- Keep micro-interactions fast (0.1-0.2s)
- Use standard timing (0.3-0.4s) for most transitions
- Reserve longer durations (0.6s+) for complex animations
- Add stagger delays for sequential reveals

### Easing
- Use `decelerate` for elements entering the viewport
- Use `accelerate` for elements exiting
- Use `standard` for most other cases
- Reserve `bounce` and `spring` for playful interactions

### Accessibility
- Always provide alternatives for motion-sensitive users
- Test with `prefers-reduced-motion` enabled
- Ensure animations don't interfere with functionality
- Keep essential content visible without animation

## Examples

See `/lib/animations/examples.tsx` for complete component examples.

## Design Philosophy

This library follows Kit and Ace's design principles:

1. **Subtlety**: Animations should enhance, not distract
2. **Purposeful**: Every animation has clear intent
3. **Refined**: Attention to timing, easing, and detail
4. **Consistent**: Unified animation language across the app
5. **Accessible**: Works for everyone, respects preferences

## License

MIT
