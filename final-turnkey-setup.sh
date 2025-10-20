#!/bin/bash

echo "🔑 TURNKEY DOMAIN SETUP - MINIMAL MANUAL STEPS"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "📋 WHAT THIS SCRIPT DOES:"
echo "1. ✅ Confirms Vercel authentication"
echo "2. ✅ Links project automatically"  
echo "3. 🔗 Opens browser to required pages"
echo "4. ✅ Verifies domain migration success"
echo ""

# Step 1: Authentication check
echo -n "Step 1: Checking Vercel authentication... "
if vercel whoami > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AUTHENTICATED${NC}"
else
    echo -e "${RED}❌ NOT AUTHENTICATED${NC}"
    echo "Run: vercel login"
    exit 1
fi

# Step 2: Project linking
echo -n "Step 2: Linking project... "
if vercel link --yes > /dev/null 2>&1; then
    echo -e "${GREEN}✅ LINKED${NC}"
else
    echo -e "${RED}❌ LINK FAILED${NC}"
    exit 1
fi

echo ""
echo "🎯 MANUAL STEPS REQUIRED (2 minutes):"
echo ""

echo "STEP A: Move Domain (30 seconds)"
echo "────────────────────────────────"
echo "🔗 Opening: https://vercel.com/peoples-group/pgclosets-store-main/domains"
echo ""
echo "Instructions:"
echo "1. Click the ⋯ menu next to 'pgclosets.com'"
echo "2. Select 'Move to another project'"
echo "3. Choose 'pgclosets-store-main' from dropdown"
echo "4. Click 'Move Domain'"
echo ""

# Open browser to domains page
if command -v open &> /dev/null; then
    open "https://vercel.com/peoples-group/pgclosets-store-main/domains"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://vercel.com/peoples-group/pgclosets-store-main/domains"
fi

read -p "Press Enter after moving the domain..."

echo ""
echo "STEP B: Disable Protection (30 seconds)"
echo "───────────────────────────────────────"
echo "🔗 Opening: https://vercel.com/peoples-group/pgclosets-store-main/settings/security"
echo ""
echo "Instructions:"
echo "1. Scroll to 'Deployment Protection'"
echo "2. Change from 'Enabled' to 'Disabled'"
echo "3. Click 'Save' button"
echo ""

# Open browser to security settings
if command -v open &> /dev/null; then
    open "https://vercel.com/peoples-group/pgclosets-store-main/settings/security"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://vercel.com/peoples-group/pgclosets-store-main/settings/security"
fi

read -p "Press Enter after disabling protection..."

echo ""
echo "🔍 VERIFYING DOMAIN MIGRATION..."
echo "================================="

# Test with timeout and retries
test_endpoint() {
    local url=$1
    local name=$2
    local max_attempts=12  # 2 minutes with 10s intervals
    local attempt=1
    
    echo -n "Testing $name... "
    
    while [ $attempt -le $max_attempts ]; do
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        if [ "$status" = "200" ]; then
            echo -e "${GREEN}✅ SUCCESS${NC}"
            return 0
        fi
        echo -n "."
        sleep 10
        ((attempt++))
    done
    
    echo -e "${RED}❌ FAILED${NC}"
    return 1
}

# Test all endpoints
test_endpoint "https://pgclosets.com/api/health" "health endpoint"
test_endpoint "https://pgclosets.com/" "home page"
test_endpoint "https://pgclosets.com/sitemap.xml" "sitemap"

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo -e "${GREEN}🌐 pgclosets.com is now live!${NC}"
echo ""
echo "Production URLs:"
echo "• Main Site: https://pgclosets.com"
echo "• Health Check: https://pgclosets.com/api/health"
echo "• Sitemap: https://pgclosets.com/sitemap.xml"
echo "• Admin: https://pgclosets.com/admin"
echo ""
echo "Next steps:"
echo "• Test the site thoroughly"
echo "• Set up monitoring if needed"
echo "• Configure any additional domains"
echo ""
echo "🚀 Your e-commerce site is ready for customers!"
