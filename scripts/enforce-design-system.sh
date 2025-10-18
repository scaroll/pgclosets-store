#!/bin/bash

# Design System Enforcement Script
# Prevents visual inconsistencies by validating code against design system rules

set -e

YELLOW='\033[1;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🎨 PG Closets Design System Validator"
echo "====================================="
echo ""

# 1. Check for raw hex colors in CSS/SCSS
echo -e "${YELLOW}Checking for raw hex colors in stylesheets...${NC}"
if grep -r --include="*.css" --include="*.scss" --exclude-dir={node_modules,.next,build} -E "#[0-9a-fA-F]{3,6}" . 2>/dev/null | grep -v "globals-unified.css" | grep -v "design-tokens"; then
  echo -e "${RED}❌ Found raw hex colors! Use design tokens instead.${NC}"
  echo "   Import from: @/components/ui-kit or use CSS variables from globals-unified.css"
  exit 1
else
  echo -e "${GREEN}✅ No raw hex colors found${NC}"
fi

# 2. Check for deprecated design system imports
echo -e "${YELLOW}Checking for deprecated design system imports...${NC}"
if grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --exclude-dir={node_modules,.next,build} "design-system.css\|variables.css" . 2>/dev/null; then
  echo -e "${RED}❌ Found deprecated design system imports!${NC}"
  echo "   Use: import '@/app/globals-unified.css' instead"
  exit 1
else
  echo -e "${GREEN}✅ No deprecated imports found${NC}"
fi

# 3. Check for inline styles in React components
echo -e "${YELLOW}Checking for inline styles in components...${NC}"
if grep -r --include="*.tsx" --include="*.jsx" --exclude-dir={node_modules,.next,build} 'style={{' . 2>/dev/null; then
  echo -e "${RED}❌ Found inline styles! Use UI kit components or Tailwind utilities.${NC}"
  echo "   Import from: @/components/ui-kit"
  exit 1
else
  echo -e "${GREEN}✅ No inline styles found${NC}"
fi

# 4. Check for legacy button classes
echo -e "${YELLOW}Checking for legacy button classes...${NC}"
if grep -r --include="*.tsx" --include="*.jsx" --exclude-dir={node_modules,.next,build} 'className=".*btn-primary.*"\|className=".*ds-btn.*"' . 2>/dev/null; then
  echo -e "${RED}❌ Found legacy button classes!${NC}"
  echo "   Use: <Button variant='primary'> from @/components/ui-kit"
  exit 1
else
  echo -e "${GREEN}✅ No legacy button classes found${NC}"
fi

# 5. Validate design tokens file exists
echo -e "${YELLOW}Validating design tokens...${NC}"
if [ ! -f "design-tokens/tokens.json" ]; then
  echo -e "${RED}❌ Design tokens file missing!${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Design tokens file exists${NC}"
fi

# 6. Check if globals-unified.css is being used
echo -e "${YELLOW}Checking globals-unified.css usage...${NC}"
if ! grep -r --include="*.tsx" --include="*.ts" --exclude-dir={node_modules,.next,build} "globals-unified.css" . 2>/dev/null >/dev/null; then
  echo -e "${RED}❌ globals-unified.css not imported anywhere!${NC}"
  echo "   Import it in your root layout or _app file"
  exit 1
else
  echo -e "${GREEN}✅ globals-unified.css is imported${NC}"
fi

echo ""
echo -e "${GREEN}✅ All design system checks passed!${NC}"
echo ""
echo "Design System Resources:"
echo "  • Tokens: /design-tokens/tokens.json"
echo "  • UI Kit: @/components/ui-kit"
echo "  • Styles: @/app/globals-unified.css"
echo "  • Docs: /docs/visual-system.md"
