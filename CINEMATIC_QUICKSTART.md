# Cinematic Components - Quick Start Guide

Get up and running with Apple-quality components in 5 minutes.

## 🚀 Quick Start

### 1. Homepage with Hero + Showcase

**File: `app/page.tsx`**
```tsx
import { AppleHero } from "@/components/home/AppleHero"
import { AppleShowcase } from "@/components/product/AppleShowcase"

export default function HomePage() {
  return (
    <main>
      <AppleHero
        videoUrl="/videos/hero.mp4"
        posterImage="/images/hero.jpg"
        headline="Transform Your Space"
        subheadline="Premium closet solutions"
        ctaText="Explore products"
        ctaLink="#products"
      />

      <AppleShowcase
        title="Featured Products"
        products={[
          {
            id: "1",
            name: "Barn Doors",
            price: "$899",
            image: "/images/barn-door.jpg",
            slug: "barn-doors",
            newProduct: true,
          },
        ]}
      />
    </main>
  )
}
```

### 2. Feature Section

**File: `app/about/page.tsx`**
```tsx
import { FeatureHighlight } from "@/components/features/FeatureHighlight"

export default function AboutPage() {
  return (
    <FeatureHighlight
      features={[
        {
          id: "1",
          headline: "Expertly Crafted",
          description: "Premium materials and precision engineering.",
          image: "/images/craftsmanship.jpg",
          ctaText: "Learn more",
          ctaLink: "/craftsmanship",
        },
      ]}
    />
  )
}
```

### 3. Product Detail Page

**File: `app/products/[slug]/page.tsx`**
```tsx
import { AppleLayout } from "./AppleLayout"

export default function ProductPage() {
  const product = {
    name: "Premium Barn Door",
    price: "$899",
    images: [{ url: "/images/product.jpg", alt: "Product" }],
    specifications: [
      { label: "Material", value: "Premium hardwood" },
    ],
  }

  return <AppleLayout product={product} />
}
```

### 4. Video Background Section

**File: `app/showroom/page.tsx`**
```tsx
import { VideoHero } from "@/components/media/VideoHero"

export default function ShowroomPage() {
  return (
    <VideoHero
      videoSources={{ mp4: "/videos/showroom.mp4" }}
      posterImage="/images/showroom.jpg"
      className="h-screen"
    >
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold">Visit Our Showroom</h1>
        <p className="text-2xl">Ottawa's premier closet destination</p>
      </div>
    </VideoHero>
  )
}
```

## 📦 Component Imports

```tsx
// Heroes
import { AppleHero } from "@/components/home/AppleHero"
import { VideoHero } from "@/components/media/VideoHero"

// Product Components
import { AppleShowcase } from "@/components/product/AppleShowcase"
import { ProductCard } from "@/components/product/ProductCard"
import { AppleLayout } from "@/app/products/[slug]/AppleLayout"

// Feature Components
import { FeatureHighlight } from "@/components/features/FeatureHighlight"

// UI Components
import { AppleButton } from "@/components/ui/AppleButton"
import { ImageZoom } from "@/components/media/ImageZoom"
```

## 🎨 Common Patterns

### Full-Width Section with Parallax
```tsx
<section className="relative min-h-screen overflow-hidden">
  {/* Your content */}
</section>
```

### Centered Content Container
```tsx
<div className="mx-auto max-w-7xl px-6">
  {/* Your content */}
</div>
```

### Apple Blue CTA
```tsx
<Link
  href="/products"
  className="inline-flex items-center gap-2 text-xl font-semibold text-[#0071e3] hover:text-[#0077ed]"
>
  Learn more
  <ArrowRight className="h-5 w-5" />
</Link>
```

### Gradient Overlay
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
```

## 🎯 Pro Tips

### 1. Video Optimization
```tsx
// Always provide both formats
videoSources={{
  webm: "/videos/hero.webm",  // Smaller, better compression
  mp4: "/videos/hero.mp4",    // Fallback
}}

// Use poster images
posterImage="/images/poster.jpg"
```

### 2. Image Best Practices
```tsx
<Image
  src="/images/hero.jpg"
  alt="Descriptive alt text"
  fill
  priority  // For above-fold images
  quality={90}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 3. Responsive Typography
```tsx
className="text-4xl md:text-6xl lg:text-8xl"
```

### 4. Smooth Animations
```tsx
transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
```

## 🔧 Customization

### Change Apple Blue
```tsx
// In tailwind.config.ts
extend: {
  colors: {
    'apple-blue': '#0071e3',  // Change this
  }
}

// Then use:
className="text-apple-blue hover:text-apple-blue/90"
```

### Adjust Parallax Speed
```tsx
const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])  // Slower
const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) // Faster
```

### Modify Overlay Opacity
```tsx
<VideoHero overlayOpacity={0.3} />  // Lighter
<VideoHero overlayOpacity={0.7} />  // Darker
```

## 📱 Mobile Optimization

### Stack Layouts on Mobile
```tsx
<div className="flex flex-col lg:flex-row">
  {/* Will stack on mobile, side-by-side on desktop */}
</div>
```

### Hide on Mobile
```tsx
<div className="hidden md:block">
  {/* Only shows on tablet and up */}
</div>
```

### Mobile-Only Content
```tsx
<div className="block md:hidden">
  {/* Only shows on mobile */}
</div>
```

## ⚡ Performance Checklist

- [ ] Use `next/image` for all images
- [ ] Add `priority` to above-fold images
- [ ] Optimize video file sizes (< 10MB)
- [ ] Use WebP/WebM formats when possible
- [ ] Add proper `sizes` attribute to images
- [ ] Lazy load below-fold content
- [ ] Test on slow 3G connection

## 🎬 Animation Performance

```tsx
// Good: GPU-accelerated properties
transform: "translateY(20px)"
opacity: 0.5
scale: 1.1

// Avoid: Triggers layout recalculation
top: "20px"
margin: "20px"
width: "100%"
```

## 🐛 Common Issues

### Video not autoplaying?
```tsx
// Ensure muted attribute is set
<video muted autoPlay loop />
```

### Parallax not smooth?
```tsx
// Use useSpring for smoother motion
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
})
```

### Images not loading?
```tsx
// Check image paths are absolute
src="/images/hero.jpg"  // ✓ Correct
src="images/hero.jpg"   // ✗ Wrong
```

## 📚 Resources

- **Full Documentation**: See `CINEMATIC_COMPONENTS.md`
- **Visual Guide**: See `CINEMATIC_VISUAL_GUIDE.md`
- **Examples**: See `components/examples/AppleHeroExample.tsx`

## 🆘 Need Help?

Common questions:
1. **How do I change colors?** → Modify `tailwind.config.ts`
2. **How do I add more products?** → Add to the `products` array
3. **Can I use images instead of video?** → Yes, omit `videoUrl` prop
4. **How do I customize animations?** → Adjust Framer Motion props

---

**Quick Start Guide by**: Cinematic Experience Team
**Last Updated**: 2025-10-15
