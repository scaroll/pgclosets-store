/**
 * AGENT 15: ESP (Email Service Provider) Integration Agent
 *
 * Unified interface for multiple email providers:
 * - Resend (primary)
 * - SendGrid (enterprise)
 * - AWS SES (cost-effective)
 * - Mailgun (transactional)
 * - Postmark (transactional premium)
 */

import { Resend } from 'resend';

export type ESProvider = 'resend' | 'sendgrid' | 'ses' | 'mailgun' | 'postmark';

export interface EmailPayload {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  tags?: Array<{ name: string; value: string }>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: ESProvider;
}

/**
 * ESP Integration Agent - Unified Email Sending Interface
 */
export class ESPIntegrationAgent {
  private provider: ESProvider;
  private resend?: Resend;

  constructor(provider: ESProvider = 'resend') {
    this.provider = provider;

    if (provider === 'resend') {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  /**
   * Send email using configured provider
   */
  async send(payload: EmailPayload): Promise<SendResult> {
    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendWithResend(payload);
        case 'sendgrid':
          return await this.sendWithSendGrid(payload);
        case 'ses':
          return await this.sendWithSES(payload);
        case 'mailgun':
          return await this.sendWithMailgun(payload);
        case 'postmark':
          return await this.sendWithPostmark(payload);
        default:
          return {
            success: false,
            error: `Unknown provider: ${this.provider}`,
            provider: this.provider
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.provider
      };
    }
  }

  /**
   * Send batch emails
   */
  async sendBatch(payloads: EmailPayload[]): Promise<SendResult[]> {
    const results: SendResult[] = [];

    // Send in batches to avoid rate limits
    const BATCH_SIZE = 100;
    for (let i = 0; i < payloads.length; i += BATCH_SIZE) {
      const batch = payloads.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(p => this.send(p)));
      results.push(...batchResults);

      // Rate limiting delay
      if (i + BATCH_SIZE < payloads.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Resend implementation
   */
  private async sendWithResend(payload: EmailPayload): Promise<SendResult> {
    if (!this.resend || !process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: 'Resend not configured',
        provider: 'resend'
      };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: payload.from,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
        cc: payload.cc,
        bcc: payload.bcc,
        tags: payload.tags,
        attachments: payload.attachments
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          provider: 'resend'
        };
      }

      return {
        success: true,
        messageId: data?.id,
        provider: 'resend'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'resend'
      };
    }
  }

  /**
   * SendGrid implementation
   */
  private async sendWithSendGrid(payload: EmailPayload): Promise<SendResult> {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

    if (!SENDGRID_API_KEY) {
      return {
        success: false,
        error: 'SendGrid not configured',
        provider: 'sendgrid'
      };
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: Array.isArray(payload.to)
            ? payload.to.map(email => ({ email }))
            : [{ email: payload.to }],
          cc: payload.cc?.map(email => ({ email })),
          bcc: payload.bcc?.map(email => ({ email }))
        }],
        from: { email: payload.from },
        subject: payload.subject,
        content: [
          { type: 'text/html', value: payload.html },
          ...(payload.text ? [{ type: 'text/plain', value: payload.text }] : [])
        ],
        reply_to: payload.replyTo ? { email: payload.replyTo } : undefined
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `SendGrid error: ${response.statusText}`,
        provider: 'sendgrid'
      };
    }

    return {
      success: true,
      messageId: response.headers.get('x-message-id') || undefined,
      provider: 'sendgrid'
    };
  }

  /**
   * AWS SES implementation
   */
  private async sendWithSES(payload: EmailPayload): Promise<SendResult> {
    // AWS SES implementation would go here
    // Requires AWS SDK
    console.log('📧 SES sending not yet implemented');

    return {
      success: false,
      error: 'SES implementation pending',
      provider: 'ses'
    };
  }

  /**
   * Mailgun implementation
   */
  private async sendWithMailgun(payload: EmailPayload): Promise<SendResult> {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return {
        success: false,
        error: 'Mailgun not configured',
        provider: 'mailgun'
      };
    }

    const formData = new FormData();
    formData.append('from', payload.from);
    formData.append('to', Array.isArray(payload.to) ? payload.to.join(',') : payload.to);
    formData.append('subject', payload.subject);
    formData.append('html', payload.html);
    if (payload.text) formData.append('text', payload.text);
    if (payload.replyTo) formData.append('h:Reply-To', payload.replyTo);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Mailgun error: ${response.statusText}`,
        provider: 'mailgun'
      };
    }

    const result = await response.json();

    return {
      success: true,
      messageId: result.id,
      provider: 'mailgun'
    };
  }

  /**
   * Postmark implementation
   */
  private async sendWithPostmark(payload: EmailPayload): Promise<SendResult> {
    const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;

    if (!POSTMARK_API_KEY) {
      return {
        success: false,
        error: 'Postmark not configured',
        provider: 'postmark'
      };
    }

    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': POSTMARK_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        From: payload.from,
        To: Array.isArray(payload.to) ? payload.to.join(',') : payload.to,
        Subject: payload.subject,
        HtmlBody: payload.html,
        TextBody: payload.text,
        ReplyTo: payload.replyTo,
        Cc: payload.cc?.join(','),
        Bcc: payload.bcc?.join(',')
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Postmark error: ${response.statusText}`,
        provider: 'postmark'
      };
    }

    const result = await response.json();

    return {
      success: true,
      messageId: result.MessageID,
      provider: 'postmark'
    };
  }

  /**
   * Verify provider configuration
   */
  async verifyConfiguration(): Promise<{
    configured: boolean;
    provider: ESProvider;
    error?: string;
  }> {
    const testPayload: EmailPayload = {
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>'
    };

    // Don't actually send, just check if provider is configured
    switch (this.provider) {
      case 'resend':
        return {
          configured: !!process.env.RESEND_API_KEY,
          provider: 'resend',
          error: !process.env.RESEND_API_KEY ? 'RESEND_API_KEY not set' : undefined
        };

      case 'sendgrid':
        return {
          configured: !!process.env.SENDGRID_API_KEY,
          provider: 'sendgrid',
          error: !process.env.SENDGRID_API_KEY ? 'SENDGRID_API_KEY not set' : undefined
        };

      case 'mailgun':
        return {
          configured: !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN),
          provider: 'mailgun',
          error: !process.env.MAILGUN_API_KEY ? 'MAILGUN_API_KEY not set' :
                 !process.env.MAILGUN_DOMAIN ? 'MAILGUN_DOMAIN not set' : undefined
        };

      case 'postmark':
        return {
          configured: !!process.env.POSTMARK_API_KEY,
          provider: 'postmark',
          error: !process.env.POSTMARK_API_KEY ? 'POSTMARK_API_KEY not set' : undefined
        };

      default:
        return {
          configured: false,
          provider: this.provider,
          error: 'Provider not implemented'
        };
    }
  }

  /**
   * Get provider statistics
   */
  async getProviderStats(): Promise<{
    provider: ESProvider;
    monthlySent: number;
    monthlyQuota: number;
    percentageUsed: number;
  }> {
    // Implementation would query provider API for usage stats
    return {
      provider: this.provider,
      monthlySent: 0,
      monthlyQuota: 10000,
      percentageUsed: 0
    };
  }
}

export default ESPIntegrationAgent;
