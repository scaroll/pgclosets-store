#!/bin/bash

echo "�� FINAL VERIFICATION"
echo "===================="

echo ""
echo "Testing pgclosets.com..."

# Test health endpoint
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/api/health)
echo "Health endpoint: $HEALTH"

# Test home page
HOME=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/)
echo "Home page: $HOME"

# Test sitemap
SITEMAP=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/sitemap.xml)
echo "Sitemap: $SITEMAP"

echo ""
if [ "$HEALTH" = "200" ] && [ "$HOME" = "200" ] && [ "$SITEMAP" = "200" ]; then
    echo "🎉 SUCCESS! pgclosets.com is now live!"
    echo ""
    echo "🌐 Production URLs:"
    echo "• Site: https://pgclosets.com"
    echo "• Health: https://pgclosets.com/api/health"
    echo "• Sitemap: https://pgclosets.com/sitemap.xml"
    echo "• Admin: https://pgclosets.com/admin"
else
    echo "❌ Domain setup not complete yet."
    echo "Make sure you completed both manual steps in Vercel dashboard."
fi
