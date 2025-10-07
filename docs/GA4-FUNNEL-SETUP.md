# GA4 Funnel Dashboard Setup Guide

## Overview
This guide provides instructions for setting up GA4 funnel tracking and dashboards for the PG Closets website to monitor user behavior and conversion paths.

## Key Metrics to Track

### 1. PLP (Product Listing Page) CTR
- **Metric**: Product card clicks / page views
- **Event**: `cta_click` with `cta_location: 'grid'`
- **Purpose**: Measure effectiveness of product cards in driving engagement

### 2. PDP (Product Detail Page) CTR
- **Metric**: "Get Free Quote" clicks / PDP views
- **Event**: `cta_click` with `cta_location: 'pdp'`
- **Purpose**: Track conversion rate from product view to quote request

### 3. Sticky CTA Performance
- **Metric**: Mobile sticky CTA clicks / mobile sessions
- **Event**: `sticky_cta_click`
- **Purpose**: Measure mobile-specific CTA effectiveness

### 4. Quote Funnel
- **Steps**:
  - Quote Start: `quote_start` event
  - Quote Submit: `quote_submit` event with `success: true`
- **Purpose**: Track quote request completion rate

## GA4 Exploration Setup

### Funnel Exploration Configuration

1. **Navigate to GA4**:
   - Go to **Explore** → **Funnel Exploration**

2. **Create Primary Conversion Funnel**:
   ```
   Step 1: page_view (page_location contains '/products')
   Step 2: cta_click (cta_location = 'grid')
   Step 3: page_view (page_location contains '/products/')
   Step 4: cta_click (cta_location = 'pdp')
   Step 5: quote_start
   Step 6: quote_submit (success = true)
   ```

3. **Funnel Settings**:
   - **Funnel type**: Standard funnel
   - **Step completion**: Any order (non-sequential)
   - **Measurement**: Sessions or Users
   - **Date range**: Last 30 days (adjustable)

### Mobile Sticky CTA Funnel

1. **Create Mobile-Specific Funnel**:
   ```
   Step 1: page_view (device_category = 'mobile')
   Step 2: sticky_cta_click
   Step 3: quote_start
   Step 4: quote_submit (success = true)
   ```

2. **Add Breakdown Dimension**: `device_category`

## Custom Reports

### Weekly CTA Performance by Location

**Report Configuration**:
- **Dimensions**:
  - Primary: `cta_location`
  - Secondary: `cta_label`
- **Metrics**:
  - Total clicks
  - Unique users
  - CTR (clicks/page_views)
- **Filter**: Event name = `cta_click`
- **Date Range**: Last 7 days, compare to previous period

### Product Engagement Heatmap

**Report Configuration**:
- **Dimensions**:
  - Row: `product_name`
  - Column: `event_name`
- **Metrics**:
  - Event count
  - Unique users
- **Filters**:
  - Events: `cta_click`, `grid_card_view`, `quote_start`
- **Visualization**: Heatmap

### Mobile vs Desktop Conversion

**Report Configuration**:
- **Dimensions**: `device_category`
- **Metrics**:
  - Sessions
  - `quote_start` count
  - `quote_submit` count
  - Conversion rate (quote_submit / quote_start)
- **Comparison**: Mobile vs Desktop vs Tablet

## Event Tracking Implementation Status

### ✅ Implemented Events

1. **trackCTAClick**
   - Location: Grid, PDP, Header, Hero, Footer, Sticky Mobile
   - Labels: get_quote, book_measurement, email_us, view_details, add_to_cart

2. **trackStickyMobileCTA**
   - Tracks mobile sticky CTA clicks on PDP
   - Includes product_id and product_name

3. **trackQuoteStart**
   - Tracks when user initiates quote request
   - Captures source and product context

4. **trackQuoteSubmit**
   - Tracks successful and failed quote submissions
   - Includes form_id, products, total_value
   - Fires conversion event on success

5. **trackMeasurementHelperClick**
   - Tracks clicks to measurement guide
   - Captures location context

6. **trackFilterApply** & **trackSortChange**
   - Product discovery interactions
   - Filter and sort behavior tracking

7. **trackGridCardView** & **trackGridCardCTAClick**
   - Individual product card engagement
   - Position and list context tracking

### Event Data Layer Structure

All events use the GTM data layer with this structure:
```javascript
{
  event: 'event_name',
  event_category: 'Category',
  event_label: 'Label',
  // Event-specific parameters
}
```

## Custom Dimensions to Configure

Add these custom dimensions in GA4:

1. **cta_location** (Event-scoped)
   - Type: Text
   - Description: Location of CTA click

2. **cta_label** (Event-scoped)
   - Type: Text
   - Description: CTA button label/action

3. **product_id** (Event-scoped)
   - Type: Text
   - Description: Product identifier

4. **product_name** (Event-scoped)
   - Type: Text
   - Description: Product name

5. **form_id** (Event-scoped)
   - Type: Text
   - Description: Form identifier

## Recommended Dashboards

### 1. Quote Funnel Dashboard
**Widgets**:
- Funnel visualization (6 steps)
- Drop-off rate by step
- Time to conversion
- Top exit pages
- Mobile vs Desktop comparison

### 2. CTA Performance Dashboard
**Widgets**:
- CTA clicks by location (bar chart)
- CTR by location (scorecard)
- Click trend over time (line chart)
- Sticky CTA effectiveness (mobile only)
- Heat map of CTA engagement

### 3. Product Discovery Dashboard
**Widgets**:
- Top viewed products (table)
- Filter usage frequency
- Sort preference distribution
- Grid card CTR by position
- Product engagement funnel

## Goals and Conversions

### Primary Conversion: Quote Submission
- **Event**: `quote_submit` with `success = true`
- **Value**: Use `total_value` parameter
- **Currency**: CAD

### Secondary Conversions:
1. **Quote Started** - `quote_start`
2. **Measurement Helper Click** - `measurement_helper_click`
3. **PDP CTA Click** - `cta_click` where `cta_location = 'pdp'`

## Monitoring and Alerts

### Set Up Alerts For:

1. **Conversion Rate Drop**
   - Alert if quote submission rate drops below 15% (week-over-week)

2. **CTA Performance Anomaly**
   - Alert if any CTA location CTR drops below 5%

3. **Mobile Sticky CTA**
   - Alert if mobile sticky CTA clicks < 10% of mobile PDP views

4. **Quote Submission Failures**
   - Alert if `quote_submit` with `success = false` > 5%

## Testing and Validation

### Before Going Live:
1. ✅ Verify all events fire in GA4 DebugView
2. ✅ Confirm custom dimensions populate correctly
3. ✅ Test funnel with sample user journey
4. ✅ Validate conversion tracking
5. ✅ Check real-time reports show data

### Post-Launch:
- Monitor for 1 week to establish baseline
- Adjust alert thresholds based on actual data
- Review funnel drop-off points
- Optimize low-performing CTAs

## Resources

- **GA4 Documentation**: https://support.google.com/analytics/
- **GTM Implementation**: See `/lib/analytics/gtm.ts`
- **Event Tracking**: See `/lib/analytics/events.ts`
- **Conversion Tracking**: See quote form implementations

## Update History

- **2025-01-XX**: Initial funnel setup documentation
- **Implementation Status**: All tracking events implemented and active
