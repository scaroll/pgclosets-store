/**
 * Newsletter Subscription Backend
 *
 * Supports multiple providers:
 * - ConvertKit (recommended for e-commerce)
 * - Mailchimp
 * - Resend (for simple email lists)
 *
 * Setup Instructions:
 * 1. Choose your provider and sign up
 * 2. Add API key to .env.local
 * 3. Configure provider below
 */

// Newsletter provider configuration
const PROVIDER = process.env.NEWSLETTER_PROVIDER || 'resend'; // 'convertkit' | 'mailchimp' | 'resend'

interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

interface NewsletterResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Subscribe email to newsletter using ConvertKit
 */
async function subscribeConvertKit(data: NewsletterSubscription): Promise<NewsletterResponse> {
  const API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = process.env.CONVERTKIT_FORM_ID;

  if (!API_KEY || !FORM_ID) {
    return {
      success: false,
      error: 'ConvertKit not configured. Add CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID to .env.local'
    };
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: API_KEY,
        email: data.email,
        first_name: data.firstName,
        tags: ['website-signup']
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to subscribe'
      };
    }

    return {
      success: true,
      message: 'Successfully subscribed to newsletter'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Subscribe email to newsletter using Mailchimp
 */
async function subscribeMailchimp(data: NewsletterSubscription): Promise<NewsletterResponse> {
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., 'us1'

  if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
    return {
      success: false,
      error: 'Mailchimp not configured. Add MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, and MAILCHIMP_SERVER_PREFIX to .env.local'
    };
  }

  try {
    const response = await fetch(
      `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`
        },
        body: JSON.stringify({
          email_address: data.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: data.firstName || '',
            LNAME: data.lastName || ''
          },
          tags: ['Website Signup']
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      // Check if already subscribed
      if (result.title === 'Member Exists') {
        return {
          success: true,
          message: 'Email already subscribed'
        };
      }

      return {
        success: false,
        error: result.detail || 'Failed to subscribe'
      };
    }

    return {
      success: true,
      message: 'Successfully subscribed to newsletter'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Subscribe email to newsletter using Resend
 * (Simple email list - stores in Resend audiences)
 */
async function subscribeResend(data: NewsletterSubscription): Promise<NewsletterResponse> {
  const API_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!API_KEY) {
    return {
      success: false,
      error: 'Resend not configured. Add RESEND_API_KEY to .env.local'
    };
  }

  try {
    // If no audience ID, just send a notification email
    if (!AUDIENCE_ID) {
      const { default: resend } = await import('./resend');

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'PG Closets <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'info@pgclosets.ca',
        subject: 'New Newsletter Subscription',
        html: `
          <h2>New Newsletter Subscriber</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.firstName ? `<p><strong>Name:</strong> ${data.firstName} ${data.lastName || ''}</p>` : ''}
          <p><strong>Source:</strong> ${data.source || 'Website'}</p>
        `
      });

      return {
        success: true,
        message: 'Subscription received (add RESEND_AUDIENCE_ID for audience management)'
      };
    }

    // Add to Resend audience
    const response = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to subscribe'
      };
    }

    return {
      success: true,
      message: 'Successfully subscribed to newsletter'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Main newsletter subscription function
 * Routes to appropriate provider based on configuration
 */
export async function subscribeToNewsletter(
  data: NewsletterSubscription
): Promise<NewsletterResponse> {
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      error: 'Invalid email address'
    };
  }

  // Log subscription attempt
  console.log(`📧 Newsletter subscription attempt: ${data.email} (provider: ${PROVIDER})`);

  // Route to appropriate provider
  switch (PROVIDER) {
    case 'convertkit':
      return subscribeConvertKit(data);

    case 'mailchimp':
      return subscribeMailchimp(data);

    case 'resend':
      return subscribeResend(data);

    default:
      // Fallback: log to console
      console.log('⚠️ No newsletter provider configured. Subscription data:', data);
      return {
        success: false,
        error: 'Newsletter service not configured. Set NEWSLETTER_PROVIDER in .env.local'
      };
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<NewsletterResponse> {
  // Implementation depends on provider
  // For now, log the request
  console.log(`📧 Unsubscribe request: ${email}`);

  return {
    success: true,
    message: 'Unsubscribe request received'
  };
}
