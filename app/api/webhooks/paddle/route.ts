import crypto from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// Paddle webhook signature verification
function verifyPaddleWebhook(body: string, signature: string, publicKey: string): boolean {
  try {
    const verify = crypto.createVerify('sha1')
    verify.update(body)
    return verify.verify(publicKey, signature, 'base64')
  } catch (error) {
    console.error('[v0] Webhook verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('paddle-signature')

    // Verify webhook signature (in production, use your actual public key)
    const publicKey = process.env.PADDLE_PUBLIC_KEY || ''
    if (publicKey && signature && !verifyPaddleWebhook(body, signature, publicKey)) {
      console.error('[v0] Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    // Handle different webhook events
    switch (data.alert_name) {
      case 'payment_succeeded':
        // TODO: Update order status, send confirmation email, etc.
        break

      case 'payment_failed':
        // TODO: Handle failed payment
        break

      case 'subscription_created':
        // TODO: Handle subscription creation
        break

      case 'subscription_cancelled':
        // TODO: Handle subscription cancellation
        break

      default:
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Paddle webhook endpoint' })
}
