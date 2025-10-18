# CTA Quick Start Guide

## 30-Second Implementation

### 1. Basic Button

```tsx
import { PrimaryCTA } from '@/components/cta'

<PrimaryCTA href="/quote">
  Get Free Quote
</PrimaryCTA>
```

### 2. Hero Section (Complete)

```tsx
import { PrimaryCTA, TrustBadges, SocialProof } from '@/components/cta'

<section className="text-center space-y-6">
  <h1>Transform Your Space</h1>

  <PrimaryCTA href="/quote" size="xl">
    Get Your Free Quote
  </PrimaryCTA>

  <TrustBadges variant="minimal" />
  <SocialProof variant="stats" />
</section>
```

### 3. Product Page CTAs

```tsx
import { PrimaryCTA, PhoneCTA } from '@/components/cta'

<div className="space-y-4">
  <PrimaryCTA fullWidth size="lg">
    Request Quote
  </PrimaryCTA>

  <PhoneCTA variant="button" />
</div>
```

### 4. Urgent Offer

```tsx
import { UrgencyCTA } from '@/components/cta'

<UrgencyCTA
  urgencyType="availability"
  urgencyMessage="Only 3 slots left this week"
>
  Book Now
</UrgencyCTA>
```

### 5. Mobile Sticky Phone

```tsx
import { PhoneCTA } from '@/components/cta'

{isMobile && <PhoneCTA variant="sticky" />}
```

## Component Cheat Sheet

| Component | Use For | Key Props |
|-----------|---------|-----------|
| `PrimaryCTA` | Main actions | `variant`, `size`, `href` |
| `SecondaryCTA` | Supporting actions | `variant`, `icon` |
| `UrgencyCTA` | Time-sensitive | `urgencyType`, `urgencyMessage` |
| `TrustBadges` | Build credibility | `variant`, `animated` |
| `SocialProof` | Customer validation | `variant` |
| `QuoteRequestCTA` | Lead forms | `variant`, `showBenefits` |
| `PhoneCTA` | Phone calls | `variant`, `phoneNumber` |

## Common Patterns

### Pattern 1: Hero with Phone Alternative

```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <PrimaryCTA href="/quote" size="lg">Get Quote</PrimaryCTA>
  <PhoneCTA variant="button" size="lg" />
</div>
```

### Pattern 2: CTA with Trust

```tsx
<div className="space-y-4">
  <PrimaryCTA fullWidth>Get Started</PrimaryCTA>
  <TrustBadges variant="minimal" />
</div>
```

### Pattern 3: Urgency + Social Proof

```tsx
<div className="space-y-4">
  <UrgencyCTA>Limited Time Offer</UrgencyCTA>
  <LiveActivity action="John just booked" />
</div>
```

## Variants Quick Reference

### PrimaryCTA
- `filled` - Black bg, white text (default)
- `outline` - Transparent bg, black border
- `ghost` - Minimal, no background

### SecondaryCTA
- `subtle` - Light gray background
- `minimal` - Border only
- `text` - Text link style

### UrgencyCTA
- `time` - "Ends Friday"
- `availability` - "3 left"
- `demand` - "10 viewing"

### TrustBadges
- `minimal` - Inline icons + text
- `inline` - Horizontal cards
- `stacked` - Grid layout
- `detailed` - Full description cards

### SocialProof
- `stats` - Customer count, years, rating
- `rating` - 5-star display
- `activity` - Recent actions
- `testimonial` - Full review

### PhoneCTA
- `button` - Standard button
- `card` - Card with hours
- `sticky` - Fixed bottom banner
- `floating` - FAB (mobile)

## Sizes

All core CTAs support:
- `sm` - Compact (mobile sidebars)
- `md` - Standard (default)
- `lg` - Prominent (product pages)
- `xl` - Hero (landing pages)

## Need More Help?

📖 **Full Documentation:** `/components/cta/README.md`
📋 **Best Practices:** `/components/cta/CTABestPractices.md`
🎨 **See Examples:** Import `CTAShowcase` component
