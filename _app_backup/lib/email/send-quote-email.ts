// @ts-nocheck - Quote email service
import { Resend } from 'resend';

// Lazy initialize Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'PG Closets <noreply@pgclosets.com>';
const SALES_TEAM_EMAIL = process.env.SALES_TEAM_EMAIL || process.env.ADMIN_EMAIL || 'sales@pgclosets.com';

export interface QuoteEmailData {
  customer: {
    name: string;
    email: string;
    phone?: string;
    province?: string;
  };
  quote: {
    quoteNumber: string;
    receivedAt: string;
  };
  product?: {
    name: string;
    category: string;
    price?: number;
    selectedOptions?: Record<string, any>;
  };
  notes?: string;
}

/**
 * Send quote confirmation email to customer
 */
export async function sendQuoteConfirmationEmail(data: QuoteEmailData): Promise<boolean> {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('[QUOTE_EMAIL] Resend API key not configured. Email not sent.');
      // In development, just log the email details
      if (process.env.NODE_ENV !== 'production') {
        console.log('[QUOTE_EMAIL] Would send confirmation to:', data.customer.email);
        console.log('[QUOTE_EMAIL] Quote Number:', data.quote.quoteNumber);
      }
      return false;
    }

    const { customer, quote, product, notes } = data;

    // Build customer confirmation HTML email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Your quote request has been received</p>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 2px solid #e2e8f0; border-top: none;">
            <p style="font-size: 16px; color: #374151;">Hi ${customer.name},</p>
            <p style="font-size: 16px; color: #374151;">Thank you for your interest in PG Closets. We've received your quote request and our team will get back to you within 24-48 business hours.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Your Quote Details</h2>
              <p style="margin: 8px 0; color: #64748b;"><strong>Quote Number:</strong> <span style="font-family: monospace; color: #1e293b;">${quote.quoteNumber}</span></p>
              <p style="margin: 8px 0; color: #64748b;"><strong>Received:</strong> ${new Date(quote.receivedAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
              ${product?.name ? `<p style="margin: 8px 0; color: #64748b;"><strong>Product:</strong> ${product.name}</p>` : ''}
              ${product?.price ? `<p style="margin: 8px 0; color: #64748b;"><strong>Starting Price:</strong> $${product.price.toFixed(2)} CAD</p>` : ''}
            </div>

            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px; font-size: 16px; color: #1e40af;">What Happens Next?</h3>
              <ol style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px;">
                <li style="margin-bottom: 8px;">Our team reviews your requirements</li>
                <li style="margin-bottom: 8px;">We'll contact you within 24-48 hours</li>
                <li style="margin-bottom: 8px;">We'll prepare a detailed quote</li>
                <li>Schedule a consultation if needed</li>
              </ol>
            </div>

            <p style="font-size: 14px; color: #64748b; margin-top: 24px;">Questions? Contact us at <a href="mailto:sales@pgclosets.com" style="color: #2563eb;">sales@pgclosets.com</a> or call <a href="tel:+16135551234" style="color: #2563eb;">(613) 555-1234</a></p>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;">
            <p>PG Closets - Premium Custom Closet Solutions</p>
            <p>Ottawa, Ontario, Canada</p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const resend = getResendClient();
    if (!resend) {
      console.warn('[QUOTE_EMAIL] Resend client not available');
      return false;
    }

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customer.email,
      subject: `Quote Request Received - ${data.quote.quoteNumber}`,
      html: emailHtml,
      replyTo: SALES_TEAM_EMAIL,
    });

    if (result.error) {
      console.error('[QUOTE_EMAIL] Failed to send confirmation email:', result.error);
      return false;
    }

    console.log('[QUOTE_EMAIL] Confirmation email sent successfully:', {
      emailId: result.data?.id,
      to: data.customer.email,
      quoteNumber: data.quote.quoteNumber,
    });

    return true;
  } catch (error) {
    console.error('[QUOTE_EMAIL] Error sending confirmation email:', error);
    return false;
  }
}

/**
 * Send quote notification to sales team
 */
export async function sendQuoteNotificationToSales(data: QuoteEmailData): Promise<boolean> {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('[QUOTE_EMAIL] Resend API key not configured. Sales notification not sent.');
      return false;
    }

    const { customer, quote, product, notes } = data;

    // Build HTML email for sales team
    const salesEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; margin-bottom: 0;">
            <h1 style="margin: 0; font-size: 28px;">🎯 New Quote Request</h1>
            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Action required - Customer waiting for response</p>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 2px solid #e2e8f0; border-top: none;">
            <!-- Customer Information -->
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Customer Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${customer.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${customer.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${customer.email}</a>
                  </td>
                </tr>
                ${customer.phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Phone:</td>
                  <td style="padding: 8px 0;">
                    <a href="tel:${customer.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${customer.phone}</a>
                  </td>
                </tr>
                ` : ''}
                ${customer.province ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Province:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${customer.province}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Quote Information -->
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #8b5cf6;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Quote Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Quote Number:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-family: monospace; font-weight: 700;">${quote.quoteNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Received:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${new Date(quote.receivedAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}</td>
                </tr>
              </table>
            </div>

            ${product ? `
            <!-- Product Information -->
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #1e293b;">Product Interest</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Product:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${product.name}</td>
                </tr>
                ${product.category ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Category:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${product.category}</td>
                </tr>
                ` : ''}
                ${product.price && product.price > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Price:</td>
                  <td style="padding: 8px 0; color: #059669; font-size: 16px; font-weight: 700;">$${product.price.toFixed(2)} CAD</td>
                </tr>
                ` : ''}
                ${product.selectedOptions && Object.keys(product.selectedOptions).length > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Options:</td>
                  <td style="padding: 8px 0;">
                    <ul style="margin: 0; padding: 0; list-style: none;">
                      ${Object.entries(product.selectedOptions)
                        .map(([key, value]) => `<li style="color: #1e293b; font-size: 14px; padding: 4px 0;">• ${key}: ${value}</li>`)
                        .join('')}
                    </ul>
                  </td>
                </tr>
                ` : ''}
              </table>
            </div>
            ` : ''}

            ${notes ? `
            <!-- Customer Notes -->
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #92400e;">Customer Notes</h2>
              <p style="margin: 0; color: #78350f; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${notes}</p>
            </div>
            ` : ''}

            <!-- Action Items -->
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #1e3a8a;">Next Steps</h2>
              <ol style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                <li>Review customer requirements and product details</li>
                <li>Contact customer within 24-48 business hours</li>
                <li>Prepare detailed quote with pricing options</li>
                <li>Schedule consultation if needed</li>
              </ol>
            </div>

            <!-- Quick Actions -->
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${customer.email}?subject=Re: Quote Request ${quote.quoteNumber}"
                 style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 8px 8px;">
                Reply to Customer
              </a>
              ${customer.phone ? `
              <a href="tel:${customer.phone}"
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 8px 8px;">
                Call Customer
              </a>
              ` : ''}
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">PG Closets Sales Notification System</p>
            <p style="margin: 4px 0 0;">Quote Reference: ${quote.quoteNumber}</p>
          </div>
        </body>
      </html>
    `;

    // Send email to sales team
    const resend = getResendClient();
    if (!resend) {
      console.warn('[QUOTE_EMAIL] Resend client not available for sales notification');
      return false;
    }

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: SALES_TEAM_EMAIL,
      subject: `🎯 New Quote Request: ${customer.name} - ${product?.name || 'General Inquiry'}`,
      html: salesEmailHtml,
      replyTo: customer.email,
    });

    if (result.error) {
      console.error('[QUOTE_EMAIL] Failed to send sales notification:', result.error);
      return false;
    }

    console.log('[QUOTE_EMAIL] Sales notification sent successfully:', {
      emailId: result.data?.id,
      to: SALES_TEAM_EMAIL,
      quoteNumber: quote.quoteNumber,
    });

    return true;
  } catch (error) {
    console.error('[QUOTE_EMAIL] Error sending sales notification:', error);
    return false;
  }
}

/**
 * Send both customer confirmation and sales notification
 * This is the main function to call from the API route
 */
export async function sendQuoteEmails(data: QuoteEmailData): Promise<{
  customerEmailSent: boolean;
  salesEmailSent: boolean;
}> {
  // Send both emails in parallel
  const [customerEmailSent, salesEmailSent] = await Promise.all([
    sendQuoteConfirmationEmail(data),
    sendQuoteNotificationToSales(data),
  ]);

  return {
    customerEmailSent,
    salesEmailSent,
  };
}
