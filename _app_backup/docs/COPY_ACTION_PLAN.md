# Copywriting Implementation Action Plan

Prioritized file-by-file updates for elevated copywriting rollout.

## Phase 1: Core Conversion Pages (Week 1)
**Goal**: Update highest-traffic, highest-conversion pages
**Impact**: 80% of conversion improvement

---

### File 1: `/app/page.tsx` (Homepage Metadata)
**Current**:
```typescript
title: 'PG Closets | Elevated Taste Without Pretense | Ottawa\'s Premium Closet Doors'
description: 'Transform your Ottawa home with sophisticated closet door solutions...'
```

**Update**:
```typescript
title: 'Transform Your Closet in 2-3 Weeks | Lifetime Warranty | PG Closets Ottawa'
description: 'Premium Renin closet doors with expert installation. 500+ Ottawa projects, BBB A+, lifetime warranty. Get instant estimate or call (613) 701-6393.'
```

---

### File 2: `/app/HomePage.tsx`
**Line 104-106**: Hero headline
```typescript
// CURRENT
<Heading level={1} className="...">
  Transform Your Closet in 2-3 Weeks
</Heading>

// KEEP (already good!)
```

**Line 114-116**: Hero subheadline
```typescript
// CURRENT
<Text size="lg" className="...">
  Lifetime Warranty | Expert Installation | 500+ Ottawa Projects
</Text>

// KEEP (already good!)
```

**Line 230-236**: Featured section
```typescript
// CURRENT
<Heading level={2}>Crafted for Ottawa</Heading>
<Text size="lg">Premium closet solutions designed to elevate your home</Text>

// UPDATE TO
<Heading level={2}>Why 500+ Ottawa Homeowners Chose PG</Heading>
<Text size="lg">
  Not the biggest closet door company in Ottawa. Just the most committed
  to getting yours right.
</Text>
```

**Line 240-254**: Feature cards
```typescript
// UPDATE feature descriptions:

{
  title: "Premium Quality",
  description: "Official Renin dealer offering genuine products and full manufacturer warranties. No substitutions, no compromises.",
  icon: "★"
},
{
  title: "Expert Installation",
  description: "Certified specialists with 500+ local installations. We measure precisely, install expertly, guarantee for life.",
  icon: "◆"
},
{
  title: "Lifetime Warranty",
  description: "If our installation ever fails, we return and make it right. No time limits, no fine print, no worries.",
  icon: "◇"
}
```

**Line 302-306**: Mid-page image section
```typescript
// CURRENT
<Heading level={2}>Designed to Inspire</Heading>
<Text size="lg">Every detail considered, every space transformed</Text>

// UPDATE TO
<Heading level={2}>Transformations That Tell Stories</Heading>
<Text size="lg">
  From ordinary closets to architectural features. See what's possible.
</Text>
```

**Line 334-339**: Final CTA
```typescript
// CURRENT
<Heading level={2}>Start Your Project Today</Heading>
<Text size="lg">
  Join 500+ satisfied Ottawa homeowners. Free quote, no obligation.
</Text>

// UPDATE TO
<Heading level={2}>Ready to Transform Your Space?</Heading>
<Text size="lg">
  Start with zero obligation. See pricing instantly or book a free
  consultation. We're here to help, not pressure.
</Text>
```

---

### File 3: `/components/home/WhyPGSection.tsx`
**Line 44-49**: Section header
```typescript
// CURRENT
<h2 className="...">Why Choose PG Closets?</h2>
<p className="...">
  We're not just selling doors—we're delivering a complete solution
  with professional service from start to finish.
</p>

// UPDATE TO
<h2 className="...">Why 500+ Ottawa Homeowners Chose PG</h2>
<p className="...">
  We're not the biggest closet door company in Ottawa. We're just the
  most committed to getting yours right.
</p>
```

**Line 6-37**: Feature descriptions
```typescript
// UPDATE to:
const features = [
  {
    icon: Ruler,
    title: "Free Precision Measure",
    description: "Professional measurement within 30km. We verify exact dimensions before fabrication—perfect fit guaranteed."
  },
  {
    icon: Calendar,
    title: "2-3 Week Installation",
    description: "From measure to beautiful working doors in under 3 weeks. Most Ottawa projects completed in 14-21 days."
  },
  {
    icon: Shield,
    title: "Lifetime Workmanship Warranty",
    description: "If our installation ever fails, we return and make it right. Free, forever. No time limits, no fine print."
  },
  {
    icon: ThumbsUp,
    title: "Official Renin Dealer",
    description: "Genuine products direct from manufacturer. Full warranties, priority support, and proven quality."
  },
  {
    icon: Sparkles,
    title: "Expert Installation Guaranteed",
    description: "Certified installers with 500+ local projects. We measure precisely, install expertly, guarantee for life."
  },
  {
    icon: Check,
    title: "Ottawa-Based Team",
    description: "Family-owned, locally accountable. We live here, work here, and serve our neighbors with pride."
  }
]
```

**Line 74-77**: Bottom tagline
```typescript
// CURRENT
<span className="...">Serving Ottawa and surrounding areas since 2020</span>

// UPDATE TO
<span className="...">
  500+ Ottawa projects completed | BBB A+ rated | 5★ Google reviews
</span>
```

---

### File 4: `/components/home/CategoryTiles.tsx`
**Line 70-76**: Section header
```typescript
// CURRENT
<h2 className="...">Shop by Door Type</h2>
<p className="...">
  Explore our curated collections of premium closet doors,
  each designed for specific applications and spaces.
</p>

// UPDATE TO
<h2 className="...">Discover Your Perfect Door</h2>
<p className="...">
  Browse our curated collections. Each style designed for specific
  spaces and aesthetic visions. Instant pricing, expert guidance.
</p>
```

**Line 109-119**: CTA button text
```typescript
// CURRENT
<Button ...>
  <Calculator className="..." />
  Quick Configure
  <ArrowRight className="..." />
</Button>

// KEEP (already good, but could enhance label)
// ALTERNATIVE if changing:
<Button ...>
  <Calculator className="..." />
  See Your Price
  <ArrowRight className="..." />
</Button>
```

---

### File 5: `/components/home/FeaturedProjects.tsx`
**Line 40-46**: Section header
```typescript
// CURRENT
<h2 className="...">Recent Ottawa Projects</h2>
<p className="...">
  See how we've transformed homes across the National Capital Region
  with professional closet door installations.
</p>

// UPDATE TO
<h2 className="...">Transformations Across the Capital Region</h2>
<p className="...">
  Real projects from Kanata to Orleans. See what's possible when
  expertise meets quality materials.
</p>
```

**Line 83-87**: View gallery button
```typescript
// CURRENT
<Button ...>
  View Full Project Gallery
  <ChevronRight className="..." />
</Button>

// UPDATE TO
<Button ...>
  See More Transformations
  <ChevronRight className="..." />
</Button>
```

---

### File 6: `/components/conversion/ConversionCTA.tsx`
**Line 48-54**: Section header
```typescript
// CURRENT
<h2 className="...">Ready to Transform Your Space?</h2>
<p className="...">
  Choose the option that works best for you. All paths lead to
  the same professional result.
</p>

// UPDATE TO
<h2 className="...">Three Ways to Start Your Project</h2>
<p className="...">
  Choose what works best for you. Same expert result, different
  starting points. Zero pressure, just honest guidance.
</p>
```

**Line 17-42**: CTA option copy
```typescript
// UPDATE descriptions to be more benefit-focused:
const ctaOptions: CTAOption[] = [
  {
    title: "Get Instant Estimate",
    description: "See your installed price in 60 seconds",  // UPDATED
    icon: Calculator,
    href: "/instant-estimate",
    variant: "primary",
    benefits: [
      "No email required",
      "Real-time pricing",
      "4 simple questions"
    ]
  },
  {
    title: "Book Free Measure",
    description: "In-home within 48 hours of request",  // UPDATED
    icon: Calendar,
    href: "/book-measure",
    variant: "secondary",
    benefits: [
      "Free within 30km Ottawa",
      "Precise measurements guaranteed",  // UPDATED
      "Zero obligation to buy"  // UPDATED
    ]
  },
  {
    title: "Call (613) 701-6393",
    description: "Speak with an expert right now",  // UPDATED
    icon: Phone,
    href: "tel:6137016393",
    variant: "outline",
    benefits: [
      "Immediate answers",
      "Mon-Fri 9am-6pm",
      "Local Ottawa team"
    ]
  }
]
```

**Line 98-107**: Bottom trust indicators
```typescript
// CURRENT is good, but could enhance:
<div className="...">
  <Check className="..." />
  <span className="...">No pressure sales</span>
</div>

// UPDATE TO
<div className="...">
  <Check className="..." />
  <span className="...">Zero pressure approach</span>
</div>

// Keep other two as-is (already good)
```

---

### File 7: `/app/contact/page.tsx`
**Line 3-6**: Metadata
```typescript
// CURRENT
export const metadata = {
  title: "Contact Us - Request Work",
  description: "Submit a work request or contact us directly for your project needs.",
}

// UPDATE TO
export const metadata = {
  title: "Let's Create Something Beautiful | Free Consultation | PG Closets Ottawa",
  description: "Start your closet transformation. Instant online estimate, free in-home measure within 48hrs, or call (613) 701-6393. Zero pressure, expert guidance.",
}
```

**Note**: The actual ContactClientPage component needs updating with elevated copy—see detailed rewrite in CONTENT_STRATEGY.md

---

### File 8: `/app/instant-estimate/page.tsx`
**Line 17-25**: Metadata
```typescript
// CURRENT
export const metadata: Metadata = {
  title: 'Instant Closet Door Estimate | ...',
  description: '...',
  // ... existing OpenGraph etc
}

// UPDATE TO
export const metadata: Metadata = {
  title: 'See Your Exact Price in 60 Seconds | No Email Required | PG Closets',
  description: 'Real installed pricing for barn doors, bypass doors, bifolds. Answer 4 questions, see complete price with installation. No email capture, no pressure.',
  openGraph: {
    title: 'Instant Closet Door Estimate | 60 Second Quote',
    description: 'See your exact installed price in 60 seconds. No email, no pressure.',
    // ... keep rest of OpenGraph
  },
}
```

**Note**: Page content needs complete rewrite per CONTENT_STRATEGY.md

---

### File 9: `/app/book-measure/page.tsx`
**Line 5-12**: Metadata
```typescript
// CURRENT
export const metadata: Metadata = {
  title: 'Book Free Measurement | ...',
  description: '...',
}

// UPDATE TO
export const metadata: Metadata = {
  title: 'Book Free Measurement | In-Home Within 48 Hours | PG Closets Ottawa',
  description: 'Free professional measurement within 30km of Ottawa. 30-minute appointment, zero pressure, precise dimensions for perfect fit. Book your preferred time.',
  openGraph: {
    title: 'Book Free In-Home Measurement | PG Closets',
    description: 'Free measurement within 48 hours. Zero obligation, precise dimensions, expert guidance.',
  },
}
```

---

## Phase 2: Product Pages (Week 2)
**Goal**: SEO optimization + product education
**Impact**: Organic traffic growth, better product understanding

---

### File 10: `/app/products/page.tsx`
**Line 5-14**: Metadata
```typescript
// CURRENT
export const metadata: Metadata = {
  title: 'Shop Closet & Sliding Doors | PG Closets Ottawa',
  description: 'Pick a door type to configure size, panels, and finish...',
}

// UPDATE TO
export const metadata: Metadata = {
  title: 'Find Your Perfect Door | Expert Guidance | PG Closets Ottawa',
  description: 'Not sure which closet door is right? Browse curated collections with instant pricing and expert guidance. Barn, bypass, bifold, and French doors.',
  keywords: 'closet doors Ottawa, barn doors, bypass doors, bifold doors, door installation Ottawa, Renin doors',
  openGraph: {
    title: 'Find Your Perfect Closet Door | PG Closets',
    description: 'Curated collections with instant pricing. Expert guidance for every space.',
    url: 'https://www.pgclosets.com/products',
  },
}
```

---

### File 11: `/app/products/barn-doors/page.tsx`
**Line 10-23**: Metadata
```typescript
// CURRENT
export const metadata: Metadata = {
  title: 'Barn Doors Ottawa | Renin Sliding Barn Doors | PG Closets',
  description: 'Transform your Ottawa home with premium Renin barn doors...',
}

// UPDATE TO
export const metadata: Metadata = {
  title: 'Barn Doors Ottawa | Modern Slides | Expert Install | PG Closets',
  description: 'Transform any space with premium Renin barn doors. From rustic charm to modern minimalism. Free measure, 2-3 week install, lifetime warranty. Browse 20+ styles.',
  keywords: 'barn doors Ottawa, sliding barn doors, Renin barn doors, interior barn doors, barn door installation, modern barn doors',
  openGraph: {
    title: 'Premium Barn Doors Ottawa | Statement-Making Slides',
    description: 'Browse our curated barn door collection. Professional installation, lifetime warranty.',
  },
}
```

**Line 75-81**: Hero headline
```typescript
// CURRENT
<h1 className="...">Barn Doors Ottawa</h1>
<p className="...">
  Transform your Ottawa home with premium Renin sliding barn doors.
  Modern style meets functional design with our collection...
</p>

// UPDATE TO
<h1 className="...">Barn Doors That Make a Statement</h1>
<p className="...">
  Modern functionality meets architectural impact. From rustic charm
  to modern minimalism, our curated collection offers the perfect
  balance of form and function.
</p>
```

**Line 84-88**: CTA buttons
```typescript
// CURRENT
<Link href="/request-work" className="...">
  Get Free Quote
</Link>

// UPDATE TO
<Link href="/instant-estimate" className="...">
  Get Instant Estimate
</Link>
```

**Line 89-94**: Secondary CTA
```typescript
// CURRENT
<Link href="/book-measure" className="...">
  Book Measurement
</Link>

// UPDATE TO (keep but enhance text)
<Link href="/book-measure" className="...">
  Book Free Measure
</Link>
```

---

### Files 12-14: Repeat for other door types
Apply same pattern to:
- `/app/products/bypass-doors/page.tsx`
- `/app/products/bifold-doors/page.tsx`
- `/app/products/french-doors/page.tsx` (if exists)

**Pattern**:
1. Update metadata with benefit-focused titles
2. Change hero headline to aspirational statement
3. Update body copy to focus on use cases and benefits
4. Ensure CTAs match core pages ("Get Instant Estimate")

---

## Phase 3: Trust & Education Pages (Week 3)
**Goal**: Build credibility and answer objections
**Impact**: Higher conversion rates from consideration phase

---

### File 15: `/app/about/page.tsx`
**Metadata update + full page rewrite**
See complete rewrite in CONTENT_STRATEGY.md, Page 5: About Us

Key sections needed:
- Hero: "Elevated Taste Without Pretense"
- Founder story (authentic, local connection)
- Values: Precision, Quality, Local Accountability, Lifetime Commitment
- Team photos and bios
- Credentials (BBB, reviews, licensing)
- Service area map

---

### File 16: `/app/why-pg/page.tsx`
**Full page rewrite**
See complete rewrite in CONTENT_STRATEGY.md, Page 8: Why Choose PG

Key sections:
- Comparison table (PG vs Big Box vs Online)
- Real rescue stories (case studies)
- Six commitments (honest guidance, precision, warranty, etc.)
- By-the-numbers section
- Three-option CTA

---

### File 17: `/app/faq/page.tsx`
**Full page rewrite**
See complete rewrite in CONTENT_STRATEGY.md, Page 9: FAQ

Key categories:
1. Choosing the Right Doors (6-8 questions)
2. Pricing & Value (4-6 questions)
3. Installation Process (5-7 questions)
4. Product Quality & Warranty (4-5 questions)
5. Service Area & Logistics (3-4 questions)
6. Specific Door Types (4-6 questions)

---

### File 18: `/app/services/page.tsx`
**Full page rewrite**
See complete rewrite in CONTENT_STRATEGY.md, Page 10: Services Overview

Key sections:
- Hero: "Complete Solutions, Start to Finish"
- Five core services (consultation, estimator, measure, install, support)
- Additional services (custom, retrofit, sourcing)
- Process timeline (week by week)
- Why this matters section

---

## Phase 4: Supporting Pages (Week 4)
**Goal**: Complete site consistency
**Impact**: Professional polish throughout

---

### Files 19-23: Area Pages
Update all neighborhood pages with consistent pattern:
- `/app/kanata/page.tsx`
- `/app/barrhaven/page.tsx`
- `/app/orleans/page.tsx`
- `/app/nepean/page.tsx`
- `/app/areas/[neighborhood]/page.tsx`

**Pattern for each**:
```typescript
export const metadata = {
  title: `Closet Doors ${Neighborhood} | Expert Install | PG Closets`,
  description: `Premium Renin closet doors in ${Neighborhood}. Free measure, 2-3 week install, lifetime warranty. 100+ local projects. Call (613) 701-6393.`,
}
```

---

### Files 24-28: Collection Pages
Update remaining collection pages:
- `/app/products/closet-doors/page.tsx`
- `/app/products/sliding-doors/page.tsx`
- `/app/products/interior-doors/page.tsx`
- `/app/products/hardware/page.tsx`
- `/app/products/closet-systems/page.tsx`

Apply same elevated copy pattern as barn doors page.

---

### File 29: `/app/simple-products/page.tsx`
**Line 9**: Page title
```typescript
// CURRENT
<h1 className="...">Simple Products</h1>

// UPDATE TO
<h1 className="...">Browse All Products</h1>
```

Add intro copy:
```typescript
<p className="text-lg text-muted-foreground mb-6 max-w-2xl">
  Explore our complete collection of closet doors and accessories.
  Each product available with professional installation and lifetime warranty.
</p>
```

---

## Quick Wins (Can Do Today)
**High impact, low effort updates**

### 1. Update All CTA Buttons Site-Wide
Find and replace:
- "Get Quote" → "Get Instant Estimate"
- "Contact Us" → "Book Free Consultation"
- "Submit" → "Send My Request →"
- "Learn More" → "Explore Collection →"

### 2. Add Trust Indicators to Header/Footer
Add small text in footer:
```
BBB A+ Rated | 500+ Ottawa Projects | 5★ Google Reviews | Lifetime Warranty
```

### 3. Update Phone Number Display
Ensure all instances use:
```
Call (613) 701-6393
```
Not just: "Contact" or "Phone"

### 4. Update All Button `aria-label` Attributes
```typescript
// Before
<Button aria-label="Contact">Contact</Button>

// After
<Button aria-label="Get instant closet door estimate">Get Instant Estimate</Button>
```

---

## Testing & Validation

### After Each Update
- [ ] Check mobile responsiveness
- [ ] Verify links still work
- [ ] Test form submissions
- [ ] Confirm metadata renders correctly
- [ ] Check for typography issues
- [ ] Validate accessible color contrast

### A/B Testing Candidates
Once base copy is implemented, test variations:
1. Hero headline: "Transform Your Closet in 2-3 Weeks" vs "Beautiful Closets, Installed in 2-3 Weeks"
2. Primary CTA: "Get Instant Estimate" vs "See Your Price Now"
3. Social proof: "500+ projects" vs "Trusted by 500+ homeowners"

---

## Success Metrics

Track these KPIs after implementation:

### Engagement
- Time on page (target: +30%)
- Scroll depth (target: 75%+ reach footer)
- Bounce rate (target: <40%)

### Conversion
- Instant estimate starts (track increase %)
- Measure bookings (track increase %)
- Phone calls (track increase %)
- Form submissions (track increase %)

### SEO
- Organic traffic growth
- Featured snippet captures
- "Closet doors Ottawa" ranking
- Brand search volume

---

## Resources

**Main Strategy**: `/docs/CONTENT_STRATEGY.md`
**Quick Reference**: `/docs/COPY_IMPLEMENTATION_GUIDE.md`
**This Plan**: `/docs/COPY_ACTION_PLAN.md`

**Questions or blockers?**
Document in: `/docs/COPY_QUESTIONS.md` (create as needed)

---

## Timeline Summary

**Week 1**: Core conversion pages (9 files)
- Priority: Homepage, CTAs, Instant Estimate, Contact, Book Measure

**Week 2**: Product pages (5+ files)
- Priority: Products hub, Barn doors, Bypass, Bifold

**Week 3**: Trust pages (4 files)
- Priority: About, Why PG, FAQ, Services

**Week 4**: Supporting pages (10+ files)
- Priority: Area pages, remaining collections, simple products

**Total**: ~30 files across 4 weeks

---

**Let's create something beautiful.**
