#!/bin/bash

# Policy Update Script
# Updates all "free consultation/free in-home/free measurement/book measurement" references
# Policy: Free online quotes only. On-site measurement is paid and optional.

echo "🔄 Starting policy update..."
echo "Policy: Free online quotes (email-only). On-site measurement is paid and optional."
echo ""

# Find and replace patterns
echo "📝 Replacing prohibited phrases..."

# Pattern 1: "Free Consultation" → "Free Online Quote"
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Free Consultation/Free Online Quote/g' {} +
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/free consultation/free online quote/g' {} +

# Pattern 2: "Free In-Home" → "Free Online Quote"
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Free In-Home Visit/Free Online Quote/g' {} +
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/free in-home visit/free online quote/g' {} +
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Free In-Home/Free Online Quote/g' {} +
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/free in-home/free online quote/g' {} +

# Pattern 3: "Free Measurement" → "Free Online Quote"
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/Free Measurement/Free Online Quote/g' {} +
find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's/free measurement/free online quote/g' {} +

# Pattern 4: "Book Measurement" → "Request On-Site Measurement (Paid)" or "Email Us"
# This one needs manual review as context matters
echo "⚠️  'Book Measurement' requires manual review - see list below"

echo ""
echo "✅ Automated replacements complete"
echo ""
echo "📋 Files that still contain 'book measurement' (requires manual review):"
rg -i "book measurement" app components lib -l 2>/dev/null || echo "None found"

echo ""
echo "📋 Verification - checking for remaining prohibited phrases:"
echo ""
echo "Checking 'free consultation':"
rg -i "free consultation" app components lib -l 2>/dev/null | head -10 || echo "✅ None found"

echo ""
echo "Checking 'free in-home':"
rg -i "free in-home" app components lib -l 2>/dev/null | head -10 || echo "✅ None found"

echo ""
echo "Checking 'free measurement':"
rg -i "free measurement" app components lib -l 2>/dev/null | head -10 || echo "✅ None found"

echo ""
echo "🎯 Policy update script complete!"
echo "Next: Review 'book measurement' files manually and run verification"
