# Enterprise Integration Hub

## Overview

The Enterprise Integration Hub provides centralized orchestration of 20+ essential enterprise services, enabling seamless integration across payment processing, communications, analytics, business operations, marketing, and security systems.

## Architecture

### Core Services

1. **Payment Processing (5 integrations)**
   - Stripe for credit cards
   - PayPal for alternative payments
   - Apple Pay and Google Pay
   - Adyen for Afterpay/Klarna financing
   - Square for in-person payments

2. **Communication Services (6 integrations)**
   - SendGrid for email marketing
   - Twilio for SMS notifications
   - Intercom for live chat
   - Mailchimp for newsletters
   - Slack for internal notifications

3. **Analytics & Tracking (5 integrations)**
   - Google Analytics 4
   - Google Tag Manager
   - Facebook Pixel
   - LinkedIn Insight Tag
   - Vercel Analytics

4. **Business Operations (4 integrations)**
   - QuickBooks for accounting
   - Salesforce for CRM
   - Zendesk for customer support
   - ShipStation for shipping

5. **Marketing & SEO (5 integrations)**
   - SEMrush for SEO tracking
   - Ahrefs for backlink monitoring
   - Google Search Console
   - Yelp for reviews
   - Houzz for portfolio

## Installation & Setup

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
SQUARE_APPLICATION_ID=...
SQUARE_ACCESS_TOKEN=...
SQUARE_LOCATION_ID=...
ADYEN_CLIENT_KEY=...
ADYEN_ORIGIN_KEY=...
APPLE_PAY_MERCHANT_ID=...
GOOGLE_PAY_MERCHANT_ID=...

# Communications
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@pgclosets.com
TWILIO_ACCOUNT_SID=AC....
TWILIO_AUTH_TOKEN=....
TWILIO_FROM_NUMBER=+1....
INTERCOM_ACCESS_TOKEN=....
MAILCHIMP_API_KEY=....
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=....
SLACK_BOT_TOKEN=xoxb-....
SLACK_CHANNEL_ID=C....

# Analytics
GA_TRACKING_ID=G-....
GTM_ID=GTM-....
GTM_AUTH=....
GTM_PREVIEW=env-....
HOTJAR_ID=123456
HOTJAR_SV=6
FACEBOOK_PIXEL_ID=1234567890123456
LINKEDIN_PARTNER_ID=123456

# Business Operations
QUICKBOOKS_CLIENT_ID=....
QUICKBOOKS_CLIENT_SECRET=....
QUICKBOOKS_REDIRECT_URI=....
QUICKBOOKS_REALM_ID=....
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_USERNAME=....
SALESFORCE_PASSWORD=....
SALESFORCE_SECURITY_TOKEN=....
ZENDESK_SUBDOMAIN=pgclosets
ZENDESK_USERNAME=....
ZENDESK_TOKEN=....
SHIPSTATION_API_KEY=....
SHIPSTATION_API_SECRET=....

# Marketing & SEO
SEMRUSH_API_KEY=....
AHREFS_ACCESS_TOKEN=....
GSC_CLIENT_ID=....
GSC_CLIENT_SECRET=....
GSC_REFRESH_TOKEN=....
YELP_API_KEY=....
HOUZZ_API_KEY=....

# Security
ENCRYPTION_SECRET_KEY=....
JWT_SECRET=....
ALLOWED_ORIGINS=https://pgclosets.com,https://www.pgclosets.com
```

## Usage Examples

### Basic Usage

```typescript
import { getIntegrationHub } from '@/lib/integrations';

const hub = getIntegrationHub();

// Process an order
const orderResult = await hub.processOrder({
  id: 'order-123',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe',
    phone: '+1-555-123-4567',
  },
  items: [
    { sku: 'CLOSET-001', name: 'Custom Closet', price: 2999.99, quantity: 1 }
  ],
  total: 2999.99,
  paymentMethod: 'stripe',
  paymentDetails: {
    amount: 2999.99,
    currency: 'USD',
  },
});

// Onboard a new customer
const customerResult = await hub.onboardCustomer({
  email: 'newcustomer@example.com',
  name: 'Jane Smith',
  phone: '+1-555-987-6543',
  source: 'website',
});
```

### Individual Service Usage

```typescript
import { getIntegrationHub } from '@/lib/integrations';

const hub = getIntegrationHub();

// Payment processing
const payments = hub.getPayments();
const paymentIntent = await payments.createStripePaymentIntent(100.00, 'USD');

// Communications
const communications = hub.getCommunications();
await communications.sendEmail('user@example.com', 'Welcome!', 'Welcome to PG Closets!');

// Analytics
const analytics = hub.getAnalytics();
analytics.trackEvent('User', 'Signup', 'Website Form');
analytics.trackPurchase('order-123', 99.99, items);

// Business operations
const business = hub.getBusiness();
const lead = await business.createSalesforceLead({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  source: 'Website',
});

// Marketing
const marketing = hub.getMarketing();
const seoAnalysis = await marketing.getComprehensiveSEOAnalysis('pgclosets.com');

// Security
const security = hub.getSecurity();
const encrypted = security.encrypt('Sensitive data');
const decrypted = security.decrypt(encrypted);
```

### React Components

```typescript
import { AnalyticsProvider, PayPalButton } from '@/lib/integrations';

// Wrap your app with analytics provider
function App() {
  return (
    <AnalyticsProvider>
      <YourApp />
    </AnalyticsProvider>
  );
}

// Use PayPal button
function Checkout() {
  return (
    <PayPalButton
      amount={99.99}
      currency="USD"
      onSuccess={(details) => console.log('Payment successful:', details)}
      onError={(error) => console.error('Payment failed:', error)}
    />
  );
}
```

## API Routes

Create these API routes to handle webhooks and server-side operations:

### `/api/webhooks/[provider]`
```typescript
import { getIntegrationHub } from '@/lib/integrations';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const hub = getIntegrationHub();
  const signature = request.headers.get('stripe-signature') ||
                   request.headers.get('paypal-transmission-sig') || '';
  const payload = await request.text();

  try {
    const result = await hub.handleWebhook(params.provider, signature, payload);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
```

### `/api/integrations/health`
```typescript
import { getIntegrationHub } from '@/lib/integrations';
import { NextResponse } from 'next/server';

export async function GET() {
  const hub = getIntegrationHub();
  const health = await hub.healthCheck();
  return NextResponse.json(health);
}
```

## Testing

Run the comprehensive integration test suite:

```typescript
import { getIntegrationHub } from '@/lib/integrations';

const hub = getIntegrationHub();
const testResults = await hub.runTests();

console.log('Test Results:', testResults);
```

## Features

### 🔄 Unified Workflows
- **Order Processing**: Automatic payment processing, business system sync, and customer notifications
- **Customer Onboarding**: CRM lead creation, welcome emails, and analytics tracking
- **Support Requests**: Ticket creation, customer notifications, and team alerts

### 🛡️ Security Features
- End-to-end encryption for sensitive data
- JWT-based authentication with refresh tokens
- API key management with rate limiting
- Comprehensive audit logging
- GDPR and CCPA compliance checks

### 📊 Analytics & Tracking
- Multi-channel event tracking
- E-commerce analytics
- User behavior tracking
- Performance monitoring
- A/B testing support

### 🏢 Business Operations
- Automated invoice creation
- Customer relationship management
- Shipping label generation
- Support ticket management
- Multi-system synchronization

### 📈 Marketing & SEO
- Keyword position tracking
- Competitor analysis
- Backlink monitoring
- Review management
- Content performance tracking

### 🧪 Testing & Monitoring
- Comprehensive integration test suite
- Health monitoring
- Performance metrics
- Error handling and recovery
- Real-time status dashboards

## Error Handling

All services implement standardized error handling:

```typescript
try {
  const result = await hub.processOrder(orderData);
  // Handle success
} catch (error) {
  // Error is automatically logged to audit trail
  // Standardized error format with context and recovery suggestions
  console.error('Order processing failed:', error.message);
}
```

## Monitoring & Maintenance

### Health Checks
```bash
curl https://yourdomain.com/api/integrations/health
```

### Audit Logs
Access comprehensive audit logs through the security hub:
```typescript
const security = hub.getSecurity();
const logs = security.getAuditLog({
  level: 'error',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});
```

### Performance Metrics
Monitor integration performance through built-in analytics:
```typescript
const metrics = await hub.getBusinessMetrics();
console.log('Business Operations Metrics:', metrics);
```

## Best Practices

1. **Always validate inputs** before processing
2. **Use error boundaries** to handle integration failures gracefully
3. **Monitor rate limits** to avoid API throttling
4. **Implement retry logic** for transient failures
5. **Secure API keys** using environment variables
6. **Regular health checks** to ensure service availability
7. **Audit logging** for compliance and debugging
8. **Test integrations** before production deployment

## Support

For integration issues:
1. Check the health check endpoint
2. Review audit logs for errors
3. Run the integration test suite
4. Verify environment variables
5. Check API rate limits and quotas

## License

This integration hub is proprietary to PG Closets and should not be distributed or used outside of authorized environments.