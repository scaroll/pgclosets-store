# INTERACTION DESIGN QUICK REFERENCE

**Quick copy-paste examples for common interaction patterns**

---

## 🚀 GETTING STARTED

### 1. Import CSS (once in your app)

```typescript
// app/layout.tsx
import '@/styles/interactions.css';
```

### 2. Import Components

```typescript
import { PremiumButton } from '@/components/ui/PremiumButton';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MagneticCTA } from '@/components/ui/MagneticCTA';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HapticFeedback } from '@/components/ui/HapticFeedback';
```

---

## 📚 COMMON PATTERNS

### Hero CTA Section

```tsx
<section className="py-24 text-center">
  <ScrollReveal direction="up" variant="confident" delay={200}>
    <h1 className="font-display text-6xl font-light mb-6">
      Transform Your Space
    </h1>
  </ScrollReveal>

  <ScrollReveal direction="up" variant="confident" delay={400}>
    <p className="text-xl text-charcoal-600 mb-8">
      Custom closet systems designed for how you live
    </p>
  </ScrollReveal>

  <ScrollReveal direction="up" variant="confident" delay={600}>
    <div className="flex gap-4 justify-center">
      <PremiumButton variant="copper" size="lg" shimmer glow>
        Get Free Consultation
      </PremiumButton>

      <PremiumButton variant="outline" size="lg">
        View Gallery
      </PremiumButton>
    </div>
  </ScrollReveal>
</section>
```

### Product Card

```tsx
<AnimatedCard
  variant="elevated"
  hoverEffect="lift"
  revealOnScroll
  accentPosition="bottom"
  imageSlot={
    <img src="/product.jpg" alt="Product" className="w-full h-64 object-cover" />
  }
>
  <AnimatedCardHeader>
    <AnimatedCardTitle>Premier Walk-In System</AnimatedCardTitle>
    <AnimatedCardDescription>
      Handcrafted with premium materials
    </AnimatedCardDescription>
  </AnimatedCardHeader>

  <AnimatedCardContent>
    <p className="text-sm text-charcoal-600 mb-4">
      Starting at $4,999
    </p>
  </AnimatedCardContent>

  <AnimatedCardFooter>
    <PremiumButton variant="copper" className="w-full">
      Learn More
    </PremiumButton>
  </AnimatedCardFooter>
</AnimatedCard>
```

### Product Grid with Stagger

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {products.map((product, index) => (
    <ScrollReveal
      key={product.id}
      direction="up"
      variant="confident"
      delay={index * 100}
    >
      <AnimatedCard variant="elevated" hoverEffect="lift">
        {/* Card content */}
      </AnimatedCard>
    </ScrollReveal>
  ))}
</div>
```

### Magnetic CTA

```tsx
<MagneticCTA
  strength="medium"
  glow
  haptic
  icon={<ArrowRightIcon className="w-5 h-5" />}
>
  Start Your Project Today
</MagneticCTA>
```

### Loading Button

```tsx
const [loading, setLoading] = useState(false);

<PremiumButton
  variant="copper"
  loading={loading}
  onClick={async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  }}
>
  Submit Request
</PremiumButton>
```

### Success Button

```tsx
const [success, setSuccess] = useState(false);

<PremiumButton
  variant="primary"
  success={success}
  onClick={() => {
    // Do something
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }}
>
  {success ? 'Submitted!' : 'Submit'}
</PremiumButton>
```

---

## 🎨 VARIANTS REFERENCE

### PremiumButton Variants

```tsx
<PremiumButton variant="primary">Primary Button</PremiumButton>
<PremiumButton variant="copper">Copper Accent</PremiumButton>
<PremiumButton variant="outline">Outlined</PremiumButton>
<PremiumButton variant="ghost">Ghost Button</PremiumButton>
<PremiumButton variant="luxury">Luxury Gradient</PremiumButton>
```

### PremiumButton Sizes

```tsx
<PremiumButton size="sm">Small</PremiumButton>
<PremiumButton size="md">Medium (default)</PremiumButton>
<PremiumButton size="lg">Large</PremiumButton>
<PremiumButton size="xl">Extra Large</PremiumButton>
```

### AnimatedCard Hover Effects

```tsx
<AnimatedCard hoverEffect="lift">Lifts on hover</AnimatedCard>
<AnimatedCard hoverEffect="glow">Glows on hover</AnimatedCard>
<AnimatedCard hoverEffect="scale">Scales on hover</AnimatedCard>
<AnimatedCard hoverEffect="none">No effect</AnimatedCard>
```

### ScrollReveal Directions

```tsx
<ScrollReveal direction="up">Slides up</ScrollReveal>
<ScrollReveal direction="down">Slides down</ScrollReveal>
<ScrollReveal direction="left">Slides from left</ScrollReveal>
<ScrollReveal direction="right">Slides from right</ScrollReveal>
<ScrollReveal direction="fade">Fades only</ScrollReveal>
```

---

## 🛠️ UTILITY FUNCTIONS

### Check Reduced Motion

```typescript
import { prefersReducedMotion } from '@/lib/design-system/interactions';

if (!prefersReducedMotion()) {
  // Apply animation
}
```

### Trigger Haptic Feedback

```typescript
import { triggerHaptic } from '@/lib/design-system/interactions';

// On button click
triggerHaptic('medium');

// On success
triggerHaptic('success');

// On error
triggerHaptic('error');
```

### Use Timing Constants

```typescript
import { TIMING } from '@/lib/design-system/interactions';

const duration = TIMING.normal; // 250ms
```

### Use Easing Curves

```typescript
import { EASING_CURVES } from '@/lib/design-system/interactions';

const easing = EASING_CURVES.premium;
// "cubic-bezier(0.23, 1, 0.32, 1)"
```

---

## 🎯 CSS CLASSES

### Ready-to-Use Classes

```html
<!-- Premium button styles -->
<button class="btn-premium copper-glow-hover">
  Hover for glow
</button>

<!-- Luxury card -->
<div class="card-luxury">
  Card with hover effect
</div>

<!-- Scroll reveals -->
<div class="reveal-fade-up">Fades in and slides up</div>
<div class="reveal-scale">Scales in</div>

<!-- Loading states -->
<div class="loading-pulse">Breathing animation</div>
<div class="loading-shimmer">Shimmer effect</div>

<!-- Accent line -->
<h2 class="accent-line">Line appears on hover</h2>

<!-- GPU acceleration -->
<div class="gpu-accelerate">Hardware accelerated</div>

<!-- Transition presets -->
<div class="transition-luxury">Luxury transition</div>
<div class="transition-premium">Premium transition</div>
```

---

## ⚡ PERFORMANCE TIPS

### 1. Use Transform-Only Animations

```css
/* ✅ GOOD - GPU accelerated */
.my-element {
  transition: transform 250ms ease;
}
.my-element:hover {
  transform: translateY(-4px) scale(1.02);
}

/* ❌ AVOID - Forces repaints */
.my-element:hover {
  top: -4px;
  width: 105%;
}
```

### 2. Add Will-Change Hints

```css
/* During animation */
.animating {
  will-change: transform;
}

/* After animation */
.animated {
  will-change: auto;
}
```

### 3. Use CSS Variables

```css
.my-button {
  transition: transform var(--timing-normal) var(--easing-elegant);
  box-shadow: var(--shadow-copper-glow);
}
```

---

## 📱 MOBILE OPTIMIZATION

### Haptic Feedback

```tsx
import { HapticButton } from '@/components/ui/HapticFeedback';

<HapticButton
  hapticPattern="medium"
  onClick={handleClick}
>
  Add to Cart
</HapticButton>
```

### Touch-Optimized Sizes

```tsx
// Always use minimum size="md" for mobile
<PremiumButton size="md">  // 44px min-height ✅
<PremiumButton size="sm">  // 36px min-height ⚠️
```

---

## 🎨 BRAND COLORS

### Copper Accent

```typescript
import { COPPER_ACCENT, COPPER_VARIANTS } from '@/lib/design-system/interactions';

// Copper accent: #B87333
const color = COPPER_ACCENT;

// Copper variants
const lightCopper = COPPER_VARIANTS[100]; // #F9EFE5
const darkCopper = COPPER_VARIANTS[700];  // #8A4D1F
```

### CSS Variables

```css
.my-element {
  background: var(--copper-500);
  box-shadow: var(--shadow-copper-glow);
}
```

---

## 🔍 TROUBLESHOOTING

### Animations Not Working?

1. Check if CSS is imported:
   ```typescript
   // app/layout.tsx
   import '@/styles/interactions.css';
   ```

2. Check if user has reduced motion enabled:
   ```typescript
   import { prefersReducedMotion } from '@/lib/design-system/interactions';
   console.log('Reduced motion:', prefersReducedMotion());
   ```

### Choppy Performance?

1. Add GPU acceleration:
   ```css
   .my-element {
     transform: translateZ(0);
     will-change: transform;
   }
   ```

2. Use transform instead of position/size:
   ```css
   /* ✅ GOOD */
   transform: translateY(-4px);

   /* ❌ AVOID */
   top: -4px;
   ```

### Haptic Not Working?

1. Check device support:
   ```typescript
   import { isHapticSupported } from '@/components/ui/HapticFeedback';
   console.log('Haptic supported:', isHapticSupported());
   ```

2. Ensure user interaction (iOS requirement):
   ```tsx
   // Must be triggered by user action
   onClick={() => triggerHaptic('medium')}
   ```

---

## 📚 FULL DOCUMENTATION

For complete API reference, see:
- `/docs/INTERACTION_DESIGN_GUIDE.md` - Full documentation
- `/lib/design-system/interactions.ts` - TypeScript definitions
- `/AGENT_11_INTERACTION_DESIGN_SUMMARY.md` - Implementation summary

---

**Happy building! 🚀**
