// Email service module
// In production, integrate with services like SendGrid, Resend, or AWS SES

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface BookingEmailData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: string;
  address?: string;
  notes?: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || 'PG Closets <noreply@pgclosets.com>';

/**
 * Send an email (stub implementation)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, text, from = DEFAULT_FROM } = options;

  // In development, just log the email
  if (process.env.NODE_ENV !== 'production') {
    console.log('[EMAIL] Would send email:', {
      from,
      to,
      subject,
      preview: (text || html || '').substring(0, 100),
    });
    return true;
  }

  // Production implementation would use a service like:
  // - SendGrid: @sendgrid/mail
  // - Resend: resend
  // - AWS SES: @aws-sdk/client-ses

  try {
    // Placeholder for actual email sending
    console.log('[EMAIL] Sending email to:', to);
    return true;
  } catch (error) {
    console.error('[EMAIL_ERROR]', error);
    return false;
  }
}

/**
 * Send booking confirmation email to customer
 * Alias for sendBookingConfirmationEmail
 */
export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  return sendBookingConfirmationEmail(data);
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1d1d1f;">Booking Confirmation</h1>
      <p>Hi ${data.name},</p>
      <p>Thank you for booking with PG Closets. Here are your appointment details:</p>
      <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Type:</strong> ${data.type}</p>
        ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      </div>
      <p>If you need to reschedule or cancel, please contact us at (613) 701-6393 or reply to this email.</p>
      <p>Best regards,<br>The PG Closets Team</p>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: 'Your PG Closets Appointment Confirmation',
    html,
  });
}

/**
 * Send booking notification to admin
 */
export async function sendBookingNotification(data: BookingEmailData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pgclosets.com';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h1>New Booking Received</h1>
      <div style="background: #f5f5f7; padding: 20px; border-radius: 12px;">
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Type:</strong> ${data.type}</p>
        ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Booking: ${data.type} - ${data.name}`,
    html,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  orderDetails: any
): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1d1d1f;">Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p><strong>Total:</strong> $${(orderDetails.total / 100).toFixed(2)} CAD</p>
        <p><strong>Items:</strong> ${orderDetails.itemCount} items</p>
      </div>
      <p>We'll send you another email when your order ships.</p>
      <p>Best regards,<br>The PG Closets Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderId}`,
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1d1d1f;">Reset Your Password</h1>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #0071e3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Reset Password
        </a>
      </div>
      <p style="color: #86868b; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your PG Closets Password',
    html,
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const adminEmail = process.env.CONTACT_EMAIL || 'info@pgclosets.com';

  // Map subject values to readable labels
  const subjectLabels: Record<string, string> = {
    consultation: 'Free Consultation Request',
    quote: 'Get a Quote',
    installation: 'Installation Question',
    product: 'Product Inquiry',
    support: 'Customer Support',
    other: 'Other',
  };

  const subjectLabel = subjectLabels[data.subject] || data.subject;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h1 style="color: #1d1d1f;">New Contact Form Submission</h1>
      <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
        <p><strong>Subject:</strong> ${subjectLabel}</p>
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
          <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
        </div>
      </div>
      <p style="color: #86868b; font-size: 12px;">
        This message was sent via the PG Closets website contact form.
      </p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[Contact] ${subjectLabel} - ${data.name}`,
    html,
    replyTo: data.email,
  });
}

/**
 * Send auto-response email to customer after contact form submission
 */
export async function sendContactAutoResponse(data: {
  name: string;
  email: string;
  subject: string;
}): Promise<boolean> {
  // Map subject values to readable labels
  const subjectLabels: Record<string, string> = {
    consultation: 'Free Consultation Request',
    quote: 'Quote Request',
    installation: 'Installation Question',
    product: 'Product Inquiry',
    support: 'Customer Support',
    other: 'Your Inquiry',
  };

  const subjectLabel = subjectLabels[data.subject] || 'Your Inquiry';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1d1d1f;">Thank You for Contacting PG Closets</h1>
      <p>Hi ${data.name},</p>
      <p>Thank you for reaching out to us regarding your <strong>${subjectLabel}</strong>. We've received your message and a member of our team will get back to you within 24 hours.</p>

      <div style="background: #f5f5f7; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1d1d1f;">What's Next?</h3>
        <ul style="padding-left: 20px; color: #1d1d1f;">
          <li>Our team will review your inquiry</li>
          <li>We'll respond via email within 24 hours</li>
          <li>For urgent matters, call us at <a href="tel:+16137016393" style="color: #0071e3;">(613) 701-6393</a></li>
        </ul>
      </div>

      <p>In the meantime, feel free to explore our website:</p>
      <ul style="padding-left: 20px;">
        <li><a href="https://www.pgclosets.com/gallery" style="color: #0071e3;">View Our Gallery</a></li>
        <li><a href="https://www.pgclosets.com/products" style="color: #0071e3;">Browse Our Products</a></li>
        <li><a href="https://www.pgclosets.com/book-measure" style="color: #0071e3;">Book a Free Consultation</a></li>
      </ul>

      <p style="margin-top: 30px;">Best regards,<br><strong>The PG Closets Team</strong></p>

      <hr style="border: none; border-top: 1px solid #d2d2d7; margin: 30px 0;" />

      <p style="color: #86868b; font-size: 12px;">
        PG Closets - Custom Closet Solutions<br />
        Ottawa, Ontario<br />
        <a href="tel:+16137016393" style="color: #86868b;">(613) 701-6393</a> |
        <a href="mailto:info@pgclosets.com" style="color: #86868b;">info@pgclosets.com</a>
      </p>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: `Thank you for contacting PG Closets - ${subjectLabel}`,
    html,
  });
}
