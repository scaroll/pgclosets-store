# Email & Notifications System

## Overview

PG Closets uses [Resend](https://resend.com) for sending transactional emails and [React Email](https://react.email) for creating responsive email templates.

## Features

### Email Types

1. **Order Confirmation** - Sent when an order is successfully placed
2. **Booking Confirmation** - Sent when a consultation is booked (includes .ics calendar file)
3. **Welcome Email** - Sent when a new user registers
4. **Password Reset** - Sent when a user requests a password reset

### Email Features

- Responsive HTML templates
- Support for attachments (ICS calendar files)
- Admin notifications for orders and bookings
- Automatic retry on failure
- Rate limiting to prevent abuse

## Configuration

### Required Environment Variables

```env
# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=PG Closets <noreply@pgclosets.com>
ADMIN_EMAIL=admin@pgclosets.com

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=https://pgclosets.com
```

### Getting Started with Resend

1. Sign up for a [Resend account](https://resend.com/signup)
2. Add and verify your domain
3. Create an API key
4. Add the API key to your `.env.local` file

## Usage

### Sending Emails Programmatically

```typescript
import { sendOrderConfirmation, sendBookingConfirmation, sendWelcomeEmail, sendPasswordReset } from '@/lib/email';

// Send order confirmation
await sendOrderConfirmation({
  orderNumber: 'PGC-2025-123456',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  orderDate: 'Monday, January 15, 2025',
  items: [
    {
      name: 'Premium Barn Door',
      quantity: 1,
      price: 49900, // in cents
      image: 'https://...'
    }
  ],
  subtotal: 49900,
  tax: 6487,
  shipping: 0,
  total: 56387,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Main St',
    city: 'Ottawa',
    province: 'ON',
    postalCode: 'K1A 0B1'
  }
});

// Send booking confirmation
await sendBookingConfirmation({
  bookingId: 'BK-1234567890',
  customerName: 'Jane Smith',
  service: 'Free In-Home Consultation',
  date: 'Thursday, January 18, 2025',
  time: '2:00 PM',
  duration: '90 minutes',
  location: 'Ottawa',
  address: '456 Oak Ave, Ottawa, ON K2B 1C2',
  projectType: 'Walk-in Closet',
  notes: 'Looking for custom shelving solution'
});

// Send welcome email
await sendWelcomeEmail({
  name: 'John Doe',
  email: 'john@example.com'
});

// Send password reset
await sendPasswordReset({
  name: 'John Doe',
  email: 'john@example.com',
  resetToken: 'abc123...'
});
```

### Creating New Email Templates

1. Create a new React component in `/emails/`:

```tsx
// emails/new-template.tsx
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
} from '@react-email/components';

interface NewTemplateProps {
  name: string;
  message: string;
}

export const NewTemplate = (props: NewTemplateProps) => {
  const { name, message } = props;

  return (
    <Html>
      <Head />
      <Preview>Your preview text here</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hello {name}!</Heading>
          <Text style={paragraph}>{message}</Text>
          <Button href="https://pgclosets.com" style={button}>
            Call to Action
          </Button>
        </Container>
      </Body>
    </Html>
  );
};

// Add styles...
const main = { /* ... */ };
const container = { /* ... */ };
// etc.
```

2. Add a sending function in `/lib/email.ts`:

```typescript
export async function sendNewEmail(data: NewEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: DEFAULT_FROM,
      to: data.email,
      subject: 'Your Subject Here',
      react: NewTemplate(data),
    });

    if (error) throw error;
    return emailData;
  } catch (error) {
    console.error('[Email] Error:', error);
    throw error;
  }
}
```

## Email Templates

### Order Confirmation
- Shows order details, items, pricing
- Includes shipping address
- Links to order tracking page

### Booking Confirmation
- Shows appointment details
- Includes preparation tips
- Attachable ICS calendar file
- Reschedule information

### Welcome Email
- Member benefits overview
- Quick action buttons
- Welcome discount code
- Helpful resources

### Password Reset
- Secure reset link (1-hour expiry)
- Security tips
- Contact support information

## Testing

### Local Development

During development, emails will be sent to the configured address in Resend. You can:

1. Use Resend's test mode (emails won't actually send)
2. Use a development email address
3. Preview templates locally

### Preview Templates Locally

```typescript
// In development, you can preview templates
import { previewEmail } from '@/lib/email';

const emailHtml = await previewEmail('order', {
  orderNumber: 'TEST-123',
  // ... other data
});
```

## API Integration

### Order API
The order API (`/api/orders`) automatically sends confirmation emails when orders are created.

### Booking API
The booking API (`/api/bookings`) automatically sends confirmation emails with calendar attachments.

### Auth API
- `/api/auth/register` - Sends welcome email on registration
- `/api/auth/reset-password` - Sends password reset email

## Rate Limiting

All email endpoints are protected by rate limiting to prevent abuse:

- Order confirmations: General rate limit applies
- Booking confirmations: 5 requests per minute
- Password reset: 3 requests per 5 minutes

## Error Handling

- Email failures don't block the main operation (order/booking creation)
- Errors are logged but don't affect user experience
- Admin notifications fail silently if the customer email succeeds

## Admin Notifications

Admin notifications are automatically sent for:
- New orders
- New bookings

Admin email address is configured via `ADMIN_EMAIL` environment variable.

## Security

- All email templates use sanitized inputs
- Password reset tokens expire after 1 hour
- Rate limiting prevents email bombing
- Sensitive data is never included in plain text

## Monitoring

Monitor email delivery in the Resend dashboard:
- Delivery status
- Open rates
- Click rates
- Bounce handling
- Spam complaints

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check RESEND_API_KEY is set
   - Verify domain is configured in Resend
   - Check console for error logs

2. **Templates not rendering**
   - Ensure all required props are passed
   - Check for TypeScript errors
   - Test with preview function

3. **Rate limiting**
   - Adjust rate limits in `/lib/rate-limit.ts`
   - Use Redis for distributed rate limiting

## Best Practices

1. Always handle email errors gracefully
2. Don't block main operations on email sending
3. Include unsubscribe links where appropriate
4. Test templates across email clients
5. Keep email content concise and actionable
6. Use proper semantic HTML for accessibility
7. Include both HTML and text versions
8. Monitor delivery rates and adjust as needed