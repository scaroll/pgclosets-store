# PG Closets Store - Jobber Integration Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed
- Jobber account with Client Hub ID: `83a3d24e-c18d-441c-80d1-d85419ea28ae`
- Google Analytics 4 property
- (Optional) Slack workspace for notifications

### 1. Install Vercel CLI & Login
```bash
npm i -g vercel
vercel login
```

### 2. Deploy to Vercel
```bash
cd /Users/spencercarroll/Downloads/pgclosets-store
vercel --prod
```

### 3. Configure Environment Variables
Set these environment variables in Vercel dashboard or via CLI:

#### Required Variables
```bash
# Analytics
vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID
# Enter: G-M01QFYXCDN

vercel env add GA4_API_SECRET
# Get from: GA4 > Admin > Data Streams > Measurement Protocol API secrets

# Jobber (already configured in code)
vercel env add JOBBER_CLIENT_HUB_ID  
# Enter: 83a3d24e-c18d-441c-80d1-d85419ea28ae
```

#### Optional Variables
```bash
# Slack Notifications
vercel env add SLACK_WEBHOOK_URL
# Create at: https://api.slack.com/apps > Incoming Webhooks

# Paddle Payments (if using)
vercel env add NEXT_PUBLIC_PADDLE_VENDOR_ID
vercel env add NEXT_PUBLIC_PADDLE_ENVIRONMENT
# Enter: sandbox or live

# Contact Info
vercel env add NEXT_PUBLIC_CONTACT_EMAIL
# Enter: info@pgclosets.ca

vercel env add NEXT_PUBLIC_CONTACT_PHONE
# Enter: (613) 262-2604
```

### 4. Redeploy with Environment Variables
```bash
vercel --prod
```

## 📊 Analytics Setup

### Google Analytics 4
1. Create GA4 property for pgclosets.ca
2. Get Measurement ID (G-XXXXXXXXXX)
3. Create Measurement Protocol API Secret:
   - GA4 > Admin > Data Streams > [Your Stream] > Measurement Protocol API secrets
   - Create new secret for server-side tracking

### Custom Events Configured
- `view_form` - When Jobber form comes into viewport
- `form_start` - When user starts filling form
- `form_field_interaction` - Individual field interactions
- `generate_lead` - Form submission with estimated value
- `phone_click` - Phone number clicks
- `exit_intent_triggered` - Exit intent popup triggers

## 🔗 Jobber Webhook Setup

### Configure Webhook in Jobber
1. Go to Jobber Settings > Integrations > Webhooks
2. Add new webhook URL: `https://your-domain.vercel.app/api/webhooks/jobber`
3. Select events:
   - `work_request.created`
   - `quote.sent`
   - `quote.approved`
   - `job.completed`
   - `client.created`

### Webhook Events Handled
- **New Quote Request**: GA4 tracking + Slack notification
- **Quote Sent**: Conversion funnel tracking
- **Quote Approved**: Purchase event + celebration message
- **Job Completed**: Success tracking

## 📱 Form Placements

### 1. Hero Section Form
- **Location**: Top of store page (`/store`)
- **Tracking Label**: `hero_form`
- **Features**: Immediate load, no lazy loading
- **Fallback**: Phone number with tracking

### 2. Exit Intent Popup
- **Trigger**: Mouse leave from top of page or scroll up on mobile
- **Delay**: 10 seconds minimum on page
- **Offer**: 15% discount + free consultation
- **Frequency**: Once per session

### 3. Form Analytics
All forms track:
- Form views (viewport entry)
- Field interactions (focus/completion)
- Form submissions with lead value estimation
- Error states and fallback usage

## 🎯 Lead Value Estimation

The system automatically estimates lead value based on:
- **Base Value**: $3,000 CAD
- **Project Type Multipliers**:
  - Walk-in closets: 1.8x
  - Custom projects: 2.2x  
  - Premium projects: 2.5x
  - Kitchen projects: 1.5x
- **Urgency Multiplier**: High urgency +20%

## 🔔 Notification Setup

### Slack Integration
Set `SLACK_WEBHOOK_URL` to receive instant notifications for:
- 🎯 New quote requests with client details
- 📋 Quote sent confirmations
- 🎉 Quote approvals with value
- ✅ Job completion confirmations

## 📈 Performance Monitoring

### Core Web Vitals
- Jobber form lazy loading for below-fold placements
- Image optimization for hero backgrounds
- Script loading optimization

### Form Performance Metrics
- Form load time tracking
- Field completion rates
- Abandonment analysis
- Conversion attribution

## 🛡️ Security Features

### Headers Configured
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Webhook Security
- Signature verification for Jobber webhooks
- CORS configuration for webhook endpoints
- Input validation and sanitization

## 🧪 Testing Checklist

### Form Functionality
- [ ] Hero form loads and displays properly
- [ ] Exit intent popup triggers correctly
- [ ] Form submissions create Jobber work requests
- [ ] Phone click tracking works
- [ ] Error states display fallback options

### Analytics Tracking
- [ ] GA4 events fire for all form interactions
- [ ] Server-side tracking via webhooks works
- [ ] Lead value estimation is accurate
- [ ] Exit intent events track properly

### Mobile Experience
- [ ] Forms are responsive and touch-friendly
- [ ] Exit intent works on mobile (scroll up detection)
- [ ] Phone links work properly
- [ ] Performance is optimized

## 🚀 Production Deployment URL

Your PG Closets store with Jobber integration will be available at:
**https://pgclosets-ottawa.vercel.app**

## 📞 Support

For deployment issues or customization:
- Check Vercel deployment logs
- Monitor GA4 real-time reports
- Test webhook endpoints with Jobber
- Review Slack notifications for lead tracking

---

*This deployment includes complete Jobber form integration with advanced analytics tracking, exit intent optimization, and real-time lead notifications for PG Closets.*