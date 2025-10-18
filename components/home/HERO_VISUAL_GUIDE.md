# Premium Hero - Visual Design Guide

## 🎨 Visual Hierarchy & Layout

### Desktop View (1920x1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                      VIDEO BACKGROUND (Parallax)                            │
│              Renin Closet Doors Overview - Full Bleed                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                   GRADIENT OVERLAY STACK                             │  │
│  │  • Top-to-bottom: black/70 → black/50 → black/70                    │  │
│  │  • Left-to-right: black/40 → transparent → black/40                 │  │
│  │  • Radial vignette: center transparent → edges black/40             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                            ┌──────────────┐                                │
│                            │ PLAY BUTTON  │  (if autoplay fails)           │
│                            │   ▶ Icon     │  Blur backdrop, pulse          │
│                            └──────────────┘                                │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════  │
│                                                                             │
│              ┌────────────────────────────────────────────┐                │
│              │ ⭐ 500+ Ottawa Installations | Lifetime ⭐ │  Premium Badge  │
│              │    Warranty - BBB A+ Rated                │  (White/10 bg)  │
│              └────────────────────────────────────────────┘                │
│                                   ↑ mb-8                                    │
│                                                                             │
│         ╔════════════════════════════════════════════════╗                 │
│         ║                                                ║                 │
│         ║      Transform Your Space Into Art            ║  Headline       │
│         ║                                                ║  (112px, bold)  │
│         ╚════════════════════════════════════════════════╝                 │
│                                   ↑ mb-6                                    │
│                                                                             │
│                ┌────────────────────────────────────┐                      │
│                │   Where Function Meets Luxury      │  Subheadline        │
│                └────────────────────────────────────┘  (48px, light)      │
│                                   ↑ mb-4                                    │
│                                                                             │
│          ┌─────────────────────────────────────────────┐                  │
│          │ Expert installation in 2-3 weeks •          │  Value Prop      │
│          │ Official Renin dealer • BBB A+ rated        │  (20px, white/80)│
│          └─────────────────────────────────────────────┘                  │
│                                   ↑ mb-12                                   │
│                                                                             │
│  ┌───────────────────────┐ ┌──────────────────┐ ┌─────────────────────┐  │
│  │ Get Instant Estimate →│ │  📞 Call Phone   │ │ 📅 Book Free Measure│  │
│  │    PRIMARY CTA        │ │  SECONDARY CTA   │ │    TERTIARY CTA     │  │
│  │  (White bg, black)    │ │ (Transparent/70) │ │  (White/10 bg)      │  │
│  │  220x56px • Shadow    │ │  220x56px        │ │   220x56px          │  │
│  └───────────────────────┘ └──────────────────┘ └─────────────────────┘  │
│                                   ↑ gap-4                                   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════  │
│                             Trust Bar ↑ mt-16                               │
│                                                                             │
│    ●  BBB A+  │  ⭐⭐⭐⭐⭐ 5.0  │  ●  Lifetime  │  ●  Official Renin       │
│    Green pulse     Yellow stars     Blue          White                    │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════  │
│                                                                             │
│                               Scroll to Explore                             │
│                                      ↓                                      │
│                                   ║  ║  Animated line                      │
│                                   ║  ║  (y: 0→10→0)                        │
│                                   ║  ║                                     │
│                                      ↓                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile View (375x667)

```
┌─────────────────────┐
│                     │
│   VIDEO/IMAGE BG    │  Static image on mobile
│   (No parallax)     │  Optimized loading
│                     │
│  ┌───────────────┐  │
│  │  ⭐ 500+     │  │  Premium Badge (stacked)
│  │  Installations│  │
│  │  • Warranty ⭐│  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Transform   │  │  Headline (48px)
│  │   Your Space  │  │  Line breaks adjusted
│  │   Into Art    │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │Where Function │  │  Subheadline (20px)
│  │Meets Luxury   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │Expert install │  │  Value Prop (16px)
│  │• Renin dealer │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │Get Instant    │  │  Primary CTA
│  │Estimate →     │  │  Full width
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │📞 Call Phone  │  │  Secondary CTA
│  └───────────────┘  │  Full width
│                     │
│  ┌───────────────┐  │
│  │📅 Book Free   │  │  Tertiary CTA
│  │   Measure     │  │  Full width
│  └───────────────┘  │
│                     │
│  ──────────────────  │
│                     │
│  ● BBB A+    ⭐⭐⭐⭐⭐│  Trust indicators
│  ● Lifetime  ● Renin│  2-column grid
│                     │
└─────────────────────┘
```

---

## 🎭 Animation Timeline

### Entry Sequence (No user action)

```
Time    Element                    Animation
────────────────────────────────────────────────────────────────
0.0s    Video/Image                Fade in (1s)
0.2s    Premium Badge              Y: 20→0, Opacity: 0→1 (0.8s)
0.4s    Headline                   Y: 30→0, Opacity: 0→1 (0.8s)
0.6s    Subheadline                Y: 30→0, Opacity: 0→1 (0.8s)
0.7s    Value Prop                 Y: 30→0, Opacity: 0→1 (0.8s)
0.9s    CTA Group                  Y: 30→0, Opacity: 0→1 (0.8s)
1.2s    Trust Bar                  Opacity: 0→1 (1.0s)
1.5s    Scroll Indicator           Opacity: 0→1 (1.0s)
1.5s+   Scroll Loop                Y: 0→10→0 (2s infinite)
```

### Scroll Behavior (User scrolls)

```
Scroll% Background Scale  Background Y  Content Y  Content Opacity
────────────────────────────────────────────────────────────────────
0%      1.0               0%            0%         1.0
10%     1.03              10%           6%         0.96
25%     1.075             25%           15%        0.9
50%     1.15              50%           30%        0.8
75%+    1.15 (max)        50% (max)     30% (max)  0.0
```

### Hover Interactions

```
Element              Hover State                   Duration
─────────────────────────────────────────────────────────────
Primary CTA          Scale: 1.05, Shadow: larger   300ms
Secondary CTA        BG: white, Text: black        300ms
Tertiary CTA         BG: white/20, Border: white/70 300ms
Trust Badge          Text: white (from white/90)   300ms
Arrow Icon (→)       TranslateX: +4px              300ms
```

---

## 🎨 Color Specifications

### Background Layers

```css
/* Video/Image Layer */
background: url('video-or-image');
object-fit: cover;

/* Gradient Layer 1: Top-to-bottom */
background: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.7) 0%,
  rgba(0, 0, 0, 0.5) 50%,
  rgba(0, 0, 0, 0.7) 100%
);

/* Gradient Layer 2: Left-to-right */
background: linear-gradient(
  to right,
  rgba(0, 0, 0, 0.4) 0%,
  transparent 50%,
  rgba(0, 0, 0, 0.4) 100%
);

/* Gradient Layer 3: Radial vignette */
background: radial-gradient(
  ellipse at center,
  transparent 0%,
  rgba(0, 0, 0, 0.4) 100%
);
```

### Text Colors

```css
/* Headline */
color: #FFFFFF;                    /* Pure white */
opacity: 1.0;

/* Subheadline */
color: #FFFFFF;
opacity: 0.9;                      /* White/90 */

/* Value Prop */
color: #FFFFFF;
opacity: 0.8;                      /* White/80 */

/* Trust Indicators */
color: #FFFFFF;
opacity: 0.9;                      /* White/90 */
```

### Button Colors

```css
/* Primary CTA */
background: #FFFFFF;               /* White */
color: #000000;                    /* Black */
border: 2px solid #FFFFFF;
hover-background: rgba(255, 255, 255, 0.9);

/* Secondary CTA */
background: transparent;
color: #FFFFFF;
border: 2px solid rgba(255, 255, 255, 0.7);
hover-background: #FFFFFF;
hover-color: #000000;

/* Tertiary CTA */
background: rgba(255, 255, 255, 0.1);
color: #FFFFFF;
border: 2px solid rgba(255, 255, 255, 0.5);
backdrop-filter: blur(8px);
hover-background: rgba(255, 255, 255, 0.2);
hover-border: rgba(255, 255, 255, 0.7);
```

### Badge Colors

```css
/* Premium Badge Background */
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
backdrop-filter: blur(12px);

/* Trust Badge Dots */
.bbb-badge { color: #4ade80; }     /* Green-400 */
.review-badge { color: #facc15; }  /* Yellow-400 */
.warranty-badge { color: #60a5fa; }/* Blue-400 */
.dealer-badge { color: #ffffff; }  /* White */

/* Badge Pulse Animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 📐 Spacing & Layout

### Container Constraints

```
Desktop (>1024px):
  max-width: 1280px (6xl)
  padding-x: 24px (px-6)

Tablet (640-1024px):
  max-width: 100%
  padding-x: 24px (px-6)

Mobile (<640px):
  max-width: 100%
  padding-x: 24px (px-6)
```

### Vertical Spacing

```
Premium Badge ↓ 32px (mb-8)
Headline ↓ 24px (mb-6)
Subheadline ↓ 16px (mb-4)
Value Prop ↓ 48px (mb-12)
CTA Group ↓ 64px (mt-16)
Trust Bar ↓ 32px (pt-8)
```

### Horizontal Spacing

```
CTA Group Gap: 16px (gap-4)
Trust Indicators Gap: 24px (gap-6) desktop, 16px mobile
Icon-to-Text Gap: 12px (gap-3)
```

---

## 🔤 Typography Scale

### Font Sizes (Responsive)

```
Headline:
  Mobile:  48px (text-5xl)
  Tablet:  56px → 72px (text-6xl → text-7xl)
  Desktop: 112px (text-8xl)

Subheadline:
  Mobile:  20px (text-xl)
  Tablet:  24px (text-2xl)
  Desktop: 48px (text-3xl)

Value Prop:
  Mobile:  16px (text-base)
  Tablet:  18px (text-lg)
  Desktop: 20px (text-lg)

Badge Text:
  All:     14px (text-sm)

CTA Text:
  All:     16px (text-base)
```

### Font Weights

```
Headline:        700 (font-bold)
Subheadline:     300 (font-light)
Value Prop:      400 (font-normal)
Badge:           500 (font-medium)
CTA:             600 (font-semibold)
Trust Indicators: 500 (font-medium)
```

### Line Heights & Letter Spacing

```
Headline:
  line-height: 0.95 (leading-[0.95])
  letter-spacing: -0.02em (tracking-tight)

Subheadline:
  line-height: 1.2
  letter-spacing: 0.02em (tracking-wide)

Value Prop:
  line-height: 1.5
  letter-spacing: 0

Badge:
  line-height: 1.4
  letter-spacing: 0.05em (tracking-wide)

CTA:
  line-height: 1
  letter-spacing: 0.05em (tracking-wide)
```

---

## 🖼️ Icon Specifications

### Icon Sizes

```
Star Icons (⭐): 16px (w-4 h-4) in badges
Star Icons (⭐): 12px (w-3 h-3) in reviews
Arrow Icon (→): 20px (w-5 h-5)
Phone Icon (📞): 20px (w-5 h-5)
Calendar Icon (📅): 20px (w-5 h-5)
Play Icon (▶): 48px (w-12 h-12)
Trust Dots (●): 8px (w-2 h-2)
```

### Icon Sources

```typescript
import {
  ArrowRight,    // Primary CTA arrow
  Play,          // Manual video play
  Phone,         // Call CTA
  Calendar,      // Booking CTA
  Star          // Reviews and badges
} from "lucide-react"
```

---

## 📊 Accessibility Specifications

### ARIA Labels

```html
<section aria-label="Hero section">
  <video aria-hidden="true">...</video>
  <button aria-label="Play hero video">...</button>
  <h1>Transform Your Space Into Art</h1>
  <a aria-label="Get an instant closet estimate">...</a>
  <a aria-label="Call PG Closets for consultation">...</a>
  <a aria-label="Book a free in-home measurement">...</a>
</section>
```

### Color Contrast Ratios

```
White text on black/70 overlay:
  Ratio: 15.6:1 ✅ (WCAG AAA)

White/90 text on black/70 overlay:
  Ratio: 14.0:1 ✅ (WCAG AAA)

White/80 text on black/70 overlay:
  Ratio: 12.4:1 ✅ (WCAG AAA)

White text on black button:
  Ratio: 21:1 ✅ (WCAG AAA)
```

### Focus Indicators

```css
/* All interactive elements */
.cta:focus-visible {
  outline: none;
  ring: 2px solid white;
  ring-offset: 2px;
}
```

### Keyboard Navigation

```
Tab order:
  1. Primary CTA (Get Instant Estimate)
  2. Secondary CTA (Call Phone)
  3. Tertiary CTA (Book Free Measure)
  4. Play button (if visible)

Enter/Space: Activate focused element
Escape: Close video (if playing)
```

---

## 🎬 Video Specifications

### Video Requirements

```
Format:     MP4 (H.264 codec)
Resolution: 1920x1080 minimum
Aspect:     16:9
Bitrate:    5-8 Mbps (high quality)
Duration:   30-60 seconds (loop)
Audio:      None (muted)
Optimization: Compressed for web
```

### Loading Strategy

```
Desktop + Fast Connection:
  1. Show poster image immediately
  2. Load video metadata (preload="metadata")
  3. Autoplay when ready
  4. Show manual play if autoplay fails

Mobile OR Slow Connection:
  1. Show static image only
  2. No video loading
  3. Optimal performance
```

### Fallback Image

```
Format:     WebP with PNG fallback
Resolution: 1920x1080
Quality:    90%
Optimization: Next.js Image component
Loading:    priority (critical)
Sizes:      100vw
```

---

## 💡 Best Practices

### Performance

1. **Always use Next.js Image** for fallback
2. **Priority load** the fallback image
3. **Metadata-only** video preload
4. **Conditional loading** based on device
5. **Optimize video** to <5MB file size

### Accessibility

1. **ARIA labels** on all interactive elements
2. **Keyboard navigation** fully supported
3. **Color contrast** exceeds WCAG AA
4. **Reduced motion** support mandatory
5. **Screen reader** optimized content

### Conversion

1. **Primary CTA** most prominent
2. **Three-tier hierarchy** clear
3. **Social proof** immediately visible
4. **Trust signals** strategically placed
5. **Clear value prop** above fold

---

## 🎯 Design System Integration

### Tailwind Classes Used

```
Spacing:     mb-4, mb-6, mb-8, mb-12, mt-16, gap-4, px-6
Typography:  text-5xl → text-8xl, font-bold, font-light
Colors:      bg-black, text-white, border-white
Layout:      flex, items-center, justify-center
Responsive:  sm:, md:, lg: breakpoints
Animation:   transition-all, duration-300, hover:scale-105
Effects:     backdrop-blur-md, shadow-2xl
```

### Custom CSS Properties

```css
/* Spring physics */
stiffness: 100
damping: 30
restDelta: 0.001

/* Custom easing */
ease: [0.22, 1, 0.36, 1]  /* Cubic bezier for premium feel */

/* GPU acceleration */
will-change: opacity
transform: translateZ(0)
```

---

**Visual Guide Complete**
Ready for design review and developer handoff.

*Last Updated: 2025-10-14*
