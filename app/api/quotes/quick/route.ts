import { sendQuoteEmails } from '@/lib/email/send-quote-email'
import { createClient } from '@/lib/supabase/server'
import { createProtectedRoute, rateLimitConfigs } from '@/lib/validation/middleware'
import { type QuoteRequestData, quoteRequestSchema } from '@/lib/validation/schemas'
import { type NextRequest, NextResponse } from 'next/server'

const sendSlackNotification = async (payload: unknown) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn('[quotes/quick] Failed to notify Slack', error)
  }
}

async function handleQuoteRequest(
  request: NextRequest,
  data: QuoteRequestData
): Promise<NextResponse> {
  // Basic sanitization - remove any potentially harmful characters
  const sanitizeString = (str: string | undefined) =>
    str ? str.trim().substring(0, 1000) : undefined

  const quoteNumber = `Q-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const receivedAt = new Date().toISOString()

  const slackPayload = {
    text: `📩 New quote request from ${sanitizeString(data.name)}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Quote Request*\n• *Name:* ${sanitizeString(data.name)}\n• *Email:* ${sanitizeString(data.email)}\n• *Phone:* ${sanitizeString(data.phone) || 'n/a'}\n• *Project Type:* ${sanitizeString(data.projectType) || 'n/a'}\n• *Room Dimensions:* ${sanitizeString(data.roomDimensions) || 'n/a'}\n• *Timeline:* ${sanitizeString(data.timeline) || 'n/a'}\n• *Product Interest:* ${sanitizeString(data.productInterest) || sanitizeString(data.product?.name) || 'n/a'}\n• *Product Price:* ${
            data.product?.price ? `$${data.product.price.toFixed(2)} CAD` : 'n/a'
          }\n• *Selected Options:* ${
            data.selectedOptions && Object.keys(data.selectedOptions).length > 0
              ? Object.entries(data.selectedOptions)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')
              : 'none'
          }\n• *Additional Details:* ${sanitizeString(data.additionalDetails) || 'n/a'}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Quote number: ${quoteNumber}`,
          },
          {
            type: 'mrkdwn',
            text: `Received at: ${receivedAt}`,
          },
        ],
      },
    ],
  }

  await sendSlackNotification(slackPayload)

  const supabase = await createClient()

  // Use parameterized query approach through Supabase client
  const record = {
    quote_number: quoteNumber,
    received_at: receivedAt,
    product_name:
      sanitizeString(data.productInterest) || sanitizeString(data.product?.name) || null,
    product_category: sanitizeString(data.projectType) || null,
    product_price: data.product?.price || null,
    product_options: data.selectedOptions || null,
    customer_name: sanitizeString(data.name),
    customer_email: sanitizeString(data.email),
    customer_phone: sanitizeString(data.phone) || null,
    customer_province: null, // Not provided in new form
    notes: sanitizeString(data.additionalDetails) || null,
    metadata: {
      userAgent: request.headers.get('user-agent')?.substring(0, 200),
      referer: request.headers.get('referer') || request.headers.get('origin'),
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      roomDimensions: sanitizeString(data.roomDimensions),
      timeline: sanitizeString(data.timeline),
    },
  }

  const { error: supabaseError } = await supabase.from('quote_requests').insert(record)

  if (supabaseError) {
    console.warn('[quotes/quick] Failed to persist quote request', supabaseError)
    throw new Error('Database error')
  }

  // Send email notifications (customer confirmation + sales notification)
  // Don't block the response on email sending - run in background
  sendQuoteEmails({
    customer: {
      name: sanitizeString(data.name) || 'Customer',
      email: sanitizeString(data.email) || '',
      phone: sanitizeString(data.phone),
      province: null, // Not available in current form
    },
    quote: {
      quoteNumber,
      receivedAt,
    },
    product:
      data.product || data.productInterest
        ? {
            name:
              sanitizeString(data.productInterest) ||
              sanitizeString(data.product?.name) ||
              'Custom Quote',
            category: sanitizeString(data.projectType) || 'General',
            price: data.product?.price,
            selectedOptions: data.selectedOptions,
          }
        : undefined,
    notes: sanitizeString(data.additionalDetails),
  })
    .then(({ customerEmailSent: _customerEmailSent, salesEmailSent: _salesEmailSent }) => {})
    .catch(error => {
      console.error('[quotes/quick] Failed to send email notifications:', error)
      // Don't fail the request if emails fail
    })

  return NextResponse.json({
    success: true,
    quote: {
      quoteNumber,
      receivedAt,
      persisted: true,
    },
  })
}

// Create protected route with validation and rate limiting
export const POST = createProtectedRoute(quoteRequestSchema, handleQuoteRequest, {
  rateLimit: rateLimitConfigs.default,
})
