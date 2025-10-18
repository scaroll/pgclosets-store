#!/bin/bash

# Advanced Search System - Installation Verification Script
# Verifies all components and dependencies are correctly installed

echo "🔍 Verifying Advanced Search System Installation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track errors
errors=0

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((errors++))
    fi
}

echo "📦 Checking Core Components..."
check_file "components/search/InstantSearch.tsx"
check_file "components/search/AdvancedFilters.tsx"
check_file "components/search/SortOptions.tsx"
check_file "components/search/SearchResults.tsx"
check_file "components/search/SearchPage.tsx"
check_file "components/search/index.ts"
echo ""

echo "📚 Checking Documentation..."
check_file "components/search/README.md"
check_file "components/search/IMPLEMENTATION.md"
check_file "components/search/QUICK_START.md"
check_file "components/search/SUMMARY.md"
check_file "components/search/ARCHITECTURE.md"
echo ""

echo "🔧 Checking Dependencies..."
check_file "lib/hooks/use-debounce.ts"
echo ""

echo "🎯 Checking Demo Pages..."
check_file "app/products/search/page.tsx"
echo ""

echo "🎨 Checking UI Components (shadcn/ui)..."
check_file "components/ui/button.tsx"
check_file "components/ui/input.tsx"
check_file "components/ui/checkbox.tsx"
check_file "components/ui/slider.tsx"
check_file "components/ui/badge.tsx"
check_file "components/ui/sheet.tsx"
check_file "components/ui/accordion.tsx"
check_file "components/ui/dropdown-menu.tsx"
check_file "components/ui/toggle-group.tsx"
echo ""

echo "📋 Checking Types..."
if grep -q "export.*Product" "types/commerce.ts" 2>/dev/null || grep -q "export.*Product" "lib/types/commerce.ts" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Product type definition found"
else
    echo -e "${YELLOW}⚠${NC} Product type - verify types/commerce.ts or lib/types/commerce.ts exists"
fi
echo ""

echo "🔍 Checking Package Dependencies..."
if grep -q "lucide-react" package.json; then
    echo -e "${GREEN}✓${NC} lucide-react (icons)"
else
    echo -e "${RED}✗${NC} lucide-react - MISSING (run: npm install lucide-react)"
    ((errors++))
fi

if grep -q "class-variance-authority" package.json; then
    echo -e "${GREEN}✓${NC} class-variance-authority"
else
    echo -e "${RED}✗${NC} class-variance-authority - MISSING"
    ((errors++))
fi

if grep -q "tailwind-merge" package.json; then
    echo -e "${GREEN}✓${NC} tailwind-merge"
else
    echo -e "${RED}✗${NC} tailwind-merge - MISSING"
    ((errors++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ Installation Complete!${NC}"
    echo ""
    echo "All components and dependencies verified successfully."
    echo ""
    echo "Next Steps:"
    echo "1. Import components: import { SearchPage } from '@/components/search'"
    echo "2. Use in your app: <SearchPage products={products} />"
    echo "3. Check QUICK_START.md for examples"
    echo "4. Visit /products/search to see the demo"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Installation Issues Found${NC}"
    echo ""
    echo "Found $errors error(s). Please resolve the issues above."
    echo ""
    echo "Common fixes:"
    echo "- Run: npm install lucide-react"
    echo "- Check component files exist in components/search/"
    echo "- Verify shadcn/ui components are installed"
    echo ""
    exit 1
fi
