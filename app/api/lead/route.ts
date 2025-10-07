import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendLeadNotification } from '@/lib/email/lead-notification';
import { v4 as uuidv4 } from 'uuid';

// Door selection schema for quote requests
const doorSelectionSchema = z.object({
  series: z.string().min(1, 'Series is required'),
  doorType: z.enum(['sliding', 'bypass', 'bifold', 'pivot', 'barn', 'mirror'], {
    errorMap: () => ({ message: 'Invalid door type' }),
  }),
  openingWidthIn: z.number().positive('Opening width must be greater than 0'),
  openingHeightIn: z.number().positive('Opening height must be greater than 0'),
  panelCount: z.number().int().positive('Panel count must be at least 1'),
  finish: z.string().min(1, 'Finish is required'),
  hardware: z.string().min(1, 'Hardware is required'),
  softClose: z.boolean(),
  handles: z.string().min(1, 'Handles selection is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  productUrl: z.string().url('Invalid product URL').optional(),
  images: z.array(z.string().url('Invalid image URL')).max(10, 'Maximum 10 images').optional(),
});

// Zod validation schema matching LeadFormData type
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please provide a valid email address'),
  phone: z
    .string()
    .regex(
      /^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
      'Please provide a valid phone number (e.g., 613-555-1234)'
    ),
  location: z.string().min(2, 'Location is required').max(200, 'Location too long'),
  serviceType: z.enum(['measure', 'quote', 'general'], {
    errorMap: () => ({ message: 'Please select a valid service type' }),
  }),
  productInterest: z.string().max(500, 'Product interest description too long').optional(),
  message: z.string().max(2000, 'Message too long').optional(),
  preferredContact: z.enum(['email', 'phone'], {
    errorMap: () => ({ message: 'Please select a preferred contact method' }),
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted to submit this form',
  }),
  doorSelection: doorSelectionSchema.optional(),
}).refine(
  (data) => {
    // Require doorSelection when serviceType is 'quote'
    if (data.serviceType === 'quote' && !data.doorSelection) {
      return false;
    }
    return true;
  },
  {
    message: 'Door selection is required for quote requests',
    path: ['doorSelection'],
  }
);

// Response type
interface LeadResponse {
  success: boolean;
  message: string;
  leadId?: string;
}

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://www.pgclosets.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-csrf-token',
  'Access-Control-Max-Age': '86400',
};

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

/**
 * POST handler for lead submission
 * Rate limited to 3 requests per IP per hour
 */
export async function POST(request: NextRequest): Promise<NextResponse<LeadResponse>> {
  try {
    // Extract IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Rate limiting: max 3 requests per IP per hour
    const rateLimitResult = await checkRateLimit(ip, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      console.warn(`[Lead API] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: `Too many requests. Please try again in ${Math.ceil(rateLimitResult.retryAfter / 60000)} minutes.`,
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': String(Math.ceil(rateLimitResult.retryAfter / 1000)),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          }
        }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[Lead API] Invalid JSON:', error);
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: 'Invalid request format. Please check your data and try again.',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate request body
    const validationResult = leadSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      console.warn('[Lead API] Validation failed:', errors);
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: errors[0] || 'Invalid form data. Please check your inputs.',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const leadData = validationResult.data;

    // Generate unique lead ID
    const leadId = uuidv4();

    // Log lead submission (sanitized)
    console.log('[Lead API] New lead submission:', {
      leadId,
      serviceType: leadData.serviceType,
      location: leadData.location,
      timestamp: new Date().toISOString(),
      ip,
    });

    // Send email notification
    try {
      await sendLeadNotification({
        leadId,
        ...leadData,
        submittedAt: new Date().toISOString(),
        ipAddress: ip,
      });
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('[Lead API] Email notification failed:', emailError);
      // In production, you might want to queue this for retry
      // For now, we'll continue and return success to the user
    }

    // Return success response
    return NextResponse.json<LeadResponse>(
      {
        success: true,
        message: 'Thank you for your inquiry! We will contact you shortly.',
        leadId,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining - 1),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
        }
      }
    );
  } catch (error) {
    // Unexpected error handling
    console.error('[Lead API] Unexpected error:', error);

    return NextResponse.json<LeadResponse>(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later or contact us directly.',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Reject all other methods
 */
export async function GET() {
  return NextResponse.json<LeadResponse>(
    {
      success: false,
      message: 'Method not allowed',
    },
    { status: 405, headers: corsHeaders }
  );
}
