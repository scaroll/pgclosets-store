#!/bin/bash

echo "🔧 AUTOMATED DOMAIN SETUP FOR PG Closets"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command success
check_command() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 successful${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

echo ""
echo "Step 1: Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
check_command "Vercel authentication"

echo ""
echo "Step 2: Linking project..."
vercel link --yes > /dev/null 2>&1
check_command "Project linking"

echo ""
echo "Step 3: Checking current domain assignment..."
DOMAIN_INFO=$(vercel domains inspect pgclosets.com 2>/dev/null | grep -A 10 "Projects")
if echo "$DOMAIN_INFO" | grep -q "pgclosets-store-main"; then
    echo -e "${GREEN}✅ Domain already assigned to correct project${NC}"
else
    echo -e "${YELLOW}⚠️  Domain needs to be moved manually${NC}"
    echo ""
    echo "MANUAL STEP REQUIRED:"
    echo "1. Go to: https://vercel.com/peoples-group/pgclosets-store-main/domains"
    echo "2. Move pgclosets.com from 'output' project to 'pgclosets-store-main'"
    echo ""
    read -p "Press Enter after completing the manual domain move..."
fi

echo ""
echo "Step 4: Checking deployment protection..."
# This would require API access, so we'll provide instructions
echo -e "${YELLOW}⚠️  Deployment protection needs to be disabled manually${NC}"
echo ""
echo "MANUAL STEP REQUIRED:"
echo "1. Go to: https://vercel.com/peoples-group/pgclosets-store-main/settings/security"
echo "2. Set 'Deployment Protection' to 'Disabled'"
echo "3. Click 'Save'"
echo ""
read -p "Press Enter after disabling deployment protection..."

echo ""
echo "Step 5: Verifying domain migration..."
echo "Testing endpoints (this may take a few minutes for DNS propagation)..."

# Test health endpoint
echo -n "Testing health endpoint... "
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/api/health 2>/dev/null)
if [ "$HEALTH_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HEALTH_STATUS)${NC}"
else
    echo -e "${RED}❌ FAILED (HTTP $HEALTH_STATUS)${NC}"
fi

# Test home page
echo -n "Testing home page... "
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/ 2>/dev/null)
if [ "$HOME_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HOME_STATUS)${NC}"
else
    echo -e "${RED}❌ FAILED (HTTP $HOME_STATUS)${NC}"
fi

# Test sitemap
echo -n "Testing sitemap... "
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pgclosets.com/sitemap.xml 2>/dev/null)
if [ "$SITEMAP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $SITEMAP_STATUS)${NC}"
else
    echo -e "${RED}❌ FAILED (HTTP $SITEMAP_STATUS)${NC}"
fi

echo ""
if [ "$HEALTH_STATUS" = "200" ] && [ "$HOME_STATUS" = "200" ] && [ "$SITEMAP_STATUS" = "200" ]; then
    echo -e "${GREEN}🎉 DOMAIN MIGRATION COMPLETE!${NC}"
    echo -e "${GREEN}🌐 pgclosets.com is now live with your production site!${NC}"
    echo ""
    echo "Production URLs:"
    echo "• Site: https://pgclosets.com"
    echo "• Health: https://pgclosets.com/api/health"
    echo "• Sitemap: https://pgclosets.com/sitemap.xml"
else
    echo -e "${YELLOW}⚠️  Domain migration may still be propagating...${NC}"
    echo "DNS changes can take 5-30 minutes. Run this script again in a few minutes."
fi

echo ""
echo "Setup complete! 🚀"
