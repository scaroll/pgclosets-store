# System Architecture Overview

> **High-level architecture of the PG Closets e-commerce platform**

## 📋 Table of Contents

- [Architecture Principles](#architecture-principles)
- [System Context](#system-context)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Data Architecture](#data-architecture)
- [Infrastructure Architecture](#infrastructure-architecture)
- [Security Architecture](#security-architecture)
- [Performance Architecture](#performance-architecture)

## 🎯 Architecture Principles

### Core Principles

1. **Performance First**
   - Fast page loads (<2s)
   - Optimized images and assets
   - Efficient data fetching
   - Edge caching where possible

2. **User Experience**
   - Responsive design
   - Accessibility (WCAG 2.1 AA)
   - Progressive enhancement
   - Smooth interactions

3. **Maintainability**
   - Clean code architecture
   - Comprehensive documentation
   - Automated testing
   - Type safety with TypeScript

4. **Scalability**
   - Stateless application design
   - Horizontal scaling capability
   - Database optimization
   - CDN for static assets

5. **Security**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - HTTPS everywhere

## 🌍 System Context

### System Boundary

```
┌─────────────────────────────────────────────────────────┐
│                    External Systems                      │
├─────────────────────────────────────────────────────────┤
│  Stripe    │  Resend   │  Supabase  │  Vercel  │  GA4  │
└─────────────┴───────────┴────────────┴──────────┴───────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   PG Closets Platform                    │
├─────────────────────────────────────────────────────────┤
│  Next.js Frontend  │  API Routes  │  Database  │  Auth  │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                         Users                            │
├─────────────────────────────────────────────────────────┤
│  Customers  │  Content Editors  │  Administrators       │
└─────────────┴──────────────────┴───────────────────────┘
```

### Key Actors

1. **End Users (Customers)**
   - Browse products
   - Request quotes
   - View product details
   - Contact sales

2. **Content Editors**
   - Manage blog posts
   - Update product content
   - Manage SEO metadata

3. **Administrators**
   - Monitor analytics
   - Process quotes
   - Manage inventory data

## 🛠️ Technology Stack

### Frontend Layer

```typescript
{
  framework: "Next.js 15.x (App Router)",
  library: "React 18",
  language: "TypeScript 5.x",
  styling: "Tailwind CSS + shadcn/ui",
  stateManagement: "Zustand + React Context",
  forms: "React Hook Form + Zod validation",
  animations: "Framer Motion"
}
```

### Backend Layer

```typescript
{
  runtime: "Node.js 20.x",
  framework: "Next.js API Routes",
  orm: "Prisma",
  database: "PostgreSQL (Vercel Postgres)",
  authentication: "Supabase Auth",
  fileStorage: "Supabase Storage + Vercel Blob"
}
```

### Infrastructure Layer

```typescript
{
  hosting: "Vercel (Edge Network)",
  cicd: "GitHub Actions",
  monitoring: "Vercel Analytics + PostHog",
  cdn: "Vercel Edge Network",
  ssl: "Automatic (Vercel)",
  domain: "Vercel DNS"
}
```

### Third-Party Services

```typescript
{
  payments: "Stripe",
  email: "Resend",
  analytics: "Google Analytics 4 + PostHog",
  seo: "Vercel Speed Insights",
  errorTracking: "Vercel Runtime Logs"
}
```

## 🏗️ Application Architecture

### Layer Architecture

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)              │
│  - React Components                          │
│  - Pages (Next.js App Router)                │
│  - Client-side state management              │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Application Layer (Logic)            │
│  - Business logic                            │
│  - Custom hooks                              │
│  - API route handlers                        │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Data Layer (Persistence)             │
│  - Prisma ORM                                │
│  - Database models                           │
│  - Data access layer                         │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Infrastructure Layer                 │
│  - PostgreSQL database                       │
│  - File storage                              │
│  - External services                         │
└─────────────────────────────────────────────┘
```

### Component Architecture

```
app/
├── (routes)/               # Next.js routes
│   ├── page.tsx           # Homepage
│   ├── products/          # Product pages
│   ├── quote/             # Quote request
│   └── [dynamic]/         # Dynamic routes
├── api/                   # API routes
│   ├── products/          # Product API
│   ├── quotes/            # Quote API
│   └── contact/           # Contact API
├── layout.tsx             # Root layout
└── globals.css            # Global styles

components/
├── ui/                    # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── dialog.tsx
├── features/              # Feature-specific components
│   ├── product-card/
│   ├── quote-form/
│   └── hero-section/
└── layout/                # Layout components
    ├── header.tsx
    ├── footer.tsx
    └── navigation.tsx

lib/
├── utils/                 # Utility functions
│   ├── format.ts
│   ├── validation.ts
│   └── cn.ts
├── hooks/                 # Custom React hooks
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useQuote.ts
├── api/                   # API clients
│   ├── products.ts
│   ├── quotes.ts
│   └── client.ts
└── db/                    # Database utilities
    ├── prisma.ts
    └── queries.ts
```

### Data Flow

```
User Action (UI)
      │
      ▼
Component Event Handler
      │
      ▼
Custom Hook / State Management
      │
      ▼
API Route (Server)
      │
      ▼
Business Logic Layer
      │
      ▼
Data Access Layer (Prisma)
      │
      ▼
Database (PostgreSQL)
      │
      ▼
Response back up the chain
```

## 💾 Data Architecture

### Database Schema Overview

```
┌─────────────┐
│   Products  │───┐
└─────────────┘   │
                  │ 1:N
                  │
┌─────────────┐   │      ┌─────────────┐
│  Categories │───┘──────│ ProductTags │
└─────────────┘          └─────────────┘

┌─────────────┐
│   Quotes    │
└─────────────┘
      │
      │ 1:N
      │
┌─────────────┐
│ QuoteItems  │
└─────────────┘

┌─────────────┐
│   Users     │
└─────────────┘
      │
      │ 1:N
      │
┌─────────────┐
│  Sessions   │
└─────────────┘
```

### Key Data Models

**Products**
- Core product information
- Images and media
- Pricing data
- Category relationships
- SEO metadata

**Quotes**
- Customer information
- Requested products
- Project details
- Status tracking
- Communication history

**Users**
- Authentication data
- Profile information
- Preferences
- Activity history

### Data Access Patterns

1. **Read-Heavy Operations**
   - Product catalog browsing
   - Search and filtering
   - Category navigation
   - Cached with edge network

2. **Write Operations**
   - Quote submissions
   - Contact forms
   - User profile updates
   - Admin content updates

3. **Caching Strategy**
   - Static product data: Edge cache
   - Dynamic user data: No cache
   - Search results: Short TTL
   - Images: CDN + long TTL

## ☁️ Infrastructure Architecture

### Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Vercel Edge Network             │
│  - Global CDN                                │
│  - Edge functions                            │
│  - Static asset serving                      │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│          Next.js Application                 │
│  - Server-side rendering                     │
│  - API routes                                │
│  - Client-side React app                     │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│            Data & Services                   │
│  - Vercel Postgres (Database)                │
│  - Supabase (Auth & Storage)                 │
│  - Stripe (Payments)                         │
└─────────────────────────────────────────────┘
```

### Scaling Strategy

**Horizontal Scaling**
- Vercel automatically scales based on traffic
- Serverless functions scale per request
- Edge network handles global distribution

**Vertical Scaling**
- Database connection pooling
- Optimized queries
- Efficient data structures

**Caching Layers**
1. **Edge Cache**: Static pages and assets
2. **Browser Cache**: Images and scripts
3. **API Cache**: Short-lived response caching
4. **Database Cache**: Query result caching

## 🔒 Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────┐
│         Network Security (HTTPS)             │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│      Application Security (WAF)              │
│  - Rate limiting                             │
│  - DDoS protection                           │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│      Authentication & Authorization          │
│  - Supabase Auth                             │
│  - JWT tokens                                │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Data Security                        │
│  - Input validation (Zod)                    │
│  - SQL injection prevention (Prisma)         │
│  - XSS protection (React)                    │
└─────────────────────────────────────────────┘
```

### Security Measures

1. **Input Validation**
   - Zod schema validation
   - Sanitization of user input
   - Type checking with TypeScript

2. **Authentication**
   - Supabase Auth integration
   - Secure session management
   - Password hashing

3. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - Admin-only routes protected

4. **Data Protection**
   - HTTPS only
   - Encrypted database connections
   - Secure environment variables

## ⚡ Performance Architecture

### Performance Optimization Layers

```
┌─────────────────────────────────────────────┐
│         Edge Layer (CDN)                     │
│  - Static asset caching                      │
│  - Edge function execution                   │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Application Layer                    │
│  - Code splitting                            │
│  - Lazy loading                              │
│  - React optimization                        │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Data Layer                           │
│  - Database query optimization               │
│  - Connection pooling                        │
│  - Efficient data structures                 │
└─────────────────────────────────────────────┘
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | <1.8s | 1.2s |
| Largest Contentful Paint | <2.5s | 2.1s |
| Time to Interactive | <3.8s | 2.9s |
| Cumulative Layout Shift | <0.1 | 0.05 |
| First Input Delay | <100ms | 45ms |

### Optimization Techniques

1. **Image Optimization**
   - Next.js Image component
   - WebP format with AVIF fallback
   - Lazy loading below fold
   - Responsive images

2. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Dynamic imports

3. **Caching**
   - Static generation where possible
   - Incremental Static Regeneration
   - Edge caching for assets

4. **Database**
   - Indexed queries
   - Connection pooling
   - Efficient relations fetching

## 🔄 System Patterns

### Design Patterns Used

1. **Repository Pattern** - Data access abstraction
2. **Factory Pattern** - Component creation
3. **Observer Pattern** - State management (Zustand)
4. **Strategy Pattern** - Payment processing
5. **Singleton Pattern** - Database connections

### Architecture Patterns

1. **Micro-frontends** - Feature-based component organization
2. **API Gateway** - Centralized API routing
3. **CQRS** - Separate read/write operations
4. **Event-Driven** - Analytics and tracking

## 📊 Monitoring & Observability

### Monitoring Stack

```typescript
{
  performance: "Vercel Analytics + Web Vitals",
  analytics: "Google Analytics 4 + PostHog",
  logging: "Vercel Runtime Logs",
  errors: "Vercel Error Tracking",
  uptime: "Vercel Deployment Status"
}
```

### Key Metrics

1. **Performance Metrics**
   - Core Web Vitals
   - Page load times
   - API response times

2. **Business Metrics**
   - Quote submissions
   - Product views
   - Conversion rates
   - Bounce rates

3. **Technical Metrics**
   - Error rates
   - API success rates
   - Database query performance
   - Cache hit rates

## 🚀 Deployment Architecture

### CI/CD Pipeline

```
Code Push (GitHub)
      │
      ▼
GitHub Actions Triggered
      │
      ├─── Lint & Type Check
      ├─── Run Tests
      ├─── Build Application
      └─── Security Scan
      │
      ▼
Deploy to Vercel (Preview)
      │
      ▼
Manual Approval (for Production)
      │
      ▼
Deploy to Production (Vercel)
      │
      ▼
Post-deployment Checks
```

### Environment Strategy

1. **Development** - Local development environment
2. **Preview** - Automatic preview deployments for PRs
3. **Staging** - Testing environment (optional)
4. **Production** - Live production environment

## 📚 Related Documentation

- [Data Flow Diagram](./DATA_FLOW.md)
- [Tech Stack Details](./TECH_STACK.md)
- [Design Patterns](./DESIGN_PATTERNS.md)
- [Security Architecture](../developer-guides/SECURITY_GUIDE.md)
- [Performance Guide](../developer-guides/PERFORMANCE_GUIDE.md)

## 🔄 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 2025 | Architecture Team | Initial architecture documentation |

---

For questions or clarifications, please contact the architecture team or refer to [Architecture Decision Records](./DECISION_RECORDS.md).
