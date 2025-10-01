import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createProtectedRoute, rateLimitConfigs } from "@/lib/validation/middleware"
import { quoteRequestSchema, type QuoteRequestData } from "@/lib/validation/schemas"
import { sanitizeObject, sanitizationPresets } from "@/lib/validation/sanitization"

const sendSlackNotification = async (payload: unknown) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.warn("[quotes/quick] Failed to notify Slack", error)
  }
}

async function handleQuoteRequest(
  request: NextRequest,
  data: QuoteRequestData
): Promise<NextResponse> {
  // Sanitize the input data
  const sanitizedData = sanitizeObject(data, sanitizationPresets.quoteRequest);

  const quoteNumber = `Q-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const receivedAt = new Date().toISOString()

  const slackPayload = {
    text: `📩 New quote request from ${sanitizedData.customer.name}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Quote Request*\n• *Customer:* ${sanitizedData.customer.name}\n• *Email:* ${sanitizedData.customer.email}\n• *Phone:* ${sanitizedData.customer.phone || "n/a"}\n• *Province:* ${sanitizedData.customer.province || "n/a"}\n• *Product:* ${sanitizedData.product.name}\n• *Category:* ${sanitizedData.product.category}\n• *Price:* ${
            typeof sanitizedData.product.price === "number" ? `$${sanitizedData.product.price.toFixed(2)} CAD` : "n/a"
          }\n• *Options:* ${
            sanitizedData.product.selectedOptions && Object.keys(sanitizedData.product.selectedOptions).length > 0
              ? Object.entries(sanitizedData.product.selectedOptions)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")
              : "none"
          }\n• *Notes:* ${sanitizedData.notes || "n/a"}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Quote number: ${quoteNumber}`,
          },
          {
            type: "mrkdwn",
            text: `Received at: ${receivedAt}`,
          },
        ],
      },
    ],
  }

  await sendSlackNotification(slackPayload)

  const supabase = createClient()

  // Use parameterized query approach through Supabase client
  const record = {
    quote_number: quoteNumber,
    received_at: receivedAt,
    product_name: sanitizedData.product.name,
    product_category: sanitizedData.product.category,
    product_price: sanitizedData.product.price || null,
    product_options: sanitizedData.product.selectedOptions || null,
    customer_name: sanitizedData.customer.name,
    customer_email: sanitizedData.customer.email,
    customer_phone: sanitizedData.customer.phone || null,
    customer_province: sanitizedData.customer.province || null,
    notes: sanitizedData.notes || null,
    metadata: {
      userAgent: request.headers.get("user-agent")?.substring(0, 200),
      referer: request.headers.get("referer") || request.headers.get("origin"),
      ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown",
    },
  }

  const { error: supabaseError } = await supabase.from("quote_requests").insert(record)

  if (supabaseError) {
    console.warn("[quotes/quick] Failed to persist quote request", supabaseError)
    throw new Error("Database error")
  }

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
export const POST = createProtectedRoute(
  quoteRequestSchema,
  handleQuoteRequest,
  {
    rateLimit: rateLimitConfigs.standard,
    logRequests: true,
  }
)
