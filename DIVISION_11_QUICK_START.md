# Division 11: Analytics & Intelligence - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Environment Variables
```bash
# .env.local
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Step 2: Initialize Analytics
```typescript
// Already configured in app/layout.tsx
// ✅ Analytics initialized
// ✅ Cookie consent enabled
// ✅ Event tracking ready
```

### Step 3: Track Your First Event
```typescript
import { getEventTracker } from '@/lib/analytics/event-tracker'

function MyComponent() {
  const tracker = getEventTracker()

  // Track button click
  const handleClick = () => {
    tracker.trackCTAClick('Get Quote', 'hero-section')
  }

  return <button onClick={handleClick}>Get Quote</button>
}
```

### Step 4: View Dashboard
```
Visit: /admin/analytics
```

## 📊 50+ Events Available

### E-commerce (15 events)
```typescript
✅ trackViewItem()
✅ trackViewItemList()
✅ trackAddToCart()
✅ trackRemoveFromCart()
✅ trackBeginCheckout()
✅ trackPurchase()
// + 9 more
```

### Engagement (12 events)
```typescript
✅ trackPageView()
✅ trackScroll()
✅ trackClick()
✅ trackCTAClick()
✅ trackVideoStart()
✅ trackFormStart()
// + 6 more
```

### Conversion (10 events)
```typescript
✅ trackQuoteRequest()
✅ trackConsultationRequest()
✅ trackPhoneClick()
✅ trackEmailClick()
✅ trackNewsletterSignup()
// + 5 more
```

### Navigation (8 events)
```typescript
✅ trackMenuOpen()
✅ trackSearchOpen()
✅ trackFilterApply()
✅ trackSortChange()
// + 4 more
```

### Content (8 events)
```typescript
✅ trackFileDownload()
✅ trackShare()
✅ trackFAQExpand()
✅ trackModalOpen()
// + 4 more
```

## 🎯 Common Use Cases

### Track Product View
```typescript
const tracker = getEventTracker()

tracker.trackViewItem({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  brand: 'PG Closets'
})
```

### Track Add to Cart
```typescript
tracker.trackAddToCart([{
  item_id: product.id,
  item_name: product.name,
  item_category: product.category,
  price: product.price,
  quantity: 1
}], product.price)
```

### Track Quote Request
```typescript
tracker.trackQuoteRequest({
  leadType: 'quote_request',
  leadSource: 'contact-form',
  leadValue: 5000,
  contactInfo: {
    email: 'customer@example.com',
    name: 'John Doe'
  },
  products: selectedProducts,
  timestamp: Date.now(),
  sessionId: analytics.getSessionId()
})
```

### Track Form Submission
```typescript
tracker.trackFormStart('contact-form', 'contact-form-id')

// Later...
analytics.trackFormSubmission('contact-form', 'contact-form-id', true)
```

### Track Search
```typescript
tracker.trackSearch('custom closet', 25)
```

### Track Error
```typescript
try {
  // Your code
} catch (error) {
  tracker.trackError(error, false)
}
```

## 📈 Dashboard Access

### Real-Time Dashboard
```
URL: /admin/analytics?view=realtime
Features:
- Active users (now)
- Page views (last hour)
- Conversions (today)
- Live event stream
```

### Business Dashboard
```
URL: /admin/analytics
Features:
- Revenue trends
- Conversion funnel
- Top products
- Traffic sources
```

### Reporting Dashboard
```
URL: /admin/analytics?view=reports
Features:
- Weekly reports
- Monthly reports
- Custom date ranges
- Export to PDF/Excel
```

## 🔐 GDPR Compliance

### Cookie Consent
```typescript
// Automatically shown on first visit
// Users can:
✅ Accept all
✅ Reject all
✅ Customize preferences
✅ Revoke consent
```

### Privacy Features
```typescript
✅ IP anonymization
✅ Consent mode v2
✅ PII protection
✅ Right to be forgotten
✅ Data export
```

## 🤖 ML Predictions

### Revenue Forecast
```typescript
import { getPredictiveAnalytics } from '@/lib/analytics/predictive-analytics'

const predictor = getPredictiveAnalytics()

// Predict next month revenue
const forecast = await predictor.predictRevenue(new Date('2025-11-01'))

console.log(forecast)
// {
//   prediction: 45000,
//   confidence: { lower: 38000, upper: 52000 }
// }
```

### Customer Insights
```typescript
const insights = await predictor.predictCustomerBehavior(customerId)

console.log(insights)
// {
//   purchaseProbability: 0.78,
//   predictedValue: 3500,
//   recommendedProducts: [...],
//   churnRisk: 0.12
// }
```

## 📊 Automated Reports

### Weekly Reports
```
Sent: Every Monday 9:00 AM EST
To: team@pgclosets.com
Format: PDF + Dashboard Link

Contents:
- Revenue summary
- Traffic metrics
- Conversion rates
- Top products
- Issues & alerts
- Recommendations
```

### Monthly Reports
```
Sent: 1st Monday of month 9:00 AM EST
To: team@pgclosets.com, management@pgclosets.com
Format: PDF + Excel + Dashboard Link

Contents:
- Everything in weekly report
- Month-over-month trends
- Year-over-year comparison
- Cohort analysis
- Predictions for next month
```

## 🎯 Performance Metrics

### Core Web Vitals
```typescript
// Automatically tracked
✅ Largest Contentful Paint (LCP)
✅ First Input Delay (FID)
✅ Cumulative Layout Shift (CLS)
✅ Interaction to Next Paint (INP)
```

### Custom Metrics
```typescript
tracker.trackPageLoad(loadTime, resources)
tracker.trackWebVitals({ name: 'LCP', value: 2500, rating: 'good' })
```

## 🔧 Configuration

### Analytics Config
```typescript
// lib/analytics.ts
const config = {
  measurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  debug: process.env.NODE_ENV === 'development',
  anonymizeIP: true,
  enableConsentMode: true,
  cookieFlags: 'SameSite=Strict; Secure'
}
```

### Dashboard Config
```typescript
// lib/analytics/dashboard-config.ts
const dashboardConfig = {
  refreshInterval: 10000, // 10 seconds
  dateRange: 30, // days
  timezone: 'America/Toronto',
  currency: 'CAD'
}
```

## 🧪 Testing

### Development Mode
```typescript
// Events logged to console
// No real data sent to GA4
// Test mode indicators visible
```

### Test Events
```typescript
// Visit /admin/analytics?view=testing
// Click test buttons to verify:
✅ Page View
✅ Purchase
✅ Add to Cart
✅ Quote Request
✅ Error
✅ Interaction
```

### Validation
```
GA4 DebugView: https://analytics.google.com/analytics/web/#/debugview
GTM Preview: https://tagmanager.google.com/
```

## 📚 Documentation

### Full Documentation
- Main Guide: `DIVISION_11_ANALYTICS.md`
- Event Catalog: `docs/analytics/EVENT_CATALOG.md`
- Dashboard Guide: `docs/analytics/DASHBOARD_GUIDE.md`
- ML Models: `docs/analytics/ML_MODELS.md`

### API Reference
```typescript
// Event Tracker
getEventTracker(): EventTracker

// Analytics Core
getAnalytics(): Analytics

// Predictive Analytics
getPredictiveAnalytics(): PredictiveAnalytics

// Reporting
getReportingEngine(): ReportingEngine
```

## 🆘 Troubleshooting

### Events Not Showing
```
1. Check GA4 measurement ID in .env.local
2. Verify cookie consent granted
3. Check browser console for errors
4. Use GA4 DebugView to see events
```

### Dashboard Not Loading
```
1. Check internet connection
2. Verify user permissions
3. Clear browser cache
4. Check console for errors
```

### ML Predictions Inaccurate
```
1. Ensure sufficient historical data (90+ days)
2. Retrain model with latest data
3. Check for data quality issues
4. Adjust confidence intervals
```

## ✅ Checklist

### Initial Setup
- [ ] Set GA4 measurement ID
- [ ] Set GTM ID (optional)
- [ ] Test event tracking
- [ ] Configure cookie consent
- [ ] Set up automated reports

### Weekly Tasks
- [ ] Review weekly report
- [ ] Check for errors/alerts
- [ ] Monitor conversion trends
- [ ] Review top products
- [ ] Act on recommendations

### Monthly Tasks
- [ ] Review monthly report
- [ ] Analyze trends
- [ ] Update predictions
- [ ] Optimize campaigns
- [ ] Report to stakeholders

## 🎉 Next Steps

1. **Configure GA4** - Add measurement ID
2. **Test Events** - Use testing dashboard
3. **Review Dashboard** - Check real-time data
4. **Enable Reports** - Configure email delivery
5. **Train ML Models** - With historical data
6. **Monitor & Optimize** - Continuous improvement

---

**Quick Start Complete!** 🚀

For detailed documentation, see `DIVISION_11_ANALYTICS.md`

Support: analytics@pgclosets.com
