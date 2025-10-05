# Animation Library - Quick Reference Card

## Most Used Animations

### Buttons & Interactive Elements
```tsx
import { liftHover, scaleHover, buttonPressEffect } from '@/lib/animations';

<motion.button {...liftHover} {...buttonPressEffect}>Lift & Press</motion.button>
<motion.button {...scaleHover}>Scale</motion.button>
```

### Cards & Containers
```tsx
import { slideUpScroll, defaultViewport, shadowLiftHover } from '@/lib/animations';

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={defaultViewport}
  variants={slideUpScroll}
  {...shadowLiftHover}
>
  Card Content
</motion.div>
```

### Lists (Staggered)
```tsx
import { staggerChildrenScroll, staggerItemScroll } from '@/lib/animations';

<motion.ul variants={staggerChildrenScroll} initial="hidden" whileInView="visible">
  {items.map((item, i) => (
    <motion.li key={i} variants={staggerItemScroll}>{item}</motion.li>
  ))}
</motion.ul>
```

### Loading States
```tsx
import { spinnerVariants, pulseVariants, skeletonVariants } from '@/lib/animations';

<motion.div variants={spinnerVariants} animate="animate" />
<motion.div variants={pulseVariants} animate="animate" />
<motion.div variants={skeletonVariants} animate="animate" />
```

### Modals & Overlays
```tsx
import { modalTransition, backdropTransition } from '@/lib/animations';

<motion.div variants={backdropTransition} initial="initial" animate="animate" exit="exit" />
<motion.div variants={modalTransition} initial="initial" animate="animate" exit="exit">
  Modal Content
</motion.div>
```

### Form Controls
```tsx
import { checkboxVariants, toggleSwitchVariants } from '@/lib/animations';

// Checkbox
<motion.svg variants={checkboxVariants} animate={checked ? 'checked' : 'unchecked'}>
  <path d="M4 12l5 5L20 6" />
</motion.svg>

// Toggle
<motion.div variants={toggleSwitchVariants} animate={enabled ? 'on' : 'off'} />
```

## Common Patterns

### Page Transition
```tsx
import { fadeTransition } from '@/lib/animations';

<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={fadeTransition}
>
  Page Content
</motion.div>
```

### Hover + Tap
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
>
  Click Me
</motion.button>
```

### Custom Combined
```tsx
import { fade, slide, combineVariants } from '@/lib/animations';

const custom = combineVariants(
  fade({ duration: 0.5 }),
  slide({ direction: 'up' })
);

<motion.div variants={custom} initial="hidden" animate="visible" />
```

## Essential Constants

```tsx
import { DURATION, EASING } from '@/lib/animations';

// Use in custom animations
transition={{ duration: DURATION.normal, ease: EASING.decelerate }}
```

### Durations
- `DURATION.instant` → 0.1s
- `DURATION.fast` → 0.2s
- `DURATION.normal` → 0.3s ⭐ Most used
- `DURATION.smooth` → 0.4s
- `DURATION.complex` → 0.6s

### Easing
- `EASING.standard` → [0.4, 0.0, 0.2, 1] ⭐ Default
- `EASING.decelerate` → [0.0, 0.0, 0.2, 1] ⭐ Enter
- `EASING.accelerate` → [0.4, 0.0, 1, 1] ⭐ Exit

## Essential Hooks

```tsx
import {
  useScrollAnimation,
  useParallax,
  useReducedMotion
} from '@/lib/animations';

// Scroll trigger
const { ref, isInView } = useScrollAnimation();

// Parallax
const { ref, y } = useParallax(50);

// Accessibility
const prefersReduced = useReducedMotion();
```

## Import Shortcuts

```tsx
// Everything you need for most pages
import { motion } from 'framer-motion';
import {
  // Hover effects
  liftHover,
  scaleHover,
  shadowLiftHover,

  // Scroll animations
  slideUpScroll,
  fadeInScroll,
  staggerChildrenScroll,
  staggerItemScroll,
  defaultViewport,

  // Micro-interactions
  buttonPressEffect,

  // Constants
  DURATION,
  EASING,
} from '@/lib/animations';
```

## Performance Tips

✅ **DO**
- Animate `transform` and `opacity` (GPU accelerated)
- Use `viewport={{ once: true }}` for scroll animations
- Use constants for consistency

❌ **DON'T**
- Animate `width`, `height`, `top`, `left`
- Skip `prefersReducedMotion` for complex animations
- Create custom easings without testing

## Accessibility

Always include for complex animations:
```tsx
import { useReducedMotion } from '@/lib/animations';

const prefersReduced = useReducedMotion();

<motion.div
  animate={{
    x: prefersReduced ? 0 : 100,
    transition: { duration: prefersReduced ? 0.01 : 0.3 }
  }}
/>
```

## File Locations

- **Full docs**: `lib/animations/README.md`
- **Quick start**: `lib/animations/QUICKSTART.md`
- **Examples**: `lib/animations/examples.tsx`
- **All animations**: `lib/animations/index.ts`

---

**Print this card for quick reference!**
