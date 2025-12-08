# Quote System Developer Skill

Guidelines for developing the quote-based sales system for PG Closets.

## System Overview

PG Closets uses a quote-based sales flow instead of traditional e-commerce checkout:

```
Customer Request → Quote Builder → Admin Review → Measurement → Final Quote → Approval → Deposit → Production → Installation
```

## Quote Lifecycle Statuses

| Status | Description | Next Actions |
|--------|-------------|--------------|
| `DRAFT` | Customer building quote | Submit |
| `SUBMITTED` | Awaiting admin review | Review, Schedule Measurement |
| `UNDER_REVIEW` | Admin reviewing | Request Info, Schedule |
| `MEASUREMENT_SCHEDULED` | Appointment set | Complete Measurement |
| `MEASUREMENT_COMPLETED` | Measurements taken | Create Final Quote |
| `QUOTED` | Final pricing sent | Customer Review |
| `REVISION_REQUESTED` | Customer wants changes | Revise Quote |
| `APPROVED` | Customer accepted | Request Deposit |
| `DEPOSIT_PAID` | 50% paid | Start Production |
| `IN_PRODUCTION` | Being manufactured | Complete Production |
| `READY_FOR_INSTALL` | Ready to schedule | Schedule Install |
| `INSTALLATION_SCHEDULED` | Install date set | Complete Install |
| `INSTALLED` | Doors installed | Collect Final Payment |
| `COMPLETED` | Fully paid, done | Close |
| `EXPIRED` | Quote validity passed | Reactivate |
| `CANCELLED` | Customer cancelled | Archive |

## Key Models

### Quote
```typescript
interface Quote {
  id: string
  quoteNumber: string  // Format: Q-YYYY-XXXXX
  status: QuoteStatus
  customerId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  propertyAddress: Json  // { line1, line2, city, province, postalCode }
  configurations: QuoteConfig[]
  subtotal: Decimal
  tax: Decimal
  total: Decimal
  depositPercent: number  // Default 50
  validUntil?: Date
}
```

### QuoteConfig
```typescript
interface QuoteConfig {
  id: string
  quoteId: string
  roomName: string
  series: string  // 'impression' | 'echo' | etc.
  doorType: string
  widthInches: Decimal
  heightInches: Decimal
  finish: string
  hardware: string
  quantity: number
  unitPrice: Decimal
  lineTotal: Decimal
}
```

## API Patterns

### Creating a Quote
```typescript
// POST /api/quotes
const response = await fetch('/api/quotes', {
  method: 'POST',
  body: JSON.stringify({
    customerInfo: { name, email, phone },
    propertyInfo: { address },
    configurations: [{ roomName, series, doorType, ... }]
  })
})
// Returns: { success: true, quoteNumber, quoteId }
```

### Updating Quote Status (Admin)
```typescript
// PATCH /api/admin/quotes/[id]/status
const response = await fetch(`/api/admin/quotes/${id}/status`, {
  method: 'PATCH',
  body: JSON.stringify({
    status: 'MEASUREMENT_SCHEDULED',
    note: 'Scheduled for Monday',
    notifyCustomer: true
  })
})
```

### Processing Payment
```typescript
// POST /api/quotes/[id]/payment
const response = await fetch(`/api/quotes/${id}/payment`, {
  method: 'POST',
  body: JSON.stringify({
    type: 'DEPOSIT',  // or 'FINAL'
    returnUrl: window.location.origin + '/account/quotes/' + id
  })
})
// Returns: { checkoutUrl } - Redirect to Stripe
```

## Quote Builder Store (Zustand)

```typescript
// stores/quote-builder-store.ts
const useQuoteBuilderStore = create<QuoteBuilderStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      rooms: [],
      customerInfo: null,
      propertyInfo: null,

      addRoom: (room) => set(state => ({
        rooms: [...state.rooms, { ...room, id: generateId() }]
      })),

      updateRoom: (id, updates) => set(state => ({
        rooms: state.rooms.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      calculateTotal: () => {
        const rooms = get().rooms
        return rooms.reduce((sum, room) => sum + room.lineTotal, 0)
      },

      reset: () => set({ currentStep: 1, rooms: [], customerInfo: null, propertyInfo: null })
    }),
    { name: 'quote-builder' }
  )
)
```

## Email Notifications

Send emails at key points:
- Quote submitted → Admin notification + Customer confirmation
- Quote ready → Customer notification with PDF
- Appointment scheduled → Customer confirmation
- Payment received → Customer receipt

```typescript
import { sendQuoteSubmittedEmail } from '@/lib/email/quote-emails'

await sendQuoteSubmittedEmail({
  customerName: quote.customerName,
  customerEmail: quote.customerEmail,
  quoteNumber: quote.quoteNumber,
  quoteUrl: `${baseUrl}/account/quotes/${quote.id}`
})
```

## File Locations

| Purpose | Location |
|---------|----------|
| Quote types | `types/quote.ts` |
| Quote store | `stores/quote-builder-store.ts` |
| Quote APIs | `app/api/quotes/` |
| Quote builder UI | `app/quote-builder/` |
| Admin quote management | `app/(admin)/admin/quotes/` |
| Customer quote view | `app/(account)/account/quotes/` |
| Email templates | `emails/` |
| Email service | `lib/email/quote-emails.ts` |

## Best Practices

1. **Always validate** quote data with Zod before database operations
2. **Log status changes** to QuoteStatusLog for audit trail
3. **Check permissions** - customers can only see their own quotes
4. **Calculate totals server-side** - never trust client calculations
5. **Use transactions** for multi-table operations
6. **Send notifications** on important status changes
