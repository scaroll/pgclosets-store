# PG Closets Website Completion Plan
## 20-Person Development Team Strategy - Quote System Focus

---

## Executive Summary

PG Closets is a custom closet door company requiring a **quote-based sales system** rather than traditional e-commerce checkout. Customers configure custom products, request quotes, and work with sales representatives before purchasing. This plan outlines how a 20-person team will complete the quote-centric platform.

---

## Business Model: Quote-Based Sales

### Customer Journey
```
1. DISCOVER → Browse products, use instant estimate calculator
2. CONFIGURE → Build custom door configurations with options
3. REQUEST QUOTE → Submit quote request with contact info
4. CONSULTATION → Sales rep reviews, schedules measurement
5. FORMAL QUOTE → Detailed quote with installation pricing
6. APPROVAL → Customer approves quote
7. DEPOSIT → Payment to confirm order
8. INSTALLATION → Schedule and complete installation
9. FINAL PAYMENT → Balance due on completion
```

### Why Quote-Based (Not E-Commerce Checkout)
- Custom door configurations require professional measurement
- Installation pricing varies by location and complexity
- High-value transactions benefit from personal consultation
- Site conditions affect final specifications
- Professional relationships drive repeat business

---

## Current State Assessment

### Existing Quote Infrastructure ✅
- **Instant Estimate Calculator** - 6-step door configurator with pricing
- **Quote API** (`/api/quotes/quick`) - Quote request submission with Slack notification
- **Lead API** (`/api/lead`) - Lead capture with door selection data
- **useQuote Hook** - Zustand store for quote item management
- **Book Measure Page** - Consultation booking system
- **Product Catalog** - 69+ products with variants and pricing

### What Needs Completion 🔨
- Full quote builder experience
- Quote management dashboard (customer & admin)
- Quote lifecycle workflow
- CRM integration
- Installation scheduling system
- Deposit & payment processing
- Communication tools (email/SMS)
- Quote PDF generation
- Multi-quote comparison
- Follow-up automation

---

## Team Structure (20 People)

### Leadership (2 people)
| Role | Responsibilities |
|------|------------------|
| **Tech Lead** | Architecture, code reviews, technical decisions |
| **Product Manager** | Feature prioritization, stakeholder communication |

### Quote System Team (6 people)
| Role | Count | Focus Areas |
|------|-------|-------------|
| **Senior Full-Stack** | 2 | Quote builder, configurator, pricing engine |
| **Full-Stack Dev** | 2 | Quote submission, customer portal |
| **Frontend Dev** | 2 | Configuration UI, interactive forms |

### Admin & CRM Team (5 people)
| Role | Count | Focus Areas |
|------|-------|-------------|
| **Senior Backend** | 2 | Admin APIs, workflow automation, integrations |
| **Full-Stack Dev** | 2 | Admin dashboard, CRM features |
| **Backend Dev** | 1 | Reporting, analytics, data export |

### Operations Team (4 people)
| Role | Count | Focus Areas |
|------|-------|-------------|
| **Full-Stack Dev** | 2 | Scheduling, calendar, notifications |
| **Backend Dev** | 1 | Payment processing, invoicing |
| **DevOps** | 1 | Infrastructure, CI/CD, monitoring |

### Quality & Support (3 people)
| Role | Count | Focus Areas |
|------|-------|-------------|
| **QA Engineer** | 2 | Testing, automation, UAT |
| **Technical Writer** | 1 | Documentation, help content |

---

## Work Streams

### Stream 1: Quote Builder Experience
**Team:** 2 Senior Full-Stack + 2 Frontend Devs
**Duration:** Weeks 1-3

#### Enhanced Configurator
```
Current: Instant Estimate Calculator (basic)
Target: Full Quote Builder with multi-item support

Features:
├── Multi-Room Configuration
│   ├── Add multiple rooms/openings
│   ├── Name each configuration
│   └── Room-specific notes
├── Enhanced Door Configurator
│   ├── Visual door preview (2D/3D)
│   ├── Real-time price updates
│   ├── Material swatches
│   ├── Hardware previews
│   └── Dimension validation
├── Quote Summary
│   ├── Item breakdown
│   ├── Subtotal by room
│   ├── Estimated installation
│   └── Save for later
└── Quote Submission
    ├── Contact information
    ├── Property details
    ├── Preferred contact method
    ├── Availability for measurement
    └── Photo upload (existing space)
```

#### Technical Implementation
```typescript
// Enhanced Quote Item Schema
interface QuoteConfiguration {
  id: string
  roomName: string
  openingType: 'closet' | 'room-divider' | 'pantry' | 'laundry'
  doors: DoorConfiguration[]
  notes: string
  photos: string[]
}

interface DoorConfiguration {
  id: string
  productId: string
  series: string
  doorType: 'sliding' | 'bypass' | 'bifold' | 'barn' | 'pivot'
  dimensions: {
    widthInches: number
    heightInches: number
    panelCount: number
  }
  finish: string
  hardware: string
  handles: string
  softClose: boolean
  mirror: boolean
  customizations: Record<string, string>
  unitPrice: number
  quantity: number
}

interface QuoteRequest {
  id: string
  quoteNumber: string
  status: QuoteStatus
  configurations: QuoteConfiguration[]
  customer: CustomerInfo
  property: PropertyInfo
  pricing: QuotePricing
  timeline: QuoteTimeline
  assignedRep: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

type QuoteStatus =
  | 'draft'           // Customer building quote
  | 'submitted'       // Awaiting review
  | 'under_review'    // Sales rep reviewing
  | 'measurement_scheduled'
  | 'measurement_completed'
  | 'quoted'          // Formal quote sent
  | 'revision_requested'
  | 'approved'        // Customer approved
  | 'deposit_paid'    // Order confirmed
  | 'in_production'
  | 'ready_for_install'
  | 'installed'
  | 'completed'       // Final payment received
  | 'expired'
  | 'cancelled'
```

#### Pages to Build
- `/quote-builder` - Multi-step configuration wizard
- `/quote-builder/room/[id]` - Room configuration
- `/quote-builder/summary` - Quote summary & submission
- `/quote-builder/success` - Confirmation page

---

### Stream 2: Customer Quote Portal
**Team:** 2 Full-Stack Devs
**Duration:** Weeks 2-4

#### Features
```
├── My Quotes Dashboard
│   ├── Active quotes with status
│   ├── Quote history
│   ├── Quick actions (view, edit draft, resubmit)
│   └── Notifications
├── Quote Detail View
│   ├── Full configuration breakdown
│   ├── Pricing details
│   ├── Status timeline
│   ├── Communication thread
│   ├── Documents (estimates, formal quotes, contracts)
│   └── Action buttons (approve, request revision, schedule)
├── Quote Approval Flow
│   ├── Review formal quote
│   ├── Accept terms & conditions
│   ├── E-signature capture
│   └── Deposit payment
├── Appointment Management
│   ├── Schedule measurement
│   ├── View upcoming appointments
│   ├── Reschedule/cancel
│   └── Calendar sync (ICS download)
├── Communication Center
│   ├── Message thread with sales rep
│   ├── File attachments
│   ├── Response notifications
│   └── Chat history
└── Payment Center
    ├── Pay deposit
    ├── View payment schedule
    ├── Pay balance
    └── Invoice downloads
```

#### Pages to Build
- `/account/quotes` - Quote list
- `/account/quotes/[id]` - Quote detail
- `/account/quotes/[id]/approve` - Approval flow
- `/account/quotes/[id]/pay` - Payment page
- `/account/appointments` - Appointment management
- `/account/messages` - Communication center

---

### Stream 3: Admin Quote Management
**Team:** 2 Senior Backend + 2 Full-Stack Devs
**Duration:** Weeks 1-4

#### Admin Dashboard Features
```
├── Quote Pipeline
│   ├── Kanban board view (by status)
│   ├── List view with filters
│   ├── Quick status updates
│   ├── Bulk actions
│   └── Search & advanced filters
├── Quote Detail (Admin)
│   ├── Customer information
│   ├── Configuration review
│   ├── Pricing adjustments
│   ├── Margin calculator
│   ├── Internal notes
│   ├── Assign to rep
│   └── Status management
├── Quote Creation (Admin)
│   ├── Create quote for customer
│   ├── Import from phone consultation
│   └── Clone existing quote
├── Formal Quote Generation
│   ├── Add installation labor
│   ├── Apply discounts
│   ├── Set payment terms
│   ├── Set expiration date
│   ├── Generate PDF
│   └── Send to customer
├── Calendar & Scheduling
│   ├── Measurement appointments
│   ├── Installation calendar
│   ├── Tech assignment
│   ├── Route optimization
│   └── Availability management
├── Reporting
│   ├── Quote conversion rate
│   ├── Pipeline value
│   ├── Rep performance
│   ├── Average quote size
│   ├── Time to close
│   └── Revenue forecast
└── Settings
    ├── Pricing rules
    ├── Labor rates by zone
    ├── Discount limits
    ├── Quote templates
    └── Email templates
```

#### Admin Pages
- `/admin` - Dashboard overview
- `/admin/quotes` - Quote pipeline
- `/admin/quotes/[id]` - Quote management
- `/admin/quotes/[id]/formal` - Generate formal quote
- `/admin/calendar` - Scheduling calendar
- `/admin/customers` - Customer list
- `/admin/customers/[id]` - Customer profile
- `/admin/reports` - Analytics & reports
- `/admin/settings` - System settings

---

### Stream 4: Scheduling & Operations
**Team:** 2 Full-Stack + 1 Backend Dev
**Duration:** Weeks 2-4

#### Appointment System
```
├── Measurement Scheduling
│   ├── Available time slots by zone
│   ├── Tech availability
│   ├── Travel time calculation
│   ├── Customer self-scheduling
│   └── Admin override
├── Installation Scheduling
│   ├── Multi-day job support
│   ├── Crew assignment
│   ├── Material delivery coordination
│   └── Customer confirmation
├── Notifications
│   ├── Appointment reminders (email/SMS)
│   ├── Day-before confirmation
│   ├── On-my-way notification
│   ├── Completion confirmation
│   └── Follow-up survey
└── Field Operations
    ├── Mobile-friendly job view
    ├── Photo documentation
    ├── Digital sign-off
    └── Issue reporting
```

#### Database Schema Addition
```prisma
model Appointment {
  id              String            @id @default(cuid())
  quoteId         String
  quote           Quote             @relation(fields: [quoteId], references: [id])
  type            AppointmentType   // MEASUREMENT, INSTALLATION
  status          AppointmentStatus
  scheduledDate   DateTime
  scheduledTime   String            // "09:00-11:00"
  duration        Int               // minutes
  assignedTechId  String?
  assignedTech    User?             @relation(fields: [assignedTechId], references: [id])
  address         Json              // Full address object
  notes           String?
  customerNotes   String?
  completedAt     DateTime?
  completionNotes String?
  photos          String[]
  signature       String?           // Base64 or URL
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model ServiceZone {
  id              String   @id @default(cuid())
  name            String   // "Ottawa Central", "Orleans", etc.
  postalCodes     String[] // K1A, K1B, etc.
  laborRate       Decimal
  travelFee       Decimal
  minOrderValue   Decimal
  active          Boolean  @default(true)
}

model TechSchedule {
  id        String   @id @default(cuid())
  techId    String
  tech      User     @relation(fields: [techId], references: [id])
  date      DateTime
  available Boolean  @default(true)
  slots     Json     // Available time slots
  zoneIds   String[] // Zones they can serve
}
```

---

### Stream 5: Payment & Invoicing
**Team:** 1 Backend Dev + DevOps
**Duration:** Weeks 3-4

#### Payment Flow
```
Quote Approved
     ↓
Deposit Invoice Generated (typically 50%)
     ↓
Customer Pays Deposit (Stripe)
     ↓
Order Confirmed → Production
     ↓
Installation Scheduled
     ↓
Installation Complete
     ↓
Final Invoice Generated (remaining balance)
     ↓
Customer Pays Balance
     ↓
Order Complete
```

#### Features
```
├── Invoice Generation
│   ├── Deposit invoice
│   ├── Progress invoices
│   ├── Final invoice
│   ├── PDF generation
│   └── Email delivery
├── Payment Processing
│   ├── Stripe checkout
│   ├── Credit card on file
│   ├── E-transfer instructions
│   ├── Financing options (future)
│   └── Partial payments
├── Financial Tracking
│   ├── Payment status per quote
│   ├── Outstanding balances
│   ├── Revenue reports
│   └── Tax calculations (HST)
└── Refunds & Adjustments
    ├── Deposit refunds
    ├── Price adjustments
    └── Credit notes
```

#### API Endpoints
```
POST   /api/quotes/[id]/invoice        - Generate invoice
POST   /api/quotes/[id]/payment        - Process payment
GET    /api/quotes/[id]/payments       - Payment history
POST   /api/payments/webhook           - Stripe webhook
GET    /api/invoices/[id]              - Get invoice
GET    /api/invoices/[id]/pdf          - Download PDF
```

---

### Stream 6: Communication & CRM
**Team:** 1 Full-Stack Dev + 1 Backend Dev
**Duration:** Weeks 2-4

#### Features
```
├── Email Automation
│   ├── Quote received confirmation
│   ├── Quote status updates
│   ├── Formal quote delivery
│   ├── Approval confirmation
│   ├── Appointment reminders
│   ├── Installation complete
│   ├── Review request
│   └── Follow-up sequences
├── SMS Notifications
│   ├── Appointment reminders
│   ├── Tech on the way
│   ├── Payment reminders
│   └── Quick confirmations
├── Internal Messaging
│   ├── Quote-specific threads
│   ├── Customer communication log
│   ├── Internal notes
│   └── @mentions for team
├── CRM Features
│   ├── Customer profiles
│   ├── Interaction history
│   ├── Lead scoring
│   ├── Follow-up tasks
│   └── Pipeline management
└── Document Management
    ├── Quote PDFs
    ├── Contracts
    ├── Photos
    └── Warranty documents
```

#### Email Templates to Create
1. `quote-received.tsx` - Quote request confirmation
2. `quote-under-review.tsx` - Status update
3. `formal-quote.tsx` - Formal quote delivery
4. `measurement-scheduled.tsx` - Appointment confirmation
5. `measurement-reminder.tsx` - Day-before reminder
6. `quote-approved.tsx` - Approval confirmation
7. `deposit-received.tsx` - Payment confirmation
8. `installation-scheduled.tsx` - Installation confirmation
9. `installation-complete.tsx` - Completion + review request
10. `quote-expiring.tsx` - Expiration warning

---

### Stream 7: Quality & Infrastructure
**Team:** 2 QA + DevOps + Tech Writer
**Duration:** Weeks 1-4 (ongoing)

#### Testing Requirements
```
├── Unit Tests
│   ├── Pricing calculations
│   ├── Quote state management
│   ├── Validation schemas
│   └── Utility functions
├── Integration Tests
│   ├── Quote submission flow
│   ├── Payment processing
│   ├── Email sending
│   └── API endpoints
├── E2E Tests (Critical Paths)
│   ├── Quote builder → submission
│   ├── Customer approval flow
│   ├── Admin quote management
│   ├── Appointment scheduling
│   └── Payment flow
└── Performance Tests
    ├── Quote builder load time
    ├── Admin dashboard responsiveness
    └── PDF generation speed
```

#### Documentation
- Customer help center
- Admin user guide
- API documentation
- Quote process flowcharts
- Troubleshooting guides

---

## Sprint Plan (4 Weeks)

### Sprint 1 (Days 1-10): Foundation

| Team | Deliverables |
|------|--------------|
| Quote Team | Enhanced quote builder UI, multi-room support |
| Admin Team | Admin layout, quote pipeline (Kanban), quote detail view |
| Operations | Measurement scheduling API, calendar component |
| QA | Test framework, critical path tests |

**Milestone Checklist:**
- [ ] Quote builder with multi-room configurations
- [ ] Admin can view and manage incoming quotes
- [ ] Basic measurement scheduling works
- [ ] Test coverage for pricing engine

---

### Sprint 2 (Days 11-20): Core Workflows

| Team | Deliverables |
|------|--------------|
| Quote Team | Customer quote portal, quote detail view, status tracking |
| Admin Team | Formal quote generation, PDF export, pricing adjustments |
| Operations | Installation scheduling, notification system |
| CRM Team | Email templates, automated notifications |

**Milestone Checklist:**
- [ ] Customers can view their quotes and status
- [ ] Admin can generate formal quotes with PDF
- [ ] Appointment scheduling end-to-end
- [ ] Email notifications for key events

---

### Sprint 3 (Days 21-30): Payments & Polish

| Team | Deliverables |
|------|--------------|
| Quote Team | Quote approval flow, e-signature |
| Admin Team | Customer management, reporting dashboard |
| Payments | Stripe integration, deposit processing, invoices |
| Operations | Mobile field view, photo documentation |

**Milestone Checklist:**
- [ ] Customer can approve quote and pay deposit
- [ ] Admin reports show pipeline and conversion
- [ ] Payment processing tested end-to-end
- [ ] Field techs can document completions

---

### Sprint 4 (Days 31-40): Launch Prep

| Team | Deliverables |
|------|--------------|
| All Teams | Bug fixes, performance optimization |
| QA | Full regression, UAT support |
| DevOps | Production hardening, monitoring |
| Tech Writer | Help center, admin guides |

**Milestone Checklist:**
- [ ] All P0 bugs resolved
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Team trained on new system

---

## Database Schema: Complete Quote System

```prisma
// ==================== QUOTE SYSTEM ====================

model Quote {
  id                String          @id @default(cuid())
  quoteNumber       String          @unique // Q-2024-001234
  status            QuoteStatus     @default(DRAFT)

  // Customer
  customerId        String?
  customer          User?           @relation(fields: [customerId], references: [id])
  customerName      String
  customerEmail     String
  customerPhone     String

  // Property
  propertyAddress   Json            // Full address
  propertyType      String?         // House, Condo, etc.
  propertyNotes     String?

  // Configurations
  configurations    QuoteConfig[]

  // Pricing
  subtotal          Decimal
  installationFee   Decimal         @default(0)
  travelFee         Decimal         @default(0)
  discount          Decimal         @default(0)
  discountReason    String?
  taxRate           Decimal         @default(0.13)
  tax               Decimal
  total             Decimal

  // Terms
  depositPercent    Int             @default(50)
  depositAmount     Decimal?
  paymentTerms      String?
  validUntil        DateTime?

  // Assignment
  assignedRepId     String?
  assignedRep       User?           @relation("AssignedQuotes", fields: [assignedRepId], references: [id])

  // Documents
  formalQuotePdf    String?
  contractPdf       String?
  signedAt          DateTime?
  signatureData     String?

  // Relationships
  appointments      Appointment[]
  payments          Payment[]
  messages          QuoteMessage[]
  notes             QuoteNote[]
  statusHistory     QuoteStatusLog[]

  // Timestamps
  submittedAt       DateTime?
  reviewedAt        DateTime?
  quotedAt          DateTime?
  approvedAt        DateTime?
  completedAt       DateTime?
  cancelledAt       DateTime?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([status])
  @@index([customerEmail])
  @@index([assignedRepId])
}

model QuoteConfig {
  id              String    @id @default(cuid())
  quoteId         String
  quote           Quote     @relation(fields: [quoteId], references: [id], onDelete: Cascade)

  roomName        String
  openingType     String

  // Door Configuration
  productId       String?
  product         Product?  @relation(fields: [productId], references: [id])
  series          String
  doorType        String
  widthInches     Decimal
  heightInches    Decimal
  panelCount      Int
  finish          String
  hardware        String
  handles         String
  softClose       Boolean   @default(false)
  mirror          Boolean   @default(false)
  customOptions   Json?

  // Pricing
  unitPrice       Decimal
  quantity        Int       @default(1)
  lineTotal       Decimal

  // Notes & Photos
  notes           String?
  photos          String[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model QuoteStatusLog {
  id        String      @id @default(cuid())
  quoteId   String
  quote     Quote       @relation(fields: [quoteId], references: [id])
  fromStatus QuoteStatus?
  toStatus  QuoteStatus
  changedBy String?
  reason    String?
  createdAt DateTime    @default(now())
}

model QuoteMessage {
  id          String   @id @default(cuid())
  quoteId     String
  quote       Quote    @relation(fields: [quoteId], references: [id])
  senderId    String
  sender      User     @relation(fields: [senderId], references: [id])
  message     String
  attachments String[]
  isInternal  Boolean  @default(false)
  readAt      DateTime?
  createdAt   DateTime @default(now())
}

model QuoteNote {
  id        String   @id @default(cuid())
  quoteId   String
  quote     Quote    @relation(fields: [quoteId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  content   String
  createdAt DateTime @default(now())
}

model Payment {
  id              String        @id @default(cuid())
  quoteId         String
  quote           Quote         @relation(fields: [quoteId], references: [id])

  type            PaymentType   // DEPOSIT, PROGRESS, FINAL
  amount          Decimal
  method          String        // stripe, etransfer, cash
  status          PaymentStatus

  stripePaymentId String?
  invoiceNumber   String?
  invoicePdf      String?

  dueDate         DateTime?
  paidAt          DateTime?

  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

// ==================== ENUMS ====================

enum QuoteStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  MEASUREMENT_SCHEDULED
  MEASUREMENT_COMPLETED
  QUOTED
  REVISION_REQUESTED
  APPROVED
  DEPOSIT_PAID
  IN_PRODUCTION
  READY_FOR_INSTALL
  INSTALLATION_SCHEDULED
  INSTALLED
  COMPLETED
  EXPIRED
  CANCELLED
}

enum PaymentType {
  DEPOSIT
  PROGRESS
  FINAL
  REFUND
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum AppointmentType {
  MEASUREMENT
  INSTALLATION
  FOLLOW_UP
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

---

## API Endpoints: Complete List

### Quote APIs
```
# Customer-Facing
POST   /api/quotes                    - Create new quote request
GET    /api/quotes                    - List customer's quotes
GET    /api/quotes/[id]               - Get quote detail
PUT    /api/quotes/[id]               - Update draft quote
POST   /api/quotes/[id]/submit        - Submit for review
POST   /api/quotes/[id]/approve       - Approve formal quote
POST   /api/quotes/[id]/revision      - Request revision
DELETE /api/quotes/[id]               - Cancel quote

# Admin APIs
GET    /api/admin/quotes              - List all quotes (with filters)
GET    /api/admin/quotes/[id]         - Admin quote detail
PUT    /api/admin/quotes/[id]         - Update quote
PUT    /api/admin/quotes/[id]/status  - Change status
PUT    /api/admin/quotes/[id]/assign  - Assign to rep
POST   /api/admin/quotes/[id]/formal  - Generate formal quote
GET    /api/admin/quotes/[id]/pdf     - Download PDF
POST   /api/admin/quotes/clone        - Clone quote
```

### Appointment APIs
```
GET    /api/appointments/availability - Get available slots
POST   /api/appointments              - Schedule appointment
GET    /api/appointments/[id]         - Get appointment
PUT    /api/appointments/[id]         - Update appointment
DELETE /api/appointments/[id]         - Cancel appointment
POST   /api/appointments/[id]/complete - Mark complete

# Admin
GET    /api/admin/appointments        - All appointments
GET    /api/admin/calendar            - Calendar view data
PUT    /api/admin/appointments/[id]/assign - Assign tech
```

### Payment APIs
```
POST   /api/quotes/[id]/invoice       - Generate invoice
GET    /api/invoices/[id]             - Get invoice
GET    /api/invoices/[id]/pdf         - Download PDF
POST   /api/payments/create-session   - Stripe checkout session
POST   /api/payments/webhook          - Stripe webhook
GET    /api/quotes/[id]/payments      - Payment history
```

### Messaging APIs
```
GET    /api/quotes/[id]/messages      - Get thread
POST   /api/quotes/[id]/messages      - Send message
POST   /api/quotes/[id]/notes         - Add internal note (admin)
```

### Reporting APIs
```
GET    /api/admin/reports/pipeline    - Pipeline summary
GET    /api/admin/reports/conversion  - Conversion rates
GET    /api/admin/reports/revenue     - Revenue report
GET    /api/admin/reports/rep-performance - Rep metrics
```

---

## Priority Task List

### P0 - Critical (Week 1-2)

| ID | Task | Team | Hours |
|----|------|------|-------|
| P0-01 | Quote builder multi-room UI | Quote | 32 |
| P0-02 | Quote submission API | Quote | 16 |
| P0-03 | Admin quote pipeline view | Admin | 24 |
| P0-04 | Admin quote detail/edit | Admin | 24 |
| P0-05 | Customer quote portal | Quote | 24 |
| P0-06 | Measurement scheduling | Ops | 24 |
| P0-07 | Quote status notifications | CRM | 16 |
| P0-08 | Quote database schema | Backend | 8 |
| P0-09 | Pricing engine updates | Quote | 16 |
| P0-10 | Authentication for portal | Backend | 8 |

### P1 - High (Week 2-3)

| ID | Task | Team | Hours |
|----|------|------|-------|
| P1-01 | Formal quote PDF generation | Admin | 24 |
| P1-02 | Quote approval flow | Quote | 20 |
| P1-03 | Deposit payment (Stripe) | Payments | 24 |
| P1-04 | Installation scheduling | Ops | 24 |
| P1-05 | Email notification templates | CRM | 16 |
| P1-06 | Customer messaging | CRM | 20 |
| P1-07 | Admin reporting dashboard | Admin | 24 |
| P1-08 | Service zone pricing | Backend | 12 |
| P1-09 | Photo upload for quotes | Quote | 12 |
| P1-10 | Invoice generation | Payments | 16 |

### P2 - Medium (Week 3-4)

| ID | Task | Team | Hours |
|----|------|------|-------|
| P2-01 | E-signature capture | Quote | 16 |
| P2-02 | Quote comparison | Quote | 12 |
| P2-03 | SMS notifications | CRM | 16 |
| P2-04 | Mobile field app view | Ops | 24 |
| P2-05 | Advanced analytics | Admin | 24 |
| P2-06 | Customer CRM profiles | Admin | 16 |
| P2-07 | Follow-up automation | CRM | 20 |
| P2-08 | Quote templates | Admin | 12 |
| P2-09 | Discount management | Admin | 12 |
| P2-10 | Calendar integrations | Ops | 16 |

---

## Success Metrics

### Launch Criteria
- [ ] Customer can build and submit multi-room quote
- [ ] Admin can review, price, and send formal quote
- [ ] Customer can approve and pay deposit
- [ ] Measurement appointments can be scheduled
- [ ] Email notifications for all status changes
- [ ] PDF quotes generate correctly
- [ ] Payment processing works end-to-end
- [ ] Mobile-responsive on all flows

### KPIs to Track
- Quote submission rate
- Quote → Formal quote conversion
- Formal quote → Approval conversion
- Average time to formal quote
- Average quote value
- Deposit collection rate
- Customer satisfaction (post-install survey)

---

## Removed from Scope (Not Needed for Quote System)

The following e-commerce features are **removed** from this plan:
- ~~Shopping cart checkout~~
- ~~Inventory stock management~~
- ~~Shipping rate calculation~~
- ~~Direct purchase flow~~
- ~~Order fulfillment tracking~~
- ~~Product reviews on catalog~~ (keep for social proof, not purchase-linked)

These may be added later if PG Closets wants to sell accessories/hardware directly.

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Quote complexity overwhelming users | High | Progressive disclosure, save progress, clear help text |
| Admin workflow too complex | Medium | Start with minimal viable, iterate based on feedback |
| Payment integration issues | High | Thorough Stripe testing, manual fallback option |
| Email deliverability | Medium | Use Resend, monitor bounce rates, SPF/DKIM |
| Scheduling conflicts | Medium | Real-time availability checks, buffer times |

---

## Technology Stack (No Changes)

The existing stack is well-suited for a quote system:
- **Next.js 15** - Full-stack framework
- **Prisma + PostgreSQL** - Database
- **Zustand** - Quote state management
- **Stripe** - Payment processing
- **Resend** - Transactional email
- **Vercel** - Hosting & deployment

---

*Document Version: 2.0 - Quote System Focus*
*Last Updated: December 2024*
*Created for: PG Closets Development Team*
