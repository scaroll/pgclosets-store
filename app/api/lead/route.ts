import { sendLeadNotification } from '@/lib/email/lead-notification'
import { env } from '@/lib/env-validation'
import { checkRateLimit, generalRateLimiter, getClientIdentifier } from '@/lib/rate-limit'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

export const maxDuration = 30

// Type definitions
type DoorType = 'sliding' | 'bypass' | 'bifold' | 'pivot' | 'barn' | 'mirror'
type ServiceType = 'measure' | 'quote' | 'general'
type PreferredContact = 'email' | 'phone'

interface DoorSelection {
  series: string
  doorType: DoorType
  openingWidthIn: number
  openingHeightIn: number
  panelCount: number
  finish: string
  hardware: string
  softClose: boolean
  handles: string
  quantity: number
  notes?: string
  productUrl?: string
  images?: string[]
}

interface LeadNotificationData {
  leadId: string
  name: string
  email: string
  phone: string
  location: string
  serviceType: ServiceType
  preferredContact: PreferredContact
  consent: boolean
  submittedAt: string
  ipAddress: string
  productInterest?: string
  message?: string
  doorSelection?: {
    series: string
    doorType: DoorType
    openingWidthIn: number
    openingHeightIn: number
    panelCount: number
    finish: string
    hardware: string
    softClose: boolean
    handles: string
    quantity: number
    notes?: string
    productUrl?: string
    images?: string[]
  }
}

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
}) as z.ZodType<DoorSelection>

// Zod validation schema matching LeadFormData type
const leadSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email('Please provide a valid email address'),
    phone: z
      .string()
      .regex(
        /^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
        'Please provide a valid phone number (e.g., 613-701-6393)'
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
    consent: z.boolean().refine(val => val === true, {
      message: 'You must consent to be contacted to submit this form',
    }),
    doorSelection: doorSelectionSchema.optional(),
  })
  .refine(
    data => {
      // Require doorSelection when serviceType is 'quote'
      if (data.serviceType === 'quote' && !data.doorSelection) {
        return false
      }
      return true
    },
    {
      message: 'Door selection is required for quote requests',
      path: ['doorSelection'],
    }
  )

// Response type
interface LeadResponse {
  success: boolean
  message: string
  leadId?: string
}

// CORS headers configuration - more restrictive for security
const getCorsHeaders = (origin?: string) => {
  const allowedOrigins = [
    env.NEXT_PUBLIC_SITE_URL,
    'https://pgclosets.ca',
    'https://www.pgclosets.ca',
  ].filter(Boolean)

  const isAllowedOrigin = origin && allowedOrigins.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-csrf-token, x-requested-with',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin || undefined)

  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        ...corsHeaders,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    }
  )
}

/**
 * POST handler for lead submission
 * Rate limited to 3 requests per IP per hour
 */
export async function POST(request: NextRequest): Promise<NextResponse<LeadResponse>> {
  try {
    // Get origin for CORS
    const origin = request.headers.get('origin')
    const corsHeaders = getCorsHeaders(origin || undefined)

    // Reject requests from unauthorized origins
    if (origin && corsHeaders['Access-Control-Allow-Origin'] === 'null') {
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: 'Cross-origin requests not allowed',
        },
        {
          status: 403,
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
          },
        }
      )
    }

    // Extract IP address for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Rate limiting: max 3 requests per IP per hour
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await checkRateLimit(identifier, generalRateLimiter)

    if (!rateLimitResult.allowed) {
      console.warn(`[Lead API] Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: `Too many requests. Please try again later.`,
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': '3600',
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch (error) {
      console.error('[Lead API] Invalid JSON:', error)
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: 'Invalid request format. Please check your data and try again.',
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate request body
    const validationResult = leadSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message)
      console.warn('[Lead API] Validation failed:', errors)
      return NextResponse.json<LeadResponse>(
        {
          success: false,
          message: errors[0] || 'Invalid form data. Please check your inputs.',
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const leadData = validationResult.data

    // Generate unique lead ID
    const leadId = uuidv4()

    // Send email notification
    try {
      const notificationData: LeadNotificationData = {
        leadId,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        location: leadData.location,
        serviceType: leadData.serviceType,
        preferredContact: leadData.preferredContact,
        consent: leadData.consent,
        submittedAt: new Date().toISOString(),
        ipAddress: ip,
      }

      if (leadData.productInterest) {
        notificationData.productInterest = leadData.productInterest
      }
      if (leadData.message) {
        notificationData.message = leadData.message
      }
      if (leadData.doorSelection) {
        const doorSelection: LeadNotificationData['doorSelection'] = {
          series: leadData.doorSelection.series,
          doorType: leadData.doorSelection.doorType,
          openingWidthIn: leadData.doorSelection.openingWidthIn,
          openingHeightIn: leadData.doorSelection.openingHeightIn,
          panelCount: leadData.doorSelection.panelCount,
          finish: leadData.doorSelection.finish,
          hardware: leadData.doorSelection.hardware,
          softClose: leadData.doorSelection.softClose,
          handles: leadData.doorSelection.handles,
          quantity: leadData.doorSelection.quantity,
        }
        if (leadData.doorSelection.notes) {
          doorSelection.notes = leadData.doorSelection.notes
        }
        if (leadData.doorSelection.productUrl) {
          doorSelection.productUrl = leadData.doorSelection.productUrl
        }
        if (leadData.doorSelection.images) {
          doorSelection.images = leadData.doorSelection.images
        }
        notificationData.doorSelection = doorSelection
      }

      await sendLeadNotification(notificationData)
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('[Lead API] Email notification failed:', emailError)
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
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        },
      }
    )
  } catch (error) {
    // Unexpected error handling
    console.error('[Lead API] Unexpected error:', error)
    const origin = request.headers.get('origin')
    const corsHeaders = getCorsHeaders(origin || undefined)

    return NextResponse.json<LeadResponse>(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later or contact us directly.',
      },
      { status: 500, headers: corsHeaders }
    )
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
    { status: 405 }
  )
}
