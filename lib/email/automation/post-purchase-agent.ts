/**
 * AGENT 3: Post-Purchase Email Sequence
 *
 * Nurtures customers after purchase to build loyalty
 * - Order confirmation (immediate)
 * - Shipping updates (as status changes)
 * - Installation guide (before delivery)
 * - Post-installation check-in (7 days after)
 * - Review request (14 days after)
 * - Referral program invitation (30 days after)
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PostPurchaseConfig {
  email: string;
  firstName?: string;
  orderId: string;
  orderTotal: number;
  items: Array<{ name: string; quantity: number }>;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export const POST_PURCHASE_SEQUENCE = [
  { trigger: 'immediate', subject: 'Order Confirmed! #{{orderId}}', template: 'order-confirmation' },
  { trigger: 'shipped', subject: 'Your Order is On the Way!', template: 'shipping-notification' },
  { trigger: 'before_delivery', subject: 'Installation Guide & Preparation Tips', template: 'installation-guide' },
  { trigger: 'day_7', subject: 'How is Your New Closet Working Out?', template: 'post-install-checkin' },
  { trigger: 'day_14', subject: 'Share Your Experience with Others', template: 'review-request' },
  { trigger: 'day_30', subject: 'Get $100 for Every Friend You Refer', template: 'referral-invitation' },
];

export class PostPurchaseAgent {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOrderConfirmation(config: PostPurchaseConfig) {
    const html = this.getOrderConfirmationHtml(config);

    return await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <orders@pgclosets.ca>',
      to: config.email,
      subject: `Order Confirmed! #${config.orderId}`,
      html,
      tags: [
        { name: 'sequence', value: 'post-purchase' },
        { name: 'email-type', value: 'order-confirmation' },
        { name: 'order-id', value: config.orderId },
      ],
    });
  }

  async sendShippingNotification(config: PostPurchaseConfig & { trackingUrl: string }) {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #10B981; color: white; padding: 30px; text-align: center;">
          <h1>📦 Your Order is On the Way!</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p>Hi ${config.firstName || 'there'},</p>
          <p>Great news! Your order #${config.orderId} has shipped and is on its way to you.</p>
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tracking Number:</strong> ${config.trackingNumber}</p>
            <p><strong>Estimated Delivery:</strong> ${config.estimatedDelivery?.toLocaleDateString()}</p>
          </div>
          <center>
            <a href="${config.trackingUrl}" style="display: inline-block; background: #1B4A9C; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">Track Your Order</a>
          </center>
        </div>
      </div>
    `;

    return await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <orders@pgclosets.ca>',
      to: config.email,
      subject: 'Your Order is On the Way!',
      html,
      tags: [
        { name: 'sequence', value: 'post-purchase' },
        { name: 'email-type', value: 'shipping-notification' },
      ],
    });
  }

  async sendReviewRequest(config: PostPurchaseConfig) {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #1B4A9C; color: white; padding: 30px; text-align: center;">
          <h1>⭐ How Did We Do?</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p>Hi ${config.firstName || 'there'},</p>
          <p>We hope you're loving your new custom storage solution! Your feedback helps us improve and helps other homeowners make informed decisions.</p>
          <p>Would you mind taking 2 minutes to share your experience?</p>
          <center>
            <a href="https://www.pgclosets.com/reviews/new?order=${config.orderId}" style="display: inline-block; background: #F59E0B; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Leave a Review</a>
          </center>
          <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>💡 Bonus:</strong> Leave a review and get $50 off your next purchase!</p>
          </div>
        </div>
      </div>
    `;

    return await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <hello@pgclosets.ca>',
      to: config.email,
      subject: 'How is Your New Closet Working Out?',
      html,
      tags: [
        { name: 'sequence', value: 'post-purchase' },
        { name: 'email-type', value: 'review-request' },
      ],
    });
  }

  async sendReferralInvitation(config: PostPurchaseConfig) {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 40px; text-align: center;">
          <h1>💰 Earn $100 Per Referral</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p>Hi ${config.firstName || 'there'},</p>
          <p>Love your new closet? Share the love and earn rewards!</p>
          <div style="background: #1B4A9C; color: white; text-align: center; padding: 30px; border-radius: 12px; margin: 30px 0;">
            <div style="font-size: 48px; font-weight: 700;">$100</div>
            <div style="font-size: 18px;">For every friend who installs a closet</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">They get $100 off too!</div>
          </div>
          <center>
            <a href="https://www.pgclosets.com/refer" style="display: inline-block; background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Referring</a>
          </center>
        </div>
      </div>
    `;

    return await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <hello@pgclosets.ca>',
      to: config.email,
      subject: 'Get $100 for Every Friend You Refer',
      html,
      tags: [
        { name: 'sequence', value: 'post-purchase' },
        { name: 'email-type', value: 'referral-invitation' },
      ],
    });
  }

  private getOrderConfirmationHtml(config: PostPurchaseConfig): string {
    const itemsHtml = config.items.map(item => `
      <div style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
        <strong>${item.name}</strong> × ${item.quantity}
      </div>
    `).join('');

    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #10B981; color: white; padding: 30px; text-align: center;">
          <h1>✅ Order Confirmed!</h1>
          <p style="font-size: 18px; margin: 0;">Order #${config.orderId}</p>
        </div>
        <div style="padding: 40px 30px;">
          <p>Hi ${config.firstName || 'there'},</p>
          <p>Thank you for your order! We're excited to create your custom storage solution.</p>

          <h3>Order Summary:</h3>
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
            ${itemsHtml}
            <div style="font-size: 20px; font-weight: 700; color: #1B4A9C; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #1B4A9C;">
              Total: $${config.orderTotal.toFixed(2)}
            </div>
          </div>

          <h3>What Happens Next?</h3>
          <div style="line-height: 2;">
            <div>✓ Our team will review your order</div>
            <div>✓ We'll schedule your installation</div>
            <div>✓ You'll receive updates along the way</div>
          </div>

          <p>Questions? Call us at <strong>(613) 422-5800</strong></p>
        </div>
      </div>
    `;
  }
}

export default new PostPurchaseAgent();
