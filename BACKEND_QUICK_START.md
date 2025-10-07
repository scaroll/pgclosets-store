# Backend Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Set Up Resend (Required)

```bash
# 1. Go to https://resend.com
# 2. Sign up for free account
# 3. Add domain: pgclosets.com
# 4. Verify domain via DNS records
# 5. Generate API key
```

### 2. Configure Environment Variables

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local and add:
RESEND_API_KEY=re_your_actual_key_here
BUSINESS_EMAIL=info@pgclosets.com
EMAIL_FROM=leads@pgclosets.com
BUSINESS_PHONE=+1-613-555-0100
BUSINESS_ADDRESS="123 Main St, Ottawa, ON K1A 0A6"
```

### 3. Test Locally

```bash
# Start dev server
npm run dev

# Test lead submission
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "613-555-1234",
    "location": "Ottawa",
    "serviceType": "quote",
    "preferredContact": "email",
    "consent": true
  }'
```

### 4. Deploy to Vercel

```bash
# Add environment variables in Vercel dashboard
# Settings > Environment Variables

RESEND_API_KEY=re_...
BUSINESS_EMAIL=info@pgclosets.com
# ... etc

# Deploy
git push
```

---

## 📋 API Reference

### Submit Lead

**Endpoint:** `POST /api/lead`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "613-555-1234",
  "location": "Ottawa, ON",
  "serviceType": "quote",
  "productInterest": "Bypass doors",
  "message": "Looking for pricing",
  "preferredContact": "email",
  "consent": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Thank you for your inquiry! We will contact you shortly.",
  "leadId": "abc-123-def-456"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

---

## 🔒 Security Features

✅ **Rate Limiting:** 3 requests per IP per hour
✅ **Input Validation:** Zod schema with clear error messages
✅ **CORS Protection:** Restricted origins and methods
✅ **CASL Compliance:** Explicit consent required

---

## 🧪 Quick Tests

### Test Lead Submission
```typescript
// In browser console on your site
fetch('/api/lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '613-555-1234',
    location: 'Ottawa',
    serviceType: 'quote',
    preferredContact: 'email',
    consent: true
  })
}).then(r => r.json()).then(console.log)
```

### Test Email
```typescript
// Create test endpoint or use Node REPL
import { sendTestLeadNotification } from '@/lib/email/lead-notification';
await sendTestLeadNotification('your-email@example.com');
```

### Test Redirects
```bash
# Should redirect to https://www.pgclosets.com/products/bypass
curl -I http://pgclosets.com/product/bypass

# Should redirect to https://www.pgclosets.com/about
curl -I https://pgclosets.ca/about
```

---

## 🐛 Troubleshooting

### Email Not Sending
1. Check `RESEND_API_KEY` is set
2. Verify domain in Resend dashboard
3. Check Resend logs for errors
4. Verify `EMAIL_FROM` uses verified domain

### Rate Limit Too Restrictive
```typescript
// Temporarily increase in /app/api/lead/route.ts
maxRequests: 10,        // Was 3
windowMs: 60 * 60 * 1000  // Still 1 hour
```

### Redirects Not Working
1. Check middleware.ts is deployed
2. Verify `NODE_ENV=production` in Vercel
3. Clear CDN cache if using external CDN
4. Test with `curl -I` to see actual redirects

---

## 📊 Monitoring

### Check Lead Submissions
```bash
# Vercel logs
vercel logs --follow

# Filter for lead API
vercel logs --follow | grep "Lead API"
```

### Check Email Delivery
- Go to https://resend.com/emails
- View delivery status and opens

### Check Rate Limiting
```bash
# Look for rate limit warnings
vercel logs | grep "Rate limit exceeded"
```

---

## 🎯 Next Steps

1. ✅ Backend infrastructure complete
2. ⏭️ Create frontend lead form component
3. ⏭️ Add lead storage (database)
4. ⏭️ Set up CRM integration
5. ⏭️ Add analytics tracking

---

## 🆘 Support

**Documentation:** See `BACKEND_IMPLEMENTATION.md` for full details

**Common Issues:**
- Email not sending → Check Resend setup
- Rate limiting → Adjust limits in route.ts
- Validation errors → Check request schema
- Redirects → Verify middleware.ts deployed

**Files:**
- `/app/api/lead/route.ts` - Main API endpoint
- `/lib/email/lead-notification.ts` - Email system
- `/lib/rate-limit.ts` - Rate limiting
- `/middleware.ts` - Redirects
- `/.env.example` - Configuration template
