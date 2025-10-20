#!/bin/bash

echo "🔍 PG Closets Domain Migration Verification"
echo "=========================================="

# Test the custom domain
echo ""
echo "Testing pgclosets.com endpoints..."
echo "----------------------------------"

# Health check
health_status=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/api/health)
if [ "$health_status" = "200" ]; then
    echo "✅ Health API: $health_status (SUCCESS)"
    # Get health details
    health_data=$(curl -s https://pgclosets.com/api/health | jq -r '.status + " - " + .environment')
    echo "   Status: $health_data"
else
    echo "❌ Health API: $health_status (FAILED)"
fi

# Home page
home_status=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/)
if [ "$home_status" = "200" ]; then
    echo "✅ Home Page: $home_status (SUCCESS)"
else
    echo "❌ Home Page: $home_status (FAILED)"
fi

# Sitemap
sitemap_status=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/sitemap.xml)
if [ "$sitemap_status" = "200" ]; then
    echo "✅ Sitemap: $sitemap_status (SUCCESS)"
else
    echo "❌ Sitemap: $sitemap_status (FAILED)"
fi

# Products page
products_status=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/products)
if [ "$products_status" = "200" ]; then
    echo "✅ Products Page: $products_status (SUCCESS)"
else
    echo "❌ Products Page: $products_status (FAILED)"
fi

echo ""
echo "📊 Summary:"
echo "-----------"
if [ "$health_status" = "200" ] && [ "$home_status" = "200" ] && [ "$sitemap_status" = "200" ] && [ "$products_status" = "200" ]; then
    echo "🎉 ALL TESTS PASSED - Domain migration successful!"
    echo "🌐 pgclosets.com is now live with your production site!"
else
    echo "⚠️  Some tests failed. Domain migration may still be in progress."
    echo "   Wait a few more minutes and run this script again."
fi

echo ""
echo "🔗 Production URLs:"
echo "-------------------"
echo "• Site: https://pgclosets.com"
echo "• Health: https://pgclosets.com/api/health"
echo "• Sitemap: https://pgclosets.com/sitemap.xml"
echo "• Vercel URL: https://pgclosets-store-main-cxxw1mbsj-peoples-group.vercel.app"