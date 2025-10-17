# PG Closets Website Rebuild Plan

## Executive Summary

Complete rebuild of pgclosets.com - a 110-page e-commerce platform for Renin closet doors serving Ottawa region.

**Goals:**
- Modern, performant Next.js 15 architecture
- AI-powered product search and recommendations
- Unified design system implementation
- Improved conversion rates and user experience
- Better SEO and Core Web Vitals scores

## Current Architecture Analysis

### Site Structure
```
Root Pages (13):
- Home (/, /HomePage.tsx, /ClientHomePage.tsx)
- About, Contact, FAQ, Gallery
- Documentation (/docs/*)
- Blog, Why PG, Design System Showcase

Product Pages (30+):
- /products/* - Main catalog
- /collections/* - Renin collections
- /products/[slug] - Individual products
- /simple-products - Alternative view

Service Pages (15):
- /services/* - Consultation, installation, planning, warranty, maintenance
- /process/* - Design process pages
- /consultation, /installation-ottawa

Location Pages (5):
- /ottawa, /kanata, /barrhaven, /nepean, /orleans
- /areas/[neighborhood] - Dynamic locations
- /renin/* - Location-specific Renin pages

E-Commerce (12):
- /cart, /checkout, /orders
- /simple-cart - Alternative cart
- /quote, /instant-estimate, /renin-quotes
- /book-measure, /book-measurement
- /request-work, /visualizer

Account & Admin (8):
- /login, /register, /account, /profile, /dashboard
- /forgot-password, /wishlist
- /admin/* - Admin panel

Legal & Support (6):
- /privacy-policy, /terms-of-service, /return-policy, /shipping-policy
- /legal/*, /offline, /storage-check

Content (4):
- /blog/[slug] - Blog posts
- /files, /upload
- /typography-showcase
- /navigation-apple-demo, /examples

API Routes (Multiple):
- /api/* - Backend endpoints
```

### Current Tech Stack
- **Framework**: Next.js 15.5.5 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS + Design Tokens
- **Forms**: React Hook Form
- **State**: React Context
- **New**: Vercel AI SDK (just installed)

### Design System Status
✅ **Completed** (January 2025):
- `/lib/design-tokens.ts` - Unified design system
- `/components/ui/unified-button.tsx` - Consolidated button component
- Apple-inspired aesthetic
- 8px grid spacing
- Premium typography (Cormorant + Inter)

### Key Features to Preserve
1. **Product Catalog** - Renin door collections
2. **Booking System** - Measurement scheduling
3. **Quote System** - Instant estimates and custom quotes
4. **E-commerce** - Cart, checkout, orders
5. **Location Targeting** - Ottawa neighborhood pages
6. **Documentation** - /docs/* system (recently built)
7. **Blog** - Content management
8. **Admin Panel** - Product and order management

## Rebuild Architecture

### Phase 1: Foundation (Week 1)
**Core Layout System**
```
/app/layout.tsx                 - Root layout with AI SDK provider
/components/layout/
  ├── Header.tsx                - Modern navigation with search
  ├── Footer.tsx                - Comprehensive footer
  ├── MobileNav.tsx             - Mobile menu
  └── SearchDialog.tsx          - AI-powered search (Cmd+K)
```

**Design System Integration**
- Implement unified components throughout
- Use design tokens exclusively
- Create component showcase
- Ensure accessibility (WCAG AA)

**Performance Setup**
- Image optimization
- Code splitting strategy
- Route prefetching
- CDN configuration

### Phase 2: Core Pages (Week 1-2)
**Homepage Rebuild**
```typescript
/app/page.tsx
- Hero with dynamic messaging
- Featured collections
- Service highlights
- Location selector
- AI-powered product recommendations
- Trust indicators
- CTA optimization
```

**Product Catalog**
```typescript
/app/products/page.tsx          - Main catalog with AI search
/app/products/[slug]/page.tsx   - Product details
/app/collections/[id]/page.tsx  - Renin collections

Features:
- AI-powered search and filtering
- Smart recommendations
- Interactive product configurator
- Quick view modals
- Related products
- Stock availability
```

**Location Pages**
```typescript
/app/[location]/page.tsx        - Ottawa, Kanata, etc.

Features:
- Neighborhood-specific content
- Local SEO optimization
- Service area maps
- Local testimonials
- Location-based offers
```

### Phase 3: AI-Powered Features (Week 2)
**AI Product Search**
```typescript
/app/api/search/route.ts
- Semantic search across products
- Natural language queries
- Instant results
- Search history and suggestions
```

**AI Chat Assistant**
```typescript
/components/ai/ChatAssistant.tsx
- Product recommendations
- Sizing guidance
- Installation questions
- Order tracking
- Lead capture
```

**Smart Quotes**
```typescript
/app/quote/page.tsx
- AI-powered cost estimation
- Product suggestions based on needs
- Intelligent upselling
- Automated follow-ups
```

### Phase 4: Services & Booking (Week 3)
**Service Pages**
```typescript
/app/services/[service]/page.tsx
- Consultation, installation, planning
- Service benefits and process
- Pricing transparency
- Booking integration
```

**Booking System**
```typescript
/app/book/page.tsx
- AI-powered scheduling
- Availability optimization
- Automated reminders
- Calendar integration
```

### Phase 5: E-Commerce (Week 3-4)
**Shopping Cart**
```typescript
/app/cart/page.tsx
- Persistent cart state
- AI-powered upsells
- Stock validation
- Discount application
```

**Checkout**
```typescript
/app/checkout/page.tsx
- Multi-step checkout
- Payment integration
- Order confirmation
- Email notifications
```

**Order Management**
```typescript
/app/orders/[id]/page.tsx
- Order tracking
- Status updates
- Invoice generation
- Reorder functionality
```

### Phase 6: Content & SEO (Week 4)
**Blog System**
```typescript
/app/blog/[slug]/page.tsx
- MDX content
- AI content suggestions
- Related posts
- Newsletter integration
```

**SEO Optimization**
- Structured data for products
- OpenGraph optimization
- Sitemap generation
- Performance optimization
- Core Web Vitals

### Phase 7: Polish & Launch (Week 5)
**Testing**
- Functionality testing
- Performance testing
- Accessibility testing
- Cross-browser testing
- Mobile testing

**Optimization**
- Bundle size optimization
- Image optimization
- Route prefetching
- Caching strategy

**Launch**
- Staging deployment
- Production deployment
- Monitoring setup
- Analytics integration

## Technical Implementation Details

### AI SDK Integration
```typescript
// AI Provider Setup
import { createAI } from 'ai/rsc';

export const AI = createAI({
  actions: {
    searchProducts,
    getRecommendations,
    estimateQuote,
    answerQuestion,
  },
});

// Product Search
'use server';
export async function searchProducts(query: string) {
  const embedding = await generateEmbedding(query);
  const results = await vectorSearch(embedding);
  return results;
}

// Chat Assistant
import { useChat } from 'ai/react';

export function ChatAssistant() {
  const { messages, input, handleSubmit } = useChat({
    api: '/api/chat',
  });
  // ...
}
```

### Database Schema Updates
```sql
-- AI Features
CREATE TABLE product_embeddings (
  product_id INT PRIMARY KEY,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_interactions (
  id SERIAL PRIMARY KEY,
  user_id INT,
  product_id INT,
  action VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_conversations (
  id SERIAL PRIMARY KEY,
  user_id INT,
  conversation JSON,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Performance Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 250KB main chunk

### SEO Strategy
1. **Technical SEO**
   - Semantic HTML
   - Structured data
   - XML sitemap
   - Robots.txt optimization

2. **Content SEO**
   - Keyword optimization
   - Meta descriptions
   - Alt text for images
   - Internal linking

3. **Local SEO**
   - Google Business Profile
   - Location-specific content
   - Local schema markup
   - NAP consistency

## Migration Strategy

### Data Migration
1. Export existing products, orders, users
2. Transform data for new schema
3. Import with validation
4. Test data integrity

### Content Migration
1. Audit existing content
2. Improve and consolidate
3. Migrate to new structure
4. 301 redirects for changed URLs

### Feature Parity
- Ensure all existing features work
- Improve UX where possible
- Add new AI features
- Enhanced analytics

## Success Metrics

### Business Metrics
- **Conversion Rate**: Target +25%
- **Average Order Value**: Target +15%
- **Lead Generation**: Target +30%
- **Cart Abandonment**: Target -20%

### Technical Metrics
- **Page Load Time**: < 2s
- **Lighthouse Score**: > 90
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

### User Experience
- **Bounce Rate**: < 40%
- **Session Duration**: > 3 minutes
- **Pages per Session**: > 3
- **Mobile Traffic**: Improved experience

## Risk Mitigation

### Technical Risks
- **Data Loss**: Full backups before migration
- **Downtime**: Blue-green deployment
- **Performance**: Load testing before launch
- **SEO Impact**: 301 redirects, sitemap updates

### Business Risks
- **User Confusion**: Gradual rollout, clear communication
- **Feature Gaps**: Feature parity checklist
- **Training**: Staff training on new admin
- **Support**: Enhanced customer support during transition

## Timeline

**Week 1**: Foundation + Core Pages
**Week 2**: AI Features + Products
**Week 3**: Services + E-Commerce
**Week 4**: Content + SEO
**Week 5**: Testing + Launch

**Total**: 5 weeks to full production launch

## Next Steps

1. **Immediate** (Today):
   - Set up new branch: `feature/website-rebuild`
   - Create component library foundation
   - Build new header/footer
   - Implement homepage

2. **This Week**:
   - Complete core layout
   - Build product catalog
   - Implement AI search
   - Create location pages

3. **Next Week**:
   - E-commerce features
   - Booking system
   - Service pages
   - AI chat assistant

## Resources Needed

### Development
- Full-time development (5 weeks)
- Testing environment
- Staging environment
- Performance monitoring

### Content
- Product photography
- Copywriting updates
- SEO optimization
- Documentation

### External Services
- Vercel hosting
- Database hosting
- Email service
- Analytics platform
- AI API (OpenAI/Anthropic)

---

*This is a living document. Update as implementation progresses.*
