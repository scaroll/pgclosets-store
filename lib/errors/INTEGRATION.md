# Error Handling System - Quick Integration Guide

## What Was Created

### File Structure
```
lib/
├── errors/
│   ├── app-errors.ts          (11KB - Error class hierarchy)
│   ├── index.ts               (1.3KB - Main export)
│   ├── examples.ts            (8.3KB - Integration examples)
│   ├── README.md              (16KB - Full documentation)
│   └── INTEGRATION.md         (This file)
└── monitoring/
    └── error-monitor.ts       (10KB - Centralized logging)
```

### What's Included

1. **Error Class Hierarchy** (`app-errors.ts`):
   - Base `AppError` class with code, message, statusCode, context
   - 10 specialized error types for common scenarios
   - Type-safe error handling with TypeScript
   - User-friendly message conversion

2. **Centralized Monitoring** (`error-monitor.ts`):
   - Development: Console logging with rich context
   - Production: Ready for Sentry/DataDog integration
   - Context preservation (user ID, endpoint, request data)
   - Error statistics tracking

3. **Comprehensive Documentation**:
   - Full API documentation in README.md
   - Real-world integration examples
   - Best practices guide
   - Troubleshooting section

## Quick Start (5 Minutes)

### Step 1: Import the System

```typescript
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  logError,
  ErrorSeverity,
  isAppError
} from '@/lib/errors';
```

### Step 2: Use in API Routes

```typescript
// app/api/example/route.ts
export async function GET(request: NextRequest) {
  try {
    const data = await getData();
    return NextResponse.json({ data });
  } catch (error) {
    logError(error, ErrorSeverity.ERROR, {
      endpoint: '/api/example',
      method: 'GET'
    });

    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.toUserMessage() },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

### Step 3: Throw Specific Errors

```typescript
// Validation error
if (!email) {
  throw new ValidationError('Invalid input', {
    email: ['Email is required']
  });
}

// Not found error
if (!product) {
  throw new NotFoundError('Product not found', 'Product', productId);
}

// Authentication error
if (!session) {
  throw new AuthenticationError();
}
```

## Common Use Cases

### API Route Error Handling

```typescript
export async function POST(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    logError(error, ErrorSeverity.ERROR);

    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.toUserMessage() },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Server Actions

```typescript
'use server';

export async function createItem(formData: FormData) {
  try {
    // Validation
    const name = formData.get('name');
    if (!name) {
      throw new ValidationError('Name is required', {
        name: ['This field is required']
      });
    }

    // Create item
    const item = await db.item.create({ data: { name } });
    return { success: true, item };

  } catch (error) {
    logError(error);

    if (error instanceof ValidationError) {
      return {
        success: false,
        error: { message: error.toUserMessage(), fields: error.fields }
      };
    }

    return {
      success: false,
      error: { message: 'Failed to create item' }
    };
  }
}
```

### Database Operations

```typescript
async function getProduct(id: string) {
  try {
    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundError('Product not found', 'Product', id);
    }

    return product;
  } catch (error) {
    if (isAppError(error)) throw error;

    throw new DatabaseError(
      'Failed to fetch product',
      undefined,
      error instanceof Error ? error : undefined
    );
  }
}
```

### External Service Integration

```typescript
async function processStripePayment(amount: number) {
  try {
    return await stripe.paymentIntents.create({ amount, currency: 'usd' });
  } catch (error) {
    throw new PaymentError(
      error.message,
      'Stripe',
      error.payment_intent?.id,
      amount
    );
  }
}
```

## Error Types Reference

| Error Type | Status Code | Use Case |
|------------|-------------|----------|
| `ValidationError` | 400 | Input validation failures |
| `AuthenticationError` | 401 | User not authenticated |
| `AuthorizationError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource doesn't exist |
| `ConflictError` | 409 | Resource state conflicts |
| `RateLimitError` | 429 | Rate limit exceeded |
| `PaymentError` | 402 | Payment processing failures |
| `ExternalServiceError` | 502 | External service unavailable |
| `DatabaseError` | 500 | Database operation failures |
| `InternalServerError` | 500 | Unexpected errors |

## Features

### Context Preservation
Every error automatically captures:
- User ID (if authenticated)
- API endpoint and method
- Request data (sanitized)
- Timestamp
- Stack trace (development)

### User-Friendly Messages
```typescript
error.toUserMessage(); // Returns safe, user-friendly message
// "Please sign in to continue" instead of "JWT token expired"
```

### Type Safety
```typescript
if (error instanceof ValidationError) {
  console.log(error.fields); // TypeScript knows this exists
}
```

### Error Statistics
```typescript
import { getErrorStats } from '@/lib/errors';

const stats = getErrorStats();
console.log(stats.totalErrors);
console.log(stats.errorsByType);
```

## Next Steps

### Phase 1: Start Using (Now)
1. Import error classes in new code
2. Use in high-priority API routes
3. Add logging to critical operations

### Phase 2: Gradual Migration (Weeks)
1. Replace `throw new Error()` with specific error types
2. Add error handling to all API routes
3. Update server actions
4. Add client-side error displays

### Phase 3: Monitoring Integration (Later)
1. Uncomment Sentry/DataDog code in `error-monitor.ts`
2. Configure monitoring service
3. Set up alerts and dashboards
4. Review error patterns

## Monitoring Integration

### Sentry Setup
```typescript
// lib/monitoring/error-monitor.ts
// Uncomment the Sentry integration code:

if (typeof Sentry !== 'undefined') {
  Sentry.withScope((scope) => {
    scope.setLevel(severity === ErrorSeverity.CRITICAL ? 'fatal' : 'error');
    scope.setContext('error', { code: error.code });
    if (context.userId) scope.setUser({ id: context.userId });
    Sentry.captureException(error);
  });
}
```

### DataDog Setup
```typescript
// Uncomment the DataDog integration code:

if (typeof window !== 'undefined' && window.DD_LOGS) {
  window.DD_LOGS.logger.error(error.message, {
    error: { kind: error.name, message: error.message },
    context: { code: error.code, ...context }
  });
}
```

### Custom API Logging
```typescript
// Create app/api/errors/route.ts
export async function POST(request: NextRequest) {
  const errorData = await request.json();
  await db.errorLog.create({ data: errorData });
  return NextResponse.json({ success: true });
}

// Uncomment custom API integration in error-monitor.ts
```

## Best Practices

### ✅ Do
- Choose specific error types over generic errors
- Include rich context with every error
- Log at appropriate severity levels
- Use type guards (`isAppError`)
- Return user-friendly messages to clients

### ❌ Don't
- Log sensitive data (passwords, tokens)
- Expose internal error details to users
- Skip error logging in production
- Use generic `Error` for application errors
- Suppress errors silently

## Troubleshooting

**Q: Errors aren't being logged**
A: Check the `isLoggable` flag. ValidationError has it set to false by default.

**Q: Too much noise in development logs**
A: Configure the monitor:
```typescript
import { initializeErrorMonitor } from '@/lib/errors';

initializeErrorMonitor({
  logOperationalErrors: false // Don't log validation/404s
});
```

**Q: Need to log with different severity**
A: Use the severity parameter:
```typescript
logError(error, ErrorSeverity.WARNING); // Less severe
logError(error, ErrorSeverity.CRITICAL); // More severe
```

## Support

- Full documentation: `lib/errors/README.md`
- Example implementations: `lib/errors/examples.ts`
- Error classes: `lib/errors/app-errors.ts`
- Monitoring: `lib/monitoring/error-monitor.ts`

---

**System Status**: ✅ Ready for integration (no refactoring required)
**TypeScript**: ✅ Fully typed and type-safe
**Testing**: Ready for gradual adoption
**Production**: Monitoring integration points prepared
