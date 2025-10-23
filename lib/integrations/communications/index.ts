/**
 * Communications Integration Hub
 * Centralizes email, SMS, chat, and notification services
 */

import SendGrid from '@sendgrid/mail';
import twilio from 'twilio';
import * as Intercom from 'intercom-client';
import mailchimp from '@mailchimp/marketing';
import { WebClient } from '@slack/web-api';

// Communication Services Configuration
export interface CommunicationConfig {
  sendgrid?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  twilio?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  intercom?: {
    accessToken: string;
  };
  mailchimp?: {
    apiKey: string;
    serverPrefix: string;
    listId: string;
  };
  slack?: {
    botToken: string;
    channelId: string;
  };
}

export class CommunicationHub {
  private config: CommunicationConfig;
  private sendgrid: SendGrid.MailService | null = null;
  private twilioClient: twilio.Twilio | null = null;
  private intercomClient: any = null;
  private mailchimpClient: typeof mailchimp | null = null;
  private slackClient: WebClient | null = null;

  constructor(config: CommunicationConfig) {
    this.config = config;
    this.initializeServices();
  }

  private initializeServices() {
    // Initialize SendGrid
    if (this.config.sendgrid) {
      SendGrid.setApiKey(this.config.sendgrid.apiKey);
      this.sendgrid = SendGrid;
    }

    // Initialize Twilio
    if (this.config.twilio) {
      this.twilioClient = twilio(
        this.config.twilio.accountSid,
        this.config.twilio.authToken
      );
    }

    // Initialize Intercom
    if (this.config.intercom) {
      this.intercomClient = new Intercom.Client({
        token: this.config.intercom.accessToken,
      });
    }

    // Initialize Mailchimp
    if (this.config.mailchimp) {
      mailchimp.setConfig({
        apiKey: this.config.mailchimp.apiKey,
        server: this.config.mailchimp.serverPrefix,
      });
      this.mailchimpClient = mailchimp;
    }

    // Initialize Slack
    if (this.config.slack) {
      this.slackClient = new WebClient(this.config.slack.botToken);
    }
  }

  // Email Methods (SendGrid)
  async sendEmail(to: string, subject: string, content: string, templateId?: string, templateData?: Record<string, any>) {
    if (!this.sendgrid) throw new Error('SendGrid not initialized');

    try {
      if (templateId && templateData) {
        // Send template email
        const msg = {
          to,
          from: {
            email: this.config.sendgrid!.fromEmail,
            name: this.config.sendgrid!.fromName,
          },
          templateId,
          dynamicTemplateData: templateData,
        };

        return this.sendgrid.send(msg);
      } else {
        // Send plain email
        const msg = {
          to,
          from: {
            email: this.config.sendgrid!.fromEmail,
            name: this.config.sendgrid!.fromName,
          },
          subject,
          text: content,
          html: content,
        };

        return this.sendgrid.send(msg);
      }
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  }

  async sendBulkEmails(recipients: Array<{ email: string; name?: string }>, subject: string, content: string) {
    const promises = recipients.map(recipient =>
      this.sendEmail(recipient.email, subject, content)
    );

    return Promise.allSettled(promises);
  }

  async addEmailToList(email: string, listId?: string, mergeFields?: Record<string, any>) {
    if (!this.mailchimpClient) throw new Error('Mailchimp not initialized');

    try {
      const response = await this.mailchimpClient.lists.addListMember(
        listId || this.config.mailchimp!.listId,
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: mergeFields,
        }
      );

      return response;
    } catch (error) {
      console.error('Mailchimp error:', error);
      throw error;
    }
  }

  // SMS Methods (Twilio)
  async sendSMS(to: string, message: string) {
    if (!this.twilioClient) throw new Error('Twilio not initialized');

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.config.twilio!.fromNumber,
        to,
      });

      return result;
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw error;
    }
  }

  async sendBulkSMS(recipients: string[], message: string) {
    const promises = recipients.map(recipient =>
      this.sendSMS(recipient, message)
    );

    return Promise.allSettled(promises);
  }

  // Intercom Methods
  async createIntercomUser(email: string, name?: string, userId?: string, customAttributes?: Record<string, any>) {
    if (!this.intercomClient) throw new Error('Intercom not initialized');

    try {
      const user = await this.intercomClient.users.create({
        email,
        name,
        user_id: userId,
        custom_attributes: customAttributes,
      });

      return user;
    } catch (error) {
      console.error('Intercom user creation error:', error);
      throw error;
    }
  }

  async sendIntercomMessage(userId: string, message: string, fromType: 'user' | 'admin' = 'user') {
    if (!this.intercomClient) throw new Error('Intercom not initialized');

    try {
      const conversation = await this.intercomClient.conversations.create({
        from: {
          type: fromType,
          id: fromType === 'user' ? userId : 'admin',
        },
        body: message,
      });

      return conversation;
    } catch (error) {
      console.error('Intercom message error:', error);
      throw error;
    }
  }

  async createIntercomEvent(userId: string, eventName: string, metadata?: Record<string, any>) {
    if (!this.intercomClient) throw new Error('Intercom not initialized');

    try {
      const event = await this.intercomClient.events.create({
        user_id: userId,
        event_name: eventName,
        created_at: Math.floor(Date.now() / 1000),
        metadata,
      });

      return event;
    } catch (error) {
      console.error('Intercom event error:', error);
      throw error;
    }
  }

  // Slack Methods
  async sendSlackMessage(text: string, channel?: string, blocks?: any[]) {
    if (!this.slackClient) throw new Error('Slack not initialized');

    try {
      const result = await this.slackClient.chat.postMessage({
        channel: channel || this.config.slack!.channelId,
        text,
        blocks,
      });

      return result;
    } catch (error) {
      console.error('Slack message error:', error);
      throw error;
    }
  }

  async sendSlackNotification(title: string, message: string, color: 'good' | 'warning' | 'danger' = 'good', fields?: Array<{ title: string; value: string; short?: boolean }>) {
    const attachment = {
      color,
      fields: [
        { title, value: message, short: false },
        ...(fields || []),
      ],
      ts: Math.floor(Date.now() / 1000),
    };

    return this.sendSlackMessage('', undefined, [attachment]);
  }

  async uploadSlackFile(filePath: string, title: string, initialComment?: string) {
    if (!this.slackClient) throw new Error('Slack not initialized');

    try {
      const result = await this.slackClient.files.uploadV2({
        channel_id: this.config.slack!.channelId,
        file: filePath,
        title,
        initial_comment: initialComment,
      });

      return result;
    } catch (error) {
      console.error('Slack file upload error:', error);
      throw error;
    }
  }

  // Unified Communication Methods
  async sendNotification(type: 'email' | 'sms' | 'slack' | 'intercom', recipient: string, message: string, options?: any) {
    try {
      switch (type) {
        case 'email':
          return this.sendEmail(recipient, options?.subject || 'Notification', message);

        case 'sms':
          return this.sendSMS(recipient, message);

        case 'slack':
          return this.sendSlackMessage(message, options?.channel);

        case 'intercom':
          return this.sendIntercomMessage(recipient, message);

        default:
          throw new Error(`Unsupported notification type: ${type}`);
      }
    } catch (error) {
      console.error(`Error sending ${type} notification:`, error);
      throw error;
    }
  }

  async sendMultiChannelNotification(recipient: { email?: string; phone?: string; userId?: string }, message: string, options?: { channels?: string[]; subject?: string }) {
    const channels = options?.channels || ['email'];
    const promises: Promise<any>[] = [];

    if (channels.includes('email') && recipient.email) {
      promises.push(this.sendEmail(recipient.email, options?.subject || 'Notification', message));
    }

    if (channels.includes('sms') && recipient.phone) {
      promises.push(this.sendSMS(recipient.phone, message));
    }

    if (channels.includes('intercom') && recipient.userId) {
      promises.push(this.sendIntercomMessage(recipient.userId, message));
    }

    if (channels.includes('slack')) {
      promises.push(this.sendSlackMessage(message));
    }

    return Promise.allSettled(promises);
  }

  // Template Management
  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail(
      email,
      'Welcome to PG Closets!',
      `<h1>Welcome, ${name}!</h1><p>Thank you for joining PG Closets. We're excited to help you create your dream closet space.</p>`,
      'd-welcome-template',
      { name, email }
    );
  }

  async sendOrderConfirmation(email: string, orderDetails: any) {
    return this.sendEmail(
      email,
      `Order Confirmation #${orderDetails.id}`,
      `<h1>Order Confirmed</h1><p>Thank you for your order. Your order #${orderDetails.id} has been confirmed.</p>`,
      'd-order-confirmation',
      orderDetails
    );
  }

  async sendPasswordReset(email: string, resetLink: string) {
    return this.sendEmail(
      email,
      'Password Reset Request',
      `<h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
      'd-password-reset',
      { reset_link: resetLink }
    );
  }

  // Webhook Handling
  async handleWebhook(provider: string, payload: any) {
    try {
      switch (provider) {
        case 'sendgrid':
          // Handle SendGrid webhooks (opens, clicks, bounces, etc.)
          return this.handleSendGridWebhook(payload);

        case 'intercom':
          // Handle Intercom webhooks
          return this.handleIntercomWebhook(payload);

        case 'mailchimp':
          // Handle Mailchimp webhooks
          return this.handleMailchimpWebhook(payload);

        default:
          throw new Error(`Webhook handling for ${provider} not implemented`);
      }
    } catch (error) {
      console.error(`${provider} webhook error:`, error);
      throw error;
    }
  }

  private handleSendGridWebhook(payload: any) {
    // Process SendGrid webhook events
    const events = payload;
    const processedEvents = events.map((event: any) => ({
      type: event.event,
      email: event.email,
      timestamp: event.timestamp,
      reason: event.reason,
      response: event.response,
    }));

    return processedEvents;
  }

  private handleIntercomWebhook(payload: any) {
    // Process Intercom webhook events
    return {
      type: payload.type,
      data: payload.data,
      created_at: payload.created_at,
    };
  }

  private handleMailchimpWebhook(payload: any) {
    // Process Mailchimp webhook events
    return {
      type: payload.type,
      fired_at: payload.fired_at,
      data: payload.data,
    };
  }

  // Analytics and Reporting
  async getCommunicationStats() {
    const stats = {
      emails: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
      sms: { sent: 0, delivered: 0, failed: 0 },
      intercom: { conversations: 0, messages: 0 },
      slack: { messages: 0 },
    };

    // Implement analytics gathering for each service
    // This would typically involve making API calls to get statistics

    return stats;
  }

  // Error Handling
  handleCommunicationError(error: any, provider: string) {
    console.error(`${provider} communication error:`, error);

    return {
      provider,
      error: true,
      message: error.message || 'Communication failed',
      code: error.code || 'COMMUNICATION_ERROR',
      details: error,
    };
  }
}

// Configuration Helper
export const getCommunicationConfig = (): CommunicationConfig => {
  return {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY!,
      fromEmail: process.env.SENDGRID_FROM_EMAIL!,
      fromName: process.env.SENDGRID_FROM_NAME || 'PG Closets',
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID!,
      authToken: process.env.TWILIO_AUTH_TOKEN!,
      fromNumber: process.env.TWILIO_FROM_NUMBER!,
    },
    intercom: {
      accessToken: process.env.INTERCOM_ACCESS_TOKEN!,
    },
    mailchimp: {
      apiKey: process.env.MAILCHIMP_API_KEY!,
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX!,
      listId: process.env.MAILCHIMP_LIST_ID!,
    },
    slack: {
      botToken: process.env.SLACK_BOT_TOKEN!,
      channelId: process.env.SLACK_CHANNEL_ID!,
    },
  };
};