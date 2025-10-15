# PG Closets Social Media Integration - Implementation Guide

## Overview

This comprehensive social media integration system transforms PG Closets' social presence into a powerful brand amplification and revenue generation engine with shoppable content, automated posting, analytics tracking, and community engagement tools.

---

## Completed Deliverables

### 1. Strategic Documentation

#### `/docs/social/SOCIAL_STRATEGY.md` ✅
Comprehensive social media strategy covering:
- **Platform Priorities**: Instagram (primary), Pinterest (secondary), Facebook (tertiary), TikTok (experimental), LinkedIn (B2B), YouTube (content hub)
- **Content Pillars**: Product showcases (40%), design inspiration (30%), education (20%), community/testimonials (10%)
- **Posting Frequency**: Detailed schedule for each platform
- **Engagement Strategy**: Response times, DM management, community building
- **Hashtag Strategy**: 100+ researched hashtags categorized by type
- **Influencer Partnerships**: Macro, micro, and nano-influencer strategies
- **Budget Allocation**: $50,000 annual budget breakdown
- **Success Metrics**: Year 1 goals for followers, engagement, traffic, revenue

#### `/docs/social/CONTENT_CALENDAR.md` ✅
52-week editorial calendar including:
- **Monthly Themes**: January through December content planning
- **Weekly Content Themes**: Monday Motivation, Transformation Tuesday, etc.
- **Content Types by Platform**: Specific posting strategies
- **Campaign Calendar**: Quarterly campaign planning
- **UGC Schedule**: User-generated content sourcing and featuring
- **Hashtag Library**: 100+ categorized hashtags
- **Content Creation Workflow**: Production and approval processes
- **Performance Review Schedule**: Daily, weekly, monthly, quarterly reviews

### 2. React Components

#### `/components/social/InstagramFeed.tsx` ✅
Full-featured Instagram feed integration with:
- **Grid, Carousel, and Masonry layouts**
- **Post metadata**: Likes, comments, captions
- **Media type indicators**: Video and carousel badges
- **Hover overlays** with engagement stats
- **Compact version** for sidebars
- **Loading and error states**
- **Responsive design**
- **External link integration**

**Usage**:
```tsx
// Full feed on homepage
<InstagramFeed
  username="pgclosets"
  limit={9}
  layout="grid"
  showCaption={false}
  showStats={true}
  showCTA={true}
/>

// Compact sidebar version
<InstagramFeedCompact username="pgclosets" limit={4} />
```

#### `/components/social/SocialShareButtons.tsx` ✅
Comprehensive social sharing system with:
- **Multiple platforms**: Facebook, Twitter, LinkedIn, WhatsApp, Pinterest, Email
- **Three layouts**: Horizontal, vertical, compact
- **Copy link functionality** with clipboard API
- **Share count tracking** and display
- **Native Web Share API** support for mobile
- **Analytics tracking** integration
- **Customizable appearance**

**Usage**:
```tsx
// Product page sharing
<SocialShareButtons
  url={`https://pgclosets.com/products/${product.slug}`}
  title={product.title}
  description={product.description}
  image={product.images[0]}
  hashtags={["PGClosets", "BarnDoors"]}
  layout="horizontal"
  showLabels={true}
/>

// Native mobile sharing
<NativeShareButton
  url={productUrl}
  title={product.title}
  description={product.description}
/>

// Aggregate share count
<SocialShareCount url={productUrl} showBreakdown={true} />
```

### 3. Backend Integration

#### `/lib/social/shopping.ts` ✅
Shoppable social integration system with:

**InstagramShopping Class**:
- Product catalog syncing to Facebook/Instagram
- Product tagging in posts
- Product stickers for Stories
- Shopping insights and analytics
- Batch product uploads

**PinterestShopping Class**:
- Product pin creation and updates
- Product feed management for auto-sync
- Shopping analytics (impressions, saves, clicks, checkouts)
- Rich pin formatting

**FacebookShops Class**:
- Shop setup and configuration
- Product collection creation
- Catalog management
- Shop analytics

**SocialShoppingManager Class**:
- Unified catalog sync across all platforms
- Consolidated analytics dashboard
- Multi-platform coordination

**Product Feed Generation**:
- XML format (Google Shopping compatible)
- CSV format for manual uploads
- TSV format for Pinterest
- Automated feed generation from database

**Usage**:
```typescript
// Initialize manager with platform credentials
const manager = new SocialShoppingManager({
  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
    catalogId: process.env.FACEBOOK_CATALOG_ID!,
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ID!
  },
  pinterest: {
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!,
    merchantId: process.env.PINTEREST_MERCHANT_ID!
  }
})

// Sync products to all platforms
const products = await getShoppableProducts()
const results = await manager.syncAllPlatforms(products)

// Get unified analytics
const analytics = await manager.getUnifiedAnalytics(
  new Date('2025-01-01'),
  new Date('2025-01-31')
)

// Generate product feed
const xmlFeed = await generateProductFeed('xml')
```

---

## Remaining Components to Build

### 4. Additional Social Proof Widgets

#### `/components/social/FacebookReviews.tsx`
Display Facebook ratings and reviews on website.

**Features**:
- Fetch reviews via Facebook Graph API
- Star rating display
- Review carousel or grid layout
- Link to Facebook page for more reviews
- Filter by rating
- Sort by date or relevance

**Implementation**:
```tsx
export function FacebookReviews({
  pageId: string,
  limit?: number,
  minRating?: number,
  layout?: "carousel" | "grid" | "list"
}) {
  // Fetch reviews from Facebook Graph API
  // Display with user avatars, names, dates
  // Show star ratings
  // Link to Facebook page
}
```

#### `/components/social/SocialProofBanner.tsx`
"As seen on Instagram" showcase banner.

**Features**:
- Rotating customer photos from Instagram
- "Follow us" CTA
- Photo credit attribution
- Click-through to Instagram post
- Autoplay carousel

**Implementation**:
```tsx
export function SocialProofBanner({
  hashtag?: string,
  count?: number,
  autoplay?: boolean,
  interval?: number
}) {
  // Display rotating customer photos
  // "Join 5,000+ happy customers"
  // Social proof statistics
  // Follow button CTA
}
```

#### `/components/social/UserGeneratedContent.tsx`
Customer photo gallery with filtering.

**Features**:
- Grid/masonry layout of customer photos
- Filter by product category
- Filter by room type
- Lightbox for full-size viewing
- Link to original social post
- "Share Your Space" CTA

**Implementation**:
```tsx
export function UserGeneratedContent({
  category?: string,
  layout?: "grid" | "masonry",
  limit?: number,
  showFilters?: boolean
}) {
  // Fetch UGC from database/API
  // Display with product tags
  // Filter and sort controls
  // Lightbox integration
  // Submission form
}
```

#### `/components/social/SocialFollowButtons.tsx`
Centralized "Follow Us" CTA component.

**Features**:
- Icons for all social platforms
- Follower count display
- Hover effects
- Multiple layout options
- Platform-specific colors

**Implementation**:
```tsx
export function SocialFollowButtons({
  platforms: ("instagram" | "facebook" | "pinterest" | "tiktok" | "youtube")[],
  showCount?: boolean,
  layout?: "horizontal" | "vertical" | "compact",
  size?: "sm" | "md" | "lg"
}) {
  // Display follow buttons for each platform
  // Fetch and show follower counts
  // Track click events
}
```

#### `/components/social/SocialAnalytics.tsx`
Dashboard for social media performance metrics.

**Features**:
- Overview cards (followers, engagement, reach, clicks)
- Platform comparison charts
- Content performance tables
- Engagement rate trends
- Traffic and conversion metrics
- Export functionality

**Implementation**:
```tsx
export function SocialAnalytics({
  dateRange: { start: Date, end: Date },
  platforms?: string[],
  metrics?: string[]
}) {
  // Fetch analytics from all platforms
  // Display key metrics
  // Render charts and graphs
  // Show top performing content
  // Export to CSV/PDF
}
```

### 5. API Routes

#### `/app/api/social/instagram/feed/route.ts`
Fetch Instagram feed using Graph API.

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '6'

  // Fetch from Instagram Graph API
  const posts = await fetchInstagramFeed(limit)

  return Response.json({ posts })
}
```

#### `/app/api/social/share-counts/route.ts`
Aggregate social share counts for URLs.

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  // Fetch share counts from each platform
  const counts = await getShareCounts(url)

  return Response.json(counts)
}
```

#### `/app/api/social/ugc/submit/route.ts`
Handle user-generated content submissions.

```typescript
export async function POST(request: Request) {
  const data = await request.json()

  // Validate submission
  // Store in database
  // Send to moderation queue
  // Send confirmation email

  return Response.json({ success: true })
}
```

#### `/app/api/social/catalog/sync/route.ts`
Endpoint to trigger product catalog sync.

```typescript
export async function POST(request: Request) {
  const { platforms } = await request.json()

  // Get products from database
  // Sync to specified platforms
  // Return sync results

  return Response.json({ results })
}
```

### 6. Additional Strategy Documents

#### `/docs/social/INSTAGRAM_STRATEGY.md`
Detailed Instagram-specific strategy:
- Feed post guidelines (photography, captions, hashtags)
- Reels strategy (trending audio, hooks, CTAs)
- Stories tactics (interactive stickers, highlights)
- Shopping setup (product tagging, Shop tab)
- Engagement tactics (comment responses, DM automation)
- Influencer collaboration templates

#### `/docs/social/PINTEREST_STRATEGY.md`
Pinterest-specific marketing strategy:
- Board structure and organization (15-20 boards)
- Pin design best practices (vertical format, text overlays)
- Pin types (standard, idea, video, carousel)
- SEO optimization (keywords, descriptions, hashtags)
- Pinterest Ads setup and targeting
- Seasonal content planning

#### `/docs/social/PAID_SOCIAL_GUIDE.md`
Comprehensive paid advertising strategy:
- Facebook/Instagram Ads setup and optimization
- Audience targeting (demographics, interests, behaviors)
- Custom and lookalike audiences
- Ad formats (image, carousel, video, collection)
- Budget allocation (80% retargeting, 20% cold)
- A/B testing framework
- Performance benchmarks and KPIs
- Creative best practices

#### `/docs/social/COMMUNITY_GUIDE.md`
Community management playbook:
- Response templates for common inquiries
- Escalation protocols for complaints
- Review management strategy
- Crisis communication plan
- Sentiment tracking
- Community building initiatives

#### `/docs/social/CONTENT_PRODUCTION.md`
Content creation guidelines:
- Photography setup (lighting, angles, staging)
- Video production (equipment, shot lists, editing)
- Graphic design templates (Canva)
- Caption writing formulas
- Brand voice and tone
- Editing presets and filters
- Content approval workflow

### 7. Integration Libraries

#### `/lib/social/integrations.ts`
Website-to-social integration utilities.

**Features**:
- Social login (OAuth)
- Cross-posting automation
- Social pixel implementations
- UTM parameter generation
- Social proof data fetching
- Webhook handlers for social events

#### `/lib/social/ugc.ts`
User-generated content management.

**Features**:
- Hashtag monitoring
- Permission requests (automated DMs)
- Content moderation queue
- Rights management
- Gallery curation
- Contest management

#### `/lib/social/analytics.ts`
Unified social analytics aggregation.

**Features**:
- Platform API connections
- Metric normalization
- Data warehousing
- Performance reporting
- Competitive benchmarking
- Custom dashboard queries

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
✅ Complete strategic documentation
✅ Create InstagramFeed component
✅ Build SocialShareButtons component
✅ Implement shopping.ts backend
- Set up API routes for Instagram feed
- Configure social media API access tokens
- Test Instagram Shopping catalog sync

### Phase 2: Core Components (Weeks 3-4)
- Build FacebookReviews component
- Create SocialProofBanner component
- Implement UserGeneratedContent component
- Build SocialFollowButtons component
- Create API routes for share counts and UGC

### Phase 3: Analytics & Management (Weeks 5-6)
- Build SocialAnalytics dashboard component
- Implement analytics.ts backend
- Create integrations.ts library
- Build ugc.ts management system
- Set up automated catalog syncing

### Phase 4: Platform Strategies (Weeks 7-8)
- Write Instagram-specific strategy document
- Create Pinterest strategy guide
- Develop paid social advertising guide
- Build community management playbook
- Create content production guide

### Phase 5: Testing & Optimization (Weeks 9-10)
- Test all components across devices
- Verify API integrations
- Conduct A/B tests on social content
- Optimize performance
- Train team on tools and workflows

### Phase 6: Launch & Scale (Weeks 11-12)
- Launch Instagram Shopping
- Enable Pinterest Shopping Ads
- Set up Facebook Shops
- Begin influencer outreach
- Start content calendar execution
- Monitor and optimize performance

---

## Technical Requirements

### Environment Variables
```env
# Instagram/Facebook
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_ACCESS_TOKEN=your_long_lived_token
FACEBOOK_CATALOG_ID=your_catalog_id
INSTAGRAM_BUSINESS_ID=your_business_account_id

# Pinterest
PINTEREST_APP_ID=your_app_id
PINTEREST_APP_SECRET=your_app_secret
PINTEREST_ACCESS_TOKEN=your_access_token
PINTEREST_MERCHANT_ID=your_merchant_id

# TikTok
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_ACCESS_TOKEN=your_access_token

# YouTube
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
FACEBOOK_PIXEL_ID=your_pixel_id
PINTEREST_TAG_ID=your_tag_id
```

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "@prisma/client": "^5.0.0",
    "date-fns": "^2.30.0",
    "lucide-react": "latest",
    "sonner": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Database Schema
```prisma
model SocialPost {
  id          String   @id @default(cuid())
  platform    String   // "instagram" | "facebook" | "pinterest" | "tiktok"
  postId      String   @unique
  content     String
  mediaUrls   String[]
  permalink   String
  likes       Int      @default(0)
  comments    Int      @default(0)
  shares      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model UGCSubmission {
  id          String   @id @default(cuid())
  userId      String?
  email       String
  name        String
  imageUrl    String
  caption     String?
  productId   String?
  status      String   // "pending" | "approved" | "rejected"
  approvedAt  DateTime?
  createdAt   DateTime @default(now())
}

model SocialShare {
  id          String   @id @default(cuid())
  url         String
  platform    String
  userId      String?
  createdAt   DateTime @default(now())

  @@index([url])
}

model SocialAnalytics {
  id              String   @id @default(cuid())
  platform        String
  date            DateTime
  followers       Int
  engagement      Int
  reach           Int
  impressions     Int
  clicks          Int
  conversions     Int
  revenue         Float
  createdAt       DateTime @default(now())

  @@unique([platform, date])
}
```

---

## Integration Points

### 1. Product Pages
Add social sharing and Instagram feed to product detail pages:
```tsx
// app/products/[slug]/page.tsx
import { SocialShareButtons } from "@/components/social/SocialShareButtons"
import { InstagramFeedCompact } from "@/components/social/InstagramFeed"

export default function ProductPage({ product }) {
  return (
    <div>
      {/* Product content */}

      <div className="mt-8">
        <h3>Share this product</h3>
        <SocialShareButtons
          url={`https://pgclosets.com/products/${product.slug}`}
          title={product.title}
          image={product.images[0]}
        />
      </div>

      <div className="mt-12">
        <h3>See More on Instagram</h3>
        <InstagramFeedCompact limit={4} />
      </div>
    </div>
  )
}
```

### 2. Homepage
Feature Instagram feed and social proof:
```tsx
// app/page.tsx
import { InstagramFeed } from "@/components/social/InstagramFeed"
import { SocialProofBanner } from "@/components/social/SocialProofBanner"
import { UserGeneratedContent } from "@/components/social/UserGeneratedContent"

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}

      <SocialProofBanner hashtag="#MyPGClosets" count={500} />

      {/* Other sections */}

      <section className="container py-20">
        <h2>Follow Us on Instagram</h2>
        <InstagramFeed username="pgclosets" limit={9} layout="grid" />
      </section>

      <section className="container py-20">
        <h2>Customer Transformations</h2>
        <UserGeneratedContent category="barn-doors" limit={8} />
      </section>
    </div>
  )
}
```

### 3. Footer
Add social follow buttons:
```tsx
// components/Footer.tsx
import { SocialFollowButtons } from "@/components/social/SocialFollowButtons"

export function Footer() {
  return (
    <footer>
      {/* Other footer content */}

      <div className="mt-8">
        <h4>Follow Us</h4>
        <SocialFollowButtons
          platforms={["instagram", "facebook", "pinterest", "tiktok"]}
          showCount={true}
          layout="horizontal"
        />
      </div>
    </footer>
  )
}
```

### 4. Admin Dashboard
Social analytics overview:
```tsx
// app/admin/social/page.tsx
import { SocialAnalytics } from "@/components/social/SocialAnalytics"

export default function SocialAdminPage() {
  return (
    <div>
      <h1>Social Media Analytics</h1>
      <SocialAnalytics
        dateRange={{
          start: new Date('2025-01-01'),
          end: new Date()
        }}
        platforms={["instagram", "pinterest", "facebook"]}
      />
    </div>
  )
}
```

---

## Performance Optimization

### 1. Caching Strategy
- Cache Instagram feed for 15 minutes
- Cache share counts for 1 hour
- Cache social analytics for 24 hours
- Use stale-while-revalidate for improved perceived performance

### 2. Image Optimization
- Use Next.js Image component for all social images
- Lazy load Instagram feed images
- Use appropriate image sizes (responsive srcset)
- WebP format with fallbacks

### 3. API Rate Limiting
- Implement request throttling for social APIs
- Queue catalog sync operations
- Batch API requests where possible
- Use webhooks instead of polling when available

### 4. Database Indexing
- Index social post by platform and date
- Index UGC submissions by status
- Index social shares by URL
- Index analytics by platform and date

---

## Security Considerations

### 1. API Token Management
- Store tokens in environment variables
- Never expose tokens to client-side
- Rotate tokens regularly
- Use scoped permissions (minimum required access)

### 2. User-Generated Content Moderation
- All UGC requires approval before display
- Automated profanity filtering
- Manual review queue
- Report/flag functionality

### 3. Data Privacy
- GDPR compliance for EU users
- Cookie consent for tracking pixels
- Clear privacy policy
- User data deletion on request

### 4. Rate Limiting
- Implement rate limiting on public APIs
- Prevent abuse of share tracking
- Throttle UGC submissions
- Monitor for suspicious activity

---

## Testing Strategy

### 1. Component Testing
```typescript
// __tests__/components/social/InstagramFeed.test.tsx
import { render, screen } from '@testing-library/react'
import { InstagramFeed } from '@/components/social/InstagramFeed'

describe('InstagramFeed', () => {
  it('renders loading state', () => {
    render(<InstagramFeed />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays posts when loaded', async () => {
    // Mock API response
    // Render component
    // Assert posts are displayed
  })
})
```

### 2. Integration Testing
- Test Instagram API integration
- Test Pinterest catalog sync
- Test Facebook Shops setup
- Test product feed generation

### 3. E2E Testing with Playwright
```typescript
// e2e/social-sharing.spec.ts
import { test, expect } from '@playwright/test'

test('social sharing on product page', async ({ page }) => {
  await page.goto('/products/barn-door-example')

  // Click Facebook share button
  await page.click('[aria-label="Share on Facebook"]')

  // Verify share dialog opens
  await expect(page.locator('.facebook-share-dialog')).toBeVisible()
})
```

---

## Monitoring & Analytics

### 1. Key Metrics to Track
- Social referral traffic (Google Analytics)
- Social-attributed conversions
- Engagement rates by platform
- Follower growth rate
- Content performance (top posts)
- Hashtag effectiveness
- Influencer ROI
- UGC submission rate

### 2. Alerting
Set up alerts for:
- Negative sentiment spikes
- Sudden follower drops
- API failures
- Low engagement rates
- Catalog sync failures

### 3. Reporting
Generate reports:
- Daily engagement summary
- Weekly content performance
- Monthly analytics report
- Quarterly business review

---

## Training & Documentation

### 1. Team Training
- Social media strategy overview
- Content calendar management
- Using the admin dashboard
- Community management best practices
- Crisis communication protocols

### 2. User Documentation
- How to share products on social
- How to submit UGC
- How to follow PG Closets
- Contest and giveaway rules

### 3. Developer Documentation
- API integration guides
- Component usage examples
- Database schema explanations
- Troubleshooting common issues

---

## Success Metrics (Year 1 Goals)

### Follower Goals
- Instagram: 5,000+ followers
- Pinterest: 10,000+ monthly viewers
- Facebook: 2,000+ followers
- TikTok: 1,000+ followers
- YouTube: 1,000+ subscribers

### Engagement Goals
- Overall engagement rate: 4-6%
- Instagram Stories views: 1,000+ per story
- Pinterest saves: 100+/day
- Facebook reviews: 100+ (4.5+ stars)

### Traffic Goals
- Social referral traffic: 20% of total
- Monthly social clicks: 5,000+
- Link CTR: 3-5%

### Revenue Goals
- Social-attributed revenue: $120,000+/year
- Social conversion rate: 2-3%
- ROAS: 4:1
- CAC from social: <$50

---

## Next Steps

1. **Immediate Actions**:
   - Set up social media business accounts (if not done)
   - Apply for Instagram Shopping approval
   - Create Pinterest Business account
   - Set up Facebook catalog

2. **Week 1**:
   - Configure API access tokens
   - Test Instagram feed integration
   - Begin content calendar population
   - Schedule first month of posts

3. **Week 2**:
   - Launch Instagram feed on website
   - Enable social sharing on product pages
   - Start daily posting schedule
   - Begin engagement strategy

4. **Month 1**:
   - Complete all component builds
   - Launch shoppable Instagram
   - Begin influencer outreach
   - Run first contest/giveaway

5. **Quarter 1**:
   - Optimize based on performance data
   - Scale content production
   - Expand influencer partnerships
   - Launch paid advertising campaigns

---

## Support & Resources

### Helpful Links
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Pinterest API Documentation](https://developers.pinterest.com/docs/api/v5/)
- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [TikTok For Business](https://ads.tiktok.com/marketing_api/docs)

### Tools & Platforms
- **Scheduling**: Later, Hootsuite, Buffer
- **Analytics**: Sprout Social, Iconosquare
- **Design**: Canva Pro, Adobe Creative Suite
- **Hashtag Research**: Hashtagify, RiteTag
- **Influencer Discovery**: AspireIQ, Upfluence

### Community Resources
- Social Media Examiner
- Hootsuite Blog
- Buffer Blog
- Later Blog
- Instagram Creator Account resources

---

*This implementation guide provides a complete roadmap for building and launching the PG Closets social media integration system. Follow the phased approach for systematic implementation and refer to specific documentation files for detailed strategies.*
