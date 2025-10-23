# PG Closets World-Class Animation System

🚀 **Premium Animation Framework with 100+ Animations & Micro-interactions**

Transform your website into a living, breathing experience with luxury-brand quality animations that delight users and drive conversions. Built with cutting-edge technology and optimized for buttery-smooth 60fps performance.

## ✨ Features

- 🎬 **100+ Premium Animations** - Page transitions, product interactions, cart flows, navigation effects
- 🎨 **Motion Design Excellence** - World-class animations rivaling luxury brands like Apple and Tesla
- ⚡ **Ultra-Performance** - GPU-accelerated, 60fps optimized with intelligent loading
- 🎯 **Interactive Micro-interactions** - Magnetic cursor effects, 3D transforms, particle systems
- ♿ **Accessibility First** - Full reduced-motion support and WCAG compliance
- 📱 **Mobile-Optimized** - Touch-friendly animations with haptic feedback
- 🎪 **Advanced Effects** - Parallax scrolling, Ken Burns effects, morphing transitions
- 🔧 **Developer Friendly** - TypeScript, comprehensive documentation, easy integration

## 🚀 Quick Start

### Installation
```bash
# Animation libraries are already installed in the project
npm install framer-motion gsap react-intersection-observer
```

### Basic Usage
```tsx
import { motion } from 'framer-motion'
import { fadeIn, slideUp } from '@/lib/animations/variants'

<motion.div
  variants={fadeIn}
  initial="hidden"
  animate="visible"
>
  Your content here
</motion.div>
```

## 📚 Animation Categories (100+ Total)

### 1. 🎬 Page Transitions (20+ animations)

#### Advanced Page Transitions
```tsx
import PageTransition from '@/components/animations/PageTransition'

// Wrap your pages with smooth transitions
<PageTransition>
  <YourPageContent />
</PageTransition>

// Staggered page transitions
import { StaggeredPageTransition, AnimatedSection } from '@/components/animations/PageTransition'

<StaggeredPageTransition>
  <AnimatedSection delay={0.1}>
    <Header />
  </AnimatedSection>
  <AnimatedSection delay={0.2}>
    <MainContent />
  </AnimatedSection>
</StaggeredPageTransition>
```

Available transitions:
- **fadeIn** - Smooth opacity fade
- **slideUp** - Slide from bottom with bounce
- **slideDown** - Slide from top
- **slideLeft/slideRight** - Horizontal slides
- **scaleIn** - Scale from center
- **bounceIn** - Bouncy entrance with spring physics
- **flipIn** - 3D flip effect
- **rotateIn** - Rotate from hidden state
- **staggerContainer** - Sequential reveal animations

### 2. 🛍️ Product Interactions (30+ animations)

#### 3D Product Cards with Advanced Effects
```tsx
import AnimatedProductCard from '@/components/products/AnimatedProductCard'

<AnimatedProductCard
  product={{
    id: '1',
    name: 'Custom Closet System',
    price: 2999,
    image: '/products/closet.jpg',
    category: 'Closets',
    badge: 'Best Seller',
    colors: ['#fff', '#000', '#8B4513'],
    rating: 4.9
  }}
/>
```

**Premium Features:**
- **3D Tilt Effect** - Mouse-based card rotation with depth perception
- **Hover Transformations** - Scale, shadow, glow, and elevation effects
- **Image Zoom** - Smooth Ken Burns effect on hover
- **Quick Actions** - Animated cart/wishlist buttons with ripple effects
- **Color Variants** - Animated color swatches with magnetic selection
- **Rating Animations** - Star ratings with fill animations
- **Like Button** - Heart animation with particle effects
- **Price Updates** - Animated number transitions

#### Product Gallery with Carousel
```tsx
// Auto-rotating hero images with parallax
<motion.img
  animate={{
    scale: [1, 1.1, 1],
    x: [0, 20, 0],
    y: [0, -10, 0]
  }}
  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
/>

// Smooth image carousel transitions
<AnimatePresence mode="wait">
  <motion.img
    key={currentImage}
    src={images[currentImage]}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  />
</AnimatePresence>
```

### 3. 🛒 Cart & Checkout Animations (25+ animations)

#### Animated Shopping Cart Drawer
```tsx
import AnimatedCartDrawer from '@/components/cart/AnimatedCartDrawer'

<AnimatedCartDrawer
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  items={cartItems}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemove}
/>
```

**Cart Features:**
- **Slide-in Animation** - Smooth drawer from right with spring physics
- **Item Animations** - Add/remove with scale and fade transitions
- **Quantity Updates** - Animated number changes with bounce effects
- **Price Calculations** - Smooth total updates with color transitions
- **Loading States** - Skeleton animations for async operations
- **Empty State** - Animated shopping bag with floating animation
- **Badge Animations** - Cart count with scale and pulse effects

#### Multi-Step Checkout with Validation
```tsx
import AnimatedCheckoutForm from '@/components/forms/AnimatedCheckoutForm'

<AnimatedCheckoutForm />
```

**Checkout Features:**
- **Progress Steps** - Animated step indicators with completion states
- **Form Validation** - Shake animations for errors, success checkmarks
- **Field Focus** - Floating labels with smooth transitions
- **Payment Methods** - Animated card selection with glow effects
- **Processing States** - Premium loading animations with progress
- **Success Confirmation** - Confetti animations and success modals

### 4. 🧭 Navigation & UI Animations (25+ animations)

#### Advanced Navigation System
```tsx
import AnimatedNavigation from '@/components/navigation/AnimatedNavigation'

<AnimatedNavigation />
```

**Navigation Features:**
- **Mega Menu** - Smooth reveal with staggered item animations
- **Mobile Menu** - Hamburger to X morph with rotation
- **Dropdown Menus** - Height-based animations with easing
- **Search Bar** - Expand/collapse with width transitions
- **Cart Badge** - Animated count updates with spring physics
- **Logo Animations** - Hover effects with brand identity
- **Mobile Touch** - Swipe gestures and touch feedback

#### Interactive Button System
```tsx
import {
  AnimatedButton,
  GlowButton,
  MagneticButton,
  SlideButton,
  RippleButton
} from '@/components/ui/animated-button'

// Multiple animation variants
<AnimatedButton variant="bounce">Click me</AnimatedButton>
<GlowButton>Premium Feature</GlowButton>
<MagneticButton>Interactive</MagneticButton>
<SlideButton>Next →</SlideButton>
<RippleButton>Action</RippleButton>
```

**Button Variants:**
- **bounce** - Scale bounce with spring physics
- **pulse** - Continuous pulsing animation
- **shake** - Horizontal shake for errors
- **slide** - Slide content on hover
- **flip** - 3D flip with perspective
- **glow** - Glowing shadow with color transitions
- **magnetic** - Cursor attraction effect
- **ripple** - Touch-friendly ripple effect

### 5. 🎨 Hero Sections & Micro-interactions

#### Cinematic Hero Section
```tsx
import AnimatedHero, { AnimatedHeroCards } from '@/components/hero/AnimatedHero'

<AnimatedHero />
<AnimatedHeroCards />
```

**Hero Features:**
- **Background Slideshow** - Auto-rotating images with crossfade
- **Text Animations** - Typewriter effect and character reveals
- **Floating Particles** - Ambient particle system with physics
- **CTA Buttons** - Animated call-to-action with magnetic effects
- **Parallax Effects** - Multi-layer scroll-based animations
- **Feature Cards** - 3D hover effects with tilt transforms
- **Social Proof** - Animated ratings and testimonials

### 6. ⚡ Advanced Loading Animations

```tsx
import {
  PulseLoader,
  DotsLoader,
  SpinningLoader,
  SkeletonLoader,
  ProductGridSkeleton,
  WaveLoader,
  MorphingLoader,
  BouncingDotsLoader
} from '@/components/ui/loading-animations'

// 8 different loading styles
<PulseLoader />
<DotsLoader />
<SpinningLoader />
<SkeletonLoader />
<ProductGridSkeleton count={6} />
<WaveLoader />
<MorphingLoader />
<BouncingDotsLoader />
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
