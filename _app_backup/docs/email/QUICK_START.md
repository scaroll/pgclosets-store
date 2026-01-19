# Email Marketing System - Quick Start Guide

## 🚀 Get Started in 15 Minutes

### Step 1: Environment Setup (5 minutes)

```bash
# 1. Sign up for Resend (https://resend.com)
# 2. Add your domain and verify DNS records
# 3. Get your API key from dashboard
# 4. Add to .env.local:

RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM="PG Closets <hello@pgclosets.ca>"
EMAIL_REPLY_TO="info@pgclosets.ca"
CONTACT_EMAIL="info@pgclosets.ca"
```

### Step 2: Initialize Workflow Engine (5 minutes)

```typescript
// lib/email/email-service.ts
import WorkflowEngine from '@/lib/email/marketing/workflow-engine';
import { ALL_WORKFLOWS } from '@/lib/email/marketing/workflows';

// Create singleton instance
export const emailEngine = new WorkflowEngine('resend');

// Register all workflows
ALL_WORKFLOWS.forEach(workflow => {
  emailEngine.registerWorkflow(workflow);
});

export default emailEngine;
```

### Step 3: Add to Newsletter Signup (5 minutes)

```typescript
// app/api/newsletter/subscribe/route.ts
import { subscribeToNewsletter } from '@/lib/email/newsletter';
import emailEngine from '@/lib/email/email-service';

export async function POST(request: Request) {
  const { email, firstName, lastName } = await request.json();

  // Subscribe to newsletter
  const result = await subscribeToNewsletter({ email, firstName, lastName });

  if (result.success) {
    // Start welcome series workflow
    await emailEngine.startWorkflow('welcome-series', {
      email,
      firstName,
      lastName,
      metadata: {
        signupSource: 'newsletter-popup',
        signupDate: new Date()
      }
    });
  }

  return Response.json(result);
}
```

### Step 4: Setup Cron Job (Optional but Recommended)

```typescript
// app/api/cron/process-emails/route.ts
import emailEngine from '@/lib/email/email-service';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Process scheduled emails
  await emailEngine.processScheduledEmails();

  return Response.json({ success: true, timestamp: new Date().toISOString() });
}

// Add to vercel.json:
{
  "crons": [{
    "path": "/api/cron/process-emails",
    "schedule": "*/15 * * * *"
  }]
}
```

## 📧 Common Use Cases

### Start Welcome Series
```typescript
await emailEngine.startWorkflow('welcome-series', {
  email: 'customer@example.com',
  firstName: 'John',
  metadata: { signupSource: 'homepage' }
});
```

### Recover Abandoned Quote
```typescript
await emailEngine.startWorkflow('quote-abandonment', {
  email: 'customer@example.com',
  firstName: 'Sarah',
  metadata: {
    quoteId: 'quote_123',
    quoteValue: 5000,
    checkoutUrl: 'https://pgclosets.com/quote/quote_123'
  }
});
```

### Post-Purchase Nurture
```typescript
await emailEngine.startWorkflow('post-purchase', {
  email: 'customer@example.com',
  firstName: 'Mike',
  metadata: {
    orderId: 'order_456',
    orderValue: 8500,
    installationDate: '2025-11-15'
  }
});
```

### Seasonal Campaign
```typescript
// Send to all active subscribers
const subscribers = await getActiveSubscribers();

for (const subscriber of subscribers) {
  await emailEngine.startWorkflow('spring-refresh', {
    email: subscriber.email,
    firstName: subscriber.firstName,
    metadata: {
      segment: subscriber.segment,
      lastPurchase: subscriber.lastPurchaseDate
    }
  });
}
```

## 🎯 Segmentation Examples

### Query Active Subscribers
```typescript
import { SegmentationEngine } from '@/lib/email/marketing/segmentation';

const segmentEngine = new SegmentationEngine();

const activeSubscribers = segmentEngine.queryBySegment(allProfiles, {
  behavior: ['active', 'engaged'],
  recency: ['new', 'recent']
});
```

### Find High-Value At-Risk Customers
```typescript
const atRiskVIPs = segmentEngine.queryBySegment(allProfiles, {
  behavior: ['at-risk'],
  value: ['high-value'],
  funnel: ['customer']
});

// Send re-engagement with special offer
for (const customer of atRiskVIPs) {
  await emailEngine.startWorkflow('vip-customer', {
    email: customer.email,
    firstName: customer.firstName,
    metadata: {
      vipTier: 'platinum',
      specialOffer: '20% off next purchase'
    }
  });
}
```

### Geography-Based Targeting
```typescript
const ottawaWestSubscribers = segmentEngine.queryBySegment(allProfiles, {
  geography: ['ottawa-west'],
  funnel: ['subscriber', 'lead']
});

// Send showroom event invitation
```

## 📊 Track Performance

### Campaign Metrics
```typescript
import AnalyticsEngine from '@/lib/email/marketing/analytics';

const analytics = new AnalyticsEngine();

const metrics = analytics.getCampaignMetrics('welcome-series-001');

console.log(`
  Sent: ${metrics.totalSent}
  Open Rate: ${metrics.openRate}%
  Click Rate: ${metrics.clickRate}%
  Conversion Rate: ${metrics.conversionRate}%
`);
```

### Real-Time Dashboard
```typescript
const dashboard = analytics.getDashboardMetrics('7d');

console.log(`
  Total Sent (7 days): ${dashboard.overview.totalSent}
  Avg Open Rate: ${dashboard.overview.openRate}%
  Avg Click Rate: ${dashboard.overview.clickRate}%
`);
```

## 🧪 A/B Testing

### Subject Line Test
```typescript
const workflow = {
  ...WELCOME_SERIES,
  emails: [
    {
      ...WELCOME_SERIES.emails[0],
      abTest: {
        enabled: true,
        variants: [
          {
            id: 'control',
            subject: 'Welcome to PG Closets',
            templateId: 'welcome-brand-story',
            weight: 50
          },
          {
            id: 'personalized',
            subject: '{{firstName}}, Welcome to PG Closets!',
            templateId: 'welcome-brand-story',
            weight: 50
          }
        ]
      }
    }
  ]
};

emailEngine.registerWorkflow(workflow);
```

## 🔒 Compliance Checklist

### Before Sending First Email
- [ ] Domain authentication configured (SPF, DKIM, DMARC)
- [ ] Physical business address in email footer
- [ ] Unsubscribe link in every email
- [ ] Privacy policy link included
- [ ] Consent records stored with timestamp
- [ ] Preference center setup complete

### Every Campaign
- [ ] Subject line matches content (no deceptive subjects)
- [ ] Sender identification clear
- [ ] Unsubscribe prominent and functional
- [ ] Content reviewed for spam triggers
- [ ] Segment appropriate for offer/message

## 🎨 Customizing Templates

### Basic Template Customization
```typescript
// Create custom email HTML
const customWelcomeEmail = `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>Welcome, {{firstName}}!</h1>
      <p>{{customMessage}}</p>
      <a href="{{ctaUrl}}">{{ctaText}}</a>
    </body>
  </html>
`;

// Use in workflow
const workflow = {
  id: 'custom-welcome',
  emails: [{
    id: 'email-1',
    subject: 'Custom Welcome',
    templateId: 'custom-welcome-template',
    delay: { type: 'immediate' }
  }]
};
```

### React Email Templates (Recommended)
```bash
# Install React Email
npm install react-email @react-email/components

# Create template
# components/email/templates/WelcomeEmail.tsx
```

## 📈 Optimization Tips

### Improve Open Rates
1. Test subject lines (personalization, curiosity, value)
2. Optimize send times (use built-in optimization)
3. Clean inactive subscribers quarterly
4. Maintain sender reputation (low bounce/complaint rates)

### Improve Click Rates
1. Single, clear CTA above the fold
2. Mobile-responsive design
3. Personalized content based on segment
4. Relevant, valuable content

### Improve Conversions
1. Remove friction (direct links, pre-filled forms)
2. Create urgency (limited time offers)
3. Social proof (testimonials, reviews)
4. Clear value proposition

## 🆘 Common Issues

### Emails Not Sending
```typescript
// Check provider configuration
const verification = await emailEngine.espAgent.verifyConfiguration();
console.log(verification);

// If not configured:
// - Check RESEND_API_KEY in .env.local
// - Verify domain ownership in Resend dashboard
// - Check DNS records (SPF, DKIM)
```

### Low Deliverability
```typescript
// Check bounce and complaint rates
const metrics = analytics.getCampaignMetrics(campaignId);

if (metrics.bounceRate > 5) {
  console.log('High bounce rate - clean list');
  // Remove hard bounces from list
}

if (metrics.complaintRate > 0.5) {
  console.log('High complaint rate - review content');
  // Review for spam triggers, improve relevance
}
```

### Workflow Not Processing
```typescript
// Check workflow instance status
const instance = emailEngine.getInstance(instanceId);
console.log(instance.status); // 'active', 'paused', 'completed', 'cancelled'

// Resume if paused
if (instance.status === 'paused') {
  emailEngine.resumeWorkflow(instanceId);
}

// Check next scheduled email
console.log(instance.nextEmailScheduledFor);
```

## 📚 Next Steps

1. **Read Full Documentation:** `/docs/email/EMAIL_MARKETING_SYSTEM.md`
2. **Create Email Templates:** Use React Email for production templates
3. **Setup Analytics Dashboard:** Build UI with `/lib/email/marketing/analytics.ts`
4. **Implement Webhooks:** Track opens, clicks, bounces in real-time
5. **Train Team:** Share copywriting guidelines and brand voice
6. **Monitor Performance:** Weekly metrics review and optimization

## 🎯 30-Day Launch Plan

### Week 1: Setup & Configuration
- [ ] Configure ESP (Resend)
- [ ] Verify domain and DNS records
- [ ] Setup basic welcome workflow
- [ ] Test email sending

### Week 2: Content Creation
- [ ] Write all 8 workflow sequences
- [ ] Design email templates
- [ ] Create preference center
- [ ] Setup compliance pages

### Week 3: Integration & Testing
- [ ] Integrate with website forms
- [ ] Setup webhook handlers
- [ ] Test all workflows end-to-end
- [ ] QA across email clients

### Week 4: Launch & Monitor
- [ ] Soft launch to small segment
- [ ] Monitor deliverability and engagement
- [ ] Collect feedback and iterate
- [ ] Full launch to all subscribers

---

**Need Help?**
- Technical: dev@pgclosets.ca
- Content: marketing@pgclosets.ca
- Compliance: legal@pgclosets.ca
