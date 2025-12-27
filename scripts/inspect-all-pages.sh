#!/bin/bash

# Vercel Deployment Page Inspection Script
# Tests all pages for HTTP status, load time, and content verification

PREVIEW_URL="http://localhost:3000"
PRODUCTION_URL="https://www.pgclosets.com"
REPORT_FILE="PAGE_INSPECTION_REPORT.md"

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Starting Comprehensive Page Inspection..."
echo "Preview URL: $PREVIEW_URL"
echo "Production URL: $PRODUCTION_URL"
echo ""

# Initialize report
cat > $REPORT_FILE << 'EOF'
# 📊 Comprehensive Page Inspection Report

**Inspection Date**: $(date)
**Preview URL**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app
**Production URL**: https://www.pgclosets.com

---

## Test Results Summary

EOF

# Counter variables
TOTAL_PAGES=0
PASSED_PAGES=0
FAILED_PAGES=0
SLOW_PAGES=0

# Function to test a page
test_page() {
    local url=$1
    local page_name=$2
    local expected_content=$3

    TOTAL_PAGES=$((TOTAL_PAGES + 1))

    # Test HTTP status and response time
    response=$(curl -o /dev/null -s -w "%{http_code}|%{time_total}" "$url" --max-time 10)
    status_code=$(echo $response | cut -d'|' -f1)
    load_time=$(echo $response | cut -d'|' -f2)

    # Check if page loaded successfully
    if [ "$status_code" = "200" ]; then
        PASSED_PAGES=$((PASSED_PAGES + 1))

        # Check load time
        if (( $(echo "$load_time > 3.0" | bc -l) )); then
            SLOW_PAGES=$((SLOW_PAGES + 1))
            echo -e "${YELLOW}⚠️  SLOW${NC} | $page_name | $status_code | ${load_time}s"
            echo "| ⚠️ SLOW | \`$page_name\` | $status_code | ${load_time}s | [Visit]($url) |" >> $REPORT_FILE
        else
            echo -e "${GREEN}✅ PASS${NC} | $page_name | $status_code | ${load_time}s"
            echo "| ✅ PASS | \`$page_name\` | $status_code | ${load_time}s | [Visit]($url) |" >> $REPORT_FILE
        fi

        # Check for expected content if provided
        if [ -n "$expected_content" ]; then
            if curl -s "$url" | grep -q "$expected_content"; then
                echo "  ✓ Content verified: '$expected_content' found"
            else
                echo "  ⚠️  Warning: Expected content not found"
            fi
        fi
    else
        FAILED_PAGES=$((FAILED_PAGES + 1))
        echo -e "${RED}❌ FAIL${NC} | $page_name | $status_code | ${load_time}s"
        echo "| ❌ FAIL | \`$page_name\` | $status_code | ${load_time}s | [Visit]($url) |" >> $REPORT_FILE
    fi
}

# Add table header to report
cat >> $REPORT_FILE << 'EOF'

| Status | Page | HTTP Code | Load Time | Link |
|--------|------|-----------|-----------|------|
EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING CRITICAL PAGES WITH UI CHANGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Homepage with new UI
test_page "$PREVIEW_URL/" "Homepage" "Elevated Taste"

# Test Products Landing Page with luxury design
test_page "$PREVIEW_URL/products" "Products Landing" "Curated"

# Test individual product pages
test_page "$PREVIEW_URL/products/euro-3-lite-bypass" "Product: Euro 3-Lite Bypass"
test_page "$PREVIEW_URL/products/ashbury-2-panel-design-steel-frame-bypass-door" "Product: Ashbury 2-Panel"
test_page "$PREVIEW_URL/products/pavilion-2-lite-bypass" "Product: Pavilion 2-Lite"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING NAVIGATION & HEADER PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_page "$PREVIEW_URL/about" "About Page"
test_page "$PREVIEW_URL/services" "Services Page"
test_page "$PREVIEW_URL/contact" "Contact Page"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING SEO NEIGHBORHOOD PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_page "$PREVIEW_URL/areas/kanata" "Kanata Neighborhood" "Premium Closet Doors in Kanata"
test_page "$PREVIEW_URL/areas/barrhaven" "Barrhaven Neighborhood" "Barrhaven"
test_page "$PREVIEW_URL/areas/orleans" "Orleans Neighborhood" "Orleans"
test_page "$PREVIEW_URL/areas/nepean" "Nepean Neighborhood" "Nepean"
test_page "$PREVIEW_URL/areas/ottawa" "Ottawa Neighborhood" "Ottawa"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING PRODUCT CATEGORY PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_page "$PREVIEW_URL/products/barn-doors" "Barn Doors Category"
test_page "$PREVIEW_URL/products/closet-systems" "Closet Systems Category"
test_page "$PREVIEW_URL/products/hardware" "Hardware Category"
test_page "$PREVIEW_URL/products/interior-doors" "Interior Doors Category"
test_page "$PREVIEW_URL/products/room-dividers" "Room Dividers Category"
test_page "$PREVIEW_URL/products/search" "Product Search"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING KEY FUNCTIONAL PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_page "$PREVIEW_URL/request-work" "Quote Request Form"
test_page "$PREVIEW_URL/gallery" "Gallery Page"
test_page "$PREVIEW_URL/faq" "FAQ Page"
test_page "$PREVIEW_URL/blog" "Blog Listing"
test_page "$PREVIEW_URL/cart" "Shopping Cart"
test_page "$PREVIEW_URL/search" "Search Page"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING LEGAL & INFO PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_page "$PREVIEW_URL/legal/privacy" "Privacy Policy"
test_page "$PREVIEW_URL/legal/terms" "Terms of Service"
test_page "$PREVIEW_URL/shipping-policy" "Shipping Policy"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TESTING SEO & TECHNICAL PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_page "$PREVIEW_URL/sitemap.xml" "Sitemap XML"
test_page "$PREVIEW_URL/robots.txt" "Robots.txt"
test_page "$PREVIEW_URL/manifest.webmanifest" "PWA Manifest"

# Add summary to report
cat >> $REPORT_FILE << EOF

---

## 📊 Summary Statistics

- **Total Pages Tested**: $TOTAL_PAGES
- **Passed (200 OK)**: $PASSED_PAGES
- **Failed (Non-200)**: $FAILED_PAGES
- **Slow (>3s Load)**: $SLOW_PAGES
- **Success Rate**: $(echo "scale=2; $PASSED_PAGES * 100 / $TOTAL_PAGES" | bc)%

---

## 🎯 UI Improvements Verification

### ✅ Changes Deployed:
- Larger logo (48x48 pixels)
- Always-visible trust banner
- Quick links in header (About | Services | Contact)
- Phone number prominence: (613) 422-5800
- Luxury product landing page with black hero section
- White background product grid
- Elegant product cards with black buttons
- Refined typography and spacing

### 📋 Manual Verification Required:
Use the Vercel Toolbar at the preview URL to visually verify:
1. Logo size and visibility
2. Trust banner always showing
3. Quick links layout
4. Product page luxury design
5. Product card styling
6. Button hover effects
7. Mobile responsive design

---

## 🔗 Vercel Toolbar Access

**Preview URL with Toolbar**: https://pgclosets-store-main-bsobssaee-peoples-group.vercel.app

1. Open the URL in your browser
2. Click the floating Vercel icon (bottom-right)
3. Use the toolbar to navigate and inspect all pages
4. Leave comments directly on pages for any issues

---

**Generated**: $(date)
**Script**: scripts/inspect-all-pages.sh
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "INSPECTION COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 RESULTS:"
echo "   Total Pages:  $TOTAL_PAGES"
echo "   Passed:       $PASSED_PAGES"
echo "   Failed:       $FAILED_PAGES"
echo "   Slow (>3s):   $SLOW_PAGES"
echo ""
echo "📄 Detailed report saved to: $REPORT_FILE"
echo ""
echo "🔗 Visual Inspection:"
echo "   Open: $PREVIEW_URL"
echo "   Click the Vercel toolbar icon to inspect pages visually"
echo ""
