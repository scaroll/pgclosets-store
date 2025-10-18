/**
 * Error Handling Integration Examples
 *
 * Practical examples showing how to integrate the unified error handling
 * system into various parts of your application.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  PaymentError,
  ExternalServiceError,
  DatabaseError,
  InternalServerError,
  isAppError,
  normalizeError,
} from './app-errors';
import { logError, ErrorSeverity } from '../monitoring/error-monitor';

/**
 * Example 1: API Route with Comprehensive Error Handling
 */
export async function exampleAPIRoute(request: NextRequest) {
  try {
    // Simulate authentication check
    const session = await getSession(request);
    if (!session) {
      throw new AuthenticationError('User must be authenticated', {
        endpoint: '/api/example',
        method: 'GET',
      });
    }

    // Simulate input validation
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ValidationError('Missing required parameter', {
        id: ['ID parameter is required'],
      });
    }

    // Simulate database operation
    const data = await fetchData(id, session.user.id);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Log the error with context
    logError(error, ErrorSeverity.ERROR, {
      endpoint: '/api/example',
      method: request.method,
    });

    // Handle AppError instances
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

/**
 * Example 2: Server Action with Error Handling
 */
export async function exampleServerAction(formData: FormData) {
  'use server';

  try {
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError();
    }

    // Validate form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const errors: Record<string, string[]> = {};
    if (!name) errors.name = ['Name is required'];
    if (!email) errors.email = ['Email is required'];
    else if (!email.includes('@')) errors.email = ['Invalid email format'];

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid form data', errors, {
        userId: session.user.id,
        endpoint: 'exampleServerAction',
      });
    }

    // Process the data
    const result = await processData({ name, email });

    return { success: true, data: result };
  } catch (error) {
    logError(error, ErrorSeverity.ERROR);

    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          message: error.toUserMessage(),
          fields: error.fields,
        },
      };
    }

    if (isAppError(error)) {
      return {
        success: false,
        error: {
          message: error.toUserMessage(),
          code: error.code,
        },
      };
    }

    return {
      success: false,
      error: {
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Example 3: Database Operation with Error Handling
 */
async function fetchData(id: string, userId: string) {
  try {
    // Simulate database query
    const result = await db.data.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundError('Data not found', 'Data', id, {
        userId,
        metadata: { requestedId: id },
      });
    }

    // Check authorization
    if (result.ownerId !== userId) {
      throw new AuthorizationError(
        'Insufficient permissions to access this resource',
        'read:data',
        {
          userId,
          metadata: { requestedId: id, ownerId: result.ownerId },
        }
      );
    }

    return result;
  } catch (error) {
    // Re-throw AppErrors
    if (isAppError(error)) {
      throw error;
    }

    // Convert database errors
    const dbError = new DatabaseError(
      'Failed to fetch data from database',
      `SELECT * FROM data WHERE id = '${id}'`,
      error instanceof Error ? error : undefined,
      {
        userId,
        metadata: { requestedId: id },
      }
    );

    logError(dbError, ErrorSeverity.ERROR);
    throw dbError;
  }
}

/**
 * Example 4: External Service Integration
 */
export async function processPayment(amount: number, userId: string) {
  try {
    // Simulate Stripe payment
    const result = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // ... other options
    });

    return result;
  } catch (error) {
    // Handle Stripe-specific errors
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as { type: string; message: string; code?: string };

      throw new PaymentError(
        stripeError.message,
        'Stripe',
        undefined,
        amount,
        {
          userId,
          metadata: {
            stripeCode: stripeError.code,
            stripeType: stripeError.type,
          },
        }
      );
    }

    // Network or other external errors
    throw new ExternalServiceError(
      'Payment service unavailable',
      'Stripe',
      error instanceof Error ? error : undefined,
      { userId }
    );
  }
}

/**
 * Example 5: Generic Try-Catch with Error Normalization
 */
export async function someOperation(userId: string) {
  try {
    // Your operation here
    return await riskyOperation();
  } catch (error) {
    // Normalize any error to AppError
    const normalizedError = normalizeError(error, {
      userId,
      endpoint: 'someOperation',
    });

    logError(normalizedError, ErrorSeverity.ERROR);
    throw normalizedError;
  }
}

/**
 * Example 6: Client-Side Error Handler
 */
export function handleClientError(error: unknown): string {
  if (isAppError(error)) {
    // Use the user-friendly message
    return error.toUserMessage();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Example 7: Error Recovery Pattern
 */
export async function operationWithRetry(maxRetries = 3) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await performOperation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on validation or authentication errors
      if (
        isAppError(error) &&
        (error instanceof ValidationError || error instanceof AuthenticationError)
      ) {
        throw error;
      }

      // Log retry attempt
      if (attempt < maxRetries - 1) {
        logError(
          normalizeError(error, {
            metadata: { attempt: attempt + 1, maxRetries },
          }),
          ErrorSeverity.WARNING
        );

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // All retries failed
  throw new InternalServerError(
    'Operation failed after multiple attempts',
    lastError || undefined,
    {
      metadata: { attempts: maxRetries },
    }
  );
}

// Mock functions for examples (replace with actual implementations)
async function getSession(_request?: NextRequest): Promise<{ user: { id: string } } | null> {
  return { user: { id: 'user123' } };
}

async function processData(_data: { name: string; email: string }) {
  return { id: '123', status: 'processed' };
}

async function riskyOperation() {
  return { success: true };
}

async function performOperation() {
  return { success: true };
}

// Mock database and stripe
const db = {
  data: {
    findUnique: async (_options: { where: { id: string } }) => {
      return { id: '123', ownerId: 'user123', data: 'example' };
    },
  },
};

const stripe = {
  paymentIntents: {
    create: async (_options: { amount: number; currency: string }) => {
      return { id: 'pi_123', status: 'succeeded' };
    },
  },
};
