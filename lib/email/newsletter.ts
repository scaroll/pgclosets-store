import { sendEmail } from '../emails';

export interface NewsletterSubscriber {
  email: string;
  name?: string;
  source?: string;
}

// In-memory subscriber list (use database in production)
const subscribers = new Set<string>();

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(data: NewsletterSubscriber): Promise<{ success: boolean; message: string }> {
  const { email, name } = data;

  // Check if already subscribed
  if (subscribers.has(email.toLowerCase())) {
    return {
      success: true,
      message: 'You are already subscribed to our newsletter.',
    };
  }

  // Add to subscribers
  subscribers.add(email.toLowerCase());

  // Send welcome email
  sendWelcomeEmail(email, name);

  // Notify admin
  notifyAdminNewSubscriber(email, name);

  return {
    success: true,
    message: 'Thank you for subscribing! Check your email for a welcome message.',
  };
}

/**
 * Unsubscribe from newsletter
 */
export function unsubscribeFromNewsletter(email: string): { success: boolean; message: string } {
  subscribers.delete(email.toLowerCase());

  return {
    success: true,
    message: 'You have been unsubscribed from our newsletter.',
  };
}

/**
 * Send welcome email to new subscriber
 */
function sendWelcomeEmail(email: string, name?: string): boolean {
  const greeting = name ? `Hi ${name}` : 'Hi there';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1d1d1f;">Welcome to PG Closets!</h1>
      <p>${greeting},</p>
      <p>Thank you for subscribing to our newsletter! You'll be the first to know about:</p>
      <ul>
        <li>New product arrivals</li>
        <li>Exclusive deals and promotions</li>
        <li>Design tips and inspiration</li>
        <li>Special events and sales</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://www.pgclosets.com/products" style="background: #0071e3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Shop Now
        </a>
      </div>
      <p>Best regards,<br>The PG Closets Team</p>
      <p style="color: #86868b; font-size: 12px; margin-top: 30px;">
        You're receiving this email because you subscribed to the PG Closets newsletter.<br>
        <a href="https://www.pgclosets.com/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a>
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to PG Closets Newsletter!',
    html,
  });
}

/**
 * Notify admin of new subscriber
 */
function notifyAdminNewSubscriber(email: string, name?: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pgclosets.com';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h2>New Newsletter Subscriber</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: 'New Newsletter Subscriber',
    html,
  });
}

/**
 * Get subscriber count
 */
export function getSubscriberCount(): number {
  return subscribers.size;
}
