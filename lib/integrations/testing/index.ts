/**
 * Integration Testing Suite
 * Comprehensive testing for all integrated services
 */

import { PaymentProcessorHub, getPaymentConfig } from '../payments';
import { CommunicationHub, getCommunicationConfig } from '../communications';
import { AnalyticsHub, getAnalyticsConfig } from '../analytics';
import { BusinessHub, getBusinessConfig } from '../business';
import { MarketingHub, getMarketingConfig } from '../marketing';
import { SecurityHub, getSecurityConfig } from '../security';

// Test Configuration
export interface TestConfig {
  timeout: number;
  retries: number;
  mockData: boolean;
  parallel: boolean;
  verbose: boolean;
}

export interface TestResult {
  service: string;
  test: string;
  status: 'pass' | 'fail' | 'skip' | 'error';
  duration: number;
  message?: string;
  details?: any;
  error?: any;
}

export interface TestSuite {
  name: string;
  tests: Array<{
    name: string;
    timeout?: number;
    retries?: number;
    skip?: boolean;
    run: () => Promise<TestResult>;
  }>;
}

export class IntegrationTestSuite {
  private config: TestConfig;
  private results: TestResult[] = [];
  private services: {
    payments: PaymentProcessorHub;
    communications: CommunicationHub;
    analytics: AnalyticsHub;
    business: BusinessHub;
    marketing: MarketingHub;
    security: SecurityHub;
  };

  constructor(config: TestConfig) {
    this.config = config;
    this.initializeServices();
  }

  private initializeServices() {
    this.services = {
      payments: new PaymentProcessorHub(getPaymentConfig()),
      communications: new CommunicationHub(getCommunicationConfig()),
      analytics: new AnalyticsHub(getAnalyticsConfig()),
      business: new BusinessHub(getBusinessConfig()),
      marketing: new MarketingHub(getMarketingConfig()),
      security: new SecurityHub(getSecurityConfig()),
    };
  }

  // Payment Processing Tests
  private getPaymentTests(): TestSuite {
    return {
      name: 'Payment Processing',
      tests: [
        {
          name: 'Stripe Payment Intent Creation',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const result = await this.services.payments.createStripePaymentIntent(
                100.00,
                'USD',
                { test: 'integration' }
              );
              return {
                service: 'payments',
                test: 'stripe_payment_intent',
                status: result?.id ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { intentId: result?.id },
              };
            } catch (error) {
              return {
                service: 'payments',
                test: 'stripe_payment_intent',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'PayPal Order Creation',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const result = this.services.payments.createPayPalOrder(100.00, 'USD');
              return {
                service: 'payments',
                test: 'paypal_order_creation',
                status: result?.intent ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { order: result },
              };
            } catch (error) {
              return {
                service: 'payments',
                test: 'paypal_order_creation',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Payment Method Validation',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const validResult = this.services.payments.validatePaymentMethod('stripe', {
                amount: 100,
                currency: 'USD',
              });
              const invalidResult = this.services.payments.validatePaymentMethod('stripe', {});

              return {
                service: 'payments',
                test: 'payment_validation',
                status: validResult && !invalidResult ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { validResult, invalidResult },
              };
            } catch (error) {
              return {
                service: 'payments',
                test: 'payment_validation',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Communication Tests
  private getCommunicationTests(): TestSuite {
    return {
      name: 'Communications',
      tests: [
        {
          name: 'SendGrid Email Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              // Test configuration only (don't send actual email)
              const config = getCommunicationConfig();
              const hasConfig = !!(config.sendgrid?.apiKey && config.sendgrid?.fromEmail);

              return {
                service: 'communications',
                test: 'sendgrid_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'communications',
                test: 'sendgrid_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Twilio SMS Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getCommunicationConfig();
              const hasConfig = !!(config.twilio?.accountSid && config.twilio?.authToken);

              return {
                service: 'communications',
                test: 'twilio_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'communications',
                test: 'twilio_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Multi-channel Notification',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const result = await this.services.communications.sendMultiChannelNotification(
                { email: 'test@example.com' },
                'Test notification',
                { channels: ['slack'] }
              );

              return {
                service: 'communications',
                test: 'multichannel_notification',
                status: Array.isArray(result) ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { results: result },
              };
            } catch (error) {
              return {
                service: 'communications',
                test: 'multichannel_notification',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Analytics Tests
  private getAnalyticsTests(): TestSuite {
    return {
      name: 'Analytics',
      tests: [
        {
          name: 'Analytics Initialization',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getAnalyticsConfig();
              const hasConfig = !!(config.googleAnalytics || config.vercelAnalytics);

              return {
                service: 'analytics',
                test: 'initialization',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'analytics',
                test: 'initialization',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Event Tracking',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              // Test event tracking (should not throw errors)
              this.services.analytics.trackEvent('Test', 'Event', 'test', 1);

              return {
                service: 'analytics',
                test: 'event_tracking',
                status: 'pass',
                duration: Date.now() - startTime,
                details: { event: 'tracked' },
              };
            } catch (error) {
              return {
                service: 'analytics',
                test: 'event_tracking',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'E-commerce Tracking',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              this.services.analytics.trackProductView('test-123', 'Test Product', 99.99, 'Test Category');

              return {
                service: 'analytics',
                test: 'ecommerce_tracking',
                status: 'pass',
                duration: Date.now() - startTime,
                details: { event: 'product_view_tracked' },
              };
            } catch (error) {
              return {
                service: 'analytics',
                test: 'ecommerce_tracking',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Business Operations Tests
  private getBusinessTests(): TestSuite {
    return {
      name: 'Business Operations',
      tests: [
        {
          name: 'QuickBooks Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getBusinessConfig();
              const hasConfig = !!(config.quickbooks?.clientId && config.quickbooks?.clientSecret);

              return {
                service: 'business',
                test: 'quickbooks_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'business',
                test: 'quickbooks_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Salesforce Connection',
          timeout: 15000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getBusinessConfig();
              const hasConfig = !!(config.salesforce?.username && config.salesforce?.password);

              if (!hasConfig) {
                return {
                  service: 'business',
                  test: 'salesforce_connection',
                  status: 'skip',
                  duration: Date.now() - startTime,
                  details: { configured: false },
                };
              }

              // Test connection with a simple query
              const result = await this.services.business.querySalesforce('SELECT Id FROM Account LIMIT 1');

              return {
                service: 'business',
                test: 'salesforce_connection',
                status: result ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { connected: true },
              };
            } catch (error) {
              return {
                service: 'business',
                test: 'salesforce_connection',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Zendesk Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getBusinessConfig();
              const hasConfig = !!(config.zendesk?.subdomain && config.zendesk?.token);

              return {
                service: 'business',
                test: 'zendesk_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'business',
                test: 'zendesk_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Marketing Tests
  private getMarketingTests(): TestSuite {
    return {
      name: 'Marketing & SEO',
      tests: [
        {
          name: 'SEMrush Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getMarketingConfig();
              const hasConfig = !!config.semrush?.apiKey;

              return {
                service: 'marketing',
                test: 'semrush_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'marketing',
                test: 'semrush_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Ahrefs Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getMarketingConfig();
              const hasConfig = !!config.ahrefs?.accessToken;

              return {
                service: 'marketing',
                test: 'ahrefs_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'marketing',
                test: 'ahrefs_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Google Search Console Configuration',
          timeout: 10000,
          run: async () => {
            const startTime = Date.now();
            try {
              const config = getMarketingConfig();
              const hasConfig = !!(config.googleSearchConsole?.clientId && config.googleSearchConsole?.clientSecret);

              return {
                service: 'marketing',
                test: 'gsc_config',
                status: hasConfig ? 'pass' : 'skip',
                duration: Date.now() - startTime,
                details: { configured: hasConfig },
              };
            } catch (error) {
              return {
                service: 'marketing',
                test: 'gsc_config',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Security Tests
  private getSecurityTests(): TestSuite {
    return {
      name: 'Security',
      tests: [
        {
          name: 'Encryption/Decryption',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const testData = 'Sensitive test data';
              const encrypted = this.services.security.encrypt(testData);
              const decrypted = this.services.security.decrypt(encrypted);

              return {
                service: 'security',
                test: 'encryption',
                status: decrypted === testData ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { original: testData, decrypted },
              };
            } catch (error) {
              return {
                service: 'security',
                test: 'encryption',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'JWT Token Generation',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const payload = { userId: 'test-user', role: 'user' };
              const token = this.services.security.generateToken(payload);
              const verified = this.services.security.verifyToken(token);

              return {
                service: 'security',
                test: 'jwt_tokens',
                status: verified.userId === payload.userId ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { payload, verified },
              };
            } catch (error) {
              return {
                service: 'security',
                test: 'jwt_tokens',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'API Key Generation',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const apiKeyData = this.services.security.generateApiKey('test-user', ['read', 'write']);
              const validatedKey = this.services.security.validateApiKey(apiKeyData.apiKey);

              return {
                service: 'security',
                test: 'api_keys',
                status: validatedKey.userId === 'test-user' ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { keyId: apiKeyData.keyId, validated: validatedKey },
              };
            } catch (error) {
              return {
                service: 'security',
                test: 'api_keys',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Input Validation',
          timeout: 5000,
          run: async () => {
            const startTime = Date.now();
            try {
              const emailValid = this.services.security.validateEmail('test@example.com');
              const emailInvalid = !this.services.security.validateEmail('invalid-email');
              const passwordValid = this.services.security.validatePassword('Test123!@#');
              const phoneValid = this.services.security.validatePhone('+1-555-123-4567');

              const allValid = emailValid && emailInvalid && passwordValid.valid && phoneValid;

              return {
                service: 'security',
                test: 'validation',
                status: allValid ? 'pass' : 'fail',
                duration: Date.now() - startTime,
                details: { emailValid, emailInvalid, passwordValid, phoneValid },
              };
            } catch (error) {
              return {
                service: 'security',
                test: 'validation',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Integration Tests (Cross-Service)
  private getIntegrationTests(): TestSuite {
    return {
      name: 'Cross-Service Integration',
      tests: [
        {
          name: 'Order Processing Workflow',
          timeout: 20000,
          run: async () => {
            const startTime = Date.now();
            try {
              // Simulate order processing across multiple services
              const orderData = {
                id: 'test-order-123',
                customer: {
                  email: 'test@example.com',
                  name: 'Test Customer',
                  phone: '+1-555-123-4567',
                  address: {
                    line1: '123 Test St',
                    city: 'Test City',
                    state: 'TS',
                    postalCode: '12345',
                    country: 'US',
                  },
                },
                items: [
                  { sku: 'TEST-001', name: 'Test Product', price: 99.99, quantity: 1 }
                ],
                total: 99.99,
                status: 'paid',
              };

              // Test analytics tracking
              this.services.analytics.trackPurchase('test-order-123', 99.99, orderData.items);

              // Test business operations sync
              const syncResult = await this.services.business.syncOrderToAllSystems(orderData);

              // Test security audit logging
              this.services.security.logAuditEvent('order_processed', { orderId: orderData.id }, 'info', 'test-user');

              return {
                service: 'integration',
                test: 'order_workflow',
                status: 'pass',
                duration: Date.now() - startTime,
                details: { orderProcessed: true, syncResult },
              };
            } catch (error) {
              return {
                service: 'integration',
                test: 'order_workflow',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
        {
          name: 'Customer Onboarding Flow',
          timeout: 15000,
          run: async () => {
            const startTime = Date.now();
            try {
              const customerData = {
                email: 'newcustomer@example.com',
                name: 'New Customer',
                phone: '+1-555-987-6543',
              };

              // Test analytics user identification
              this.services.analytics.identifyUser('new-user-123', customerData);

              // Test communication (welcome email would be sent)
              const notificationResult = await this.services.communications.sendNotification(
                'email',
                customerData.email,
                'Welcome to PG Closets!',
                { subject: 'Welcome' }
              );

              // Test business operations (create lead in CRM)
              const leadResult = await this.services.business.createSalesforceLead({
                firstName: customerData.name.split(' ')[0],
                lastName: customerData.name.split(' ')[1] || 'Customer',
                email: customerData.email,
                phone: customerData.phone,
                source: 'Website',
              });

              return {
                service: 'integration',
                test: 'customer_onboarding',
                status: 'pass',
                duration: Date.now() - startTime,
                details: { customerIdentified: true, leadResult },
              };
            } catch (error) {
              return {
                service: 'integration',
                test: 'customer_onboarding',
                status: 'error',
                duration: Date.now() - startTime,
                message: error.message,
                error,
              };
            }
          },
        },
      ],
    };
  }

  // Test Execution
  async runAllTests(): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      skipped: number;
      errors: number;
      duration: number;
    };
    results: TestResult[];
    suites: Array<{
      name: string;
      summary: any;
      results: TestResult[];
    }>;
  }> {
    const suites = [
      this.getPaymentTests(),
      this.getCommunicationTests(),
      this.getAnalyticsTests(),
      this.getBusinessTests(),
      this.getMarketingTests(),
      this.getSecurityTests(),
      this.getIntegrationTests(),
    ];

    const overallStartTime = Date.now();
    const allResults: TestResult[] = [];
    const suiteResults: any[] = [];

    for (const suite of suites) {
      const suiteStartTime = Date.now();
      const suiteResults: TestResult[] = [];

      if (this.config.verbose) {
        console.log(`\n🧪 Running ${suite.name} tests...`);
      }

      for (const test of suite.tests) {
        if (test.skip) {
          const result: TestResult = {
            service: 'unknown',
            test: test.name,
            status: 'skip',
            duration: 0,
            message: 'Test skipped',
          };
          suiteResults.push(result);
          continue;
        }

        const testStartTime = Date.now();
        let result: TestResult;

        try {
          const timeout = test.timeout || this.config.timeout;
          result = await this.runTestWithTimeout(test.run, timeout);
        } catch (error) {
          result = {
            service: 'unknown',
            test: test.name,
            status: 'error',
            duration: Date.now() - testStartTime,
            message: error.message,
            error,
          };
        }

        suiteResults.push(result);
        allResults.push(result);

        if (this.config.verbose) {
          const statusIcon = this.getStatusIcon(result.status);
          console.log(`  ${statusIcon} ${test.name} (${result.duration}ms)`);
          if (result.message) {
            console.log(`    ${result.message}`);
          }
        }
      }

      const suiteSummary = this.calculateSummary(suiteResults);
      suiteResults.push({
        service: 'suite',
        test: suite.name,
        status: suiteSummary.failed === 0 ? 'pass' : 'fail',
        duration: Date.now() - suiteStartTime,
        details: suiteSummary,
      });

      suiteResults.push({
        results: suiteResults,
        name: suite.name,
        summary: suiteSummary,
      });
    }

    const overallSummary = this.calculateSummary(allResults);
    const totalDuration = Date.now() - overallStartTime;

    if (this.config.verbose) {
      console.log('\n📊 Test Results Summary:');
      console.log(`  Total: ${overallSummary.total}`);
      console.log(`  ✅ Passed: ${overallSummary.passed}`);
      console.log(`  ❌ Failed: ${overallSummary.failed}`);
      console.log(`  ⏭️  Skipped: ${overallSummary.skipped}`);
      console.log(`  🚨 Errors: ${overallSummary.errors}`);
      console.log(`  ⏱️  Duration: ${totalDuration}ms`);
    }

    return {
      summary: { ...overallSummary, duration: totalDuration },
      results: allResults,
      suites: suiteResults,
    };
  }

  private async runTestWithTimeout(testFn: () => Promise<TestResult>, timeout: number): Promise<TestResult> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Test timed out after ${timeout}ms`));
      }, timeout);

      testFn()
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private calculateSummary(results: TestResult[]) {
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      skipped: results.filter(r => r.status === 'skip').length,
      errors: results.filter(r => r.status === 'error').length,
      duration: 0,
    };

    summary.duration = results.reduce((total, result) => total + result.duration, 0);

    return summary;
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'skip': return '⏭️';
      case 'error': return '🚨';
      default: return '❓';
    }
  }

  // Generate Test Report
  generateReport(results: any): string {
    const report = [
      '# Integration Test Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Summary',
      `- Total Tests: ${results.summary.total}`,
      `- Passed: ${results.summary.passed}`,
      `- Failed: ${results.summary.failed}`,
      `- Skipped: ${results.summary.skipped}`,
      `- Errors: ${results.summary.errors}`,
      `- Duration: ${results.summary.duration}ms`,
      '',
      '## Test Suites',
    ];

    for (const suite of results.suites) {
      if (!suite.results) continue;

      report.push(`### ${suite.name}`);
      report.push(`- Tests: ${suite.summary.total}`);
      report.push(`- Passed: ${suite.summary.passed}`);
      report.push(`- Failed: ${suite.summary.failed}`);
      report.push(`- Duration: ${suite.summary.duration}ms`);
      report.push('');

      for (const result of suite.results) {
        if (result.service === 'suite') continue;

        const status = result.status.toUpperCase();
        const icon = this.getStatusIcon(result.status);
        report.push(`${icon} **${result.test}** - ${status} (${result.duration}ms)`);

        if (result.message) {
          report.push(`  - ${result.message}`);
        }

        if (result.details && Object.keys(result.details).length > 0) {
          report.push(`  - Details: ${JSON.stringify(result.details, null, 2)}`);
        }

        report.push('');
      }
    }

    // Add failed tests details
    const failedTests = results.results.filter(r => r.status === 'fail' || r.status === 'error');
    if (failedTests.length > 0) {
      report.push('## Failed Tests');
      report.push('');

      for (const test of failedTests) {
        report.push(`### ${test.service}: ${test.test}`);
        report.push(`**Status:** ${test.status}`);
        report.push(`**Message:** ${test.message || 'No message'}`);

        if (test.error) {
          report.push('**Error:**');
          report.push('```');
          report.push(test.error.stack || test.error.message || String(test.error));
          report.push('```');
        }

        report.push('');
      }
    }

    return report.join('\n');
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'healthy' | 'unhealthy' | 'degraded'>;
    timestamp: string;
  }> {
    const healthStatus: Record<string, 'healthy' | 'unhealthy' | 'degraded'> = {};

    try {
      // Check each service health
      healthStatus.payments = await this.checkServiceHealth('payments');
      healthStatus.communications = await this.checkServiceHealth('communications');
      healthStatus.analytics = await this.checkServiceHealth('analytics');
      healthStatus.business = await this.checkServiceHealth('business');
      healthStatus.marketing = await this.checkServiceHealth('marketing');
      healthStatus.security = 'healthy'; // Security is always "healthy" if initialized

      const statuses = Object.values(healthStatus);
      let overallStatus: 'healthy' | 'degraded' | 'unhealthy';

      if (statuses.every(status => status === 'healthy')) {
        overallStatus = 'healthy';
      } else if (statuses.some(status => status === 'unhealthy')) {
        overallStatus = 'unhealthy';
      } else {
        overallStatus = 'degraded';
      }

      return {
        status: overallStatus,
        services: healthStatus,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        services: healthStatus,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkServiceHealth(serviceName: string): Promise<'healthy' | 'unhealthy' | 'degraded'> {
    try {
      switch (serviceName) {
        case 'payments':
          const paymentConfig = getPaymentConfig();
          return paymentConfig.stripe || paymentConfig.paypal ? 'healthy' : 'degraded';

        case 'communications':
          const commConfig = getCommunicationConfig();
          return commConfig.sendgrid || commConfig.twilio ? 'healthy' : 'degraded';

        case 'analytics':
          const analyticsConfig = getAnalyticsConfig();
          return analyticsConfig.googleAnalytics || analyticsConfig.vercelAnalytics ? 'healthy' : 'degraded';

        case 'business':
          const businessConfig = getBusinessConfig();
          const hasAnyBusinessConfig = businessConfig.quickbooks || businessConfig.salesforce || businessConfig.zendesk;
          return hasAnyBusinessConfig ? 'healthy' : 'degraded';

        case 'marketing':
          const marketingConfig = getMarketingConfig();
          const hasAnyMarketingConfig = marketingConfig.semrush || marketingConfig.ahrefs || marketingConfig.googleSearchConsole;
          return hasAnyMarketingConfig ? 'healthy' : 'degraded';

        default:
          return 'degraded';
      }
    } catch (error) {
      return 'unhealthy';
    }
  }
}

// Configuration Helper
export const getTestConfig = (): TestConfig => {
  return {
    timeout: 15000, // 15 seconds
    retries: 2,
    mockData: process.env.NODE_ENV === 'test',
    parallel: true,
    verbose: process.env.VERBOSE_TESTS === 'true',
  };
};