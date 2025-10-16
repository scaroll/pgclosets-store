# Unified Error Handling System

A comprehensive error handling infrastructure for consistent error management across the application.

## 📋 Table of Contents

- [Overview](#overview)
- [Error Class Hierarchy](#error-class-hierarchy)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Routes](#api-routes)
- [Client Components](#client-components)
- [Error Monitoring](#error-monitoring)
- [Best Practices](#best-practices)
- [Integration Guide](#integration-guide)

## Overview

This system provides:

- **Consistent Error Structure**: Unified error format across the application
- **Type Safety**: TypeScript support for all error types
- **Rich Context**: Preserve debugging information with every error
- **User-Friendly Messages**: Automatic translation to user-safe messages
- **Centralized Monitoring**: Single point for error logging and tracking
- **Production-Ready**: Built-in support for Sentry, DataDog, and custom logging

## Error Class Hierarchy

```
AppError (base class)
├── ValidationError (400) - Input validation failures
├── AuthenticationError (401) - User not authenticated
├── AuthorizationError (403) - Insufficient permissions
├── NotFoundError (404) - Resource not found
├── ConflictError (409) - Resource state conflicts
├── RateLimitError (429) - Rate limit exceeded
├── PaymentError (402) - Payment processing failures
├── ExternalServiceError (502) - External service failures
├── InternalServerError (500) - Unexpected errors
└── DatabaseError (500) - Database operation failures
```

## Quick Start

### 1. Throwing Errors

```typescript
import { ValidationError, NotFoundError, AuthenticationError } from '@/lib/errors/app-errors';

// Validation error
throw new ValidationError('Invalid input', {
  email: ['Invalid email format'],
  password: ['Password must be at least 8 characters'],
});

// Not found error
throw new NotFoundError('Product not found', 'Product', productId);

// Authentication error
throw new AuthenticationError('Token expired');
```

### 2. Catching and Logging Errors

```typescript
import { logError, ErrorSeverity } from '@/lib/monitoring/error-monitor';
import { isAppError } from '@/lib/errors/app-errors';

try {
  // Your code here
} catch (error) {
  // Log the error
  logError(error, ErrorSeverity.ERROR, {
    userId: session?.user?.id,
    endpoint: '/api/products',
    method: 'POST',
  });

  // Re-throw or handle
  throw error;
}
```

## Usage Examples

### API Route Error Handling

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  isAppError
} from '@/lib/errors/app-errors';
import { logError, ErrorSeverity } from '@/lib/monitoring/error-monitor';

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError('User not authenticated', {
        endpoint: '/api/products',
        method: 'GET',
      });
    }

    // Get product
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      throw new ValidationError('Product ID is required', {
        id: ['Product ID parameter is missing'],
      });
    }

    const product = await getProduct(productId);

    if (!product) {
      throw new NotFoundError(
        'Product not found',
        'Product',
        productId,
        {
          userId: session.user.id,
          endpoint: '/api/products',
        }
      );
    }

    return NextResponse.json({ product });

  } catch (error) {
    // Log the error
    logError(error, ErrorSeverity.ERROR, {
      endpoint: '/api/products',
      method: 'GET',
    });

    // Handle AppErrors
    if (isAppError(error)) {
      return NextResponse.json(
        {
          error: {
            message: error.toUserMessage(),
            code: error.code,
            ...(error instanceof ValidationError && { fields: error.fields }),
          },
        },
        { status: error.statusCode }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: {
          message: 'An unexpected error occurred',
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError();
    }

    const body = await request.json();

    // Validate input
    const validation = validateProductInput(body);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid product data',
        validation.errors,
        {
          userId: session.user.id,
          endpoint: '/api/products',
          requestData: body,
        }
      );
    }

    // Create product
    const product = await createProduct(body);

    return NextResponse.json({ product }, { status: 201 });

  } catch (error) {
    logError(error, ErrorSeverity.ERROR, {
      endpoint: '/api/products',
      method: 'POST',
    });

    if (isAppError(error)) {
      return NextResponse.json(
        { error: { message: error.toUserMessage(), code: error.code } },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: { message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
```

### Server Action Error Handling

```typescript
// app/actions/products.ts
'use server';

import { revalidatePath } from 'next/cache';
import {
  ValidationError,
  AuthenticationError,
  NotFoundError
} from '@/lib/errors/app-errors';
import { logError } from '@/lib/monitoring/error-monitor';

export async function createProduct(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError();
    }

    // Validate form data
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;

    if (!name || !price) {
      throw new ValidationError('Missing required fields', {
        name: !name ? ['Name is required'] : [],
        price: !price ? ['Price is required'] : [],
      });
    }

    // Create product
    const product = await db.product.create({
      data: { name, price: parseFloat(price) },
    });

    revalidatePath('/products');

    return { success: true, product };

  } catch (error) {
    logError(error, {
      userId: session?.user?.id,
      endpoint: 'createProduct',
    });

    // Return error to client
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          message: error.toUserMessage(),
          fields: error.fields,
        },
      };
    }

    return {
      success: false,
      error: {
        message: 'Failed to create product',
      },
    };
  }
}
```

### Client Component Error Display

```typescript
// components/ProductForm.tsx
'use client';

import { useState } from 'react';
import { createProduct } from '@/app/actions/products';

export function ProductForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setErrors({});
    setGeneralError(null);

    const result = await createProduct(formData);

    if (!result.success) {
      if (result.error.fields) {
        // Validation errors
        setErrors(result.error.fields);
      } else {
        // General error
        setGeneralError(result.error.message);
      }
      return;
    }

    // Success handling
    console.log('Product created:', result.product);
  }

  return (
    <form action={handleSubmit}>
      {generalError && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <p className="text-sm text-red-800">{generalError}</p>
        </div>
      )}

      <div>
        <label htmlFor="name">Product Name</label>
        <input type="text" name="name" id="name" />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input type="number" name="price" id="price" />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.join(', ')}</p>
        )}
      </div>

      <button type="submit">Create Product</button>
    </form>
  );
}
```

### Payment Processing

```typescript
// lib/payment/stripe.ts
import Stripe from 'stripe';
import { PaymentError, ExternalServiceError } from '@/lib/errors/app-errors';
import { logError, ErrorSeverity } from '@/lib/monitoring/error-monitor';

export async function processPayment(
  amount: number,
  paymentMethodId: string,
  userId: string
) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    return { success: true, paymentIntent };

  } catch (error) {
    // Stripe-specific error handling
    if (error instanceof Stripe.errors.StripeError) {
      const paymentError = new PaymentError(
        error.message,
        'Stripe',
        error.payment_intent?.id,
        amount,
        {
          userId,
          endpoint: 'processPayment',
          metadata: {
            stripeCode: error.code,
            stripeType: error.type,
          },
        }
      );

      logError(paymentError, ErrorSeverity.CRITICAL);
      throw paymentError;
    }

    // Network or other external errors
    const serviceError = new ExternalServiceError(
      'Payment service unavailable',
      'Stripe',
      error instanceof Error ? error : undefined,
      { userId }
    );

    logError(serviceError, ErrorSeverity.CRITICAL);
    throw serviceError;
  }
}
```

### Database Operations

```typescript
// lib/database/products.ts
import { DatabaseError, NotFoundError } from '@/lib/errors/app-errors';
import { logError } from '@/lib/monitoring/error-monitor';

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundError('Product not found', 'Product', id);
    }

    return product;

  } catch (error) {
    // Already a NotFoundError
    if (error instanceof NotFoundError) {
      throw error;
    }

    // Database error
    const dbError = new DatabaseError(
      'Failed to fetch product',
      `SELECT * FROM products WHERE id = '${id}'`,
      error instanceof Error ? error : undefined,
      {
        metadata: { productId: id },
      }
    );

    logError(dbError);
    throw dbError;
  }
}
```

## Error Monitoring

### Basic Logging

```typescript
import { logError, ErrorSeverity } from '@/lib/monitoring/error-monitor';

// Log with different severity levels
logError(error, ErrorSeverity.ERROR);
logError(error, ErrorSeverity.WARNING);
logError(error, ErrorSeverity.CRITICAL);

// Log with context
logError(error, ErrorSeverity.ERROR, {
  userId: 'user123',
  endpoint: '/api/checkout',
  method: 'POST',
  requestData: { amount: 100 },
});
```

### Get Error Statistics

```typescript
import { getErrorStats, resetErrorStats } from '@/lib/monitoring/error-monitor';

// Get current stats
const stats = getErrorStats();
console.log('Total errors:', stats.totalErrors);
console.log('Errors by type:', stats.errorsByType);

// Reset stats
resetErrorStats();
```

### Custom Configuration

```typescript
import { initializeErrorMonitor } from '@/lib/monitoring/error-monitor';

// Initialize with custom config
initializeErrorMonitor({
  enableConsoleLogging: true,
  enableExternalLogging: true,
  logOperationalErrors: false, // Don't log validation/404 errors
  includeStackTraces: true,
});
```

## Best Practices

### 1. Choose the Right Error Type

```typescript
// ✅ Good - Specific error type
throw new ValidationError('Invalid email', { email: ['Invalid format'] });

// ❌ Bad - Generic error
throw new Error('Invalid email');
```

### 2. Include Context

```typescript
// ✅ Good - Rich context
throw new NotFoundError('Product not found', 'Product', productId, {
  userId: session.user.id,
  endpoint: '/api/products',
});

// ❌ Bad - No context
throw new NotFoundError('Product not found');
```

### 3. Log at the Right Level

```typescript
// ✅ Good - Appropriate logging
logError(authError, ErrorSeverity.WARNING);
logError(paymentError, ErrorSeverity.CRITICAL);
logError(internalError, ErrorSeverity.ERROR);

// ❌ Bad - Everything as ERROR
logError(validationError, ErrorSeverity.ERROR);
```

### 4. Sanitize User Data

```typescript
// ✅ Good - Sanitized data
logError(error, ErrorSeverity.ERROR, {
  requestData: {
    email: user.email,
    // Don't log password
  },
});

// ❌ Bad - Sensitive data in logs
logError(error, ErrorSeverity.ERROR, {
  requestData: {
    email: user.email,
    password: user.password, // Never log passwords!
  },
});
```

### 5. Use Type Guards

```typescript
// ✅ Good - Type-safe error handling
if (isAppError(error)) {
  console.log(error.code, error.statusCode);
}

// ❌ Bad - Unsafe type assertion
const appError = error as AppError;
```

## Integration Guide

### 1. Sentry Integration

```typescript
// lib/monitoring/error-monitor.ts
import * as Sentry from '@sentry/nextjs';

// Uncomment and configure in logToExternalService method
if (typeof Sentry !== 'undefined') {
  Sentry.withScope((scope) => {
    scope.setLevel(severity === ErrorSeverity.CRITICAL ? 'fatal' : 'error');
    scope.setContext('error', {
      code: error.code,
      statusCode: error.statusCode,
    });
    Sentry.captureException(error);
  });
}
```

### 2. DataDog Integration

```typescript
// Uncomment and configure in logToExternalService method
if (typeof window !== 'undefined' && window.DD_LOGS) {
  window.DD_LOGS.logger.error(error.message, {
    error: {
      kind: error.name,
      message: error.message,
    },
    context: {
      code: error.code,
      ...context,
    },
  });
}
```

### 3. Custom API Logging

```typescript
// app/api/errors/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const errorData = await request.json();

  // Store in database or send to monitoring service
  await db.errorLog.create({
    data: {
      ...errorData,
      timestamp: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
```

## Migration Strategy

### Phase 1: Infrastructure (Current)
- ✅ Create error classes
- ✅ Create monitoring system
- ✅ Write documentation

### Phase 2: Gradual Adoption
- Identify high-priority endpoints
- Replace existing error handling
- Add comprehensive logging

### Phase 3: Complete Migration
- Update all API routes
- Update all server actions
- Add client-side error handling

### Phase 4: Monitoring Integration
- Set up Sentry/DataDog
- Configure alerts
- Create error dashboards

## Troubleshooting

### Common Issues

**Issue**: Errors not being logged
```typescript
// Solution: Check isLoggable flag
throw new ValidationError('...', fields, {
  // ValidationError has isLoggable: false by default
});

// Force logging if needed
const monitor = ErrorMonitor.getInstance();
monitor.logError(error, ErrorSeverity.ERROR);
```

**Issue**: Sensitive data in logs
```typescript
// Solution: Use context sanitization
logError(error, ErrorSeverity.ERROR, {
  requestData: sanitizeData(request.body),
});
```

**Issue**: Stack traces missing in production
```typescript
// Solution: Update config
initializeErrorMonitor({
  includeStackTraces: true, // Enable in production if needed
});
```

## Support

For questions or issues with the error handling system:
1. Check this documentation
2. Review error class definitions in `app-errors.ts`
3. Review monitoring implementation in `error-monitor.ts`
4. Contact the development team

---

**Version**: 1.0.0
**Last Updated**: 2025-10-16
