# Email Notification System - Quote Requests

## Overview

This directory contains the email notification system for quote requests. When a customer submits a quote request, the system automatically sends:

1. **Customer Confirmation Email** - A professional confirmation to the customer with their quote details
2. **Sales Team Notification** - A detailed notification to the sales team with customer information and action items

## Files

- **`templates/quote-confirmation.tsx`** - React Email template for customer confirmation emails
- **`send-quote-email.ts`** - Email service that handles sending both customer and sales notifications
- **`lead-notification.ts`** - Lead notification service (existing)
- **`newsletter.ts`** - Newsletter subscription service (existing)

## Setup Instructions

### 1. Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email Addresses
EMAIL_FROM="PG Closets <noreply@pgclosets.com>"
SALES_TEAM_EMAIL="sales@pgclosets.com"
ADMIN_EMAIL="admin@pgclosets.com"  # Fallback if SALES_TEAM_EMAIL not set
```

### 2. Set Up Resend Account

1. Sign up for a Resend account at [https://resend.com](https://resend.com)
2. Add and verify your domain (e.g., pgclosets.com)
3. Configure DNS records (SPF, DKIM, DMARC) for email authentication
4. Generate an API key from the Resend dashboard
5. Add the API key to your environment variables

### 3. Test the Integration

The email system is already integrated with the quote request API at:
- **API Route:** `/app/api/quotes/quick/route.ts`

When a quote is submitted successfully:
- The quote is saved to the database
- Slack notification is sent (if configured)
- Email notifications are sent in the background (non-blocking)

## Email Templates

### Customer Confirmation Email

The customer receives a professional email that includes:

- ✅ Quote number and submission timestamp
- ✅ Product details (name, category, price, selected options)
- ✅ Customer's notes/requirements
- ✅ Next steps in the quote process (4-step workflow)
- ✅ Contact information (phone and email)
- ✅ Call-to-action to browse products
- ✅ Trust signals (free consultation, custom designs, professional installation)

### Sales Team Notification Email

The sales team receives a detailed notification with:

- 🎯 Customer information (name, email, phone, province)
- 🎯 Quote details (quote number, timestamp)
- 🎯 Product interest (name, category, price, options)
- 🎯 Customer notes and requirements
- 🎯 Next steps checklist for follow-up
- 🎯 Quick action buttons (reply to customer, call customer)

## Development Mode

When `RESEND_API_KEY` is not configured:
- Emails will not be sent
- Email details will be logged to the console (in development)
- The quote request will still succeed (emails are non-blocking)

This allows development without requiring Resend configuration.

## Email Sending Flow

```
Quote Submission
    ↓
Database Insert
    ↓
Send Emails (Background, Parallel)
    ├─→ Customer Confirmation
    └─→ Sales Team Notification
    ↓
Response Returned (Doesn't wait for emails)
```

The email sending happens in the background and doesn't block the API response. If email sending fails, the quote request still succeeds.

## Customization

### Update Email Content

Edit the React Email template:
```bash
/home/user/pgclosets-store/lib/email/templates/quote-confirmation.tsx
```

### Update Sales Notification

Edit the sales notification HTML in:
```bash
/home/user/pgclosets-store/lib/email/send-quote-email.ts
# See the sendQuoteNotificationToSales() function
```

### Change Email Addresses

Update environment variables in `.env.local`:
```bash
EMAIL_FROM="Your Company <noreply@yourdomain.com>"
SALES_TEAM_EMAIL="yoursales@yourdomain.com"
```

## Testing

### Test Email Sending Locally

```typescript
import { sendQuoteEmails } from '@/lib/email/send-quote-email';

const result = await sendQuoteEmails({
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "(613) 555-0123",
    province: "ON"
  },
  quote: {
    quoteNumber: "Q-TEST-12345",
    receivedAt: new Date().toISOString()
  },
  product: {
    name: "Walk-in Closet",
    category: "Custom Closets",
    price: 5000,
    selectedOptions: {
      "Finish": "White",
      "Hardware": "Chrome"
    }
  },
  notes: "Looking for a modern design with lots of drawer space."
});

console.log('Emails sent:', result);
```

### Preview Email Template

Use React Email's preview feature:

```bash
npm run email:dev
```

This will start a local server where you can preview and test email templates.

## Monitoring

### Check Email Logs

All email sending is logged with the `[QUOTE_EMAIL]` prefix:

```bash
# Success
[QUOTE_EMAIL] Confirmation email sent successfully: { emailId: '...', to: '...', quoteNumber: '...' }
[QUOTE_EMAIL] Sales notification sent successfully: { emailId: '...', to: '...', quoteNumber: '...' }

# Errors
[QUOTE_EMAIL] Failed to send confirmation email: { error details }
[QUOTE_EMAIL] Resend API key not configured. Email not sent.
```

### Resend Dashboard

Monitor email delivery, opens, clicks, and bounces in your Resend dashboard:
- [https://resend.com/emails](https://resend.com/emails)

## Troubleshooting

### Emails Not Sending

1. **Check API Key:** Ensure `RESEND_API_KEY` is set in `.env.local`
2. **Verify Domain:** Confirm your domain is verified in Resend dashboard
3. **Check DNS Records:** Ensure SPF, DKIM, and DMARC records are configured
4. **Review Logs:** Check server logs for `[QUOTE_EMAIL]` error messages

### Emails Going to Spam

1. **Authentication:** Verify DNS records (SPF, DKIM, DMARC) are properly configured
2. **From Address:** Use a domain-based email address, not a free email provider
3. **Content:** Avoid spam trigger words and excessive links
4. **Reputation:** Monitor bounce and complaint rates in Resend dashboard

### Template Rendering Issues

1. **React Email Components:** Ensure `@react-email/components` is installed
2. **TypeScript Errors:** The template uses `@ts-nocheck` to bypass type checking
3. **Preview Locally:** Use `npm run email:dev` to preview templates before deployment

## Support

For issues related to:
- **Email Template Design:** Edit `/lib/email/templates/quote-confirmation.tsx`
- **Email Sending Logic:** Edit `/lib/email/send-quote-email.ts`
- **API Integration:** Edit `/app/api/quotes/quick/route.ts`
- **Resend Configuration:** Visit [Resend Documentation](https://resend.com/docs)

## Future Enhancements

Consider adding:
- [ ] Email scheduling (send follow-up emails automatically)
- [ ] A/B testing for email subject lines
- [ ] Email open and click tracking
- [ ] Customer preference center (opt-out options)
- [ ] Email templates for other workflows (order confirmation, appointment reminders, etc.)
- [ ] Multi-language support for emails
