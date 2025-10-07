# Analytics & Performance Monitoring System

This directory contains the complete analytics and performance monitoring implementation for PG Closets v2.

## Overview

The analytics system combines Google Tag Manager (GTM) and Google Analytics 4 (GA4) to provide comprehensive tracking of:

- **User Behavior**: Page views, navigation, interactions
- **Lead Generation**: Form submissions, phone/email clicks, quote requests
- **E-commerce**: Product views, variant selections, quotes
- **Performance**: Core Web Vitals (LCP, CLS, INP, FCP)
- **Errors**: JavaScript errors, API failures, form validation issues

## Architecture

```
lib/analytics/
├── gtm.ts          # Google Tag Manager integration
├── ga4.ts          # Google Analytics 4 configuration
└── README.md       # This file

lib/performance/
└── web-vitals.ts   # Core Web Vitals tracking

components/
├── GoogleTagManager.tsx    # GTM script component
├── AnalyticsProvider.tsx   # Analytics wrapper
└── analytics/
    └── WebVitalsReporter.tsx  # Performance monitoring
```

## Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Performance Monitoring
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
NEXT_PUBLIC_ANALYTICS_DEBUG=false
```

### 2. Add to Root Layout

In your `app/layout.tsx`:

```tsx
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider requireConsent={true} delayMs={2000} />
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  )
}
```

### 3. Configure GTM

1. Create a GTM account at https://tagmanager.google.com
2. Create a container for your website
3. Add your GTM ID to `.env.local`
4. Configure tags, triggers, and variables in GTM UI:

**Recommended Tags:**
- GA4 Configuration Tag (fires on all pages)
- GA4 Event Tags (for custom events)
- Conversion tracking tags (phone clicks, form submissions)

**Recommended Triggers:**
- All Pages
- Form Submissions
- Click - Phone Numbers
- Click - Email Links
- Custom Events (product_view, add_to_quote, etc.)

## Usage

### Tracking Events

#### Product View

```tsx
import { trackProductView } from '@/lib/analytics/gtm'

// Track when user views a product
trackProductView({
  id: product.id,
  name: product.name,
  category: product.category,
  type: product.attributes.type,
  brand: product.brand,
  price: getLowestPrice(product),
})
```

#### Form Submission

```tsx
import { trackFormSubmit } from '@/lib/analytics/gtm'

// Track form submissions
trackFormSubmit({
  form_name: 'Quote Request',
  form_id: 'quote-form',
  form_type: 'quote',
  success: true,
  products: ['bypass-door', 'installation'],
  lead_value: 1500,
})
```

#### Phone Click

```tsx
import { trackPhoneClick } from '@/lib/analytics/gtm'

// Track phone number clicks
const handlePhoneClick = () => {
  trackPhoneClick({
    phone_number: '+1-613-XXX-XXXX',
    location: 'header',
    cta_text: 'Call Now',
  })
}
```

#### Email Click

```tsx
import { trackEmailClick } from '@/lib/analytics/gtm'

// Track email link clicks
const handleEmailClick = () => {
  trackEmailClick({
    email_address: 'info@pgclosets.com',
    location: 'footer',
    cta_text: 'Email Us',
  })
}
```

#### Add to Quote

```tsx
import { trackAddToQuote } from '@/lib/analytics/gtm'

// Track when user selects a variant or requests a quote
trackAddToQuote({
  product: {
    id: 'bypass-001',
    name: 'Bright White Bypass Door',
    category: 'Bypass Doors',
    price: 450,
  },
  variant: '48x80',
  quantity: 2,
  options: { softClose: true },
})
```

#### Search

```tsx
import { trackSearch } from '@/lib/analytics/gtm'

// Track site searches
trackSearch({
  search_term: 'bypass doors',
  search_type: 'product',
  results_count: 12,
  filters: { category: 'bypass', finish: 'white' },
})
```

#### Custom Events

```tsx
import { trackCustomEvent } from '@/lib/analytics/gtm'

// Track any custom event
trackCustomEvent('configurator_opened', {
  product_id: 'bypass-001',
  source: 'pdp',
})
```

### Performance Tracking

Web Vitals are automatically tracked when you include `<WebVitalsReporter />` in your layout.

#### Manual Performance Measurement

```tsx
import {
  startPerformanceMeasure,
  endPerformanceMeasure,
} from '@/lib/performance/web-vitals'

// Start measurement
startPerformanceMeasure('configurator_load')

// ... perform operation ...

// End measurement and track
endPerformanceMeasure('configurator_load')
```

#### Get Current Web Vitals

```tsx
import { getCurrentWebVitals } from '@/lib/performance/web-vitals'

const vitals = await getCurrentWebVitals()
console.log('LCP:', vitals.lcp)
console.log('CLS:', vitals.cls)
console.log('INP:', vitals.inp)
```

### User Consent

#### Check Consent Status

```tsx
import { useAnalyticsConsent } from '@/components/AnalyticsProvider'

function ConsentBanner() {
  const { hasConsent, grantConsent, revokeConsent } = useAnalyticsConsent()

  return (
    <div>
      {!hasConsent && (
        <button onClick={grantConsent}>Accept Analytics</button>
      )}
      {hasConsent && (
        <button onClick={revokeConsent}>Revoke Consent</button>
      )}
    </div>
  )
}
```

#### Grant Consent Programmatically

```tsx
import { updateConsentMode } from '@/lib/analytics/ga4'

// Grant analytics consent
updateConsentMode({
  analytics_storage: 'granted',
  ad_storage: 'denied',
})
```

### User Properties

```tsx
import { setCustomUserProperties } from '@/lib/analytics/ga4'

// Set user properties for segmentation
setCustomUserProperties({
  customer_type: 'returning',
  service_area: 'Ottawa',
  preferred_category: 'bypass',
  price_range: 'premium',
})
```

### User ID Tracking

```tsx
import { setUserId } from '@/lib/analytics/ga4'

// Set user ID for cross-device tracking
setUserId('user_123456')

// Clear user ID on logout
setUserId(null)
```

## Event Reference

### E-commerce Events

| Event | Description | Parameters |
|-------|-------------|------------|
| `product_view` | User views product detail page | product details |
| `view_item_list` | User views product listing | list_id, items[] |
| `add_to_quote` | User selects variant/requests quote | product, variant, quantity |
| `purchase` | Quote/purchase completed | transaction_id, value, items[] |

### Lead Generation Events

| Event | Description | Parameters |
|-------|-------------|------------|
| `form_submit` | Form submission | form_name, form_type, success |
| `phone_click` | Phone number clicked | phone_number, location |
| `email_click` | Email link clicked | email_address, location |
| `generate_lead` | Lead generated | lead_type, value |

### Navigation Events

| Event | Description | Parameters |
|-------|-------------|------------|
| `page_view` | Page viewed | page_title, page_path |
| `search` | Site search performed | search_term, results_count |
| `outbound_click` | External link clicked | url, link_text |

### Performance Events

| Event | Description | Parameters |
|-------|-------------|------------|
| `web_vitals` | Core Web Vitals metric | metric_name, value, rating |
| `timing_complete` | Custom timing | name, value, category |

### Error Events

| Event | Description | Parameters |
|-------|-------------|------------|
| `exception` | JavaScript error | description, error_type, fatal |

## GA4 Configuration

### Custom Dimensions

Configure these in GA4 admin:

| Dimension Name | Parameter | Scope |
|----------------|-----------|-------|
| Product Category | `item_category` | Event |
| Product Type | `item_category2` | Event |
| Service Area | `service_area` | User |
| Customer Type | `customer_type` | User |
| Form Type | `form_type` | Event |
| Lead Value | `lead_value` | Event |

### Conversion Events

Mark these as conversions in GA4:

- `form_submit`
- `generate_lead`
- `phone_click`
- `email_click`
- `purchase`

### Audiences

Recommended audiences:

- **High-Intent Users**: Users who viewed 3+ products
- **Quote Requesters**: Users who submitted quote forms
- **Phone Callers**: Users who clicked phone numbers
- **Returning Visitors**: Users who visited 2+ times
- **Service Area Specific**: Users from each service area

## Performance Budgets

See [PERFORMANCE_BUDGET.md](/PERFORMANCE_BUDGET.md) for full details.

### Core Web Vitals Targets

- **LCP** (Desktop): ≤ 1.5s
- **CLS**: ≤ 0.10
- **INP**: ≤ 200ms
- **FCP** (Desktop): ≤ 1.5s

### Bundle Size Limits

- **Initial JS**: ≤ 150KB gzipped
- **Total CSS**: ≤ 75KB gzipped

## Debugging

### Enable Debug Mode

```tsx
import { enableDebugMode } from '@/lib/analytics/ga4'

// Enable debug mode
enableDebugMode()

// Analytics events will now log to console
```

### View GTM Debug

1. Install Google Tag Assistant Chrome extension
2. Click extension icon
3. Enable "Preview" mode
4. Navigate your site to see tag firing

### View GA4 Debug

1. Open browser console
2. Look for `[GTM Event]` and `[GA4]` logs
3. Check GA4 DebugView in GA4 admin

### Common Issues

**Events not firing:**
- Check environment variables are set
- Verify GTM container is published
- Check browser console for errors
- Verify analytics scripts loaded

**Web Vitals not reporting:**
- Ensure `WebVitalsReporter` is in layout
- Check browser console for errors
- Verify `web-vitals` package installed

**Consent not working:**
- Check localStorage for `analytics_consent`
- Verify consent mode set in GTM
- Check GA4 consent settings

## Testing

### Local Testing

```bash
# Set debug mode
NEXT_PUBLIC_ANALYTICS_DEBUG=true

# Run development server
npm run dev

# Open browser console to see event logs
```

### Staging Testing

1. Deploy to staging environment
2. Use GTM Preview mode
3. Verify all events firing correctly
4. Check GA4 DebugView for event data

### Production Testing

1. Use Google Tag Assistant
2. Monitor GA4 Realtime reports
3. Set up GA4 alerts for missing events
4. Review weekly analytics reports

## Best Practices

1. **Always track conversions**: Phone clicks, email clicks, form submissions
2. **Use semantic event names**: Clear, descriptive event names
3. **Include relevant context**: Product IDs, categories, values
4. **Respect user privacy**: Honor consent choices
5. **Monitor performance**: Track Web Vitals regularly
6. **Test before deploy**: Verify tracking in staging
7. **Document custom events**: Update this README when adding new events

## Resources

- [GTM Documentation](https://developers.google.com/tag-manager)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Analytics](https://nextjs.org/docs/advanced-features/measuring-performance)

## Support

For issues or questions:
1. Check browser console for errors
2. Review GA4 DebugView
3. Test in GTM Preview mode
4. Check environment variables
5. Review this documentation

---

Last updated: October 6, 2025
