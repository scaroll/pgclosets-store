import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface QuoteRequestBody {
  product?: {
    name?: string
    category?: string
    price?: number
    selectedOptions?: Record<string, string>
  }
  customer?: {
    name?: string
    email?: string
    phone?: string
    province?: string
  }
  notes?: string
}

const REQUIRED_PRODUCT_FIELDS: Array<keyof NonNullable<QuoteRequestBody["product"]>> = [
  "name",
  "category",
]

const REQUIRED_CUSTOMER_FIELDS: Array<keyof NonNullable<QuoteRequestBody["customer"]>> = [
  "name",
  "email",
]

const buildMissingFields = (body: QuoteRequestBody) => {
  const missing: string[] = []

  if (!body.product) {
    missing.push("product")
  } else {
    for (const field of REQUIRED_PRODUCT_FIELDS) {
      if (!body.product?.[field]) {
        missing.push(`product.${field}`)
      }
    }
  }

  if (!body.customer) {
    missing.push("customer")
  } else {
    for (const field of REQUIRED_CUSTOMER_FIELDS) {
      if (!body.customer?.[field]) {
        missing.push(`customer.${field}`)
      }
    }
  }

  return missing
}

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequestBody
    const missingFields = buildMissingFields(body)

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const quoteNumber = `Q-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const receivedAt = new Date().toISOString()

    const slackPayload = {
      text: `📩 New quote request from ${body.customer?.name ?? "Unknown customer"}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New Quote Request*\n• *Customer:* ${body.customer?.name}\n• *Email:* ${body.customer?.email}\n• *Phone:* ${body.customer?.phone || "n/a"}\n• *Province:* ${body.customer?.province || "n/a"}\n• *Product:* ${body.product?.name}\n• *Category:* ${body.product?.category}\n• *Price:* ${
              typeof body.product?.price === "number" ? `$${body.product.price.toFixed(2)} CAD` : "n/a"
            }\n• *Options:* ${
              body.product?.selectedOptions && Object.keys(body.product.selectedOptions).length > 0
                ? Object.entries(body.product.selectedOptions)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
                : "none"
            }\n• *Notes:* ${body.notes?.trim() || "n/a"}`,
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
    const record = {
      quote_number: quoteNumber,
      received_at: receivedAt,
      product_name: body.product?.name ?? null,
      product_category: body.product?.category ?? null,
      product_price: typeof body.product?.price === "number" ? body.product.price : null,
      product_options: body.product?.selectedOptions ?? null,
      customer_name: body.customer?.name ?? null,
      customer_email: body.customer?.email ?? null,
      customer_phone: body.customer?.phone ?? null,
      customer_province: body.customer?.province ?? null,
      notes: body.notes ?? null,
      metadata: {
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer") ?? request.headers.get("origin"),
      },
    }

    const { error: supabaseError } = await supabase.from("quote_requests").insert(record)

    if (supabaseError) {
      console.warn("[quotes/quick] Failed to persist quote request", supabaseError)
    }

    return NextResponse.json({
      success: true,
      quote: {
        quoteNumber,
        receivedAt,
        persisted: !supabaseError,
      },
    })
  } catch (error) {
    console.error("[quotes/quick] Failed to process quote request", error)
    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit quote request. Please try again shortly.",
      },
      { status: 500 },
    )
  }
}
