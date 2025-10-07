/**
 * Lead Notification Email System
 * Sends professional email notifications for new lead submissions
 */

import { Resend } from 'resend';

// Lazy initialize Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

// Business configuration
const BUSINESS_CONFIG = {
  email: process.env.BUSINESS_EMAIL || 'info@pgclosets.com',
  name: 'PG Closets',
  address: process.env.BUSINESS_ADDRESS || '123 Main St, Ottawa, ON K1A 0A6',
  timezone: process.env.BUSINESS_TIMEZONE || 'America/Toronto',
};

interface LeadNotificationData {
  leadId: string;
  name: string;
  email: string;
  location: string;
  serviceType: 'measure' | 'quote' | 'general';
  productInterest?: string;
  message?: string;
  preferredContact: 'email';
  consent: boolean;
  submittedAt: string;
  ipAddress: string;
}

/**
 * Format service type for display
 */
function formatServiceType(serviceType: string): string {
  const types: Record<string, string> = {
    measure: 'In-Home Measurement',
    quote: 'Free Quote Request',
    general: 'General Inquiry',
  };
  return types[serviceType] || serviceType;
}

/**
 * Format date/time in Canadian Eastern Time
 */
function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: BUSINESS_CONFIG.timezone,
  }).format(date);
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(data: LeadNotificationData): string {
  const {
    leadId,
    name,
    email,
    location,
    serviceType,
    productInterest,
    message,
    submittedAt,
    ipAddress,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Submission - PG Closets</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #1B4A9C; color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🎯 New Lead Submission</h1>
              <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">PG Closets - Ottawa's Premier Door Solutions</p>
            </td>
          </tr>

          <!-- Service Type Badge -->
          <tr>
            <td style="padding: 20px 30px 10px;">
              <div style="display: inline-block; background-color: #9BC4E2; color: #1B4A9C; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ${formatServiceType(serviceType)}
              </div>
            </td>
          </tr>

          <!-- Customer Information -->
          <tr>
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0 0 20px; font-size: 18px; color: #1B4A9C; border-bottom: 2px solid #9BC4E2; padding-bottom: 10px;">
                Customer Information
              </h2>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;">
                    <strong>Name:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong>Email:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #1B4A9C; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">
                    <strong>Location:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;">
                    ${location}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${productInterest ? `
          <!-- Product Interest -->
          <tr>
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0 0 15px; font-size: 18px; color: #1B4A9C; border-bottom: 2px solid #9BC4E2; padding-bottom: 10px;">
                Product Interest
              </h2>
              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
                ${productInterest}
              </p>
            </td>
          </tr>
          ` : ''}

          ${message ? `
          <!-- Message -->
          <tr>
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0 0 15px; font-size: 18px; color: #1B4A9C; border-bottom: 2px solid #9BC4E2; padding-bottom: 10px;">
                Additional Message
              </h2>
              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; background-color: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">
                ${message}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Action Required -->
          <tr>
            <td style="padding: 20px 30px; background-color: #FFF9E6; border-left: 4px solid #FFC107;">
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                <strong style="color: #333;">⚡ Action Required:</strong><br>
                Please respond to this lead within 1 business hour for best conversion rates.
                Send a personalized email to ${email}.
              </p>
            </td>
          </tr>

          <!-- Metadata -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
                <strong>Lead ID:</strong> ${leadId}<br>
                <strong>Submitted:</strong> ${formatDateTime(submittedAt)}<br>
                <strong>IP Address:</strong> ${ipAddress}<br>
                <strong>CASL Consent:</strong> ✅ Provided
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                <strong>PG Closets</strong><br>
                ${BUSINESS_CONFIG.address}
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                📧 ${BUSINESS_CONFIG.email}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email template
 */
function generateEmailText(data: LeadNotificationData): string {
  const {
    leadId,
    name,
    email,
    location,
    serviceType,
    productInterest,
    message,
    submittedAt,
    ipAddress,
  } = data;

  return `
NEW LEAD SUBMISSION - PG CLOSETS
${formatServiceType(serviceType)}

=====================================

CUSTOMER INFORMATION:
-------------------------------------
Name:              ${name}
Email:             ${email}
Location:          ${location}

${productInterest ? `
PRODUCT INTEREST:
-------------------------------------
${productInterest}
` : ''}

${message ? `
MESSAGE:
-------------------------------------
${message}
` : ''}

ACTION REQUIRED:
-------------------------------------
Please respond within 1 business hour.
Send a personalized email to ${email}.

METADATA:
-------------------------------------
Lead ID:      ${leadId}
Submitted:    ${formatDateTime(submittedAt)}
IP Address:   ${ipAddress}
CASL Consent: Provided

=====================================

PG Closets
${BUSINESS_CONFIG.address}
${BUSINESS_CONFIG.email}
  `.trim();
}

/**
 * Send lead notification email
 *
 * @param data - Lead notification data
 * @throws Error if email sending fails and RESEND_API_KEY is configured
 */
export async function sendLeadNotification(data: LeadNotificationData): Promise<void> {
  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      '[Email] RESEND_API_KEY not configured. Email notification skipped.',
      { leadId: data.leadId }
    );
    return;
  }

  const recipientEmail = process.env.BUSINESS_EMAIL || BUSINESS_CONFIG.email;
  const fromEmail = process.env.EMAIL_FROM || 'leads@pgclosets.com';

  try {
    const client = getResendClient();
    const result = await client.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: data.email,
      subject: `🎯 New ${formatServiceType(data.serviceType)} - ${data.name} (${data.location})`,
      html: generateEmailHTML(data),
      text: generateEmailText(data),
      tags: [
        { name: 'type', value: 'lead-notification' },
        { name: 'service', value: data.serviceType },
        { name: 'location', value: data.location },
      ],
    });

    console.log('[Email] Lead notification sent successfully:', {
      leadId: data.leadId,
      emailId: result.data?.id,
      recipient: recipientEmail,
    });
  } catch (error) {
    console.error('[Email] Failed to send lead notification:', {
      leadId: data.leadId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to send email notification');
  }
}

/**
 * Send test email (for development/testing)
 */
export async function sendTestLeadNotification(toEmail: string): Promise<void> {
  const testData: LeadNotificationData = {
    leadId: 'test-' + Date.now(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'Ottawa, ON',
    serviceType: 'quote',
    productInterest: 'Bypass closet doors for master bedroom',
    message: 'Looking to upgrade our closet doors. Interested in getting a quote.',
    preferredContact: 'email',
    consent: true,
    submittedAt: new Date().toISOString(),
    ipAddress: '192.0.2.1',
  };

  const client = getResendClient();
  await client.emails.send({
    from: process.env.EMAIL_FROM || 'leads@pgclosets.com',
    to: toEmail,
    subject: '🧪 TEST - New Lead Notification',
    html: generateEmailHTML(testData),
    text: generateEmailText(testData),
  });

  console.log('[Email] Test notification sent to:', toEmail);
}
