import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIdentifier, generalRateLimiter } from '@/lib/rate-limit';
import { sendQuoteNotification, sendQuoteAutoResponse } from '@/lib/email/quote-notification';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/lib/env-validation';

export const maxDuration = 15;

// Measurement schema
const measurementSchema = z.object({
  width: z.number().positive('Width must be greater than 0').optional(),
  height: z.number().positive('Height must be greater than 0').optional(),
  depth: z.number().positive('Depth must be greater than 0').optional(),
  unit: z.enum(['inches', 'feet', 'cm', 'm']).default('inches'),
});

// Address schema
const addressSchema = z.object({
  street: z.string().max(200, 'Street address too long').optional(),
  city: z.string().max(100, 'City name too long').optional(),
  province: z.string().max(100, 'Province name too long').optional(),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid Canadian postal code').optional(),
});

// Main quote request schema
const quoteRequestSchema = z.object({
  // Required contact information
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please provide a valid email address'),
  phone: z
    .string()
    .regex(
      /^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
      'Please provide a valid phone number (e.g., 613-555-0123)'
    ),

  // Optional company information
  company: z.string().max(200, 'Company name too long').optional(),

  // Project details
  projectType: z.enum([
    'closet-doors',
    'barn-doors',
    'sliding-doors',
    'bifold-doors',
    'mirror-doors',
    'storage-system',
    'full-renovation',
    'other'
  ]).optional(),
  projectDescription: z.string().max(2000, 'Project description too long').optional(),
  budget: z.enum([
    'under-1000',
    '1000-3000',
    '3000-5000',
    '5000-10000',
    'over-10000',
    'flexible'
  ]).optional(),
  timeline: z.enum([
    'urgent',
    'within-1-month',
    'within-3-months',
    'within-6-months',
    'flexible'
  ]).optional(),

  // Measurements and address
  measurements: measurementSchema.optional(),
  address: addressSchema.optional(),

  // Contact preferences
  preferredContactMethod: z.enum(['email', 'phone']).default('email'),
  preferredContactTime: z.string().max(100).optional(),

  // Additional information
  notes: z.string().max(2000, 'Notes too long').optional(),
  source: z.string().max(100).optional(), // How they found us

  // Consent
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted to submit this form',
  }),
});

type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// Response type
interface QuoteResponse {
  success: boolean;
  message: string;
  quoteId?: string;
  error?: string;
}

// In-memory storage for quotes (replace with database in production)
const quoteStore = new Map<string, QuoteRequest & { quoteId: string; submittedAt: string; ipAddress: string }>();

// CORS headers configuration
const getCorsHeaders = (origin?: string) => {
  const allowedOrigins = [
    env.NEXT_PUBLIC_SITE_URL,
    env.NEXT_PUBLIC_APP_URL,
    'https://pgclosets.ca',
    'https://www.pgclosets.ca',
    'http://localhost:3000', // Development
  ].filter(Boolean);

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-csrf-token, x-requested-with',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
};

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin || undefined);

  return NextResponse.json({}, {
    status: 200,
    headers: {
      ...corsHeaders,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    }
  });
}

/**
 * POST handler for quote request submission
 * Rate limited to 5 requests per IP per hour
 */
export async function POST(request: NextRequest): Promise<NextResponse<QuoteResponse>> {
  try {
    // Get origin for CORS
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin || undefined);

    // Reject requests from unauthorized origins
    if (origin && corsHeaders['Access-Control-Allow-Origin'] === 'null') {
      return NextResponse.json<QuoteResponse>(
        {
          success: false,
          message: 'Cross-origin requests not allowed',
          error: 'CORS_ERROR',
        },
        {
          status: 403,
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
          }
        }
      );
    }

    // Extract IP address for rate limiting and logging
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Rate limiting: max 5 requests per IP per hour
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, generalRateLimiter);

    if (!rateLimitResult.allowed) {
      console.warn(`[Quote API] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json<QuoteResponse>(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': '3600',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          }
        }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[Quote API] Invalid JSON:', error);
      return NextResponse.json<QuoteResponse>(
        {
          success: false,
          message: 'Invalid request format. Please check your data and try again.',
          error: 'INVALID_JSON',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate request body with zod
    const validationResult = quoteRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      console.warn('[Quote API] Validation failed:', errors);

      return NextResponse.json<QuoteResponse>(
        {
          success: false,
          message: errors[0]?.message || 'Invalid form data. Please check your inputs.',
          error: 'VALIDATION_ERROR',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const quoteData = validationResult.data;

    // Generate unique quote ID
    const quoteId = `QT-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;
    const submittedAt = new Date().toISOString();

    // Store quote in memory (or database in production)
    const quoteRecord = {
      ...quoteData,
      quoteId,
      submittedAt,
      ipAddress: ip,
    };

    quoteStore.set(quoteId, quoteRecord);

    // Log quote submission (sanitized)
    console.log('[Quote API] New quote request:', {
      quoteId,
      name: quoteData.name,
      projectType: quoteData.projectType,
      timestamp: submittedAt,
      ip,
    });

    // Prepare email notification data
    const emailData = {
      quoteId,
      name: quoteData.name,
      email: quoteData.email,
      phone: quoteData.phone,
      company: quoteData.company,
      projectType: quoteData.projectType,
      projectDescription: quoteData.projectDescription,
      budget: quoteData.budget,
      timeline: quoteData.timeline,
      measurements: quoteData.measurements,
      address: quoteData.address,
      preferredContactMethod: quoteData.preferredContactMethod,
      preferredContactTime: quoteData.preferredContactTime,
      source: quoteData.source,
      notes: quoteData.notes,
      submittedAt,
      ipAddress: ip,
    };

    // Send email notifications (admin + customer)
    try {
      // Send both emails in parallel
      const [adminEmailSent, customerEmailSent] = await Promise.allSettled([
        sendQuoteNotification(emailData),
        sendQuoteAutoResponse(emailData),
      ]);

      // Log email results
      if (adminEmailSent.status === 'rejected') {
        console.error('[Quote API] Admin email failed:', adminEmailSent.reason);
      }
      if (customerEmailSent.status === 'rejected') {
        console.error('[Quote API] Customer email failed:', customerEmailSent.reason);
      }

      // Don't fail the request if emails fail - just log it
      if (adminEmailSent.status === 'fulfilled' && adminEmailSent.value) {
        console.log('[Quote API] Admin notification sent successfully');
      }
      if (customerEmailSent.status === 'fulfilled' && customerEmailSent.value) {
        console.log('[Quote API] Customer auto-response sent successfully');
      }
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('[Quote API] Email notification error:', emailError);
      // In production, you might want to queue this for retry
    }

    // Return success response
    return NextResponse.json<QuoteResponse>(
      {
        success: true,
        message: 'Thank you for your quote request! We will contact you shortly.',
        quoteId,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining - 1),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        }
      }
    );
  } catch (error) {
    // Unexpected error handling
    console.error('[Quote API] Unexpected error:', error);
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin || undefined);

    return NextResponse.json<QuoteResponse>(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later or contact us directly.',
        error: 'INTERNAL_ERROR',
      },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

/**
 * GET handler to retrieve a specific quote by ID
 * Note: This should be protected in production with authentication
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('id');

    if (!quoteId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote ID is required',
        },
        { status: 400 }
      );
    }

    const quote = quoteStore.get(quoteId);

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // In production, add authentication check here
    // For now, return the quote (without sensitive data)
    return NextResponse.json(
      {
        success: true,
        quote: {
          quoteId: quote.quoteId,
          name: quote.name,
          email: quote.email,
          projectType: quote.projectType,
          submittedAt: quote.submittedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Quote API GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while retrieving the quote',
      },
      { status: 500 }
    );
  }
}

/**
 * Cleanup old quotes from memory (run periodically)
 * In production, this would be handled by database retention policies
 */
function cleanupOldQuotes() {
  const now = Date.now();
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

  for (const [quoteId, quote] of quoteStore.entries()) {
    const quoteAge = now - new Date(quote.submittedAt).getTime();
    if (quoteAge > maxAge) {
      quoteStore.delete(quoteId);
    }
  }
}

// Run cleanup on module load
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldQuotes, 24 * 60 * 60 * 1000); // Daily cleanup
}
