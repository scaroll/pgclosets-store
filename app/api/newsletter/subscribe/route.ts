import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/email/newsletter';
import { checkRateLimit, getClientIdentifier, generalRateLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

// Type definitions
interface NewsletterSubscribeResult {
  success: boolean;
  message?: string;
  error?: string;
}

// Input validation schema
const newsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  firstName: z.string().max(50, 'First name too long').optional(),
  lastName: z.string().max(50, 'Last name too long').optional(),
});

/**
 * Newsletter Subscription API Route
 *
 * POST /api/newsletter/subscribe
 * Body: { email: string, firstName?: string, lastName?: string }
 *
 * Returns: { success: boolean, message?: string, error?: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting: max 3 requests per IP per hour
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, generalRateLimiter);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many subscription attempts. Please try again later.'
        },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          }
        }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const validationResult = newsletterSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          error: errors[0] || 'Invalid input data'
        },
        { status: 400 }
      );
    }

    const { email, firstName, lastName } = validationResult.data;

    // Additional email validation to prevent email injection
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Combine first and last name for the newsletter subscriber
    const name = [firstName, lastName].filter(Boolean).join(' ');

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email: email.toLowerCase().trim(),
      ...(name && { name }),
      source: 'website'
    });

    // Return result with appropriate status code and security headers
    return NextResponse.json(
      result as NewsletterSubscribeResult,
      {
        status: result.success ? 200 : 400,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining - 1),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        }
      }
    );

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your subscription'
      },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        }
      }
    );
  }
}
