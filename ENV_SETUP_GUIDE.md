# 🔐 Environment Variables Setup Guide

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# =============================================================================
# EMAIL SERVICE (Resend) - REQUIRED FOR CONTACT FORM
# =============================================================================
# Sign up at: https://resend.com
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email addresses for your business
EMAIL_FROM="PG Closets <noreply@pgclosets.ca>"
EMAIL_REPLY_TO="info@pgclosets.ca"
CONTACT_EMAIL="info@pgclosets.ca"

# =============================================================================
# NEWSLETTER SERVICE - REQUIRED FOR NEWSLETTER SIGNUP
# =============================================================================
# Choose ONE of the following providers:

# Option 1: Resend (Simplest - uses same API key as above)
NEWSLETTER_PROVIDER=resend
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Optional - creates audience in Resend

# Option 2: ConvertKit (Recommended for e-commerce)
# NEWSLETTER_PROVIDER=convertkit
# CONVERTKIT_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# CONVERTKIT_FORM_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Option 3: Mailchimp
# NEWSLETTER_PROVIDER=mailchimp
# MAILCHIMP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1
# MAILCHIMP_AUDIENCE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# MAILCHIMP_SERVER_PREFIX=us1  # e.g., us1, us2, us3, etc.

# =============================================================================
# BUSINESS INFORMATION - UPDATE PLACEHOLDERS
# =============================================================================
# Replace placeholder phone numbers in the following files:
# - app/book-measurement/page.tsx (2 instances)
# - app/api/bookings/measurement/route.ts
# - app/api/quotes/renin/route.ts
# - app/services/warranty/page.tsx (2 instances)
# - components/contact/ContactForm.tsx (example format)
BUSINESS_PHONE="(613) 422-5800"
```

## Setup Instructions

### 1. Email Service (Resend)

**Why**: Enables contact form email notifications and customer confirmations

**Steps**:
1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Verify your domain OR use `onboarding@resend.dev` for testing
3. Get API key from https://resend.com/api-keys
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM="PG Closets <noreply@pgclosets.ca>"
   CONTACT_EMAIL="info@pgclosets.ca"
   ```

**Testing**:
```bash
# Restart dev server
npm run dev

# Submit contact form at http://localhost:3000/contact
# Check email inbox for notification
```

### 2. Newsletter Service

#### Option A: Use Resend (Simplest)

**Steps**:
1. In Resend dashboard, go to Audiences
2. Create a new audience (e.g., "PG Closets Newsletter")
3. Copy the Audience ID
4. Add to `.env.local`:
   ```env
   NEWSLETTER_PROVIDER=resend
   RESEND_AUDIENCE_ID=aud_your_audience_id_here
   ```

**Note**: If you don't set `RESEND_AUDIENCE_ID`, the system will send you an email notification for each signup instead.

#### Option B: Use ConvertKit (Recommended for E-commerce)

**Why**: Better automation, segmentation, and e-commerce features

**Steps**:
1. Sign up at https://convertkit.com (free tier: 1,000 subscribers)
2. Create a form in ConvertKit dashboard
3. Get API key from Account Settings → Account Settings → Show API Secret
4. Get Form ID from the form URL or API
5. Add to `.env.local`:
   ```env
   NEWSLETTER_PROVIDER=convertkit
   CONVERTKIT_API_KEY=your_api_key_here
   CONVERTKIT_FORM_ID=your_form_id_here
   ```

#### Option C: Use Mailchimp

**Steps**:
1. Sign up at https://mailchimp.com (free tier: 500 subscribers)
2. Create an audience
3. Get API key from Account → Extras → API keys
4. Get Audience ID from Audience → Settings → Audience name and defaults
5. Find server prefix in API key (e.g., `us1`, `us2`)
6. Add to `.env.local`:
   ```env
   NEWSLETTER_PROVIDER=mailchimp
   MAILCHIMP_API_KEY=your_api_key_here-us1
   MAILCHIMP_AUDIENCE_ID=your_audience_id_here
   MAILCHIMP_SERVER_PREFIX=us1
   ```

### 3. Update Placeholder Phone Numbers

The following files contain placeholder phone numbers `(613) 555-xxxx`:

**Files to Update**:
1. `app/book-measurement/page.tsx` - 2 instances
2. `app/api/bookings/measurement/route.ts` - 1 instance
3. `app/api/quotes/renin/route.ts` - 1 instance
4. `app/services/warranty/page.tsx` - 2 instances
5. `components/contact/ContactForm.tsx` - 1 instance (example format)

**Quick Find & Replace**:
```bash
# Search for all placeholder phone numbers
grep -r "(613) 555-" app/ components/

# Or use VS Code:
# 1. Press Cmd+Shift+F (Mac) or Ctrl+Shift+F (Windows)
# 2. Search for: (613) 555-
# 3. Replace with: (613) 422-5800
```

## Verification

### Contact Form Test:
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/contact
3. Fill out and submit form
4. Check console logs for:
   ```
   ✅ Contact email sent successfully: [email-id]
   ```
5. Check your `CONTACT_EMAIL` inbox for notification
6. Check customer's email for confirmation

### Newsletter Test:
1. Navigate to any page with newsletter signup
2. Enter email address
3. Submit form
4. Should see success message
5. Check provider dashboard (Resend/ConvertKit/Mailchimp) for new subscriber

### What Works Without API Keys:

**Contact Form**:
- ✅ Form validation
- ✅ Data logging to console
- ✅ Success message shown
- ❌ No email sent

**Newsletter**:
- ✅ Form validation
- ✅ Success message shown
- ❌ No subscription created

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for development/production**
3. **Rotate API keys regularly**
4. **Use environment variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy to apply changes

## Production Deployment

### Vercel Environment Variables:

1. Go to https://vercel.com/peoples-group/pgclosets-store/settings/environment-variables
2. Add all variables from `.env.local`
3. Set scope to "Production", "Preview", and "Development"
4. Redeploy:
   ```bash
   npm run build  # Test locally first
   git push       # Triggers automatic deployment
   ```

### Domain Email Setup:

To use `noreply@pgclosets.ca` instead of `onboarding@resend.dev`:

1. In Resend dashboard, go to Domains
2. Click "Add Domain"
3. Enter `pgclosets.ca`
4. Add DNS records to your domain registrar:
   - TXT record for verification
   - MX records for email receiving
5. Wait for verification (5-10 minutes)
6. Update `.env.local`:
   ```env
   EMAIL_FROM="PG Closets <noreply@pgclosets.ca>"
   ```

## Troubleshooting

### "Email service not configured" error:
- Check `RESEND_API_KEY` is set correctly
- Restart dev server after adding environment variables
- Check for typos in variable names

### Newsletter not working:
- Check `NEWSLETTER_PROVIDER` matches chosen service
- Verify all required variables for that provider are set
- Check API keys are valid in provider dashboard
- Check console logs for specific error messages

### Emails not received:
- Check spam folder
- Verify `CONTACT_EMAIL` is correct
- Check Resend dashboard for delivery status
- Verify domain is verified (if not using onboarding@resend.dev)

## Support

- **Resend Docs**: https://resend.com/docs
- **ConvertKit Docs**: https://developers.convertkit.com
- **Mailchimp Docs**: https://mailchimp.com/developer/

---

**Status**: Backend integration complete and ready for configuration ✅
