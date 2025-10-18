import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Paddle webhook signature verification
function verifyPaddleWebhook(body: string, signature: string, publicKey: string): boolean {
  try {
    const verify = crypto.createVerify("sha1")
    verify.update(body)
    return verify.verify(publicKey, signature, "base64")
  } catch (error) {
    console.error("[v0] Webhook verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("paddle-signature")

    // Verify webhook signature (in production, use your actual public key)
    const publicKey = process.env.PADDLE_PUBLIC_KEY || ""
    if (publicKey && signature && !verifyPaddleWebhook(body, signature, publicKey)) {
      console.error("[v0] Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(body)
    console.log("[v0] Paddle webhook received:", data.alert_name)

    // Handle different webhook events
    switch (data.alert_name) {
      case "payment_succeeded":
        console.log("[v0] Payment succeeded:", {
          orderId: data.order_id,
          email: data.email,
          amount: data.sale_gross,
          currency: data.currency,
          productId: data.product_id,
        })
        // TODO: Update order status, send confirmation email, etc.
        break

      case "payment_failed":
        console.log("[v0] Payment failed:", {
          orderId: data.order_id,
          email: data.email,
          reason: data.reason,
        })
        // TODO: Handle failed payment
        break

      case "subscription_created":
        console.log("[v0] Subscription created:", {
          subscriptionId: data.subscription_id,
          email: data.email,
          planId: data.subscription_plan_id,
        })
        // TODO: Handle subscription creation
        break

      case "subscription_cancelled":
        console.log("[v0] Subscription cancelled:", {
          subscriptionId: data.subscription_id,
          email: data.email,
        })
        // TODO: Handle subscription cancellation
        break

      default:
        console.log("[v0] Unhandled webhook event:", data.alert_name)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Paddle webhook endpoint" })
}
