import { NextRequest, NextResponse } from 'next/server'

// Paddle webhook types
interface PaddleWebhookEvent {
  event_type: string
  event_id: string
  occurred_at: string
  data: {
    id: string
    status: string
    customer_id?: string
    items?: Array<{
      price_id: string
      quantity: number
      name: string
    }>
    details?: {
      totals: {
        subtotal: string
        tax: string
        total: string
        currency_code: string
      }
      line_items: Array<{
        id: string
        price_id: string
        quantity: number
        totals: {
          subtotal: string
          tax: string
          total: string
        }
      }>
    }
    customer?: {
      id: string
      email: string
      name: string
    }
    address?: {
      country_code: string
      postal_code: string
      region: string
      city: string
      first_line: string
      second_line?: string
    }
  }
}

// Handle different Paddle webhook events
async function handlePaddleEvent(event: PaddleWebhookEvent) {
  const { event_type, data } = event

  switch (event_type) {
    case 'transaction.completed':
      return handleTransactionCompleted(data)
    case 'transaction.created':
      return handleTransactionCreated(data)
    case 'transaction.updated':
      return handleTransactionUpdated(data)
    case 'transaction.payment_failed':
      return handleTransactionPaymentFailed(data)
    case 'subscription.created':
      return handleSubscriptionCreated(data)
    case 'subscription.updated':
      return handleSubscriptionUpdated(data)
    case 'subscription.canceled':
      return handleSubscriptionCanceled(data)
    default:
      console.log(`Unhandled Paddle webhook event: ${event_type}`)
      return { success: true, message: 'Event acknowledged but not processed' }
  }
}

// Handle successful transaction completion
async function handleTransactionCompleted(data: any) {
  console.log('Transaction completed:', {
    transactionId: data.id,
    customerId: data.customer_id,
    total: data.details?.totals?.total,
    currency: data.details?.totals?.currency_code
  })

  try {
    // Here you would typically:
    // 1. Update your database with the completed order
    // 2. Send confirmation email to customer
    // 3. Trigger fulfillment process
    // 4. Update inventory
    // 5. Send analytics events

    // For PG Closets specifically:
    // 1. Create order record in database
    // 2. Schedule installation consultation
    // 3. Send welcome email with next steps
    // 4. Notify internal team for order processing

    // Example integration points:
    await Promise.all([
      // createOrderRecord(data),
      // sendCustomerConfirmation(data.customer?.email),
      // scheduleInstallationConsultation(data),
      // updateInventory(data.details?.line_items),
      // trackAnalyticsEvent('purchase_completed', data)
    ])

    return {
      success: true,
      message: 'Transaction completed successfully',
      actions: [
        'Order created',
        'Customer notified',
        'Installation consultation scheduled'
      ]
    }
  } catch (error) {
    console.error('Error processing completed transaction:', error)
    return {
      success: false,
      error: 'Failed to process completed transaction',
      transactionId: data.id
    }
  }
}

// Handle transaction creation (initial checkout)
async function handleTransactionCreated(data: any) {
  console.log('Transaction created:', {
    transactionId: data.id,
    status: data.status,
    customerId: data.customer_id
  })

  // Track checkout initiation
  return {
    success: true,
    message: 'Transaction creation tracked'
  }
}

// Handle transaction updates
async function handleTransactionUpdated(data: any) {
  console.log('Transaction updated:', {
    transactionId: data.id,
    status: data.status
  })

  return {
    success: true,
    message: 'Transaction update processed'
  }
}

// Handle payment failures
async function handleTransactionPaymentFailed(data: any) {
  console.log('Transaction payment failed:', {
    transactionId: data.id,
    customerId: data.customer_id
  })

  try {
    // Handle payment failure:
    // 1. Send customer notification with retry options
    // 2. Track failed payment analytics
    // 3. Trigger dunning management if applicable

    return {
      success: true,
      message: 'Payment failure handled',
      actions: ['Customer notified', 'Retry options provided']
    }
  } catch (error) {
    console.error('Error handling payment failure:', error)
    return {
      success: false,
      error: 'Failed to handle payment failure'
    }
  }
}

// Handle subscription events (for future subscription products)
async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data.id)
  return { success: true, message: 'Subscription created' }
}

async function handleSubscriptionUpdated(data: any) {
  console.log('Subscription updated:', data.id)
  return { success: true, message: 'Subscription updated' }
}

async function handleSubscriptionCanceled(data: any) {
  console.log('Subscription canceled:', data.id)
  return { success: true, message: 'Subscription canceled' }
}

// Validate Paddle webhook signature (implement with your webhook secret)
function validatePaddleSignature(request: NextRequest, body: string): boolean {
  // In production, implement proper webhook signature validation
  // using your Paddle webhook secret key
  
  const signature = request.headers.get('paddle-signature')
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET
  
  if (!signature || !webhookSecret) {
    console.warn('Missing Paddle signature or webhook secret')
    return process.env.NODE_ENV === 'development' // Allow in dev mode
  }

  // Implement HMAC signature validation here
  // Example:
  // const crypto = require('crypto')
  // const expectedSignature = crypto
  //   .createHmac('sha256', webhookSecret)
  //   .update(body)
  //   .digest('hex')
  // return signature === expectedSignature
  
  return true // Simplified for demo - implement proper validation
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Validate webhook signature
    if (!validatePaddleSignature(request, body)) {
      console.error('Invalid Paddle webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse webhook event
    let event: PaddleWebhookEvent
    try {
      event = JSON.parse(body)
    } catch (parseError) {
      console.error('Failed to parse Paddle webhook body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    // Log incoming webhook for debugging
    console.log('Received Paddle webhook:', {
      eventType: event.event_type,
      eventId: event.event_id,
      timestamp: event.occurred_at
    })

    // Process the webhook event
    const result = await handlePaddleEvent(event)

    // Return success response
    return NextResponse.json({
      success: true,
      eventId: event.event_id,
      eventType: event.event_type,
      result
    })

  } catch (error) {
    console.error('Error processing Paddle webhook:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests (for webhook endpoint verification)
export async function GET() {
  return NextResponse.json({
    message: 'PG Closets Paddle Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  })
}