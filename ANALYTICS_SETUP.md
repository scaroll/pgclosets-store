# Analytics & Performance Monitoring Setup Guide

Complete setup guide for analytics and performance monitoring on PG Closets v2.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

Required packages (already in package.json):
- `web-vitals@^5.1.0` - Core Web Vitals tracking
- `@lhci/cli@^0.15.0` - Lighthouse CI
- `lighthouse@^12.8.2` - Lighthouse auditing

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your IDs:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Performance Monitoring
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
NEXT_PUBLIC_ANALYTICS_DEBUG=false
```

### 3. Add Components to Layout

Update your root layout (`app/layout.tsx`):

```tsx
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Analytics */}
        <AnalyticsProvider requireConsent={true} delayMs={2000} />
        <WebVitalsReporter />

        {children}
      </body>
    </html>
  )
}
```

### 4. Test Analytics

Start development server:

```bash
npm run dev
```

Open browser console and look for:
- `[GTM] Initialized`
- `[GA4] Initialized`
- `[Web Vitals] Tracking initialized`

## Google Tag Manager Setup

### 1. Create GTM Account

1. Go to https://tagmanager.google.com
2. Click "Create Account"
3. Account Name: "PG Closets"
4. Container Name: "PG Closets Website"
5. Target Platform: "Web"
6. Click "Create"

### 2. Get Container ID

After creating, you'll see your Container ID (GTM-XXXXXXX).
Add this to `.env.local`:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3. Configure Tags

#### GA4 Configuration Tag

1. **Tag Type**: Google Analytics: GA4 Configuration
2. **Measurement ID**: Your GA4 Measurement ID
3. **Trigger**: All Pages
4. **Configuration Settings**:
   - `send_page_view`: false (we handle this manually)
   - `anonymize_ip`: true
   - `allow_google_signals`: false

#### GA4 Event Tags

Create tags for these events:

**Page View Event**
- Tag Type: Google Analytics: GA4 Event
- Event Name: `page_view`
- Trigger: Custom Event (page_view)

**Product View Event**
- Tag Type: Google Analytics: GA4 Event
- Event Name: `product_view`
- Trigger: Custom Event (product_view)
- Parameters: From Data Layer

**Form Submit Event**
- Tag Type: Google Analytics: GA4 Event
- Event Name: `form_submit`
- Trigger: Custom Event (form_submit)
- Mark as Conversion: Yes

**Phone Click Event**
- Tag Type: Google Analytics: GA4 Event
- Event Name: `phone_click`
- Trigger: Custom Event (phone_click)
- Mark as Conversion: Yes

### 4. Create Triggers

**All Pages**
- Trigger Type: Page View - All Pages

**Custom Events**
- Trigger Type: Custom Event
- Event Name: (match event name from code)

**Phone Clicks**
- Trigger Type: Click - All Elements
- Filter: Click URL contains "tel:"

**Email Clicks**
- Trigger Type: Click - All Elements
- Filter: Click URL contains "mailto:"

### 5. Publish Container

1. Click "Submit" in top right
2. Version Name: "Initial Setup"
3. Version Description: "GTM and GA4 integration"
4. Click "Publish"

## Google Analytics 4 Setup

### 1. Create GA4 Property

1. Go to https://analytics.google.com
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Property Name: "PG Closets"
5. Reporting Time Zone: "Canada/Eastern"
6. Currency: "Canadian Dollar"

### 2. Get Measurement ID

1. Click "Data Streams"
2. Click "Add stream" > "Web"
3. Website URL: https://www.pgclosets.com
4. Stream Name: "PG Closets Website"
5. Copy Measurement ID (G-XXXXXXXXXX)

Add to `.env.local`:

```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Configure Custom Dimensions

Admin > Custom Definitions > Custom Dimensions:

| Dimension Name | Event Parameter | Scope |
|----------------|-----------------|-------|
| Product Category | `product_category` | Event |
| Product Type | `product_type` | Event |
| Service Area | `service_area` | User |
| Customer Type | `customer_type` | User |
| Form Type | `form_type` | Event |
| Lead Value | `lead_value` | Event |
| Variant | `variant` | Event |

### 4. Mark Conversions

Admin > Events:

Mark these as conversions:
- `form_submit`
- `generate_lead`
- `phone_click`
- `email_click`
- `add_to_quote`

### 5. Configure Audiences

Admin > Audiences > New Audience:

**High-Intent Users**
- Condition: `product_view` count ≥ 3
- Duration: 30 days

**Quote Requesters**
- Condition: `form_submit` with `form_type` = 'quote'
- Duration: 90 days

**Phone Callers**
- Condition: `phone_click` event
- Duration: 90 days

**Service Area - Ottawa**
- Condition: `service_area` = 'Ottawa'
- Duration: 540 days

### 6. Enable Enhanced Measurement

Property Settings > Data Streams > Your Stream > Enhanced Measurement:

Enable:
- ✅ Page views (already handled manually)
- ✅ Scrolls (90% threshold)
- ✅ Outbound clicks
- ✅ Site search
- ✅ File downloads

## Performance Monitoring Setup

### 1. Lighthouse CI

Already configured in `lighthouserc.js`. To run:

```bash
# Desktop audit
npm run perf:lighthouse

# Mobile audit
npm run perf:lighthouse:mobile

# All performance checks
npm run perf:all
```

### 2. Performance Budget Tracking

See [PERFORMANCE_BUDGET.md](./PERFORMANCE_BUDGET.md) for details.

Monitor these metrics:
- LCP ≤ 2.2s (mobile), ≤ 1.5s (desktop)
- CLS ≤ 0.10
- INP ≤ 200ms
- FCP ≤ 1.5s

### 3. Web Vitals Alerts

In GA4, create custom alerts:

**Poor LCP Alert**
- Metric: `web_vitals` event
- Condition: `metric_name` = 'LCP' AND `metric_rating` = 'poor'
- Alert: Daily email

**Poor CLS Alert**
- Metric: `web_vitals` event
- Condition: `metric_name` = 'CLS' AND `metric_rating` = 'poor'
- Alert: Daily email

**Poor INP Alert**
- Metric: `web_vitals` event
- Condition: `metric_name` = 'INP' AND `metric_rating` = 'poor'
- Alert: Daily email

## GDPR Compliance

### Consent Mode

The system is pre-configured with GDPR-compliant consent mode:

```tsx
// Default consent (before user choice)
{
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
}
```

### Adding Consent Banner

Create a consent banner component:

```tsx
import { useAnalyticsConsent } from '@/components/AnalyticsProvider'

export function ConsentBanner() {
  const { hasConsent, grantConsent, revokeConsent } = useAnalyticsConsent()

  if (hasConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="container flex items-center justify-between">
        <p className="text-sm">
          We use cookies to improve your experience and analyze site usage.
        </p>
        <div className="flex gap-2">
          <button onClick={grantConsent}>Accept</button>
          <button onClick={revokeConsent}>Decline</button>
        </div>
      </div>
    </div>
  )
}
```

Add to layout:

```tsx
import { ConsentBanner } from '@/components/ConsentBanner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider requireConsent={true} />
        {children}
        <ConsentBanner />
      </body>
    </html>
  )
}
```

## Testing

### Local Testing

1. Set debug mode:
   ```bash
   NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run dev
   ```

2. Open browser console
3. Navigate to different pages
4. Look for event logs: `[GTM Event]`, `[GA4]`, `[Web Vitals]`

### GTM Preview Mode

1. Open GTM container
2. Click "Preview" button
3. Enter your local URL: http://localhost:3000
4. Navigate your site
5. See tags firing in real-time

### GA4 DebugView

1. Enable debug mode (see above)
2. Open GA4 > Configure > DebugView
3. Navigate your site
4. See events in real-time

### Production Testing

1. Deploy to staging
2. Use Google Tag Assistant Chrome extension
3. Verify all tags firing
4. Check GA4 Realtime reports
5. Test conversion tracking

## Monitoring Dashboard

### GA4 Reports

Create custom reports for:

**Lead Generation Performance**
- Metrics: `form_submit`, `phone_click`, `email_click` events
- Dimensions: `form_type`, `service_area`, `source/medium`
- Date range: Last 30 days

**Product Performance**
- Metrics: `product_view`, `add_to_quote` events
- Dimensions: `product_category`, `product_type`, `variant`
- Date range: Last 30 days

**Performance Monitoring**
- Metrics: `web_vitals` events
- Dimensions: `metric_name`, `metric_rating`, `page_path`
- Date range: Last 7 days

### Weekly Review Checklist

- [ ] Review Web Vitals metrics
- [ ] Check conversion rates
- [ ] Analyze top products
- [ ] Review error events
- [ ] Check bundle size
- [ ] Performance regression check

## Troubleshooting

### Events Not Firing

**Check environment variables:**
```bash
echo $NEXT_PUBLIC_GTM_ID
echo $NEXT_PUBLIC_GA4_MEASUREMENT_ID
```

**Check browser console:**
- Look for errors
- Verify GTM script loaded
- Check dataLayer exists

**Verify GTM container:**
- Is it published?
- Are tags configured correctly?
- Are triggers set up?

### Web Vitals Not Tracking

**Check component import:**
```tsx
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'
```

**Verify web-vitals package:**
```bash
npm list web-vitals
```

**Check browser console:**
- Look for `[Web Vitals]` logs
- Verify no errors

### Consent Issues

**Check localStorage:**
```javascript
localStorage.getItem('analytics_consent')
```

**Clear consent:**
```javascript
localStorage.removeItem('analytics_consent')
```

**Test consent flow:**
1. Open site in incognito
2. Verify default consent = denied
3. Accept cookies
4. Verify consent granted

## Best Practices

1. **Always test before deploying**
   - Use GTM Preview
   - Check GA4 DebugView
   - Verify all events

2. **Document custom events**
   - Update README when adding events
   - Include event parameters
   - Note conversion status

3. **Monitor performance**
   - Weekly Web Vitals review
   - Track bundle size trends
   - Set up performance alerts

4. **Respect privacy**
   - Honor consent choices
   - Anonymize IP addresses
   - Follow GDPR guidelines

5. **Keep analytics clean**
   - Filter internal traffic
   - Remove test data
   - Use consistent naming

## Support

- **GTM Issues**: Check GTM Preview mode
- **GA4 Issues**: Use DebugView
- **Performance Issues**: Run Lighthouse audit
- **Code Issues**: Check browser console

## Resources

- [GTM Documentation](https://developers.google.com/tag-manager)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)
- [Analytics README](./lib/analytics/README.md)
- [Performance Budget](./PERFORMANCE_BUDGET.md)

---

Last updated: October 6, 2025
