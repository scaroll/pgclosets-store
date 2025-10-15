# Animation System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Import What You Need

```tsx
// Scroll animations
import { slideUpScroll, fadeInScroll, staggerChildrenScroll } from '@/lib/animations';

// Hover effects
import { shadowLiftHover, scaleHover } from '@/lib/animations';

// Micro-interactions
import { RippleButton, LinearProgress, AppleSpinner } from '@/components/ui/interactions';

// Page transitions
import { PageTransition } from '@/components/ui/PageTransition';

// Utility components
import { ScrollToTop } from '@/components/ui/ScrollToTop';
```

---

## 📦 Most Common Use Cases

### ✅ Animate Element on Scroll
```tsx
import { motion } from 'framer-motion';
import { slideUpScroll, defaultViewport } from '@/lib/animations';

<motion.div
  variants={slideUpScroll}
  initial="hidden"
  whileInView="visible"
  viewport={defaultViewport}
>
  Content appears smoothly
</motion.div>
```

### ✅ Add Hover Effect to Card
```tsx
import { motion } from 'framer-motion';
import { shadowLiftHover } from '@/lib/animations';

<motion.div {...shadowLiftHover} className="card">
  Lifts on hover with shadow
</motion.div>
```

### ✅ Create Ripple Button
```tsx
import { RippleButton } from '@/components/ui/interactions';

<RippleButton variant="primary" size="lg">
  Click Me
</RippleButton>
```

### ✅ Show Loading State
```tsx
import { LinearProgress, AppleSpinner } from '@/components/ui/interactions';

// Progress bar
<LinearProgress value={75} showLabel />

// Spinner
<AppleSpinner size={20} />
```

### ✅ Add Page Transitions
```tsx
// In app/layout.tsx
import { PageTransition } from '@/components/ui/PageTransition';

<PageTransition type="slideUp">
  {children}
</PageTransition>
```

### ✅ Stagger List Items
```tsx
import { motion } from 'framer-motion';
import { staggerChildrenScroll, staggerItemScroll } from '@/lib/animations';

<motion.ul
  variants={staggerChildrenScroll}
  initial="hidden"
  whileInView="visible"
>
  {items.map((item, i) => (
    <motion.li key={i} variants={staggerItemScroll}>
      {item}
    </motion.li>
  ))}
</motion.ul>
```

---

## 🎨 Complete Component Examples

### Product Card with All Effects
```tsx
import { motion } from 'framer-motion';
import { slideUpScroll, shadowLiftHover, defaultViewport } from '@/lib/animations';
import { RippleEffect, RippleButton } from '@/components/ui/interactions';

export function ProductCard({ product }) {
  return (
    <motion.div
      variants={slideUpScroll}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      <motion.div {...shadowLiftHover} className="bg-white rounded-lg p-6">
        <RippleEffect>
          <img src={product.image} alt={product.name} />
        </RippleEffect>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <RippleButton variant="primary" className="w-full">
          Add to Cart
        </RippleButton>
      </motion.div>
    </motion.div>
  );
}
```

### Hero Section with Stagger
```tsx
import { motion } from 'framer-motion';
import { staggerChildrenScroll, staggerItemScroll } from '@/lib/animations';
import { HapticButton } from '@/components/ui/interactions';

export function Hero() {
  return (
    <motion.section
      variants={staggerChildrenScroll}
      initial="hidden"
      whileInView="visible"
      className="text-center py-20"
    >
      <motion.h1 variants={staggerItemScroll}>
        Transform Your Space
      </motion.h1>
      <motion.p variants={staggerItemScroll}>
        Custom closet solutions designed for you
      </motion.p>
      <motion.div variants={staggerItemScroll}>
        <HapticButton hapticType="success">
          Get Free Quote
        </HapticButton>
      </motion.div>
    </motion.section>
  );
}
```

---

## 🎯 Animation Presets

### Scroll Animations
| Animation | Use Case | Import |
|-----------|----------|--------|
| `fadeInScroll` | Simple fade-in | `@/lib/animations` |
| `slideUpScroll` | Content reveal from bottom | `@/lib/animations` |
| `slideLeftScroll` | Slide from left | `@/lib/animations` |
| `scaleUpScroll` | Zoom in effect | `@/lib/animations` |
| `staggerChildrenScroll` | List container | `@/lib/animations` |
| `staggerItemScroll` | List items | `@/lib/animations` |

### Hover Effects
| Effect | Use Case | Import |
|--------|----------|--------|
| `shadowLiftHover` | Cards | `@/lib/animations` |
| `scaleHover` | Icons, buttons | `@/lib/animations` |
| `subtleScaleHover` | Minimal feedback | `@/lib/animations` |
| `glowHover` | Premium elements | `@/lib/animations` |
| `shimmerHover` | Images | `@/lib/animations` |

### Page Transitions
| Transition | Use Case | Component |
|-----------|----------|-----------|
| `fade` | Simple pages | `PageTransition` |
| `slideUp` | Modal-like | `PageTransition` |
| `scale` | Detail pages | `PageTransition` |
| `crossfade` | Image galleries | `PageTransition` |

---

## 🛠️ Customization

### Adjust Timing
```tsx
// Quick animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.15 }} // 150ms
>
  Fast fade
</motion.div>

// Slow animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }} // 600ms
>
  Slow fade
</motion.div>
```

### Custom Colors
```tsx
import { RippleButton } from '@/components/ui/interactions';

// Primary button
<RippleButton variant="primary">Black background</RippleButton>

// Secondary button
<RippleButton variant="secondary">Gray background</RippleButton>

// Ghost button
<RippleButton variant="ghost">Transparent</RippleButton>
```

### Custom Spinners
```tsx
import { LinearProgress, CircularProgress } from '@/components/ui/interactions';

// Colors
<LinearProgress value={50} color="success" /> // green
<LinearProgress value={50} color="warning" /> // yellow
<LinearProgress value={50} color="error" /> // red

// Sizes
<CircularProgress size={40} />
<CircularProgress size={60} />
<CircularProgress size={80} />
```

---

## 📱 Responsive Animations

### Mobile-Only Haptic
```tsx
import { HapticButton } from '@/components/ui/interactions';

<HapticButton hapticType="light">
  Vibrates on mobile devices
</HapticButton>
```

### Desktop-Only Hover
```tsx
import { motion } from 'framer-motion';
import { scaleHover } from '@/lib/animations';

<motion.div
  {...scaleHover}
  className="hidden md:block" // Only on desktop
>
  Hover effect
</motion.div>
```

---

## ♿ Accessibility

### Respect Reduced Motion
All animations automatically respect `prefers-reduced-motion` system preference.

### Manual Check
```tsx
import { useReducedMotion } from '@/lib/animations/hooks';

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div>Static content</div>;
  }

  return <motion.div>Animated content</motion.div>;
}
```

---

## 🎓 Learning Path

1. **Start Simple**: Use `fadeInScroll` and `slideUpScroll`
2. **Add Hover**: Apply `shadowLiftHover` to cards
3. **Enhance Buttons**: Replace buttons with `RippleButton`
4. **Add Loading**: Use `AppleSpinner` and `LinearProgress`
5. **Page Transitions**: Wrap layout in `PageTransition`
6. **Advanced**: Create custom variants and hooks

---

## 📚 Full Documentation

- **Complete Guide**: See `MOTION_DESIGN_SUMMARY.md`
- **All Components**: Check `/lib/animations/` and `/components/ui/interactions/`
- **Examples**: View `/lib/animations/showcase-examples.tsx`

---

## 🆘 Troubleshooting

### Animation Not Working?
- ✅ Check `framer-motion` is imported
- ✅ Verify `initial` and `animate` props are set
- ✅ Ensure viewport is configured for scroll animations
- ✅ Check browser console for errors

### Performance Issues?
- ✅ Use `viewport={{ once: true }}` for scroll animations
- ✅ Limit simultaneous animations
- ✅ Avoid animating layout properties (use transforms)
- ✅ Check `will-change` is not overused

### Animations Too Fast/Slow?
- ✅ Adjust `transition={{ duration: 0.3 }}` (in seconds)
- ✅ Use preset durations from `DURATION` constants
- ✅ Test on actual devices, not just dev tools

---

## ✅ Quick Checklist

Before launching:
- [ ] All scroll animations have `viewport` config
- [ ] Hover effects provide instant feedback
- [ ] Loading states show during async operations
- [ ] Page transitions don't block interaction
- [ ] Reduced motion preferences respected
- [ ] Mobile touch interactions smooth
- [ ] No layout shifts during animations

---

**Need Help?** Check `MOTION_DESIGN_SUMMARY.md` for complete documentation.

**Ready to Ship!** All animations are production-ready and performance-optimized.
