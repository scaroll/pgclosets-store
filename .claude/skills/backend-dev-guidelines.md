# Backend Development Guidelines

Best practices for API routes, Prisma, authentication, and backend architecture.

## Tech Stack

- **Framework:** Next.js 15 App Router
- **ORM:** Prisma with PostgreSQL
- **Auth:** NextAuth.js v5 (beta)
- **Validation:** Zod
- **Email:** React Email + Resend
- **Payments:** Stripe

## API Route Structure

### Basic Pattern

```typescript
// app/api/quotes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQuoteSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10)
  }),
  configurations: z.array(z.object({
    roomName: z.string(),
    series: z.string(),
    // ...
  }))
})

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication (if required)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse and validate body
    const body = await request.json()
    const validatedData = createQuoteSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    // 3. Business logic
    const quote = await prisma.quote.create({
      data: {
        // ...
      }
    })

    // 4. Return response
    return NextResponse.json({
      success: true,
      data: quote
    })

  } catch (error) {
    console.error('[POST /api/quotes] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Dynamic Route Parameters

```typescript
// app/api/quotes/[id]/route.ts
interface RouteParams {
  params: Promise<{ id: string }>  // Next.js 15 requires Promise
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params  // Await the params

  const quote = await prisma.quote.findUnique({
    where: { id }
  })

  if (!quote) {
    return NextResponse.json(
      { success: false, error: 'Quote not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: quote })
}
```

## Prisma Patterns

### Query Patterns

```typescript
// Find with relations
const quote = await prisma.quote.findUnique({
  where: { id },
  include: {
    configurations: true,
    customer: {
      select: { name: true, email: true }
    },
    statusLogs: {
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
})

// Filtered list with pagination
const quotes = await prisma.quote.findMany({
  where: {
    status: { in: ['SUBMITTED', 'UNDER_REVIEW'] },
    createdAt: { gte: startDate }
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize
})

// Aggregate
const stats = await prisma.quote.aggregate({
  where: { status: 'COMPLETED' },
  _sum: { total: true },
  _count: true,
  _avg: { total: true }
})
```

### Transaction Pattern

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Create quote
  const quote = await tx.quote.create({
    data: { /* ... */ }
  })

  // Create configurations
  await tx.quoteConfig.createMany({
    data: configurations.map(config => ({
      quoteId: quote.id,
      ...config
    }))
  })

  // Log status
  await tx.quoteStatusLog.create({
    data: {
      quoteId: quote.id,
      status: 'SUBMITTED',
      changedBy: userId
    }
  })

  return quote
})
```

## Authentication

### Checking Auth in API Routes

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Get user with role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  })

  // Check admin access
  if (user?.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    )
  }

  // ... continue
}
```

### Role-Based Access

```typescript
function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest) => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { authorized: false, status: 401 }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || !allowedRoles.includes(user.role)) {
      return { authorized: false, status: 403 }
    }

    return { authorized: true, user }
  }
}

// Usage
export async function POST(request: NextRequest) {
  const auth = await requireRole(['ADMIN'])
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Forbidden' }, { status: auth.status })
  }
  // ...
}
```

## Validation with Zod

```typescript
import { z } from 'zod'

// Define schemas
const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().length(2),
  postalCode: z.string().regex(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i)
})

const quoteSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  propertyAddress: addressSchema,
  configurations: z.array(z.object({
    roomName: z.string(),
    series: z.enum(['impression', 'echo', 'profile', 'contour']),
    quantity: z.number().int().min(1).max(10)
  })).min(1)
})

// Use in route
const result = quoteSchema.safeParse(body)
if (!result.success) {
  return NextResponse.json({
    error: 'Validation failed',
    details: result.error.flatten()
  }, { status: 400 })
}

const { customerName, configurations } = result.data
```

## Error Handling

### Consistent Error Responses

```typescript
// Success response
return NextResponse.json({
  success: true,
  data: result
})

// Error responses
return NextResponse.json({
  success: false,
  error: 'Human readable message',
  code: 'ERROR_CODE',  // Optional for client handling
  details: {}  // Optional additional info
}, { status: 400 })

// Common status codes
// 400 - Bad Request (validation, missing params)
// 401 - Unauthorized (not logged in)
// 403 - Forbidden (no permission)
// 404 - Not Found
// 409 - Conflict (duplicate, invalid state)
// 500 - Internal Server Error
```

### Logging

```typescript
try {
  // ...
} catch (error) {
  // Log with context
  console.error('[POST /api/quotes] Error:', {
    userId: session?.user?.id,
    body: sanitizedBody,  // Remove sensitive data
    error: error instanceof Error ? error.message : error
  })

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  )
}
```

## Webhook Handling

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object)
      break
    // Handle other events
  }

  return NextResponse.json({ received: true })
}
```

## File Locations

| Purpose | Location |
|---------|----------|
| API routes | `app/api/` |
| Auth config | `lib/auth.ts` |
| Prisma client | `lib/prisma.ts` |
| Database schema | `prisma/schema.prisma` |
| Email service | `lib/email/` |
| Validation schemas | `lib/validations/` |
