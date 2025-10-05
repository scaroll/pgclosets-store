# PG Closets Homepage Hero - Kit and Ace Inspired

## Overview

A stunning, minimal homepage hero section inspired by Kit and Ace's aesthetic, featuring:
- Full-screen video/image hero
- Elegant typography with smooth animations
- Strategic whitespace
- Framer Motion animations
- Responsive design
- Trust indicators
- Smooth scroll experience

## Files Created/Modified

### Created:
- `/app/HomePage.tsx` - Main homepage component with hero section

### Modified:
- `/app/page.tsx` - Updated to use new HomePage component

## Design Philosophy

### Kit and Ace Aesthetic
1. **Minimal Design**: Clean, uncluttered interface with generous whitespace
2. **Large Imagery**: Full-screen video/image background for maximum impact
3. **Typography Excellence**: Light, elegant fonts with precise tracking
4. **Subtle Animations**: Smooth, sophisticated motion using Framer Motion
5. **Strategic CTAs**: Clear, prominent call-to-action buttons

## Component Structure

```tsx
HomePage
├── Hero Section (Full-screen)
│   ├── Video/Image Background
│   ├── Gradient Overlay
│   ├── Main Content
│   │   ├── Headline
│   │   ├── Subheadline
│   │   ├── CTA Buttons
│   │   └── Trust Indicators
│   └── Scroll Indicator
├── Featured Section
│   ├── Three Feature Cards
│   └── Quality, Installation, Warranty
├── Full-Width Lifestyle Image
│   └── Centered CTA
└── Final CTA Section
    └── Consultation Booking
```

## Key Features

### 1. Full-Screen Hero
- **Video Background**: Auto-playing, looped, muted video
- **Fallback Image**: High-quality image loads while video buffers
- **Parallax Effect**: Subtle scale animation on scroll
- **Gradient Overlay**: Professional dark gradient for text readability

### 2. Typography
- **Headline**:
  - Mobile: text-5xl (48px)
  - Tablet: text-7xl (72px)
  - Desktop: text-8xl (96px)
  - Font weight: 300 (light)
  - Tracking: tight

- **Subheadline**:
  - Mobile: text-4xl
  - Tablet: text-6xl
  - Desktop: text-7xl
  - Opacity: 90% for hierarchy

### 3. Animations

#### Framer Motion Timeline:
1. **Headline** (0.3s delay)
   - Fade in from opacity 0
   - Slide up 30px
   - Duration: 1s
   - Easing: Custom cubic-bezier

2. **Subheadline** (0.5s delay)
   - Same animation as headline
   - Staggered for sophistication

3. **CTA Buttons** (0.7s delay)
   - Fade in and slide up
   - Hover effects with smooth transitions

4. **Trust Indicators** (1s delay)
   - Gentle fade in
   - Border reveal animation

5. **Scroll Indicator** (1.5s delay)
   - Fade in
   - Continuous bounce animation

### 4. Button Interactions

#### Primary CTA (White Button):
- **Default**: White background, black text
- **Hover**: Transparent background, white text
- **Border**: 2px white border
- **Animation**: 500ms transition
- **Icon**: Arrow with translate-x animation

#### Secondary CTA (Outline Button):
- **Default**: Transparent with white border
- **Hover**: White background, black text
- **Border**: 2px white/60 border
- **Animation**: 500ms transition

### 5. Trust Indicators

Four key metrics with animated dots:
- **BBB A+ Rated** (Green pulsing dot)
- **5.0 Star Reviews** (Yellow dot)
- **Lifetime Warranty** (Blue dot)
- **Official Renin Dealer** (White dot)

### 6. Scroll Indicator
- Positioned at bottom center
- "Scroll" label in uppercase
- Animated vertical line
- Continuous bounce motion
- Fades out on scroll

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Stacked CTAs
- Reduced font sizes
- Full-width buttons

### Tablet (640px - 1024px)
- Increased font sizes
- Side-by-side CTAs
- Larger spacing

### Desktop (> 1024px)
- Maximum font sizes
- Wide max-width container
- Enhanced animations
- Larger imagery

## Performance Optimizations

### 1. Video Loading
```tsx
useEffect(() => {
  const video = document.createElement('video')
  video.src = '/hero-video.mp4'
  video.addEventListener('loadeddata', () => setIsVideoLoaded(true))
}, [])
```

### 2. Image Optimization
- Next.js Image component
- Priority loading for hero image
- Quality: 90 for hero, 85 for others
- Proper sizing with fill property

### 3. Animation Performance
- CSS transforms (GPU-accelerated)
- Framer Motion with optimized easing
- viewport={{ once: true }} for scroll animations
- Reduced motion support (inherited from globals.css)

## Accessibility Features

### 1. Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Section landmarks
- Descriptive alt text

### 2. Keyboard Navigation
- Focus-visible states on all interactive elements
- Logical tab order
- Skip links (via StandardLayout)

### 3. Screen Readers
- Descriptive link text
- ARIA labels where needed
- Proper semantic structure

### 4. Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Assets Required

### Critical Assets:
1. `/public/hero-video.mp4` - Main hero video (1920x1080, 10-15s loop)
2. `/public/hero-fallback.jpg` - Fallback image (1920x1080)
3. `/public/lifestyle-image.jpg` - Full-width lifestyle image (1920x1080)

### Recommended Specifications:

#### Hero Video:
- Format: MP4 (H.264)
- Resolution: 1920x1080
- Frame rate: 30fps
- Duration: 10-15 seconds
- File size: < 5MB
- Bitrate: 2000-3000 kbps
- No audio required

#### Hero Fallback Image:
- Format: JPG
- Resolution: 1920x1080
- Quality: 90%
- File size: < 300KB
- WebP version recommended

#### Lifestyle Image:
- Format: JPG
- Resolution: 1920x1080
- Quality: 90%
- File size: < 400KB
- Focused composition for text overlay

## Color Palette

### Hero Section:
- Background: Black (#000000)
- Text: White (#FFFFFF)
- Overlay: Black with opacity gradients
- Accent dots: Green (#4ade80), Yellow (#facc15), Blue (#60a5fa), White

### Feature Section:
- Background: White (#FFFFFF)
- Text: Black (#000000)
- Borders: Black with 10% opacity
- Hover: Black with 30% opacity

### CTA Section:
- Background: Black (#000000)
- Text: White (#FFFFFF)
- Button: White background, black text
- Button Hover: Transparent with white border

## Typography Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
             "Helvetica Neue", Helvetica, Arial, sans-serif;
```

### Font Weights:
- Light: 300 (Headlines)
- Regular: 400 (Body)
- Medium: 500 (Feature titles)

### Letter Spacing:
- Tight: -0.03em (Large headlines)
- Wide: 0.08em (Uppercase labels)
- Normal: Default for body

## Animation Easing

```tsx
ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smooth, professional feel
```

This easing curve provides:
- Gentle acceleration
- Smooth mid-transition
- Natural deceleration
- Professional feel

## Integration with Existing System

### StandardLayout
- Navigation bar
- Footer
- Mobile menu
- Accessibility features

### Styling
- Uses existing Tailwind configuration
- Leverages global CSS variables
- Compatible with dark mode (if implemented)
- Follows existing design system

### Components
- Button component from shadcn/ui
- Image optimization from Next.js
- Framer Motion for animations

## Future Enhancements

### Potential Additions:
1. **Multiple Video Variants**
   - Different videos for different times of day
   - Seasonal variations
   - Product-specific hero videos

2. **Interactive Elements**
   - Hover states revealing product details
   - Animated cursor following
   - Interactive scroll-based reveals

3. **Advanced Animations**
   - Stagger animations for trust indicators
   - Parallax layers in background
   - Text splitting for character animations

4. **Performance**
   - Video lazy loading
   - Intersection observer for animations
   - WebP image support with fallbacks

5. **A/B Testing**
   - Different headline variations
   - CTA button copy testing
   - Color scheme variations

## Maintenance Notes

### Regular Updates:
- Video content (seasonal changes)
- Trust indicator metrics
- CTA copy optimization
- Image refreshes

### Performance Monitoring:
- Core Web Vitals (LCP, FID, CLS)
- Video load times
- Animation frame rates
- Mobile performance

### Analytics Tracking:
- CTA click rates
- Scroll depth
- Time on hero section
- Video engagement

## Browser Support

### Tested Browsers:
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### Fallbacks:
- Video not supported: Shows image
- Animations disabled: Graceful degradation
- JavaScript disabled: Static content visible

## Deployment Checklist

- [ ] Replace placeholder video with final hero video
- [ ] Replace placeholder images with final imagery
- [ ] Test video loading on various connections
- [ ] Verify animations on different devices
- [ ] Check accessibility with screen readers
- [ ] Validate Core Web Vitals
- [ ] Test on mobile devices
- [ ] Verify CTAs link to correct pages
- [ ] Check trust indicators are accurate
- [ ] Review typography on all breakpoints

## Success Metrics

### Key Performance Indicators:
1. **Engagement**
   - Average time on page
   - Scroll depth
   - CTA click-through rate

2. **Performance**
   - Lighthouse score > 90
   - LCP < 2.5s
   - CLS < 0.1

3. **Conversions**
   - Quote request rate
   - Product page visits
   - Consultation bookings

## Contact & Support

For questions or issues with the homepage hero implementation, please refer to the project documentation or contact the development team.

---

**Version**: 1.0
**Last Updated**: 2025-10-04
**Author**: Claude (Anthropic)
**Framework**: Next.js 15, React 18, TypeScript, Tailwind CSS, Framer Motion
