import { sendEmail } from '../emails';

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  source?: string;
}

/**
 * Send lead notification to admin
 */
export async function sendLeadNotification(data: LeadData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pgclosets.com';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h1>New Lead Received</h1>
      <div style="background: #f5f5f7; padding: 20px; border-radius: 12px;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.service ? `<p><strong>Service Interested:</strong> ${data.service}</p>` : ''}
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
        ${data.source ? `<p><strong>Source:</strong> ${data.source}</p>` : ''}
      </div>
      <p style="color: #86868b; font-size: 12px; margin-top: 20px;">
        Received at: ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Lead: ${data.name} - ${data.service || 'General Inquiry'}`,
    html,
    replyTo: data.email,
  });
}

/**
 * Send auto-response to lead
 */
export async function sendLeadAutoResponse(data: LeadData): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1d1d1f;">Thank You for Contacting PG Closets</h1>
      <p>Hi ${data.name},</p>
      <p>Thank you for reaching out to us! We've received your inquiry and one of our team members will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to:</p>
      <ul>
        <li>Browse our <a href="https://www.pgclosets.com/products">product catalog</a></li>
        <li>Get an <a href="https://www.pgclosets.com/instant-estimate">instant estimate</a></li>
        <li>Book a <a href="https://www.pgclosets.com/book-measure">free measurement</a></li>
      </ul>
      <p>Best regards,<br>The PG Closets Team</p>
      <p style="color: #86868b; font-size: 12px;">
        PG Closets - Premium Closet Doors & Storage Solutions<br>
        Ottawa, ON | (613) 555-0123
      </p>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: 'Thank You for Contacting PG Closets',
    html,
  });
}
