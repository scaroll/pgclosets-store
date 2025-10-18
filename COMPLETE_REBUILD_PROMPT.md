# Complete Website Rebuild - AI SDK Sub-Agent Orchestration Prompt

## Mission: Transform PG Closets into a Production-Ready E-Commerce Platform

**Objective**: Execute a complete website rebuild to create a fully functional, secure, and performant e-commerce platform for PG Closets (premium closet doors and storage solutions in Ottawa).

**Context**: AI SDK 5 is deployed but has 125+ critical issues. The site needs a ground-up rebuild with proper database integration, security, and modern e-commerce functionality.

**Execution Strategy**: Use token-efficient sub-agents working in parallel across 8 specialized domains.

---

## 🎯 SUCCESS CRITERIA

### Core Functionality (Must Have)
- [ ] Fully functional product catalog with real database
- [ ] Working shopping cart and checkout with Stripe
- [ ] Booking system for consultations/measurements/installations
- [ ] AI-powered chat with 11 tools (already deployed, needs hardening)
- [ ] Admin dashboard for product/order/booking management
- [ ] Email notifications for orders and bookings
- [ ] Mobile-responsive design (Apple-inspired aesthetic)
- [ ] Production-ready security (rate limiting, input validation, CSRF)

### Performance Targets
- [ ] Lighthouse score: 95+ (Performance, Accessibility, SEO)
- [ ] First Contentful Paint: < 1.2s
- [ ] Time to Interactive: < 2.5s
- [ ] Core Web Vitals: All "Good"

### Business Requirements
- [ ] Service areas: Ottawa, Kanata, Barrhaven, Nepean, Orleans
- [ ] Product categories: Barn doors, bifold doors, bypass doors, pivot doors, room dividers, hardware, mirrors
- [ ] 0% financing for 6-12 months, competitive rates for 24-36 months
- [ ] Free consultation, professional measurement, expert installation
- [ ] Business hours: 9 AM - 5 PM EST (America/Toronto)

---

## 🤖 SUB-AGENT TASK DELEGATION

Execute these 8 tasks in parallel using token-efficient sub-agents:

### Sub-Agent 1: Database Architecture & Prisma Schema
**Priority**: CRITICAL (blocks everything else)
**Estimated Tokens**: 5K

**Task**: Create complete Prisma schema with all required models for e-commerce, bookings, and AI features.

**Requirements**:
1. **Product Management**:
   - Products (with variants, inventory, pricing in cents)
   - Categories (hierarchical with slugs)
   - Collections (featured, bestsellers, new arrivals)
   - Product images (multiple per product)
   - Product embeddings (vector for AI search - pgvector extension)

2. **E-Commerce**:
   - Cart (with items, guest support)
   - Orders (with status tracking, payment info)
   - Order items (with snapshot of product at purchase time)
   - Payment transactions (Stripe integration)
   - Shipping addresses

3. **Booking System**:
   - Bookings (consultations, measurements, installations)
   - Time slots (with availability tracking)
   - Service types (with durations, pricing)
   - Blocked dates (holidays, maintenance)

4. **User Management**:
   - Users (customers and admins)
   - User sessions
   - User addresses (shipping, billing)
   - User preferences

5. **AI Features**:
   - Chat conversations (with message history)
   - AI recommendations (cached results)
   - Search queries (for analytics)

6. **CMS**:
   - Pages (about, FAQ, policies)
   - Blog posts (SEO content)
   - Testimonials/reviews

7. **Configuration**:
   - Site settings (business hours, contact info, tax rates)
   - Feature flags
   - Email templates

**Deliverables**:
- `/prisma/schema.prisma` - Complete schema
- `/prisma/migrations/` - Initial migration
- `/prisma/seed.ts` - Seed data for development
- `/lib/db/client.ts` - Singleton Prisma client
- `DATABASE_SETUP.md` - Setup instructions

**Database Requirements**:
- PostgreSQL 14+
- pgvector extension for embeddings
- Row-level security for multi-tenancy support (future)
- Proper indexes on all foreign keys and search fields
- Timestamps (createdAt, updatedAt) on all models

---

### Sub-Agent 2: Security & Authentication System
**Priority**: CRITICAL (prevents abuse)
**Estimated Tokens**: 6K

**Task**: Implement comprehensive security layer with authentication, authorization, rate limiting, and input validation.

**Requirements**:

1. **Authentication**:
   - NextAuth.js v5 setup with credentials + magic link
   - Google OAuth (optional)
   - Session management with JWT
   - Refresh token rotation
   - Password hashing with bcrypt (12 rounds)

2. **Authorization**:
   - Role-based access control (admin, customer, guest)
   - Middleware for protected routes
   - API route protection
   - Admin-only actions (product management, order management)

3. **Rate Limiting**:
   - `/lib/rate-limit.ts` - Token bucket implementation
   - Different limits per endpoint:
     - AI chat: 10 requests/minute
     - AI recommendations: 5 requests/minute
     - Auth endpoints: 5 requests/5 minutes (brute force protection)
     - Product search: 20 requests/minute
     - Checkout: 3 requests/minute
   - Redis-backed (Upstash Redis for Vercel)

4. **Input Validation**:
   - `/lib/validation/` - Comprehensive Zod schemas
   - XSS prevention with DOMPurify
   - SQL injection prevention (Prisma handles this, but validate inputs)
   - CSRF protection (NextAuth handles this)
   - File upload validation (size, type, virus scanning)

5. **Security Headers**:
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer-Policy
   - Permissions-Policy

6. **API Key Management**:
   - Validate all environment variables at startup
   - Rotate API keys regularly (document process)
   - Never log sensitive data

**Deliverables**:
- `/auth.ts` - NextAuth configuration
- `/middleware.ts` - Enhanced security middleware
- `/lib/rate-limit.ts` - Rate limiting implementation
- `/lib/validation/` - All validation schemas
- `/lib/security/` - Security utilities (sanitization, encryption)
- `SECURITY_GUIDE.md` - Security best practices and setup

---

### Sub-Agent 3: E-Commerce Core (Products, Cart, Checkout)
**Priority**: HIGH (core business functionality)
**Estimated Tokens**: 8K

**Task**: Build complete e-commerce system with product catalog, shopping cart, and Stripe checkout.

**Requirements**:

1. **Product Catalog**:
   - `/app/(shop)/products/page.tsx` - Product listing with filters
   - `/app/(shop)/products/[slug]/page.tsx` - Product detail page
   - `/app/(shop)/categories/[slug]/page.tsx` - Category pages
   - `/lib/db/repositories/product-repository.ts` - Product queries
   - Server-side filtering, sorting, pagination
   - Image optimization with Next.js Image
   - Product variants (size, color, finish)
   - Inventory tracking (prevent overselling)

2. **Shopping Cart**:
   - `/lib/cart/` - Cart state management (server-side with database)
   - `/app/api/cart/` - Cart API routes (add, remove, update quantity)
   - Cart persistence (authenticated users: database, guests: cookies)
   - Cart totals calculation (subtotal, tax, shipping)
   - Cart item limits (max quantity per item, max items total)
   - Cart expiration (30 days for guests)

3. **Checkout**:
   - `/app/(shop)/checkout/page.tsx` - Multi-step checkout flow
   - `/app/api/checkout/create-intent/route.ts` - Stripe Payment Intent
   - `/app/api/checkout/webhook/route.ts` - Stripe webhook handler
   - Stripe Elements integration (card, payment request button)
   - Address validation (Canada Post API or similar)
   - Order confirmation email
   - Order tracking page
   - Guest checkout support

4. **Order Management**:
   - `/app/(admin)/orders/page.tsx` - Admin order list
   - `/app/(admin)/orders/[id]/page.tsx` - Order detail with actions
   - Order status workflow (pending → processing → shipped → delivered)
   - Order fulfillment (print packing slips, shipping labels)
   - Refund processing (full/partial via Stripe)
   - Order search and filtering

**Deliverables**:
- All product and cart pages
- Complete checkout flow with Stripe
- Order management system
- `/lib/stripe/` - Stripe utilities
- `ECOMMERCE_SETUP.md` - Setup guide

---

### Sub-Agent 4: Booking System with Calendar
**Priority**: HIGH (unique business requirement)
**Estimated Tokens**: 7K

**Task**: Build comprehensive booking system for consultations, measurements, and installations with conflict prevention.

**Requirements**:

1. **Calendar UI**:
   - `/app/(shop)/book/page.tsx` - Booking calendar interface
   - `/components/booking/Calendar.tsx` - Enhanced calendar component
   - Service type selector (consultation, measurement, installation)
   - Date picker with availability indicators
   - Time slot selection (30-minute increments)
   - Location selector (Ottawa, Kanata, Barrhaven, Nepean, Orleans)

2. **Availability Logic**:
   - `/lib/booking/availability.ts` - Availability calculator
   - Business hours enforcement (9 AM - 5 PM EST)
   - Buffer time between appointments (15 minutes)
   - Travel time between locations (configurable per city)
   - Service duration enforcement:
     - Consultation: 60 minutes
     - Measurement: 120 minutes
     - Installation: 240 minutes
   - Block dates (holidays, maintenance days)
   - Blackout periods (admin-configurable)

3. **Booking Management**:
   - `/app/api/bookings/` - Booking CRUD operations
   - Database transactions with row-level locking (prevent race conditions)
   - Booking ID generation (secure, collision-free)
   - Customer information collection (name, email, phone, project details)
   - Booking confirmation email with calendar invite (.ics file)
   - Reminder emails (24 hours before, 2 hours before)

4. **Admin Interface**:
   - `/app/(admin)/bookings/page.tsx` - Admin booking calendar
   - `/app/(admin)/bookings/[id]/page.tsx` - Booking detail with notes
   - Booking status management (confirmed, cancelled, completed, no-show)
   - Manual booking creation (walk-ins, phone bookings)
   - Reschedule and cancellation handling
   - Customer communication log

5. **AI Integration**:
   - Fix existing booking tools to use real database
   - Add transaction support to prevent double-bookings
   - Improve error handling and validation

**Deliverables**:
- Complete booking system with calendar UI
- Admin booking management
- Email notification system
- `/lib/booking/` - Booking utilities
- `BOOKING_SYSTEM.md` - User and admin guide

---

### Sub-Agent 5: Admin Dashboard
**Priority**: MEDIUM (needed for operations)
**Estimated Tokens**: 6K

**Task**: Build comprehensive admin dashboard for managing products, orders, bookings, and content.

**Requirements**:

1. **Dashboard Layout**:
   - `/app/(admin)/layout.tsx` - Admin layout with sidebar navigation
   - `/app/(admin)/dashboard/page.tsx` - Overview with key metrics
   - Metrics: Sales, Orders, Bookings, Revenue (daily, weekly, monthly)
   - Charts: Revenue trends, top products, conversion funnel
   - Quick actions: Add product, create booking, view pending orders

2. **Product Management**:
   - `/app/(admin)/products/page.tsx` - Product list with search/filter
   - `/app/(admin)/products/new/page.tsx` - Create product form
   - `/app/(admin)/products/[id]/edit/page.tsx` - Edit product
   - Image upload with preview (multiple images per product)
   - Variant management (add/edit/delete variants)
   - Inventory tracking
   - Bulk actions (delete, update pricing, change status)
   - Product import/export (CSV)

3. **Order Management**:
   - Already covered in Sub-Agent 3
   - Add refund interface
   - Add order notes/internal comments

4. **Booking Management**:
   - Already covered in Sub-Agent 4
   - Add technician assignment
   - Add service completion checklist

5. **Content Management**:
   - `/app/(admin)/pages/page.tsx` - Manage CMS pages
   - `/app/(admin)/blog/page.tsx` - Blog post management
   - `/app/(admin)/testimonials/page.tsx` - Review management
   - WYSIWYG editor (Tiptap or similar)

6. **Settings**:
   - `/app/(admin)/settings/page.tsx` - Site configuration
   - Business hours configuration
   - Tax rates (provincial)
   - Shipping zones and rates
   - Email template editor
   - Feature flag management

**Deliverables**:
- Complete admin dashboard
- Product management interface
- Content management system
- `/components/admin/` - Reusable admin components
- `ADMIN_GUIDE.md` - Admin user manual

---

### Sub-Agent 6: Email & Notification System
**Priority**: MEDIUM (customer experience)
**Estimated Tokens**: 5K

**Task**: Implement comprehensive email notification system with beautiful templates.

**Requirements**:

1. **Email Infrastructure**:
   - Use Resend (already in env-validation.ts)
   - `/lib/email/client.ts` - Email client wrapper
   - Error handling and retry logic
   - Queue support for bulk emails (Vercel Queue or similar)

2. **Email Templates** (React Email):
   - `/emails/` - All email templates
   - Order confirmation (with order summary, tracking link)
   - Order shipped (with tracking number)
   - Order delivered
   - Booking confirmation (with .ics calendar invite)
   - Booking reminder (24 hours before)
   - Booking reminder (2 hours before)
   - Password reset (magic link)
   - Welcome email (new customer)
   - Newsletter template
   - Invoice template

3. **Template Requirements**:
   - Mobile-responsive
   - Apple Mail compatible
   - Dark mode support
   - Brand styling (navy, sky blue, black)
   - Company logo and contact info
   - Unsubscribe link (required by law)

4. **Notification System**:
   - `/lib/notifications/` - Notification service
   - Email preferences (customer can opt-out of marketing)
   - Admin notifications (new order, new booking, low inventory)
   - SMS notifications (optional - Twilio integration)

5. **Testing**:
   - Email preview in development
   - Test mode (send to admin email only)
   - Email deliverability testing

**Deliverables**:
- Complete email system with templates
- Email testing utilities
- `/lib/email/` - Email service
- `EMAIL_SETUP.md` - Configuration guide

---

### Sub-Agent 7: AI System Hardening & Optimization
**Priority**: HIGH (already deployed, needs fixes)
**Estimated Tokens**: 7K

**Task**: Fix all 20 critical issues from audit report and optimize AI system for production.

**Requirements**:

1. **Security Fixes**:
   - Implement rate limiting on all AI endpoints
   - Add input sanitization (XSS, injection prevention)
   - Fix prompt injection vulnerabilities
   - Add API key validation at startup
   - Add Content-Type validation
   - Implement CORS configuration

2. **Data Integrity Fixes**:
   - Fix price format inconsistency (standardize to cents everywhere)
   - Add comprehensive input validation (Zod schemas)
   - Fix division by zero risks
   - Add error handling to all AI operations
   - Implement retry logic with exponential backoff

3. **Type Safety Fixes**:
   - Fix tool execute function signatures (TypeScript compilation)
   - Define explicit Product interface
   - Standardize category enums (single source of truth)
   - Add type guards for runtime validation
   - Remove all `any` types

4. **Database Integration**:
   - Replace all mock data with real database queries
   - Implement proper transaction support in booking tools
   - Use UUID for booking IDs (not timestamps)
   - Add proper indexes for performance

5. **Performance Optimization**:
   - Implement embedding cache with pgvector
     - Pre-compute embeddings on product create/update
     - Store in database as vector column
     - Use vector similarity search (100x faster)
   - Add response caching (Next.js unstable_cache)
   - Optimize tool execution (parallel where possible)
   - Add request timeouts

6. **Monitoring & Logging**:
   - Replace console.log with structured logging (Pino)
   - Add OpenTelemetry instrumentation
   - Track AI token usage for cost monitoring
   - Add error tracking (Sentry or similar)
   - Log all AI tool executions with context

**Deliverables**:
- All 20 critical issues fixed
- AI system fully integrated with database
- Performance optimizations implemented
- Monitoring and logging in place
- `AI_SYSTEM_PRODUCTION_READY.md` - Production readiness checklist

---

### Sub-Agent 8: Frontend Polish & Performance
**Priority**: MEDIUM (user experience)
**Estimated Tokens**: 7K

**Task**: Polish frontend with Apple-inspired design, optimize performance, and ensure mobile responsiveness.

**Requirements**:

1. **Design System Refinement**:
   - `/lib/design-tokens.ts` - Complete design token system (already exists, enhance)
   - Consistent spacing, typography, colors across all pages
   - Animation system (framer-motion)
   - Dark mode support (optional)
   - Accessible components (WCAG 2.1 AA)

2. **Component Library**:
   - `/components/ui/` - Reusable UI components (shadcn/ui compatible)
   - Button variants (primary, secondary, outline, ghost)
   - Form components (input, select, textarea, checkbox, radio)
   - Modal/Dialog system
   - Toast notifications
   - Loading states (skeletons, spinners)
   - Error boundaries

3. **Homepage** (`/app/page.tsx`):
   - Hero section (full-width image/video, CTA)
   - Featured products carousel
   - Service areas map
   - Testimonials section
   - Instagram feed (optional)
   - Newsletter signup
   - Trust badges (BBB, Google reviews)

4. **Product Pages**:
   - Image gallery with zoom
   - Product details (description, specs, dimensions)
   - Variant selector (size, color, finish)
   - Add to cart with quantity selector
   - Related products
   - Reviews/testimonials
   - Breadcrumb navigation

5. **Performance Optimization**:
   - Image optimization (Next.js Image, WebP format)
   - Code splitting (dynamic imports for heavy components)
   - Font optimization (next/font)
   - Prefetching (next/link)
   - Service Worker for offline support (optional)
   - Lazy loading for below-the-fold content

6. **Mobile Optimization**:
   - Touch-friendly UI (44px minimum touch target)
   - Swipe gestures for galleries
   - Bottom navigation for key actions
   - Prevent iOS zoom on input focus (font-size: 16px)
   - Fast tap response (remove 300ms delay)

7. **SEO**:
   - All pages have proper metadata
   - OpenGraph tags for social sharing
   - Structured data (JSON-LD schema)
   - Sitemap generation
   - Robots.txt
   - Canonical URLs

**Deliverables**:
- Polished, production-ready frontend
- Complete component library
- Performance optimization (Lighthouse 95+)
- Mobile-responsive design
- SEO optimization
- `DESIGN_SYSTEM.md` - Design guidelines

---

## 📊 EXECUTION STRATEGY

### Phase 1: Foundation (Sub-Agents 1, 2) - Week 1
**Run in parallel, total estimated time: 8 hours**

1. Launch Sub-Agent 1 (Database Architecture)
2. Launch Sub-Agent 2 (Security & Authentication)
3. Wait for completion, verify deliverables
4. Run database migration and seed data
5. Test authentication flow

**Validation Checklist**:
- [ ] Database schema complete with all models
- [ ] Prisma migration successful
- [ ] Seed data loaded
- [ ] Authentication working (signup, login, logout)
- [ ] Rate limiting functional
- [ ] Security headers verified

---

### Phase 2: Core Features (Sub-Agents 3, 4, 7) - Week 2
**Run in parallel, total estimated time: 12 hours**

1. Launch Sub-Agent 3 (E-Commerce Core)
2. Launch Sub-Agent 4 (Booking System)
3. Launch Sub-Agent 7 (AI System Hardening)
4. Wait for completion
5. Integration testing

**Validation Checklist**:
- [ ] Product catalog functional with real data
- [ ] Shopping cart works (add, remove, update)
- [ ] Stripe checkout completes successfully
- [ ] Booking system prevents double-bookings
- [ ] Calendar UI shows correct availability
- [ ] AI tools use real database (no mock data)
- [ ] All 20 critical issues fixed

---

### Phase 3: Operations & Polish (Sub-Agents 5, 6, 8) - Week 3
**Run in parallel, total estimated time: 10 hours**

1. Launch Sub-Agent 5 (Admin Dashboard)
2. Launch Sub-Agent 6 (Email System)
3. Launch Sub-Agent 8 (Frontend Polish)
4. Wait for completion
5. End-to-end testing

**Validation Checklist**:
- [ ] Admin can manage products
- [ ] Admin can manage orders
- [ ] Admin can manage bookings
- [ ] Email notifications working
- [ ] Frontend polished and responsive
- [ ] Performance targets met (Lighthouse 95+)

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All TypeScript compilation errors resolved
- [ ] All tests passing (unit, integration, e2e)
- [ ] Environment variables configured in Vercel
- [ ] Database migration successful on production
- [ ] Stripe webhook configured
- [ ] Resend email configured
- [ ] Redis (Upstash) configured
- [ ] Error tracking configured (Sentry)

### Post-Deployment Verification
- [ ] Homepage loads correctly
- [ ] Product pages load with real data
- [ ] Cart functionality works
- [ ] Checkout completes successfully (test mode)
- [ ] Booking system works
- [ ] AI chat responds correctly
- [ ] Admin dashboard accessible
- [ ] Email notifications sent
- [ ] Performance targets met (run Lighthouse)
- [ ] Security headers verified (securityheaders.com)
- [ ] No console errors in browser

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking alerts configured
- [ ] Uptime monitoring (UptimeRobot or similar)
- [ ] Cost monitoring (Stripe, OpenAI, Vercel)
- [ ] Database backups configured

---

## 📝 ENVIRONMENT VARIABLES REQUIRED

Add to Vercel environment variables:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations

# Authentication
NEXTAUTH_SECRET="..." # Generate: openssl rand -base64 32
NEXTAUTH_URL="https://pgclosets.com"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="PG Closets <noreply@pgclosets.com>"

# OpenAI (already configured)
OPENAI_API_KEY="sk-..."

# Redis (Upstash)
REDIS_URL="redis://..."
REDIS_TOKEN="..."

# Optional
SENTRY_DSN="https://..."
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

---

## 🎯 SUCCESS METRICS

### Technical Metrics
- TypeScript: 0 compilation errors
- Test Coverage: 85%+
- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse SEO: 95+
- Core Web Vitals: All "Good"

### Business Metrics
- Page Load Time: < 2s
- Add to Cart Success Rate: 95%+
- Checkout Completion Rate: 70%+
- Booking Completion Rate: 80%+
- AI Chat Response Time: < 3s
- Email Delivery Rate: 99%+

### Security Metrics
- 0 XSS vulnerabilities
- 0 SQL injection points
- All inputs validated
- Rate limiting on all endpoints
- HTTPS enforced
- Security headers: A+ rating

---

## 📚 DOCUMENTATION TO GENERATE

Each sub-agent should produce:
1. Code implementation (all files)
2. Setup/configuration guide (.md file)
3. API documentation (for API routes)
4. Testing guide
5. Troubleshooting section

Final documentation bundle:
- `README.md` - Project overview
- `SETUP.md` - Complete setup guide
- `API_REFERENCE.md` - All API endpoints
- `ADMIN_GUIDE.md` - Admin manual
- `USER_GUIDE.md` - Customer user guide
- `DEVELOPER_GUIDE.md` - For future developers
- `DEPLOYMENT_GUIDE.md` - Deployment checklist
- `TROUBLESHOOTING.md` - Common issues

---

## 🔧 TECHNOLOGY STACK (Already Decided)

**Frontend**:
- Next.js 15.5.5
- React 19
- TypeScript 5.9.3
- Tailwind CSS
- Framer Motion (animations)
- shadcn/ui (components)

**Backend**:
- Next.js API Routes
- Prisma ORM
- PostgreSQL 14+ with pgvector
- Redis (Upstash)

**Services**:
- Vercel (hosting)
- Stripe (payments)
- Resend (email)
- OpenAI (AI features)
- Sentry (error tracking, optional)

**AI**:
- AI SDK 5.0.75
- OpenAI GPT-4 Turbo (chat)
- OpenAI GPT-4o-mini (search, lightweight tasks)
- text-embedding-3-small (embeddings)

---

## ⚠️ IMPORTANT NOTES FOR SUB-AGENTS

1. **Use Existing Code**: Don't recreate what exists. The AI SDK 5 implementation is already deployed. Fix and enhance it.

2. **Follow Existing Patterns**: Check current file structure and naming conventions before creating new files.

3. **Type Safety First**: All code must compile with TypeScript strict mode. No `any` types.

4. **Security First**: Never trust user input. Validate, sanitize, and escape everything.

5. **Mobile First**: Design for mobile, enhance for desktop.

6. **Performance First**: Lazy load, code split, optimize images, cache aggressively.

7. **Error Handling**: Every function should have comprehensive error handling. No silent failures.

8. **Testing**: Write tests as you code, not after. Aim for 85% coverage.

9. **Documentation**: Document as you code. Future you will thank you.

10. **Commit Often**: Small, focused commits with clear messages.

---

## 🎬 LAUNCH COMMAND FOR AI

Execute this prompt with the following command structure:

```typescript
// Launch 8 parallel sub-agents
const tasks = [
  { subagent: 'fullstack-developer', task: 'Sub-Agent 1: Database Architecture' },
  { subagent: 'fullstack-developer', task: 'Sub-Agent 2: Security & Authentication' },
  { subagent: 'fullstack-developer', task: 'Sub-Agent 3: E-Commerce Core' },
  { subagent: 'fullstack-developer', task: 'Sub-Agent 4: Booking System' },
  { subagent: 'fullstack-developer', task: 'Sub-Agent 5: Admin Dashboard' },
  { subagent: 'fullstack-developer', task: 'Sub-Agent 6: Email & Notifications' },
  { subagent: 'llm-application-dev:ai-engineer', task: 'Sub-Agent 7: AI System Hardening' },
  { subagent: 'frontend-developer', task: 'Sub-Agent 8: Frontend Polish' },
];

// Execute in phases to avoid token limit
// Phase 1: Agents 1, 2
// Phase 2: Agents 3, 4, 7
// Phase 3: Agents 5, 6, 8
```

---

**END OF PROMPT**

This prompt provides complete context, requirements, and deliverables for a full website rebuild. Each sub-agent has clear objectives, technical requirements, and success criteria. The phased approach ensures foundation is solid before building features.
