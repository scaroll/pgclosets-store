/**
 * AGENT 1: Welcome Email Sequence Automation
 *
 * Manages automated welcome series for new subscribers and customers
 * - Immediate welcome email (Day 0)
 * - Value proposition email (Day 2)
 * - Product showcase email (Day 5)
 * - Social proof & testimonials (Day 7)
 * - Special offer email (Day 10)
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WelcomeSequenceConfig {
  email: string;
  firstName?: string;
  lastName?: string;
  signupSource: 'newsletter' | 'quote' | 'purchase' | 'account';
  metadata?: Record<string, any>;
}

export interface SequenceEmail {
  day: number;
  subject: string;
  template: string;
  condition?: (data: WelcomeSequenceConfig) => boolean;
}

/**
 * Welcome Sequence Definition
 */
export const WELCOME_SEQUENCE: SequenceEmail[] = [
  {
    day: 0,
    subject: 'Welcome to PG Closets - Transform Your Space',
    template: 'welcome-day-0',
  },
  {
    day: 2,
    subject: 'Why Choose Custom Storage Solutions?',
    template: 'welcome-day-2',
  },
  {
    day: 5,
    subject: 'Featured Projects: See What\'s Possible',
    template: 'welcome-day-5',
  },
  {
    day: 7,
    subject: 'What Our Customers Say About Us',
    template: 'welcome-day-7',
  },
  {
    day: 10,
    subject: '10% Off Your First Consultation',
    template: 'welcome-day-10',
    condition: (data) => data.signupSource !== 'purchase',
  },
];

/**
 * Welcome Sequence Agent
 */
export class WelcomeSequenceAgent {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Start welcome sequence for new subscriber
   */
  async startSequence(config: WelcomeSequenceConfig): Promise<{
    success: boolean;
    sequenceId?: string;
    error?: string;
  }> {
    try {
      // Send immediate welcome email
      const result = await this.sendWelcomeEmail(config);

      if (!result.success) {
        return result;
      }

      // Schedule remaining emails
      await this.scheduleSequenceEmails(config);

      return {
        success: true,
        sequenceId: result.emailId,
      };
    } catch (error) {
      console.error('Failed to start welcome sequence:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send immediate welcome email
   */
  private async sendWelcomeEmail(
    config: WelcomeSequenceConfig
  ): Promise<{ success: boolean; emailId?: string; error?: string }> {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const emailContent = this.getWelcomeEmailContent(config);

      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'PG Closets <welcome@pgclosets.ca>',
        to: config.email,
        subject: emailContent.subject,
        html: emailContent.html,
        tags: [
          { name: 'sequence', value: 'welcome' },
          { name: 'day', value: '0' },
          { name: 'source', value: config.signupSource },
        ],
      });

      if (error) {
        return { success: false, error: error.message };
      }

      console.log(`✅ Welcome email sent to ${config.email}`);
      return { success: true, emailId: data?.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Schedule remaining sequence emails
   * In production, use a job queue like BullMQ or Inngest
   */
  private async scheduleSequenceEmails(
    config: WelcomeSequenceConfig
  ): Promise<void> {
    // Skip first email (already sent)
    const remainingEmails = WELCOME_SEQUENCE.slice(1);

    // Store sequence schedule in database
    // This is a placeholder - implement with your preferred job queue
    console.log(
      `📅 Scheduled ${remainingEmails.length} emails for ${config.email}`
    );

    // Example schedule data that would be stored
    const scheduleData = remainingEmails
      .filter((email) => !email.condition || email.condition(config))
      .map((email) => ({
        email: config.email,
        template: email.template,
        subject: email.subject,
        scheduledFor: new Date(
          Date.now() + email.day * 24 * 60 * 60 * 1000
        ).toISOString(),
        metadata: config.metadata,
      }));

    console.log('Schedule data:', JSON.stringify(scheduleData, null, 2));
  }

  /**
   * Get welcome email content
   */
  private getWelcomeEmailContent(config: WelcomeSequenceConfig): {
    subject: string;
    html: string;
  } {
    const firstName = config.firstName || 'there';

    return {
      subject: WELCOME_SEQUENCE[0].subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: var(--color-secondary); }
              .header { background: linear-gradient(135deg, var(--color-primary) 0%, #2563EB 100%); color: white; padding: 40px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
              .content { padding: 40px 30px; }
              .content h2 { color: var(--color-primary); margin-top: 0; }
              .cta-button { display: inline-block; background: var(--color-primary); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .cta-button:hover { background: #2563EB; }
              .features { margin: 30px 0; }
              .feature { margin: 20px 0; padding-left: 30px; position: relative; }
              .feature:before { content: '✓'; position: absolute; left: 0; color: #10B981; font-weight: bold; }
              .footer { background: #F9FAFB; padding: 30px; text-align: center; color: var(--color-text-muted); font-size: 14px; }
              .social-links { margin: 20px 0; }
              .social-links a { margin: 0 10px; color: var(--color-primary); text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to PG Closets!</h1>
              </div>

              <div class="content">
                <h2>Hi ${firstName},</h2>

                <p>Welcome to PG Closets - Ottawa's premier custom storage solution specialists! We're thrilled to have you join our community of homeowners who value quality, organization, and beautiful design.</p>

                <p>Over the next few days, we'll share:</p>

                <div class="features">
                  <div class="feature">Inspiring transformation stories from customers like you</div>
                  <div class="feature">Expert tips for maximizing your space</div>
                  <div class="feature">Behind-the-scenes looks at our design process</div>
                  <div class="feature">Exclusive offers and early access to new products</div>
                </div>

                <p>Ready to start your transformation journey?</p>

                <center>
                  <a href="https://www.pgclosets.com/quote" class="cta-button">Get Your Free Quote</a>
                </center>

                <p>Have questions? Our team is here to help! Reply to this email anytime.</p>

                <p>Looking forward to helping you create the organized, beautiful space of your dreams!</p>

                <p>Best regards,<br>
                <strong>The PG Closets Team</strong></p>
              </div>

              <div class="footer">
                <div class="social-links">
                  <a href="https://facebook.com/pgclosets">Facebook</a>
                  <a href="https://instagram.com/pgclosets">Instagram</a>
                  <a href="https://www.pgclosets.com">Website</a>
                </div>

                <p>PG Closets - Custom Storage Solutions<br>
                Ottawa, Ontario | info@pgclosets.com</p>

                <p>You're receiving this email because you signed up at pgclosets.com<br>
                <a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="https://www.pgclosets.com/privacy">Privacy Policy</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Stop sequence for unsubscribed user
   */
  async stopSequence(email: string): Promise<{ success: boolean }> {
    // Implementation would cancel scheduled emails
    console.log(`🛑 Stopping welcome sequence for ${email}`);
    return { success: true };
  }

  /**
   * Get sequence status for user
   */
  async getSequenceStatus(email: string): Promise<{
    active: boolean;
    currentDay?: number;
    emailsSent?: number;
  }> {
    // Implementation would query database/job queue
    return {
      active: false,
    };
  }
}

export default new WelcomeSequenceAgent();
