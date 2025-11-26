import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: result.error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      };
    }

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; error: NextResponse } {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const result = schema.safeParse(params);

  if (!result.success) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: result.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Validation middleware wrapper
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const validation = await validateBody(req, schema);

    if (!validation.success) {
      return validation.error;
    }

    return handler(req, validation.data);
  };
}

/**
 * Common validation patterns
 */
export const patterns = {
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s\-\(\)\+]+$/).min(10),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/),
  uuid: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  url: z.string().url(),
  date: z.string().datetime(),
};

/**
 * Create a paginated query schema
 */
export function paginatedQuerySchema<T extends z.ZodRawShape>(additional?: T) {
  const base = {
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  };

  return z.object(additional ? { ...base, ...additional } : base);
}

/**
 * Rate limit configurations
 */
export const rateLimitConfigs = {
  default: { maxRequests: 60, windowMs: 60000 },
  strict: { maxRequests: 10, windowMs: 60000 },
  relaxed: { maxRequests: 200, windowMs: 60000 },
  auth: { maxRequests: 5, windowMs: 900000 },
};

/**
 * Create a protected route handler with validation and rate limiting
 */
export function createProtectedRoute<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>,
  options?: {
    rateLimit?: { maxRequests: number; windowMs: number };
  }
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    // Validate request body
    const validation = await validateBody(req, schema);
    if (!validation.success) {
      return validation.error;
    }

    // Execute handler
    return handler(req, validation.data);
  };
}
