/**
 * Resend Email Integration
 *
 * Setup Instructions:
 * 1. Sign up at https://resend.com
 * 2. Get your API key from dashboard
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxxxxxxxxxx
 * 4. Add verified domain or use onboarding@resend.dev for testing
 */

import { Resend } from 'resend';
import { env, services } from '../env-validation';

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY);

// Email configuration from validated environment
const EMAIL_CONFIG = {
  from: env.EMAIL_FROM || 'PG Closets <onboarding@resend.dev>',
  replyTo: env.EMAIL_REPLY_TO || 'info@pgclosets.ca',

  // Recipients for contact form submissions
  contactRecipients: [
    env.CONTACT_EMAIL || 'info@pgclosets.ca'
  ]
};

interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

/**
 * Send contact form submission email
 */
export async function sendContactEmail(data: ContactEmailData) {
  // Check if email service is available
  if (!services.hasEmail()) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
    console.log('Contact form data:', data);
    return {
      success: false,
      error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.'
    };
  }

  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: var(--color-primary); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: var(--color-primary); }
            .value { margin-top: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the PG Closets website contact form.</p>
              <p><a href="https://www.pgclosets.com">www.pgclosets.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.contactRecipients,
      replyTo: data.email,
      subject: `New Contact Form: ${data.firstName} ${data.lastName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ Contact email sent successfully:', emailData?.id);
    return {
      success: true,
      emailId: emailData?.id
    };

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send confirmation email to customer
 */
export async function sendContactConfirmation(data: ContactEmailData) {
  if (!services.hasEmail()) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: var(--color-primary); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .cta { background: var(--color-secondary); color: var(--color-primary); padding: 15px 30px; text-decoration: none; display: inline-block; margin: 20px 0; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting PG Closets</h1>
            </div>
            <div class="content">
              <p>Hi ${data.firstName},</p>
              <p>Thank you for reaching out to PG Closets. We've received your message and our team will get back to you within 24 hours.</p>
              <p><strong>Your Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
              <p>If you have any urgent questions, feel free to reply to this email.</p>
              <a href="https://www.pgclosets.com" class="cta">Visit Our Website</a>
              <p>Best regards,<br>The PG Closets Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.email,
      subject: 'Thank you for contacting PG Closets',
      html: confirmationHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false };
  }
}

export default resend;
