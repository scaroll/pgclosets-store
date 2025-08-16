import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Jobber webhook events we care about
type JobberEvent = 
  | 'work_request.created'
  | 'quote.sent' 
  | 'quote.approved'
  | 'job.completed'
  | 'client.created';

interface JobberWebhookPayload {
  event: JobberEvent;
  data: {
    id: string;
    client?: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    request?: {
      id: string;
      description: string;
      service_type: string;
      urgency: string;
      created_at: string;
    };
    quote?: {
      id: string;
      total: number;
      line_items: Array<{
        name: string;
        unit_price: number;
        quantity: number;
      }>;
    };
  };
}

// Verify webhook signature (you'll need to set this up in Jobber)
function verifyJobberWebhook(payload: string, signature: string | null): boolean {
  // In production, verify the webhook signature using your Jobber webhook secret
  // For now, we'll just check if we have a signature
  return signature !== null;
}

// Send server-side GA4 events via Measurement Protocol
async function trackServerEvent(eventName: string, parameters: Record<string, any>) {
  const measurementId = 'G-M01QFYXCDN'; // Your GA4 Measurement ID
  const apiSecret = process.env.GA4_API_SECRET; // Set this in your environment variables
  
  if (!apiSecret) {
    console.warn('GA4_API_SECRET not set, skipping server-side tracking');
    return;
  }

  try {
    const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: parameters.client_id || 'webhook-server',
        events: [{
          name: eventName,
          params: parameters
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`GA4 API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send GA4 event:', error);
  }
}

// Send Slack notification for new leads
async function sendSlackNotification(message: string, blocks?: any[]) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not set, skipping Slack notification');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
        blocks: blocks
      })
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
}

// Estimate lead value based on project details
function calculateEstimatedValue(data: JobberWebhookPayload['data']): number {
  let baseValue = 3000; // Base closet project value
  
  if (data.request?.service_type) {
    const serviceType = data.request.service_type.toLowerCase();
    const multipliers: Record<string, number> = {
      'walk-in': 1.8,
      'reach-in': 1.0,
      'custom': 2.2,
      'premium': 2.5,
      'kitchen': 1.5,
      'pantry': 1.3
    };
    
    for (const [type, multiplier] of Object.entries(multipliers)) {
      if (serviceType.includes(type)) {
        baseValue *= multiplier;
        break;
      }
    }
  }

  // Urgency multiplier
  if (data.request?.urgency === 'high') {
    baseValue *= 1.2;
  }

  return Math.round(baseValue);
}

async function handleNewQuoteRequest(data: JobberWebhookPayload['data']) {
  const estimatedValue = calculateEstimatedValue(data);
  
  // Track in GA4 via Measurement Protocol
  await trackServerEvent('quote_request_received', {
    client_id: data.client?.id || 'unknown',
    client_email: data.client?.email,
    request_id: data.request?.id,
    estimated_value: estimatedValue,
    project_type: data.request?.service_type,
    urgency: data.request?.urgency,
    source: 'jobber_webhook',
    currency: 'CAD',
    value: estimatedValue
  });

  // Send Slack notification for immediate follow-up
  await sendSlackNotification(
    `🎯 New Quote Request from ${data.client?.name || 'Unknown Client'}`,
    [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Lead Alert!*\n\n*Client:* ${data.client?.name || 'N/A'}\n*Email:* ${data.client?.email || 'N/A'}\n*Phone:* ${data.client?.phone || 'N/A'}\n*Project:* ${data.request?.description || 'N/A'}\n*Estimated Value:* $${estimatedValue.toLocaleString()} CAD`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View in Jobber' },
            url: `https://app.getjobber.com/requests/${data.request?.id}`,
            style: 'primary'
          },
          {
            type: 'button', 
            text: { type: 'plain_text', text: 'Call Client' },
            url: `tel:${data.client?.phone?.replace(/\D/g, '')}`
          }
        ]
      }
    ]
  );

  console.log('New quote request processed:', {
    client: data.client?.name,
    estimatedValue,
    requestId: data.request?.id
  });
}

async function handleQuoteSent(data: JobberWebhookPayload['data']) {
  await trackServerEvent('quote_sent', {
    client_id: data.client?.id || 'unknown',
    quote_id: data.quote?.id,
    quote_value: data.quote?.total || 0,
    currency: 'CAD',
    source: 'jobber_webhook'
  });

  console.log('Quote sent tracked:', {
    quoteId: data.quote?.id,
    value: data.quote?.total
  });
}

async function handleQuoteApproved(data: JobberWebhookPayload['data']) {
  // Track conversion in GA4
  await trackServerEvent('purchase', {
    transaction_id: data.quote?.id || 'unknown',
    value: data.quote?.total || 0,
    currency: 'CAD',
    items: data.quote?.line_items?.map((item) => ({
      item_name: item.name,
      price: item.unit_price,
      quantity: item.quantity
    })) || [],
    source: 'jobber_webhook'
  });

  // Send celebration Slack message
  await sendSlackNotification(
    `🎉 Quote Approved! ${data.client?.name} - $${data.quote?.total?.toLocaleString()} CAD`
  );

  console.log('Quote approval tracked:', {
    quoteId: data.quote?.id,
    value: data.quote?.total,
    client: data.client?.name
  });
}

async function handleJobCompleted(data: JobberWebhookPayload['data']) {
  await trackServerEvent('job_completed', {
    client_id: data.client?.id || 'unknown',
    job_value: data.quote?.total || 0,
    currency: 'CAD',
    source: 'jobber_webhook'
  });

  // Send completion notification
  await sendSlackNotification(
    `✅ Job Completed! ${data.client?.name} - Project finished successfully`
  );

  console.log('Job completion tracked:', {
    client: data.client?.name
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get headers
    const headersList = await headers();
    const signature = headersList.get('x-jobber-signature');
    
    // Parse request body
    const body = await request.text();
    const payload: JobberWebhookPayload = JSON.parse(body);

    // Verify webhook authenticity
    if (!verifyJobberWebhook(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Log received webhook
    console.log('Received Jobber webhook:', {
      event: payload.event,
      timestamp: new Date().toISOString()
    });

    // Handle different event types
    switch (payload.event) {
      case 'work_request.created':
        await handleNewQuoteRequest(payload.data);
        break;
      
      case 'quote.sent':
        await handleQuoteSent(payload.data);
        break;
      
      case 'quote.approved':
        await handleQuoteApproved(payload.data);
        break;
      
      case 'job.completed':
        await handleJobCompleted(payload.data);
        break;
      
      case 'client.created':
        // Track new client creation
        await trackServerEvent('client_created', {
          client_id: payload.data.client?.id || 'unknown',
          source: 'jobber_webhook'
        });
        break;
      
      default:
        console.log('Unhandled webhook event:', payload.event);
    }

    return NextResponse.json({ 
      received: true, 
      event: payload.event,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Jobber webhook error:', error);
    
    // Track webhook errors in GA4
    await trackServerEvent('webhook_error', {
      error_type: 'jobber_webhook_processing',
      error_message: (error as Error).message,
      source: 'jobber_webhook'
    });

    return NextResponse.json(
      { error: 'Webhook processing failed', details: (error as Error).message }, 
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  // Return challenge for webhook verification
  if (challenge) {
    return new Response(challenge, { status: 200 });
  }
  
  return NextResponse.json({ 
    status: 'Jobber webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}