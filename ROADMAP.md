# Product Roadmap - pgclosets.com Optimization

**Version:** 1.0
**Last Updated:** 2025-10-09
**Planning Horizon:** Next 12 weeks
**Strategic Goal:** Achieve 90+ Lighthouse score and 40%+ conversion improvement

---

## Overview

This roadmap outlines the next 4 phases of optimization following Phase 6 (Conversion Optimization) completion. Each phase builds on previous work with clear deliverables, success metrics, and dependencies.

**Current State (Post-Phase 6):**
- ✅ Critical issues resolved (3/3)
- ✅ Value-first hero messaging implemented
- ✅ Multi-CTA conversion strategy deployed
- ✅ Quick Configure friction reduction live
- ✅ Scroll-triggered engagement implemented
- ⚠️ 20 issues remaining (8 high, 12 medium/low priority)

**Target State (End of Phase 10):**
- 🎯 Lighthouse score: 90+ (all categories)
- 🎯 Hero conversion rate: 3.8%+ (vs 2.3% baseline)
- 🎯 Mobile engagement: 64%+ (vs 42% baseline)
- 🎯 WCAG 2.1 AA compliance: 100%
- 🎯 Core Web Vitals: All green

---

## Phase 7: Content & Copy Refinement

**Timeline:** Week 1-2
**Priority:** 🔴 HIGH
**Effort:** 🟡 MEDIUM (3-4 days)
**Expected Impact:** +8-12% conversion improvement

### Objectives

1. Enhance product descriptions for SEO and user decision-making
2. Add social proof through customer testimonials
3. Create competitive differentiation content
4. Optimize for voice search and local SEO

### Deliverables

| Deliverable | Description | Success Metric |
|-------------|-------------|----------------|
| **Testimonial Section** | 6-8 customer testimonials with photos | Trust score +15% |
| **Product Descriptions** | SEO-optimized descriptions for all door types | Organic traffic +20% |
| **Comparison Tables** | Renin vs competitors feature matrix | Time on page +30% |
| **FAQ Schema** | Structured FAQ data for rich snippets | Featured snippet rank |
| **Voice Search Optimization** | "closet doors near me" keyword targeting | Voice search visibility |

### Tasks

**Week 1:**
- [x] Audit existing product descriptions
- [ ] Gather customer testimonials (request from past clients)
- [ ] Research competitor positioning
- [ ] Identify voice search opportunities
- [ ] Create comparison criteria matrix

**Week 2:**
- [ ] Rewrite product descriptions with SEO focus
- [ ] Design testimonial component with photos
- [ ] Build comparison table component
- [ ] Implement FAQ schema markup
- [ ] Add local SEO keywords

### Files to Modify

```
/components/testimonials/TestimonialSection.tsx     [CREATE]
/components/products/ComparisonTable.tsx            [CREATE]
/components/seo/FAQSchema.tsx                       [CREATE]
/app/products/[slug]/page.tsx                       [MODIFY]
/lib/seo/structured-data.ts                         [MODIFY]
```

### Success Metrics

- **Organic Traffic:** +20% from long-tail keywords
- **Time on Page:** +30% on product pages
- **Trust Indicators:** Testimonial visibility 80%+
- **Voice Search:** Rank for 5+ "near me" queries
- **Featured Snippets:** 3+ FAQ rich snippets

### Dependencies

- Customer photo permissions
- Competitor research data
- Stock photography budget (if needed)

---

## Phase 8: Performance Optimization

**Timeline:** Week 3-4
**Priority:** 🔴 HIGH
**Effort:** 🟢 LOW-MEDIUM (2-3 days)
**Expected Impact:** +5-8% conversion improvement

### Objectives

1. Achieve Lighthouse performance score 90+
2. Improve Core Web Vitals to "Good" across all metrics
3. Reduce initial bundle size by 30-40%
4. Optimize mobile loading experience

### Deliverables

| Deliverable | Description | Success Metric |
|-------------|-------------|----------------|
| **Code Splitting** | Lazy load heavy components | Bundle size -35% |
| **Resource Hints** | Preload critical assets | LCP < 2.5s |
| **Image Optimization** | WebP/AVIF formats, lazy loading | Image payload -50% |
| **Video Optimization** | Mobile-specific hero video | Mobile LCP < 3.0s |
| **Animation Reduction** | `prefers-reduced-motion` support | Accessibility +10% |

### Tasks

**Week 3:**
- [ ] Run Lighthouse audit baseline
- [ ] Implement dynamic imports for:
  - InstantEstimateModal
  - Framer Motion animations
  - Gallery components
- [ ] Add resource hints (preload, prefetch)
- [ ] Convert hero video to multiple resolutions

**Week 4:**
- [ ] Implement WebP/AVIF image formats
- [ ] Add lazy loading to all images
- [ ] Add `prefers-reduced-motion` media queries
- [ ] Optimize font loading strategy
- [ ] Run final Lighthouse audit

### Files to Modify

```
/app/HomePage.tsx                                   [MODIFY - lazy loading]
/next.config.js                                     [MODIFY - image optimization]
/app/layout.tsx                                     [MODIFY - resource hints]
/components/ui/AnimatedSection.tsx                  [MODIFY - motion reduction]
/public/hero-video-720p.mp4                         [CREATE]
/public/hero-video-1080p.mp4                        [CREATE]
```

### Performance Targets

**Lighthouse Scores (Target: 90+):**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Bundle Size:**
- Homepage initial: < 250KB (vs ~350KB current)
- Total page weight: < 2MB (vs ~3MB+ current)

### Success Metrics

- **Lighthouse Performance:** 90+ score
- **Mobile LCP:** < 3.0s (vs ~5s estimated current)
- **Desktop LCP:** < 2.5s
- **Bundle Size:** -35% reduction
- **Time to Interactive:** < 3.5s

### Dependencies

- Video encoding software (FFmpeg)
- Image optimization pipeline
- Testing environment for performance

---

## Phase 9: Advanced Analytics & Personalization

**Timeline:** Week 5-7
**Priority:** 🟡 MEDIUM
**Effort:** 🔴 HIGH (5-6 days)
**Expected Impact:** +10-15% conversion improvement

### Objectives

1. Implement comprehensive conversion funnel tracking
2. Add heatmap and session replay analysis
3. Create personalization based on traffic source
4. Build data-driven optimization feedback loop

### Deliverables

| Deliverable | Description | Success Metric |
|-------------|-------------|----------------|
| **Estimator Step Tracking** | Track progression through configurator | Identify drop-off point |
| **Heatmap Integration** | Hotjar or Microsoft Clarity | Click patterns visible |
| **Session Replay** | Record user sessions | Friction points identified |
| **Traffic Source Personalization** | Customize messaging by source | Conversion lift +12% |
| **Funnel Visualization** | Google Analytics 4 funnel | Conversion path clarity |

### Tasks

**Week 5:**
- [ ] Set up Hotjar or Microsoft Clarity account
- [ ] Implement estimator step tracking events
- [ ] Create Google Analytics 4 conversion funnel
- [ ] Add scroll depth milestone tracking (25%, 50%, 75%, 100%)
- [ ] Implement video engagement tracking (play, pause, complete)

**Week 6:**
- [ ] Build traffic source detection utility
- [ ] Create personalized messaging variants:
  - Google Ads: Emphasize "Free Estimate"
  - Organic Search: Emphasize "Ottawa's #1 Rated"
  - Direct/Referral: Emphasize "500+ Projects"
  - Social: Emphasize visual transformation
- [ ] Implement A/B testing framework
- [ ] Set up custom GA4 dashboard

**Week 7:**
- [ ] Analyze first 2 weeks of heatmap data
- [ ] Watch 50+ session replays for patterns
- [ ] Document common friction points
- [ ] Create optimization backlog from insights
- [ ] Run statistical significance tests

### Files to Create/Modify

```
/lib/analytics/funnel-tracking.ts                   [CREATE]
/lib/analytics/personalization.ts                   [CREATE]
/components/analytics/HotjarScript.tsx              [CREATE]
/hooks/use-traffic-source.ts                        [CREATE]
/app/HomePage.tsx                                   [MODIFY - personalization]
/components/configurator/InstantEstimateModal.tsx   [MODIFY - step tracking]
```

### Analytics Events to Add

```typescript
// Estimator step progression
trackEvent({
  category: 'estimator',
  action: 'step_completed',
  label: 'Step 1: Door Type',
  value: timeSpent
})

// Scroll depth milestones
trackEvent({
  category: 'engagement',
  action: 'scroll_depth',
  label: '50%',
  nonInteraction: true
})

// Video engagement
trackEvent({
  category: 'video',
  action: 'play',
  label: 'Hero Video',
  nonInteraction: false
})

// Traffic source attribution
trackEvent({
  category: 'attribution',
  action: 'session_start',
  label: trafficSource,
  nonInteraction: true
})
```

### Success Metrics

- **Estimator Drop-Off:** Identify specific step with highest abandonment
- **Heatmap Insights:** 10+ actionable findings from click patterns
- **Session Replays:** 20+ friction points documented
- **Personalization Lift:** 12%+ conversion improvement from source-based messaging
- **Funnel Completion:** 5%+ improvement in funnel completion rate

### Dependencies

- Hotjar/Clarity subscription ($0-99/month)
- Google Analytics 4 property configured
- A/B testing framework decision

---

## Phase 10: Conversion Flow Optimization

**Timeline:** Week 8-10
**Priority:** 🟡 MEDIUM
**Effort:** 🟡 MEDIUM (4-5 days)
**Expected Impact:** +12-18% conversion improvement

### Objectives

1. Enhance estimator UX with multi-step flow
2. Add visual product configurator
3. Implement save & continue functionality
4. Build abandoned cart recovery system
5. Add early email capture

### Deliverables

| Deliverable | Description | Success Metric |
|-------------|-------------|----------------|
| **Multi-Step Estimator** | 3-step wizard with progress bar | Completion rate +25% |
| **Finish Preview** | Visual rendering of door finishes | Confidence +30% |
| **Save & Continue** | Email capture for unfinished estimates | Abandonment recovery 15% |
| **Email Automation** | Abandoned cart reminder sequence | Recovery rate 8-12% |
| **Early Capture** | Email at step 1 (optional) | Lead volume +40% |

### Tasks

**Week 8:**
- [ ] Design multi-step estimator wireframes
- [ ] Build progress indicator component
- [ ] Create step transition animations
- [ ] Implement step validation logic
- [ ] Add "Previous" button navigation

**Week 9:**
- [ ] Design finish preview component
- [ ] Create 3D/photo renderings for finishes
- [ ] Build interactive finish selector
- [ ] Add "Save & Continue" modal
- [ ] Implement email capture form

**Week 10:**
- [ ] Set up email automation (ConvertKit/Mailchimp)
- [ ] Write abandoned cart email sequence:
  - Email 1: 1 hour after abandonment
  - Email 2: 24 hours after abandonment
  - Email 3: 72 hours with special offer
- [ ] Implement email template designs
- [ ] Test complete flow end-to-end
- [ ] Deploy with feature flag

### Multi-Step Estimator Flow

```
Step 1: Door Type & Style
├─ Select door category (Barn, Bypass, Bifold)
├─ Select style within category
└─ Optional: Enter email for save & continue

Step 2: Dimensions & Configuration
├─ Opening width and height
├─ Number of panels
├─ Track configuration
└─ Progress: 33% → 66%

Step 3: Finish & Extras
├─ Material/finish selection with preview
├─ Hardware upgrades
├─ Add-ons (soft close, locks)
└─ Progress: 66% → 100%

Result: Instant Estimate
├─ Price breakdown
├─ Timeline estimate
├─ Download PDF quote
└─ Book consultation CTA
```

### Files to Create/Modify

```
/components/configurator/MultiStepEstimator.tsx     [CREATE]
/components/configurator/ProgressBar.tsx            [CREATE]
/components/configurator/FinishPreview.tsx          [CREATE]
/components/configurator/SaveContinueModal.tsx      [CREATE]
/lib/email/abandoned-cart.ts                        [CREATE]
/lib/storage/estimate-storage.ts                    [CREATE]
```

### Email Automation Sequence

**Email 1: Immediate Recovery (1 hour)**
```
Subject: Your closet estimate is waiting
Preview: You're 90% there! Complete your estimate in 2 minutes.

Body:
- Personalized greeting with door type
- Resume link to saved estimate
- Reminder of specific timeframe (2-3 weeks)
- CTA: "Complete My Estimate"
```

**Email 2: Value Reinforcement (24 hours)**
```
Subject: Still thinking about your closet upgrade?
Preview: Here's what makes PG Closets different

Body:
- Highlight trust signals (500+ projects, BBB A+)
- Customer testimonial relevant to their door type
- Lifetime warranty emphasis
- CTA: "See My Estimate" or "Book Free Consultation"
```

**Email 3: Incentive Offer (72 hours)**
```
Subject: Special offer on your closet project
Preview: Save $100 on installation when you book this week

Body:
- Limited-time offer ($100 off or free upgrade)
- Urgency: "Offer expires in 5 days"
- Social proof: "Join 500+ satisfied Ottawa homeowners"
- CTA: "Claim My Offer"
```

### Success Metrics

- **Estimator Completion Rate:** 48%+ (vs 31% baseline)
- **Email Capture Rate:** 40%+ of estimator starts
- **Abandonment Recovery:** 15% of abandoned carts recovered
- **Email Open Rate:** 35%+ for sequence
- **Email Click-Through:** 12%+ from emails to site

### Dependencies

- Email service provider subscription ($20-50/month)
- Finish preview assets (photos or 3D renders)
- PDF quote generation library
- Local storage/session management

---

## Phase 11: Accessibility & Compliance (BONUS)

**Timeline:** Week 11-12
**Priority:** 🟡 MEDIUM (Legal risk mitigation)
**Effort:** 🟡 MEDIUM (3-4 days)
**Expected Impact:** Legal compliance + 3-5% conversion (inclusive design)

### Objectives

1. Achieve WCAG 2.1 AA compliance
2. Implement comprehensive keyboard navigation
3. Add screen reader optimization
4. Create accessibility statement page

### Deliverables

| Deliverable | Description | Success Metric |
|-------------|-------------|----------------|
| **WCAG 2.1 AA Compliance** | Pass all Level A and AA criteria | 100% compliance |
| **Keyboard Navigation** | Full site navigable with keyboard | All features accessible |
| **Screen Reader Optimization** | NVDA/JAWS tested and optimized | 0 critical issues |
| **Focus Indicators** | Visible focus states on all interactive elements | All elements compliant |
| **Accessibility Statement** | Public commitment to accessibility | Legal protection |

### Tasks

**Week 11:**
- [ ] Run axe DevTools full site scan
- [ ] Run WAVE accessibility checker
- [ ] Test with NVDA screen reader
- [ ] Test with JAWS screen reader (if available)
- [ ] Document all violations

**Week 12:**
- [ ] Fix color contrast issues (4.5:1 ratio)
- [ ] Add skip navigation link
- [ ] Enhance ARIA labels and roles
- [ ] Implement visible focus indicators
- [ ] Add keyboard shortcuts documentation
- [ ] Create accessibility statement page
- [ ] Final audit and verification

### Files to Create/Modify

```
/app/accessibility/page.tsx                         [CREATE]
/components/a11y/SkipNavigation.tsx                [CREATE]
/app/globals.css                                    [MODIFY - focus styles]
/components/navigation/MegaMenuNav.tsx              [MODIFY - ARIA]
/components/ui/button.tsx                           [MODIFY - focus rings]
```

### WCAG 2.1 AA Checklist

**Perceivable:**
- [x] Text alternatives for non-text content
- [ ] Color contrast minimum 4.5:1
- [ ] Resize text up to 200% without loss of content
- [ ] No information conveyed by color alone

**Operable:**
- [ ] All functionality available from keyboard
- [ ] No keyboard traps
- [ ] Skip navigation link present
- [ ] Page titles descriptive and unique

**Understandable:**
- [x] Page language identified (lang="en")
- [ ] Consistent navigation
- [ ] Consistent identification
- [ ] Error suggestions provided

**Robust:**
- [ ] Valid HTML
- [ ] Name, Role, Value for all UI components
- [ ] Status messages announced to screen readers

### Success Metrics

- **axe Violations:** 0 critical, 0 serious
- **WAVE Errors:** 0 errors
- **Keyboard Navigation:** 100% functional
- **Screen Reader:** 100% content accessible
- **Color Contrast:** 100% compliant
- **Legal Risk:** Significantly reduced

### Dependencies

- NVDA screen reader (free)
- JAWS trial license (optional, $95/month)
- axe DevTools browser extension (free)

---

## Success Tracking Dashboard

### Key Performance Indicators (KPIs)

**Conversion Metrics:**
```
Hero CTA Click-Through Rate
├─ Baseline: 8.1%
├─ Target: 14.2%
└─ Current: [TBD after deploy]

Overall Conversion Rate
├─ Baseline: 2.3%
├─ Target: 3.8%
└─ Current: [TBD after deploy]

Estimator Completion Rate
├─ Baseline: 31%
├─ Target: 48%
└─ Current: [TBD after deploy]
```

**Performance Metrics:**
```
Lighthouse Performance Score
├─ Baseline: [TBD - run audit]
├─ Target: 90+
└─ Current: [TBD after Phase 8]

Largest Contentful Paint (LCP)
├─ Baseline: [TBD - run audit]
├─ Target: < 2.5s
└─ Current: [TBD after Phase 8]

Time to Interactive (TTI)
├─ Baseline: [TBD - run audit]
├─ Target: < 3.5s
└─ Current: [TBD after Phase 8]
```

**Engagement Metrics:**
```
Mobile Engagement Rate
├─ Baseline: 42%
├─ Target: 64%
└─ Current: [TBD after deploy]

Scroll Depth (40%+ page)
├─ Baseline: [TBD - measure]
├─ Target: 65%
└─ Current: [TBD after Phase 9]

Time on Site
├─ Baseline: [TBD - measure]
├─ Target: +30%
└─ Current: [TBD after Phase 7]
```

### Weekly Check-ins

**Every Monday:**
1. Review previous week's metrics
2. Assess progress toward phase goals
3. Identify blockers or dependencies
4. Adjust timeline if needed
5. Update stakeholders

**Metrics to Track Weekly:**
- Traffic (sessions, users, pageviews)
- Conversion rate (overall + by source)
- Bounce rate and exit pages
- Top landing pages
- Mobile vs desktop performance
- Form submission rates
- Estimator engagement

---

## Risk Management

### High-Risk Areas

**Risk 1: Performance Regression**
- **Probability:** Medium
- **Impact:** High (conversion loss)
- **Mitigation:** Lighthouse CI in deployment pipeline
- **Rollback:** Immediate revert if score drops >5 points

**Risk 2: Analytics Tracking Breaks**
- **Probability:** Low
- **Impact:** High (blind optimization)
- **Mitigation:** Test events before deploy, monitor GA4
- **Rollback:** Event tracking verification checklist

**Risk 3: Mobile Experience Degrades**
- **Probability:** Medium
- **Impact:** Critical (68% of traffic)
- **Mitigation:** Comprehensive mobile device testing
- **Rollback:** Device-specific testing before each phase

**Risk 4: A/B Test Reaches Significance Too Slowly**
- **Probability:** Medium
- **Impact:** Medium (delayed learning)
- **Mitigation:** Calculate required sample size upfront
- **Rollback:** Extend testing period or increase traffic split

**Risk 5: Third-Party Dependencies Fail**
- **Probability:** Low
- **Impact:** Medium (feature degradation)
- **Mitigation:** Error boundaries around external scripts
- **Rollback:** Graceful degradation, no critical path dependencies

---

## Budget & Resources

### Estimated Costs

**Phase 7 (Content):**
- Customer testimonial photos: $0-200 (if stock needed)
- Copywriting assistance (optional): $0-500

**Phase 8 (Performance):**
- No additional costs (internal optimization)

**Phase 9 (Analytics):**
- Hotjar/Clarity: $0-99/month (start with free tier)
- A/B testing tool (optional): $0-49/month

**Phase 10 (Conversion Flow):**
- Email automation: $20-50/month (ConvertKit/Mailchimp)
- Finish preview assets: $0-300 (if 3D renders needed)

**Phase 11 (Accessibility):**
- JAWS license (optional): $95/month or free NVDA

**Total Estimated:** $20-1,294 (wide range based on choices)

### Time Investment

**Per Phase:**
- Phase 7: 3-4 days (24-32 hours)
- Phase 8: 2-3 days (16-24 hours)
- Phase 9: 5-6 days (40-48 hours)
- Phase 10: 4-5 days (32-40 hours)
- Phase 11: 3-4 days (24-32 hours)

**Total Time:** 17-22 days (136-176 hours)

**Resource Allocation:**
- Developer: 70% of time
- Designer: 15% of time (Phase 7, 10)
- Content Writer: 10% of time (Phase 7)
- QA/Testing: 5% of time (all phases)

---

## Decision Points & Approvals

### Phase 7 Decision Point
**Question:** Hire copywriter or write internally?
**Options:**
- Option A: Internal team writes (faster, lower cost, may be lower quality)
- Option B: Hire professional ($500 budget, higher quality, slower)
**Recommendation:** Start internal, hire if needed based on results

### Phase 9 Decision Point
**Question:** Which heatmap tool?
**Options:**
- Option A: Microsoft Clarity (free, good features, Microsoft data)
- Option B: Hotjar (paid, more features, better UX)
**Recommendation:** Start with Clarity, upgrade to Hotjar if budget allows

### Phase 10 Decision Point
**Question:** Email automation platform?
**Options:**
- Option A: ConvertKit ($29/month, creator-focused, good automation)
- Option B: Mailchimp ($20/month, well-known, complex pricing)
- Option C: SendGrid ($15/month, developer-focused, API-first)
**Recommendation:** ConvertKit for ease of use + automation features

### Phase 11 Decision Point
**Question:** How comprehensive should accessibility audit be?
**Options:**
- Option A: Automated tools only (fast, cheap, 70% coverage)
- Option B: Automated + manual screen reader (thorough, 90% coverage)
- Option C: Professional audit firm ($2-5K, 100% coverage, certification)
**Recommendation:** Option B for strong compliance without high cost

---

## Success Criteria Summary

### Phase 6 (Complete) ✅
- [x] Hero conversion rate projected 65% increase
- [x] Multi-CTA strategy implemented
- [x] Quick Configure 67% friction reduction
- [x] Scroll trigger at 40% depth

### Phase 7 (Weeks 1-2)
- [ ] 6+ customer testimonials live
- [ ] Organic traffic +20%
- [ ] Time on page +30%
- [ ] 3+ FAQ rich snippets

### Phase 8 (Weeks 3-4)
- [ ] Lighthouse performance 90+
- [ ] LCP < 2.5s desktop, < 3.0s mobile
- [ ] Bundle size -35%
- [ ] Core Web Vitals all green

### Phase 9 (Weeks 5-7)
- [ ] Estimator drop-off point identified
- [ ] 10+ heatmap insights documented
- [ ] Traffic source personalization live
- [ ] Conversion lift +12% from personalization

### Phase 10 (Weeks 8-10)
- [ ] Multi-step estimator completion rate 48%+
- [ ] Email capture rate 40%+
- [ ] Abandonment recovery 15%
- [ ] Email automation sequence deployed

### Phase 11 (Weeks 11-12)
- [ ] WCAG 2.1 AA compliance 100%
- [ ] 0 critical accessibility violations
- [ ] Keyboard navigation 100% functional
- [ ] Accessibility statement published

---

## Communication Plan

### Weekly Updates

**To:** Spencer Carroll (Product Owner)
**When:** Every Friday 4pm
**Format:** Email + Dashboard link
**Contents:**
- Week in review (completed work)
- Metrics update (conversion, performance)
- Blockers or risks
- Next week's priorities

### Monthly Reviews

**To:** Stakeholders
**When:** First Monday of month
**Format:** 30-minute meeting + slide deck
**Contents:**
- Progress toward quarterly goals
- ROI analysis (conversion improvement)
- Budget status
- Strategic recommendations

### Ad-Hoc Communication

**Use Case: Critical Issue**
- Immediate Slack/text notification
- Email with details within 30 minutes
- Proposed solution within 2 hours

**Use Case: Major Win**
- Celebrate in team channel
- Document in changelog
- Consider customer communication

---

## Long-Term Vision (Beyond Week 12)

### Q2 2025 (Weeks 13-26)
- Advanced personalization (machine learning)
- Video testimonials and virtual tours
- Live chat integration
- AR/VR door visualization (experimental)

### Q3 2025 (Weeks 27-39)
- Mobile app consideration (iOS/Android)
- Loyalty program for repeat customers
- Referral system with incentives
- Expanded service area (beyond Ottawa)

### Q4 2025 (Weeks 40-52)
- Full e-commerce checkout (buy online)
- 3D room configurator
- AI-powered design recommendations
- Multi-language support (French)

---

**Roadmap Version:** 1.0
**Created:** 2025-10-09
**Next Review:** Week 4 (after Phase 8 completion)
**Owner:** Spencer Carroll
**Status:** 🚀 Ready for Execution
