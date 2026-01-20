import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, getClientIdentifier, generalRateLimiter } from '@/lib/rate-limit'
import { sendContactNotification, sendContactAutoResponse } from '@/lib/emails'

// Contact form validation schema
const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .email('Please provide a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Please select a subject'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
})

export type ContactFormData = z.infer<typeof contactSchema>

/**
 * Contact Form API Route
 *
 * POST /api/contact
 * Body: { name: string, email: string, phone?: string, subject: string, message: string }
 *
 * Returns: { success: boolean, message?: string, error?: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting: max 5 contact form submissions per IP per hour
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await checkRateLimit(identifier, generalRateLimiter)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many contact form submissions. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message)
      return NextResponse.json(
        {
          success: false,
          error: errors[0] || 'Invalid input data',
        },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = validationResult.data

    // Additional email validation to prevent email injection
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitizedData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
    }

    // Send email notification to admin (info@pgclosets.com)
    const adminEmailSent = await sendContactNotification({
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
    })

    // Send auto-response to customer
    const customerEmailSent = await sendContactAutoResponse({
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
    })

    // Log contact submission for monitoring (without PII)
    console.log(
      `[Contact] New contact form submission from IP: ${identifier}, subject: ${sanitizedData.subject}`
    )

    // Check if at least the admin notification was sent
    if (!adminEmailSent) {
      console.error('[Contact] Failed to send admin notification email')
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to process your message. Please try again later.',
        },
        {
          status: 500,
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
          },
        }
      )
    }

    if (!customerEmailSent) {
      // Log the failure but don't fail the entire request
      console.warn('[Contact] Failed to send customer auto-response email')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you within 24 hours.',
      },
      {
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining - 1),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        },
      }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your message. Please try again.',
      },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      }
    )
  }
}
