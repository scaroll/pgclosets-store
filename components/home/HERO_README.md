# Premium Hero Component

## Overview

The `PremiumHero` component is a cinematic, conversion-optimized hero section designed for immediate emotional impact and maximum conversions. It features sophisticated animations, intelligent video loading, and premium CTA design.

## Key Features

### 1. Cinematic Video Background
- **Full-bleed video** with seamless fallback to static image
- **Intelligent loading** based on device type and connection speed
- **Bandwidth awareness** - detects slow connections and serves static image
- **Prefers-reduced-motion** support for accessibility
- **Lazy video loading** with poster image for instant LCP

### 2. Sophisticated Animations
- **Parallax scrolling** effects using Framer Motion
- **Spring physics** for smooth, natural motion
- **Staggered content reveals** for dramatic entrance
- **Micro-interactions** on CTAs with hover states
- **Optimized performance** with `will-change` and GPU acceleration

### 3. Premium CTA Design
- **Three-tier hierarchy**: Primary > Secondary > Tertiary
- **Clear visual priority** using size, color, and position
- **Icon integration** with Lucide React icons
- **Responsive design** adapting to mobile/desktop
- **Analytics tracking** built-in for conversion optimization

### 4. Social Proof Integration
- **500+ installations** prominently displayed
- **Trust indicators**: BBB A+ rating, 5-star reviews, lifetime warranty
- **Visual badges** with animated elements
- **Strategic placement** in hero badge and trust bar

### 5. Performance Optimization
- **<2s LCP target** through intelligent loading strategies
- **Priority image loading** for fallback
- **Metadata-only video preload** to save bandwidth
- **Device-specific optimization** (mobile vs desktop)
- **Connection-aware loading** for optimal UX

## Usage

```tsx
import { PremiumHero } from "@/components/home/PremiumHero"

export default function HomePage() {
  return (
    <PremiumHero
      videoUrl="https://your-video-url.mp4"
      fallbackImage="/images/hero-fallback.jpg"
      headline="Transform Your Space Into Art"
      subheadline="Where Function Meets Luxury"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoUrl` | `string` | Renin video URL | Video background URL |
| `fallbackImage` | `string` | `/images/elegant-barn-door-closet.png` | Static image fallback |
| `headline` | `string` | `"Transform Your Space Into Art"` | Main hero headline |
| `subheadline` | `string` | `"Where Function Meets Luxury"` | Supporting subheadline |

## Design Specifications

### Typography
- **Headline**: 5xl-8xl (responsive), font-bold, tracking-tight
- **Subheadline**: xl-3xl (responsive), font-light, tracking-wide
- **Body text**: base-lg, white/80 opacity

### Colors
- **Background**: Black with gradient overlays
- **Text**: White with opacity variations
- **CTAs**: White primary, transparent secondary with white borders
- **Accents**: Green (BBB), Yellow (reviews), Blue (warranty)

### Spacing
- **Vertical rhythm**: 4, 6, 8, 12, 16 units
- **Container max-width**: 6xl (1280px)
- **Content padding**: px-6 (mobile), responsive

### Animations
- **Duration**: 0.8s (content), 1-2s (scroll effects)
- **Easing**: Custom cubic-bezier [0.22, 1, 0.36, 1]
- **Stagger delay**: 0.2s between elements
- **Parallax range**: 0-50% vertical translation

## Performance Metrics

### Target Metrics
- **LCP**: <2s (target: 1.5s)
- **FID**: <100ms (target: 50ms)
- **CLS**: <0.1 (target: 0)
- **TTI**: <3.5s (target: 3s)

### Optimization Strategies
1. **Priority loading** for fallback image
2. **Metadata-only** video preload
3. **Device detection** for adaptive loading
4. **Connection speed** detection
5. **Reduced motion** support

## Accessibility

### Features
- **ARIA labels** on all interactive elements
- **Semantic HTML** structure
- **Keyboard navigation** support
- **Screen reader** optimized
- **Prefers-reduced-motion** detection
- **Color contrast** meets WCAG AA standards

### Testing
- Test with screen readers (VoiceOver, NVDA)
- Verify keyboard navigation
- Check color contrast ratios
- Test with reduced motion enabled

## Browser Support

### Fully Supported
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

### Graceful Degradation
- Older browsers: Static image only
- No JavaScript: Static hero with CTAs functional
- No video support: Automatic fallback to image

## Analytics Integration

### Tracked Events
- **Hero View**: Impression tracking
- **CTA Clicks**: All three CTAs tracked separately
- **Video Interaction**: Play/pause events
- **Scroll Depth**: Hero engagement measurement

### Event Structure
```typescript
trackCTAClick({
  location: 'hero',
  label: 'Get Instant Estimate' | 'Call Now' | 'Book Free Measure'
})
```

## Copy Variations

### Alternative Headlines
- "Transform Your Space Into Art" (Current)
- "Where Function Meets Luxury" (Current subheadline)
- "Elevate Every Space"
- "Designed to Inspire, Built to Last"
- "Your Vision, Expertly Realized"

### Alternative Subheadlines
- "Where Function Meets Luxury" (Current)
- "Premium Closet Solutions for Ottawa Homes"
- "Expert Installation in 2-3 Weeks"
- "500+ Satisfied Ottawa Homeowners"

## Testing Checklist

### Visual Testing
- [ ] Desktop (1920x1080, 1440x900, 1366x768)
- [ ] Tablet (768x1024, 834x1194)
- [ ] Mobile (375x667, 414x896, 390x844)
- [ ] Dark mode support
- [ ] Light mode support

### Functional Testing
- [ ] Video plays automatically on desktop
- [ ] Video falls back on mobile
- [ ] All CTAs clickable and tracked
- [ ] Scroll indicator animates
- [ ] Parallax effects smooth
- [ ] Manual play button works
- [ ] Connection detection works
- [ ] Reduced motion respected

### Performance Testing
- [ ] LCP < 2s on 3G
- [ ] FID < 100ms
- [ ] CLS score 0
- [ ] No layout shifts
- [ ] Smooth 60fps animations

## Maintenance

### Regular Updates
- Review analytics data monthly
- A/B test headline variations
- Update social proof numbers (500+ installations)
- Refresh video content quarterly
- Optimize based on user behavior

### Content Updates
- **Trust indicators**: Update BBB rating, review count
- **Statistics**: Update installation count
- **Video**: Refresh with new projects
- **Copy**: Test variations for conversion optimization

## Known Issues & Limitations

### Safari iOS Video Autoplay
- **Issue**: iOS Safari requires user interaction for video
- **Solution**: Manual play button appears automatically
- **Workaround**: Static image shown by default on mobile

### Connection Detection
- **Issue**: Not all browsers support Network Information API
- **Solution**: Fallback to screen size detection
- **Impact**: Minimal, affects <5% of users

### CLS on Video Load
- **Issue**: Potential layout shift when video loads
- **Solution**: Poster image with identical aspect ratio
- **Impact**: Zero CLS with proper implementation

## Future Enhancements

### Planned Features
1. **Video quality selection** based on connection speed
2. **Multiple video sources** for different devices
3. **WebP/AVIF fallbacks** for better compression
4. **Intersection Observer** for lazy video loading
5. **A/B testing framework** for headline variations
6. **Dynamic content** from CMS
7. **Personalization** based on user location/behavior

### Performance Optimizations
1. **WebM format** for better compression
2. **Adaptive bitrate** streaming
3. **CDN optimization** for video delivery
4. **Preconnect hints** for video source
5. **Resource hints** for critical assets

## Support

For questions or issues, contact the development team or refer to:
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web Vitals](https://web.dev/vitals/)

---

**Last Updated**: 2025-10-14
**Component Version**: 1.0.0
**Next.js Version**: 15.5.4
**Framer Motion Version**: 11.11.1
