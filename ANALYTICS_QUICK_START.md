# Analytics Infrastructure Quick Start Guide
## Get Analytics Running in 30 Minutes

**For:** PG Closets Development Team
**Updated:** October 14, 2025

---

## Step 1: Configure Environment Variables (5 minutes)

Add these to your `.env.local` file:

```bash
# Google Analytics & Tag Manager
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Marketing Pixels
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXX
NEXT_PUBLIC_PINTEREST_TAG_ID=XXXXXXXXXXXXX
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=XXXXXXX

# Dynamic Number Insertion (Optional - for call tracking)
NEXT_PUBLIC_PHONE_TRACKING_GOOGLE_ADS=+16131234567
NEXT_PUBLIC_PHONE_TRACKING_FACEBOOK=+16131234568
NEXT_PUBLIC_PHONE_TRACKING_TIKTOK=+16131234569
NEXT_PUBLIC_PHONE_TRACKING_ORGANIC=+16131234570
NEXT_PUBLIC_PHONE_TRACKING_DIRECT=+16131234571

# Analytics Settings
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
NEXT_PUBLIC_ANALYTICS_DEBUG=false
```

**Get Your IDs:**
- GA4: https://analytics.google.com → Admin → Data Streams
- GTM: https://tagmanager.google.com → Admin → Container ID
- Facebook: https://business.facebook.com → Events Manager → Pixel ID
- TikTok: https://ads.tiktok.com → Assets → Events → Pixel ID
- Pinterest: https://ads.pinterest.com → Conversions → Pinterest Tag
- LinkedIn: https://business.linkedin.com → Insight Tag → Partner ID

---

## Step 2: Add Analytics to Layout (5 minutes)

Update `/app/layout.tsx`:

```tsx
import Script from 'next/script'
import { initializeAllTags } from '@/lib/analytics/tag-manager'
import { initializeScrollTracking } from '@/lib/analytics/conversion-tracking'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize all marketing tags on mount
  React.useEffect(() => {
    initializeAllTags()
    initializeScrollTracking()
  }, [])

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}

        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body>
        {children}

        {/* GTM NoScript Fallback */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
      </body>
    </html>
  )
}
```

---

## Step 3: Track Product Views (3 minutes)

In your Product Detail Page component:

```tsx
import { trackProductDetailView } from '@/lib/analytics/enhanced-ga4'
import { trackUnifiedEvent } from '@/lib/analytics/tag-manager'

export function ProductDetailPage({ product }) {
  useEffect(() => {
    // Track in GA4 with full details
    trackProductDetailView({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      item_category2: product.type,
      item_brand: product.brand || 'Renin',
      price: product.price,
      variant: product.selectedVariant?.name,
    })

    // Also track in all marketing pixels
    trackUnifiedEvent('product_view', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
    })
  }, [product.id])

  return (
    // Your product page JSX
  )
}
```

---

## Step 4: Track Quote Requests (5 minutes)

In your quote form component:

```tsx
import {
  trackQuoteRequestStart,
  trackQuoteRequestComplete,
} from '@/lib/analytics/conversion-tracking'

export function QuoteForm() {
  const handleQuoteStart = () => {
    trackQuoteRequestStart({
      source: 'quote_page',
      product_id: selectedProduct?.id,
      product_name: selectedProduct?.name,
    })
  }

  const handleQuoteSubmit = async (data) => {
    // Submit quote to backend
    const quoteId = await submitQuote(data)

    // Track completion
    trackQuoteRequestComplete({
      quote_id: quoteId,
      quote_type: 'custom',
      products: selectedProducts,
      total_value: calculateTotal(selectedProducts),
      customer_info: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        postal_code: data.postal_code,
      },
      source: 'quote_page',
    })
  }

  return (
    <form onSubmit={handleSubmit(handleQuoteSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

---

## Step 5: Track Phone Calls (3 minutes)

In your header or phone link components:

```tsx
import { trackPhoneCallClick } from '@/lib/analytics/conversion-tracking'

export function PhoneLink() {
  const handlePhoneClick = () => {
    trackPhoneCallClick({
      phone_number: '+1-613-123-4567',
      location: 'header',
      cta_text: 'Call Now',
      page_path: window.location.pathname,
    })
  }

  return (
    <a
      href="tel:+16131234567"
      onClick={handlePhoneClick}
      className="phone-link"
    >
      (613) 123-4567
    </a>
  )
}
```

---

## Step 6: Track Add to Cart (3 minutes)

In your add to cart button:

```tsx
import { trackAddToCart } from '@/lib/analytics/enhanced-ga4'
import { trackUnifiedEvent } from '@/lib/analytics/tag-manager'

export function AddToCartButton({ product, variant, quantity }) {
  const handleAddToCart = () => {
    // Add to cart logic
    addToCart(product, variant, quantity)

    // Track in GA4
    trackAddToCart({
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: variant.price,
          quantity: quantity,
          variant: variant.name,
        },
      ],
      value: variant.price * quantity,
    })

    // Track in all pixels
    trackUnifiedEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: variant.price,
    })
  }

  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  )
}
```

---

## Step 7: Enable Dynamic Number Insertion (3 minutes)

In your main layout or header component:

```tsx
import { setupDynamicNumberInsertion } from '@/lib/analytics/conversion-tracking'

export function Header() {
  useEffect(() => {
    // Replace phone numbers based on traffic source
    setupDynamicNumberInsertion()
  }, [])

  return (
    <header>
      <a href="tel:+16131234567" data-phone-number>
        (613) 123-4567
      </a>
    </header>
  )
}
```

---

## Step 8: Test Everything (3 minutes)

### 1. Start Development Server

```bash
NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run dev
```

### 2. Open Browser Console

Look for initialization messages:
```
[GTM] Initialized
[GA4] Initialized
[Facebook Pixel] Initialized
[TikTok Pixel] Initialized
[Pinterest Tag] Initialized
[LinkedIn Insight Tag] Initialized
[Tag Manager] All tags initialized
```

### 3. Perform Test Actions

- Navigate between pages ✓
- View a product ✓
- Click phone number ✓
- Submit quote form ✓
- Add to cart ✓
- Scroll to bottom ✓

### 4. Verify in Tools

1. **GA4 DebugView**
   - Open: https://analytics.google.com
   - Go to: Configure → DebugView
   - See events in real-time

2. **GTM Preview Mode**
   - Open: https://tagmanager.google.com
   - Click "Preview"
   - Enter your localhost URL
   - See tags firing

3. **Facebook Pixel Helper**
   - Install Chrome extension
   - Click extension icon
   - Verify events firing

---

## Common Issues & Solutions

### Issue: No events showing in GA4

**Solution:**
1. Check environment variable is set: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
2. Verify measurement ID is correct (starts with "G-")
3. Check browser console for errors
4. Enable debug mode: `NEXT_PUBLIC_ANALYTICS_DEBUG=true`
5. Wait 24-48 hours for data to appear in standard reports (use DebugView for immediate feedback)

### Issue: GTM tags not firing

**Solution:**
1. Verify GTM container is published
2. Check GTM ID is correct (starts with "GTM-")
3. Use GTM Preview mode to debug
4. Check dataLayer is populating: `console.log(window.dataLayer)`

### Issue: Phone tracking not working

**Solution:**
1. Check tracking numbers are configured
2. Verify UTM parameters in URL
3. Check console for DNI logs
4. Ensure phone links have `href="tel:..."`

### Issue: Events not showing in Facebook Pixel

**Solution:**
1. Verify Pixel ID is correct
2. Check Pixel Helper Chrome extension
3. Ensure pixel initialized: `console.log(window.fbq)`
4. Check Facebook Events Manager Test Events

---

## Next Steps

### Week 1: Core Tracking

- ✓ Configure environment variables
- ✓ Add analytics to layout
- ✓ Track product views
- ✓ Track quote requests
- ✓ Track phone calls
- ✓ Track add to cart
- ✓ Test in development
- [ ] Deploy to staging
- [ ] Validate in staging
- [ ] Deploy to production

### Week 2: Advanced Features

- [ ] Set up GA4 custom dimensions
- [ ] Configure GTM triggers and variables
- [ ] Mark conversion events in GA4
- [ ] Create GA4 audiences
- [ ] Set up enhanced measurement
- [ ] Configure goal funnels

### Week 3: Dashboards & Reporting

- [ ] Create Looker Studio dashboard
- [ ] Set up automated daily reports
- [ ] Configure weekly reports
- [ ] Set up monthly reports
- [ ] Create custom alerts
- [ ] Train team on dashboards

### Week 4: Optimization

- [ ] Review first month of data
- [ ] Identify optimization opportunities
- [ ] Refine tracking implementation
- [ ] Update attribution models
- [ ] Optimize conversion funnels
- [ ] Document insights

---

## Support & Resources

### Documentation

- **Full Implementation:** `/ANALYTICS_INFRASTRUCTURE_DEPLOYMENT_SUMMARY.md`
- **Setup Guide:** `/ANALYTICS_SETUP.md`
- **Analytics README:** `/lib/analytics/README.md`

### Code Files

- **GA4 Enhanced:** `/lib/analytics/enhanced-ga4.ts`
- **Tag Manager:** `/lib/analytics/tag-manager.ts`
- **Conversion Tracking:** `/lib/analytics/conversion-tracking.ts`

### External Resources

- **GA4 Docs:** https://developers.google.com/analytics/devguides/collection/ga4
- **GTM Docs:** https://developers.google.com/tag-manager
- **Facebook Pixel:** https://developers.facebook.com/docs/meta-pixel
- **TikTok Pixel:** https://ads.tiktok.com/help/article?aid=10000357
- **Pinterest Tag:** https://help.pinterest.com/en/business/article/track-conversions-with-pinterest-tag

### Need Help?

**Analytics Team:** analytics@pgclosets.com
**Implementation Support:** Agents #36-40
**Technical Issues:** dev-team@pgclosets.com

---

## Success Checklist

After completing this guide, you should have:

- [x] All environment variables configured
- [x] Analytics initialized in layout
- [x] Product views tracked
- [x] Quote requests tracked
- [x] Phone calls tracked
- [x] Add to cart tracked
- [x] Events visible in browser console
- [x] Events visible in GA4 DebugView
- [x] Events visible in GTM Preview
- [x] Events visible in Facebook Pixel Helper

**Congratulations! Your analytics infrastructure is live.** 🎉

Now monitor your dashboard and start optimizing based on data insights.

---

**Document Version:** 1.0
**Last Updated:** October 14, 2025
**Estimated Setup Time:** 30 minutes
