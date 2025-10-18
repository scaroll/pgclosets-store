#!/bin/bash

# PG Closets Integration Verification Script
# Verifies all components are properly integrated and deployment-ready

set -e

echo "🔍 PG Closets Integration Verification"
echo "======================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# 1. Project Structure Verification
echo "1. Verifying Project Structure..."
echo "   -------------------------------"

if [ -f "package.json" ]; then
    pass "package.json exists"
else
    fail "package.json not found"
fi

if [ -f "next.config.mjs" ]; then
    pass "next.config.mjs exists"
else
    fail "next.config.mjs not found"
fi

if [ -d "app" ]; then
    pass "app directory exists"
else
    fail "app directory not found"
fi

if [ -d "components" ]; then
    pass "components directory exists"
else
    fail "components directory not found"
fi

if [ -d "lib" ]; then
    pass "lib directory exists"
else
    fail "lib directory not found"
fi

echo ""

# 2. Critical Component Verification
echo "2. Verifying Critical Components..."
echo "   ---------------------------------"

# Check key components
COMPONENTS=(
    "components/ui/sheet.tsx"
    "components/search/AdvancedFilters.tsx"
    "components/cart/CartDrawer.tsx"
    "components/PgFooter.tsx"
    "components/navigation/Header.tsx"
    "components/mobile/MobileNavigation.tsx"
)

for comp in "${COMPONENTS[@]}"; do
    if [ -f "$comp" ]; then
        pass "$(basename "$comp") found"
    else
        fail "$(basename "$comp") not found"
    fi
done

echo ""

# 3. Key Pages Verification
echo "3. Verifying Key Pages..."
echo "   ----------------------"

PAGES=(
    "app/page.tsx"
    "app/layout.tsx"
    "app/products/page.tsx"
    "app/products/[slug]/page.tsx"
    "app/cart/page.tsx"
    "app/contact/page.tsx"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        pass "$(basename "$page") found"
    else
        fail "$(basename "$page") not found"
    fi
done

echo ""

# 4. Build Artifacts Verification
echo "4. Verifying Build Artifacts..."
echo "   ----------------------------"

if [ -d ".next" ]; then
    pass ".next build directory exists"

    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        pass "Build ID: $BUILD_ID"
    else
        warn "BUILD_ID not found - run 'npm run build'"
    fi

    if [ -d ".next/static" ]; then
        pass "Static assets compiled"
    else
        fail "Static assets not found"
    fi
else
    warn ".next directory not found - run 'npm run build'"
fi

echo ""

# 5. Dependencies Check
echo "5. Checking Dependencies..."
echo "   ------------------------"

if [ -d "node_modules" ]; then
    pass "node_modules exists"

    # Check critical dependencies
    DEPS=("next" "react" "react-dom" "typescript")
    for dep in "${DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            pass "$dep installed"
        else
            fail "$dep not installed"
        fi
    done
else
    warn "node_modules not found - run 'npm install'"
fi

echo ""

# 6. Configuration Files
echo "6. Verifying Configuration Files..."
echo "   ---------------------------------"

CONFIGS=(
    "tsconfig.json"
    "tailwind.config.ts"
    ".env.local.example"
)

for config in "${CONFIGS[@]}"; do
    if [ -f "$config" ]; then
        pass "$(basename "$config") exists"
    else
        if [ "$config" == ".env.local.example" ]; then
            warn "$(basename "$config") not found - optional"
        else
            fail "$(basename "$config") not found"
        fi
    fi
done

echo ""

# 7. SheetTrigger Fix Verification
echo "7. Verifying Component Fixes..."
echo "   ----------------------------"

if grep -q "SheetTrigger" "components/ui/sheet.tsx"; then
    pass "SheetTrigger component implemented"
else
    fail "SheetTrigger component missing"
fi

if grep -q "export function SheetTrigger" "components/ui/sheet.tsx"; then
    pass "SheetTrigger exported correctly"
else
    fail "SheetTrigger not exported"
fi

echo ""

# 8. Build System Check
echo "8. Testing Build System..."
echo "   -----------------------"

if command -v npm &> /dev/null; then
    pass "npm is available"

    # Check npm scripts
    if grep -q '"build"' package.json; then
        pass "Build script configured"
    else
        fail "Build script not configured"
    fi

    if grep -q '"dev"' package.json; then
        pass "Dev script configured"
    else
        fail "Dev script not configured"
    fi
else
    fail "npm not found"
fi

echo ""

# 9. Git Status
echo "9. Checking Git Status..."
echo "   ----------------------"

if command -v git &> /dev/null; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        pass "Git repository initialized"

        # Check for uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            warn "Uncommitted changes detected"
            echo "   Modified files:"
            git status --short | head -10
        else
            pass "No uncommitted changes"
        fi
    else
        warn "Not a git repository"
    fi
else
    warn "Git not available"
fi

echo ""

# 10. Deployment Readiness
echo "10. Deployment Readiness Check..."
echo "    -----------------------------"

# Check for Vercel configuration
if [ -f ".vercel/project.json" ] || [ -d "templates/prod/.vercel" ]; then
    pass "Vercel configuration available"
else
    warn "Vercel configuration not found"
fi

# Check for production environment variables
if [ -f ".env.production" ]; then
    pass ".env.production exists"
else
    warn ".env.production not found - ensure env vars configured in Vercel"
fi

# Check for deployment scripts
if [ -f "deploy-pgclosets.sh" ]; then
    pass "Deployment script available"

    if [ -x "deploy-pgclosets.sh" ]; then
        pass "Deployment script is executable"
    else
        warn "Deployment script not executable - run 'chmod +x deploy-pgclosets.sh'"
    fi
else
    warn "Deployment script not found"
fi

echo ""
echo "======================================="
echo "Integration Verification Summary"
echo "======================================="
echo ""
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC}   $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Integration verification successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review warnings (if any)"
    echo "  2. Run 'npm run build' to verify production build"
    echo "  3. Run './deploy-pgclosets.sh' to deploy to production"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Integration verification failed${NC}"
    echo ""
    echo "Please fix the failed checks before deploying."
    echo ""
    exit 1
fi
