# Vercel Toolbar Visual Inspection Guide

## 🎯 Vercel Toolbar Deployed Successfully

The Vercel Toolbar has been integrated and deployed to enable visual inspection of all pages.

---

## 🔗 Deployment URLs

### Preview Deployment (with Toolbar)
**Preview URL**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app
- Toolbar is **automatically enabled** on preview deployments
- Click the Vercel icon in bottom-right corner to open toolbar

### Production Deployment
**Production URL**: https://www.pgclosets.com
**Vercel Production**: https://pgclosets-store-main-2p25d0sx5-peoples-group.vercel.app
- Toolbar is **disabled** in production by default for performance

---

## 🛠️ How to Access the Vercel Toolbar

### Method 1: Preview Deployment (Recommended)
1. **Open Preview URL**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app
2. **Look for Vercel Icon**: Bottom-right corner of the page (floating button)
3. **Click the Icon**: Opens the Vercel Toolbar
4. **Navigate Pages**: Use toolbar to inspect different pages

### Method 2: Vercel Dashboard
1. Go to https://vercel.com/peoples-group/pgclosets-store-main
2. Click on the latest deployment
3. Click "Visit" to open with toolbar enabled
4. Use the toolbar to navigate and inspect

### Method 3: Local Development
1. Run `npm run dev` locally
2. Toolbar will appear in development mode
3. Navigate to http://localhost:3000

---

## 📋 Pages to Inspect

### 1. **Homepage** - `/`
**What to Check**:
- ✅ Logo size (should be 48x48, larger than before)
- ✅ Trust banner at very top (Official Renin Dealer, 500+ Ottawa Installations, Price Match Guarantee)
- ✅ Quick links in header (About | Services | Contact)
- ✅ Phone number prominent: (613) 422-5800
- ✅ Hero section with "Elevated Taste Without Pretense"
- ✅ Luxury design aesthetic throughout

**Direct Link**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/

---

### 2. **Products Landing Page** - `/products`
**What to Check**:
- ✅ NEW: Black luxury hero section with "Curated Collection" heading
- ✅ NEW: White background for product grid (not gray)
- ✅ NEW: Elegant product cards with:
  - Light, refined typography
  - Black "View Details" buttons
  - Black/white "Quote" buttons
  - Smooth hover effects (700ms transitions)
  - Premium badges on high-value items

**Direct Link**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/products

---

### 3. **Individual Product Pages** - `/products/[slug]`
**Sample Products to Check**:
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/products/euro-3-lite-bypass
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/products/ashbury-2-panel-design-steel-frame-bypass-door

**What to Check**:
- ✅ Product images load correctly
- ✅ Pricing displays properly (e.g., CA$299.00, not CA$2.99)
- ✅ Add to cart functionality
- ✅ Product details and specifications

---

### 4. **Navigation & Header** (All Pages)
**What to Check**:
- ✅ Trust banner always visible at top
- ✅ Quick links visible on desktop
- ✅ Logo prominently displayed (48x48)
- ✅ Main navigation menu works
- ✅ Mega menu dropdowns function properly
- ✅ Mobile menu works on small screens

**Test on These Pages**:
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/about
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/services
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/contact

---

### 5. **SEO Neighborhood Pages** - `/areas/[neighborhood]`
**What to Check**:
- ✅ Pages load correctly
- ✅ Proper H1 tags for each neighborhood
- ✅ Local SEO content displays

**Direct Links**:
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/areas/kanata
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/areas/barrhaven
- https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/areas/orleans

---

### 6. **Other Key Pages**
- **Quote Request**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/request-work
- **Gallery**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/gallery
- **FAQ**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/faq
- **Blog**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app/blog

---

## 🔍 Vercel Toolbar Features

### What the Toolbar Provides:
1. **Page Navigation**: Quick links to all pages
2. **Comments**: Leave feedback directly on the page
3. **Performance**: View Core Web Vitals and performance metrics
4. **Lighthouse**: Run Lighthouse audits
5. **Analytics**: View real-time analytics data
6. **Sharing**: Share specific views with team members

### How to Use Toolbar:
1. **Click the floating Vercel button** (bottom-right)
2. **Select a feature** from the toolbar menu
3. **Navigate pages** using the sidebar
4. **Leave comments** by clicking anywhere on the page
5. **View performance** metrics in real-time

---

## ✅ Inspection Checklist

### UI Changes Verification:
- [ ] Logo is larger and more visible (48x48)
- [ ] Trust banner always visible (no dismiss button)
- [ ] Quick links present in header (About, Services, Contact)
- [ ] Phone number prominent
- [ ] Product page has luxury black hero section
- [ ] Product grid has white background
- [ ] Product cards have elegant styling
- [ ] Buttons are black/white with uppercase text
- [ ] Hover effects are smooth (700ms)

### Functionality Verification:
- [ ] All navigation menus work
- [ ] Product filtering works
- [ ] Product detail pages load
- [ ] Quote form works
- [ ] Mobile menu functions
- [ ] Search functionality works
- [ ] Images load correctly

### Performance Verification:
- [ ] Pages load quickly (<3s)
- [ ] Images are optimized
- [ ] No console errors
- [ ] Smooth animations
- [ ] Responsive on all devices

---

## 🚀 Quick Commands

### View Latest Deployment Logs:
```bash
vercel inspect pgclosets-store-main-bsobssaee-peoples-group.vercel.app --logs
```

### Redeploy if Needed:
```bash
vercel redeploy pgclosets-store-main-bsobssaee-peoples-group.vercel.app
```

### Deploy New Preview:
```bash
VERCEL_PROJECT_ID="prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu" VERCEL_ORG_ID="team_Xzht85INUsoW05STx9DMMyLX" vercel --yes
```

### Deploy to Production:
```bash
VERCEL_PROJECT_ID="prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu" VERCEL_ORG_ID="team_Xzht85INUsoW05STx9DMMyLX" vercel --prod --yes
```

---

## 📱 Mobile Testing

### Test on Multiple Devices:
1. Use Vercel Toolbar's device preview feature
2. Or use browser DevTools responsive mode
3. Test on actual devices if available

### Key Mobile Breakpoints:
- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

---

## 🎨 Design System Verification

### Typography:
- [ ] Headings use light weights (font-light)
- [ ] Wide letter spacing (tracking-wide, tracking-wider)
- [ ] Proper hierarchy (text-5xl → text-sm)

### Colors:
- [ ] Black backgrounds for luxury sections
- [ ] White backgrounds for content areas
- [ ] Gray-900 for trust banner gradient
- [ ] Proper contrast ratios

### Buttons:
- [ ] Black primary buttons
- [ ] White/transparent secondary buttons
- [ ] Uppercase text with wide tracking
- [ ] 300-500ms transitions

---

## 📊 Performance Targets

### Core Web Vitals (via Toolbar):
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Scores:
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 95

---

## 🐛 Common Issues to Check

1. **Images Not Loading**: Check console for 404 errors
2. **Styling Issues**: Verify Tailwind classes are applied
3. **JavaScript Errors**: Check console for errors
4. **Mobile Menu**: Ensure it opens/closes properly
5. **Form Submissions**: Test quote request form
6. **Product Filtering**: Verify all filters work
7. **Pricing Display**: Ensure prices show correctly (dollars, not cents)

---

## 📞 Support

If you find any issues during inspection:
1. Use Vercel Toolbar to leave comments directly on the page
2. Take screenshots with annotations
3. Check browser console for errors
4. Note the specific URL where the issue occurs

---

**Deployment Date**: October 6, 2025
**Deployment Team**: PG Closets AI Development Division
**Vercel Toolbar Version**: 0.1.41
**Total Pages**: 180 static pages generated

🎉 **Ready for Visual Inspection!**
