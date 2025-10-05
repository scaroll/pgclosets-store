# Animation Library - Quick Start Guide

## Installation

The animation library is already installed with Framer Motion. No additional setup required!

## Basic Usage

### 1. Simple Fade Transition

```tsx
import { motion } from 'framer-motion';
import { fadeTransition } from '@/lib/animations';

export default function MyPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeTransition}
    >
      <h1>Welcome</h1>
    </motion.div>
  );
}
```

### 2. Hover Effect

```tsx
import { motion } from 'framer-motion';
import { liftHover } from '@/lib/animations';

export function Button() {
  return (
    <motion.button
      {...liftHover}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Hover Me
    </motion.button>
  );
}
```

### 3. Scroll Animation

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
      className="p-6 bg-white rounded-lg"
    >
      <h2>Scroll to reveal</h2>
    </motion.div>
  );
}
```

### 4. Loading Spinner

```tsx
import { motion } from 'framer-motion';
import { spinnerVariants } from '@/lib/animations';

export function Spinner() {
  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
    />
  );
}
```

### 5. Button Press Feedback

```tsx
import { motion } from 'framer-motion';
import { buttonPressEffect } from '@/lib/animations';

export function PressableButton() {
  return (
    <motion.button
      {...buttonPressEffect}
      className="px-6 py-3 bg-black text-white rounded"
    >
      Press Me
    </motion.button>
  );
}
```

## Common Patterns

### Staggered List

```tsx
import { motion } from 'framer-motion';
import { staggerChildrenScroll, staggerItemScroll, defaultViewport } from '@/lib/animations';

export function List({ items }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerChildrenScroll}
    >
      {items.map((item, i) => (
        <motion.li key={i} variants={staggerItemScroll}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Modal with Backdrop

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { modalTransition, backdropTransition } from '@/lib/animations';

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />
          <motion.div
            variants={modalTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-lg max-w-md">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Custom Animation

```tsx
import { motion } from 'framer-motion';
import { fade, slide, combineVariants } from '@/lib/animations';

export function CustomCard() {
  const customAnimation = combineVariants(
    fade({ duration: 0.5 }),
    slide({ direction: 'up', distance: 20 })
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customAnimation}
    >
      <h2>Custom Animation</h2>
    </motion.div>
  );
}
```

## Hooks

### Scroll Animation Hook

```tsx
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/lib/animations';

export function ScrollReveal() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
      >
        Content
      </motion.div>
    </div>
  );
}
```

### Parallax Hook

```tsx
import { motion } from 'framer-motion';
import { useParallax } from '@/lib/animations';

export function ParallaxImage() {
  const { ref, y } = useParallax(100);

  return (
    <motion.div ref={ref} style={{ y }}>
      <img src="/image.jpg" alt="Parallax" />
    </motion.div>
  );
}
```

### Reduced Motion

```tsx
import { useReducedMotion } from '@/lib/animations';

export function AdaptiveAnimation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        x: prefersReducedMotion ? 0 : 100,
        transition: {
          duration: prefersReducedMotion ? 0.01 : 0.3,
        },
      }}
    >
      Content
    </motion.div>
  );
}
```

## Best Practices

1. **Keep it subtle**: Use `DURATION.normal` (0.3s) for most animations
2. **GPU acceleration**: Animate `transform` and `opacity` when possible
3. **Accessibility**: Always use `prefersReducedMotion` for complex animations
4. **Performance**: Use `viewport={{ once: true }}` for scroll animations
5. **Consistency**: Stick to the provided constants for timing and easing

## Next Steps

- Check out `/lib/animations/examples.tsx` for complete component examples
- Read `/lib/animations/README.md` for full documentation
- Explore all available animations in the individual files
- Customize constants in `/lib/animations/constants.ts` to match your brand

## Common Constants

```tsx
import { DURATION, EASING, SCALE } from '@/lib/animations';

// Durations
DURATION.fast    // 0.2s
DURATION.normal  // 0.3s
DURATION.smooth  // 0.4s

// Easing
EASING.standard    // [0.4, 0.0, 0.2, 1]
EASING.decelerate  // [0.0, 0.0, 0.2, 1]
EASING.accelerate  // [0.4, 0.0, 1, 1]

// Scale
SCALE.minimal   // 0.98
SCALE.standard  // 1.05
```

## Support

For issues or questions, refer to:
- Full documentation: `/lib/animations/README.md`
- Example components: `/lib/animations/examples.tsx`
- Framer Motion docs: https://www.framer.com/motion/
