# Quote Request API Endpoint

## Endpoint
`POST /api/quotes/request`

## Features
- ✅ Zod schema validation for all inputs
- ✅ Rate limiting (60 requests per minute per IP)
- ✅ In-memory storage (can be replaced with database)
- ✅ Email notifications (admin + customer auto-response)
- ✅ CORS protection
- ✅ Unique quote ID generation
- ✅ Comprehensive error handling

## Request Schema

### Required Fields
- `name` (string, 2-100 chars)
- `email` (valid email address)
- `phone` (format: 613-555-0123)
- `consent` (boolean, must be true)

### Optional Fields
- `company` (string, max 200 chars)
- `projectType` (enum: closet-doors, barn-doors, sliding-doors, bifold-doors, mirror-doors, storage-system, full-renovation, other)
- `projectDescription` (string, max 2000 chars)
- `budget` (enum: under-1000, 1000-3000, 3000-5000, 5000-10000, over-10000, flexible)
- `timeline` (enum: urgent, within-1-month, within-3-months, within-6-months, flexible)
- `preferredContactMethod` (enum: email, phone, default: email)
- `preferredContactTime` (string, max 100 chars)
- `notes` (string, max 2000 chars)
- `source` (string, max 100 chars)

### Nested Objects
- `measurements` (optional)
  - `width` (number, positive)
  - `height` (number, positive)
  - `depth` (number, positive)
  - `unit` (enum: inches, feet, cm, m, default: inches)

- `address` (optional)
  - `street` (string, max 200 chars)
  - `city` (string, max 100 chars)
  - `province` (string, max 100 chars)
  - `postalCode` (string, Canadian format: A1A 1A1)

## Example Request

```javascript
const response = await fetch('/api/quotes/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Required
    name: 'John Doe',
    email: 'john@example.com',
    phone: '613-555-0123',
    consent: true,

    // Optional
    company: 'Acme Inc',
    projectType: 'closet-doors',
    projectDescription: 'Looking to replace 3 closet doors in master bedroom',
    budget: '3000-5000',
    timeline: 'within-1-month',
    preferredContactMethod: 'email',
    preferredContactTime: 'Weekday mornings',

    measurements: {
      width: 72,
      height: 84,
      depth: 24,
      unit: 'inches'
    },

    address: {
      street: '123 Main St',
      city: 'Ottawa',
      province: 'ON',
      postalCode: 'K1A 0A1'
    },

    notes: 'Prefer white finish to match existing decor',
    source: 'Google Search'
  })
});

const data = await response.json();
console.log(data);
// {
//   "success": true,
//   "message": "Thank you for your quote request! We will contact you shortly.",
//   "quoteId": "QT-1733353200000-A1B2C3D4"
// }
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Thank you for your quote request! We will contact you shortly.",
  "quoteId": "QT-1733353200000-A1B2C3D4"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Please provide a valid email address",
  "error": "VALIDATION_ERROR"
}
```

### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "error": "RATE_LIMIT_EXCEEDED"
}
```

### CORS Error (403)
```json
{
  "success": false,
  "message": "Cross-origin requests not allowed",
  "error": "CORS_ERROR"
}
```

### Internal Error (500)
```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later or contact us directly.",
  "error": "INTERNAL_ERROR"
}
```

## Response Headers

All responses include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when rate limit resets

Rate limit exceeded responses also include:
- `Retry-After`: Seconds until retry is allowed

## Email Notifications

### Admin Notification
Sent to `ADMIN_EMAIL` environment variable with:
- Full quote details
- Customer contact information
- Project specifications
- Measurements and address (if provided)
- IP address and timestamp for security

### Customer Auto-Response
Sent to customer's email address with:
- Quote reference number
- Next steps explanation
- Helpful links to browse products/gallery
- Contact information

## Retrieve Quote (GET)

```javascript
const response = await fetch('/api/quotes/request?id=QT-1733353200000-A1B2C3D4');
const data = await response.json();
// Returns basic quote information (authentication should be added in production)
```

## Environment Variables Required
- `ADMIN_EMAIL` - Email address to receive quote notifications
- `EMAIL_FROM` - From address for automated emails (optional)
- `NEXT_PUBLIC_SITE_URL` - Your site URL for email links

## Security Features
1. **Rate Limiting**: 60 requests per minute per IP
2. **CORS Protection**: Only allowed origins can make requests
3. **Input Validation**: All inputs validated with Zod schemas
4. **XSS Protection**: Content-Type and Frame-Options headers
5. **Sanitized Logging**: Sensitive data excluded from logs

## Storage
Currently uses in-memory Map for quote storage. In production, replace with:
- PostgreSQL (using Prisma)
- MongoDB
- Redis
- Or any other persistent storage

## Production Recommendations
1. Add Quote model to Prisma schema
2. Replace in-memory storage with database
3. Add authentication for GET endpoint
4. Implement email service (SendGrid, Resend, AWS SES)
5. Add webhook for CRM integration
6. Set up monitoring and alerts
7. Add analytics tracking
8. Implement quote expiration and cleanup jobs
