import { sendQuoteEmails } from '@/lib/email/send-quote-email'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

interface BasketItem {
  productId: string
  slug: string
  name: string
  category: string
  price: number
  quantity: number
  variantId?: string
  variantName?: string
  notes?: string
}

interface BasketQuoteRequest {
  name: string
  email: string
  phone?: string
  projectType?: string
  roomDimensions?: string
  preferredTimeline?: string
  additionalDetails?: string
  items: BasketItem[]
}

// Basic validation schema
function validateBasketQuoteRequest(data: unknown): data is BasketQuoteRequest {
  const req = data as Partial<BasketQuoteRequest>
  return (
    typeof req === 'object' &&
    req !== null &&
    typeof req.name === 'string' &&
    req.name.trim().length > 0 &&
    typeof req.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.email) &&
    Array.isArray(req.items) &&
    req.items.length > 0
  )
}

const sendSlackNotification = async (payload: {
  quoteNumber: string
  receivedAt: string
  customer: { name: string; email: string; phone?: string }
  items: BasketItem[]
  total: number
  details?: string
}) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const { quoteNumber, receivedAt, customer, items, total } = payload

  const itemsList = items
    .map(
      item =>
        `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}${item.variantName ? ` - ${item.variantName}` : ''}${item.notes ? ` [Note: ${item.notes}]` : ''}`
    )
    .join('\n')

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `📋 New basket quote request from ${customer.name}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New Basket Quote Request*\n• *Name:* ${customer.name}\n• *Email:* ${customer.email}\n• *Phone:* ${customer.phone || 'n/a'}\n• *Items:* ${items.length}\n• *Total:* $${total.toFixed(2)} CAD`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Quote Items:*\n${itemsList}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Quote: ${quoteNumber} | Received: ${receivedAt}`,
              },
            ],
          },
        ],
      }),
    })
  } catch (error) {
    console.warn('[quotes/basket] Failed to notify Slack', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!validateBasketQuoteRequest(body)) {
      return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 })
    }

    const {
      name,
      email,
      phone,
      projectType,
      roomDimensions,
      preferredTimeline,
      additionalDetails,
      items,
    } = body

    // Sanitize inputs
    const sanitizeString = (str: string | undefined) => str?.trim().substring(0, 1000)

    const quoteNumber = `QB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const receivedAt = new Date().toISOString()
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Send Slack notification
    await sendSlackNotification({
      quoteNumber,
      receivedAt,
      customer: {
        name: sanitizeString(name),
        email: sanitizeString(email),
        phone: sanitizeString(phone),
      },
      items,
      total,
      details: sanitizeString(additionalDetails),
    })

    // Save to database
    const supabase = await createClient()

    const record = {
      quote_number: quoteNumber,
      received_at: receivedAt,
      product_name: `${items.length} items - ${items.map(i => i.name).join(', ')}`.substring(
        0,
        500
      ),
      product_category: projectType || 'Mixed',
      product_price: total,
      product_options: {
        items: items.map(item => ({
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          variantId: item.variantId,
          variantName: item.variantName,
          notes: item.notes,
        })),
        roomDimensions: sanitizeString(roomDimensions),
        timeline: sanitizeString(preferredTimeline),
      },
      customer_name: sanitizeString(name),
      customer_email: sanitizeString(email),
      customer_phone: sanitizeString(phone),
      customer_province: null,
      notes: sanitizeString(additionalDetails),
      metadata: {
        userAgent: request.headers.get('user-agent')?.substring(0, 200),
        referer: request.headers.get('referer') || request.headers.get('origin'),
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      },
    }

    const { error: supabaseError } = await supabase.from('quote_requests').insert(record)

    if (supabaseError) {
      console.warn('[quotes/basket] Failed to persist quote request', supabaseError)
    }

    // Send email notifications (don't block response)
    sendQuoteEmails({
      customer: {
        name: sanitizeString(name),
        email: sanitizeString(email),
        phone: sanitizeString(phone),
        province: null,
      },
      quote: {
        quoteNumber,
        receivedAt,
      },
      product: {
        name: `${items.length} items`,
        category: projectType || 'Mixed',
        price: total,
        selectedOptions: {
          items: items.map(i => `${i.name} x${i.quantity}`).join(', '),
        },
      },
      notes: sanitizeString(additionalDetails),
    }).catch(error => {
      console.error('[quotes/basket] Failed to send email notifications:', error)
    })

    return NextResponse.json({
      success: true,
      quoteNumber,
      receivedAt,
      itemCount: items.length,
      total,
    })
  } catch (error) {
    console.error('[quotes/basket] Error processing request:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
