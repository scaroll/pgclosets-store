/**
 * Enterprise Integration Hub - Main Entry Point
 * Central orchestration of all 20+ enterprise integrations
 */

import { PaymentProcessorHub, getPaymentConfig } from './payments';
import { CommunicationHub, getCommunicationConfig } from './communications';
import { AnalyticsHub, getAnalyticsConfig } from './analytics';
import { BusinessHub, getBusinessConfig } from './business';
import { MarketingHub, getMarketingConfig } from './marketing';
import { SecurityHub, getSecurityConfig } from './security';
import { IntegrationTestSuite, getTestConfig } from './testing';

// Main Integration Hub
export class EnterpriseIntegrationHub {
  private payments: PaymentProcessorHub;
  private communications: CommunicationHub;
  private analytics: AnalyticsHub;
  private business: BusinessHub;
  private marketing: MarketingHub;
  private security: SecurityHub;
  private testSuite: IntegrationTestSuite;

  private initialized = false;
  private config: {
    payments: any;
    communications: any;
    analytics: any;
    business: any;
    marketing: any;
    security: any;
    testing: any;
  };

  constructor() {
    this.config = {
      payments: getPaymentConfig(),
      communications: getCommunicationConfig(),
      analytics: getAnalyticsConfig(),
      business: getBusinessConfig(),
      marketing: getMarketingConfig(),
      security: getSecurityConfig(),
      testing: getTestConfig(),
    };

    this.initialize();
  }

  private initialize() {
    try {
      // Initialize all services
      this.payments = new PaymentProcessorHub(this.config.payments);
      this.communications = new CommunicationHub(this.config.communications);
      this.analytics = new AnalyticsHub(this.config.analytics);
      this.business = new BusinessHub(this.config.business);
      this.marketing = new MarketingHub(this.config.marketing);
      this.security = new SecurityHub(this.config.security);
      this.testSuite = new IntegrationTestSuite(this.config.testing);

      this.initialized = true;

      console.log('🚀 Enterprise Integration Hub initialized successfully');
      console.log(`✅ Payments: ${this.getServiceStatus('payments')}`);
      console.log(`✅ Communications: ${this.getServiceStatus('communications')}`);
      console.log(`✅ Analytics: ${this.getServiceStatus('analytics')}`);
      console.log(`✅ Business: ${this.getServiceStatus('business')}`);
      console.log(`✅ Marketing: ${this.getServiceStatus('marketing')}`);
      console.log(`✅ Security: ${this.getServiceStatus('security')}`);
    } catch (error) {
      console.error('❌ Failed to initialize Enterprise Integration Hub:', error);
      throw error;
    }
  }

  private getServiceStatus(service: string): string {
    switch (service) {
      case 'payments':
        return this.config.payments.stripe ? 'Configured' : 'Partial';
      case 'communications':
        return this.config.communications.sendgrid ? 'Configured' : 'Partial';
      case 'analytics':
        return this.config.analytics.googleAnalytics ? 'Configured' : 'Partial';
      case 'business':
        return this.config.business.salesforce ? 'Configured' : 'Partial';
      case 'marketing':
        return this.config.marketing.semrush ? 'Configured' : 'Partial';
      case 'security':
        return 'Configured';
      default:
        return 'Unknown';
    }
  }

  // Unified Order Processing
  async processOrder(orderData: {
    id: string;
    customer: any;
    items: any[];
    total: number;
    paymentMethod: string;
    paymentDetails: any;
  }) {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    const startTime = Date.now();
    let paymentResult: any = null;
    let businessSyncResult: any = null;
    let communicationResult: any = null;

    try {
      // Log order processing start
      this.security.logAuditEvent('order_processing_started', {
        orderId: orderData.id,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
      }, 'info', orderData.customer.id);

      // Step 1: Process Payment
      try {
        paymentResult = await this.payments.processPayment(
          orderData.paymentMethod,
          orderData.paymentDetails
        );

        this.analytics.trackPurchase(
          orderData.id,
          orderData.total,
          orderData.items
        );
      } catch (error) {
        this.security.logAuditEvent('payment_failed', {
          orderId: orderData.id,
          error: error.message,
        }, 'error', orderData.customer.id);
        throw error;
      }

      // Step 2: Sync to Business Systems
      try {
        businessSyncResult = await this.business.syncOrderToAllSystems({
          ...orderData,
          status: 'paid',
        });
      } catch (error) {
        console.warn('Business sync failed:', error);
        // Don't fail the order if business sync fails
      }

      // Step 3: Send Communications
      try {
        communicationResult = await this.communications.sendMultiChannelNotification(
          {
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            userId: orderData.customer.id,
          },
          `Order #${orderData.id} confirmed! Your payment of $${orderData.total} has been processed successfully.`,
          {
            channels: ['email'],
            subject: `Order Confirmation #${orderData.id}`,
          }
        );
      } catch (error) {
        console.warn('Communication failed:', error);
        // Don't fail the order if communication fails
      }

      // Step 4: Track Analytics
      this.analytics.trackEvent('Ecommerce', 'Order Completed', orderData.paymentMethod, orderData.total);

      // Log successful order processing
      this.security.logAuditEvent('order_processing_completed', {
        orderId: orderData.id,
        duration: Date.now() - startTime,
      }, 'info', orderData.customer.id);

      return {
        success: true,
        orderId: orderData.id,
        paymentResult,
        businessSyncResult,
        communicationResult,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      this.security.logAuditEvent('order_processing_failed', {
        orderId: orderData.id,
        error: error.message,
        duration: Date.now() - startTime,
      }, 'error', orderData.customer.id);

      throw error;
    }
  }

  // Unified Customer Onboarding
  async onboardCustomer(customerData: {
    email: string;
    name: string;
    phone?: string;
    address?: any;
    source: string;
  }) {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    try {
      const results: any = {};

      // Analytics: Identify user
      this.analytics.identifyUser(customerData.email, {
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        source: customerData.source,
      });

      // Analytics: Track lead
      this.analytics.trackLead('customer_signup', 0);

      // Business: Create lead in CRM
      try {
        const [firstName, lastName] = customerData.name.split(' ');
        results.crm = await this.business.createSalesforceLead({
          firstName: firstName || '',
          lastName: lastName || 'Customer',
          email: customerData.email,
          phone: customerData.phone,
          source: customerData.source,
          status: 'New',
        });
      } catch (error) {
        console.warn('CRM lead creation failed:', error);
      }

      // Communications: Welcome email
      try {
        results.communication = await this.communications.sendWelcomeEmail(
          customerData.email,
          customerData.name
        );
      } catch (error) {
        console.warn('Welcome email failed:', error);
      }

      // Business: Create customer in accounting
      try {
        results.accounting = await this.business.createQuickBooksCustomer({
          displayName: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
        });
      } catch (error) {
        console.warn('Accounting customer creation failed:', error);
      }

      // Security: Log successful onboarding
      this.security.logAuditEvent('customer_onboarded', {
        email: customerData.email,
        source: customerData.source,
      }, 'info', customerData.email);

      return {
        success: true,
        customer: customerData,
        results,
      };
    } catch (error) {
      this.security.logAuditEvent('customer_onboarding_failed', {
        email: customerData.email,
        error: error.message,
      }, 'error', customerData.email);

      throw error;
    }
  }

  // Unified Support Request
  async handleSupportRequest(requestData: {
    customer: any;
    subject: string;
    description: string;
    priority?: string;
    category?: string;
  }) {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    try {
      // Create Zendesk ticket
      const ticket = await this.business.createZendeskTicket({
        subject: requestData.subject,
        description: requestData.description,
        requesterEmail: requestData.customer.email,
        requesterName: requestData.customer.name,
        priority: (requestData.priority as any) || 'normal',
        tags: requestData.category ? [requestData.category] : [],
      });

      // Send confirmation to customer
      await this.communications.sendEmail(
        requestData.customer.email,
        `Support Request Received: ${requestData.subject}`,
        `We've received your support request and will respond within 24 hours. Your ticket ID is ${ticket.id}.`
      );

      // Notify internal team on Slack
      await this.communications.sendSlackNotification(
        `New Support Request`,
        `Ticket #${ticket.id}: ${requestData.subject} from ${requestData.customer.email}`,
        'normal',
        [
          { title: 'Customer', value: requestData.customer.name, short: true },
          { title: 'Priority', value: requestData.priority || 'normal', short: true },
          { title: 'Category', value: requestData.category || 'general', short: true },
        ]
      );

      // Track support request in analytics
      this.analytics.trackEvent('Support', 'Request Created', requestData.category || 'general');

      // Log support request
      this.security.logAuditEvent('support_request_created', {
        ticketId: ticket.id,
        customerEmail: requestData.customer.email,
        subject: requestData.subject,
      }, 'info', requestData.customer.id);

      return {
        success: true,
        ticketId: ticket.id,
        ticket,
      };
    } catch (error) {
      this.security.logAuditEvent('support_request_failed', {
        customerEmail: requestData.customer.email,
        error: error.message,
      }, 'error', requestData.customer.id);

      throw error;
    }
  }

  // Webhook Handler
  async handleWebhook(provider: string, signature: string, payload: any) {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    try {
      let result: any = null;

      // Verify webhook signature
      const verifiedPayload = await this.payments.handleWebhook(provider, signature, payload);

      // Route to appropriate handler
      switch (provider) {
        case 'stripe':
          result = await this.handleStripeWebhook(verifiedPayload);
          break;
        case 'paypal':
          result = await this.handlePayPalWebhook(verifiedPayload);
          break;
        case 'sendgrid':
          result = await this.communications.handleWebhook('sendgrid', verifiedPayload);
          break;
        case 'intercom':
          result = await this.communications.handleWebhook('intercom', verifiedPayload);
          break;
        case 'yelp':
          result = await this.marketing.handleWebhook('yelp', verifiedPayload);
          break;
        case 'houzz':
          result = await this.marketing.handleWebhook('houzz', verifiedPayload);
          break;
        default:
          throw new Error(`Webhook provider ${provider} not supported`);
      }

      // Log webhook processing
      this.security.logAuditEvent('webhook_processed', {
        provider,
        eventType: verifiedPayload.type || 'unknown',
      });

      return result;
    } catch (error) {
      this.security.logAuditEvent('webhook_processing_failed', {
        provider,
        error: error.message,
      }, 'error');

      throw error;
    }
  }

  private async handleStripeWebhook(payload: any) {
    switch (payload.type) {
      case 'payment_intent.succeeded':
        this.analytics.trackEvent('Payment', 'Stripe Success', payload.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        this.analytics.trackEvent('Payment', 'Stripe Failed', payload.data.object.id);
        break;
      case 'invoice.payment_succeeded':
        this.analytics.trackEvent('Payment', 'Invoice Paid', payload.data.object.id);
        break;
      default:
        console.log(`Unhandled Stripe webhook type: ${payload.type}`);
    }

    return { processed: true, type: payload.type };
  }

  private async handlePayPalWebhook(payload: any) {
    switch (payload.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        this.analytics.trackEvent('Payment', 'PayPal Success', payload.resource.id);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        this.analytics.trackEvent('Payment', 'PayPal Denied', payload.resource.id);
        break;
      default:
        console.log(`Unhandled PayPal webhook type: ${payload.event_type}`);
    }

    return { processed: true, type: payload.event_type };
  }

  // Health Check
  async healthCheck() {
    if (!this.initialized) {
      return {
        status: 'unhealthy',
        message: 'Integration Hub not initialized',
        timestamp: new Date().toISOString(),
      };
    }

    return this.testSuite.healthCheck();
  }

  // Run Integration Tests
  async runTests() {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    const results = await this.testSuite.runAllTests();

    // Generate and log report
    const report = this.testSuite.generateReport(results);
    console.log('\n' + report);

    return results;
  }

  // Get Service Statuses
  getServiceStatuses() {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    return {
      payments: this.getServiceStatus('payments'),
      communications: this.getServiceStatus('communications'),
      analytics: this.getServiceStatus('analytics'),
      business: this.getServiceStatus('business'),
      marketing: this.getServiceStatus('marketing'),
      security: this.getServiceStatus('security'),
    };
  }

  // Get Individual Services (for advanced usage)
  getPayments() { return this.payments; }
  getCommunications() { return this.communications; }
  getAnalytics() { return this.analytics; }
  getBusiness() { return this.business; }
  getMarketing() { return this.marketing; }
  getSecurity() { return this.security; }
  getTestSuite() { return this.testSuite; }

  // Configuration Methods
  updateConfig(service: string, newConfig: any) {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    switch (service) {
      case 'payments':
        this.config.payments = { ...this.config.payments, ...newConfig };
        this.payments = new PaymentProcessorHub(this.config.payments);
        break;
      case 'communications':
        this.config.communications = { ...this.config.communications, ...newConfig };
        this.communications = new CommunicationHub(this.config.communications);
        break;
      case 'analytics':
        this.config.analytics = { ...this.config.analytics, ...newConfig };
        this.analytics = new AnalyticsHub(this.config.analytics);
        break;
      case 'business':
        this.config.business = { ...this.config.business, ...newConfig };
        this.business = new BusinessHub(this.config.business);
        break;
      case 'marketing':
        this.config.marketing = { ...this.config.marketing, ...newConfig };
        this.marketing = new MarketingHub(this.config.marketing);
        break;
      case 'security':
        this.config.security = { ...this.config.security, ...newConfig };
        this.security = new SecurityHub(this.config.security);
        break;
      default:
        throw new Error(`Unknown service: ${service}`);
    }

    console.log(`✅ ${service} configuration updated`);
  }

  getConfig() {
    if (!this.initialized) throw new Error('Integration Hub not initialized');

    return {
      payments: this.config.payments,
      communications: this.config.communications,
      analytics: this.config.analytics,
      business: this.config.business,
      marketing: this.config.marketing,
      security: this.config.security,
      testing: this.config.testing,
    };
  }
}

// Global Integration Hub Instance
let integrationHub: EnterpriseIntegrationHub | null = null;

export const getIntegrationHub = (): EnterpriseIntegrationHub => {
  if (!integrationHub) {
    integrationHub = new EnterpriseIntegrationHub();
  }
  return integrationHub;
};

// Initialize on module load (in production)
if (process.env.NODE_ENV === 'production') {
  getIntegrationHub();
}

// Export all individual modules and configurations
export * from './payments';
export * from './communications';
export * from './analytics';
export * from './business';
export * from './marketing';
export * from './security';
export * from './testing';

export default EnterpriseIntegrationHub;