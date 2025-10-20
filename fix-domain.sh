#!/bin/bash

echo "🔧 QUICK DOMAIN FIX"
echo "==================="

echo ""
echo "The domain pgclosets.com is currently assigned to the 'output' project."
echo "We need to move it to the 'pgclosets-store-main' project."
echo ""

echo "📋 EXACT STEPS:"
echo "1. Open: https://vercel.com/peoples-group/pgclosets-store-main/domains"
echo "2. Find 'pgclosets.com' in the list"
echo "3. Click the '⋯' menu button (three dots)"
echo "4. Select 'Move to another project'"
echo "5. Choose 'pgclosets-store-main' from the dropdown"
echo "6. Click 'Move Domain'"
echo ""

# Open browser
if command -v open &> /dev/null; then
    open "https://vercel.com/peoples-group/pgclosets-store-main/domains"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://vercel.com/peoples-group/pgclosets-store-main/domains"
fi

echo "After completing the move, press Enter to test..."
read

echo ""
echo "🔍 Testing domain..."
sleep 5

STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/api/health)
if [ "$STATUS" = "200" ]; then
    echo "✅ SUCCESS! pgclosets.com is now working!"
    echo ""
    echo "🌐 Your site is live at: https://pgclosets.com"
else
    echo "❌ Still not working. DNS may need more time to propagate."
    echo "Current status: $STATUS"
fi
