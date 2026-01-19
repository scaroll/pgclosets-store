#!/bin/bash

# Comprehensive error fixing script for pgclosets-store-main
# This script fixes all TypeScript, ESLint, and common issues

set -e

echo "🚀 Starting comprehensive error fixes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Fix all import type statements
echo -e "${YELLOW}📦 Fixing type-only imports...${NC}"
find app lib components -name "*.ts" -o -name "*.tsx" | while read file; do
  # Fix NextRequest, NextResponse imports
  sed -i '' 's/import { NextRequest, NextResponse }/import type { NextRequest }\nimport { NextResponse }/g' "$file" 2>/dev/null || true
  sed -i '' 's/import { NextRequest }/import type { NextRequest }/g' "$file" 2>/dev/null || true
  sed -i '' 's/import { Metadata }/import type { Metadata }/g' "$file" 2>/dev/null || true
done

# 2. Fix optional chaining for split operations
echo -e "${YELLOW}🔗 Fixing optional chaining...${NC}"
find app -name "*.ts" -o -name "*.tsx" | while read file; do
  # Fix split()[0].trim() → split()[0]?.trim()
  sed -i '' 's/\.split(",)\[0\]\.trim()/\.split(",")[0]?.trim()/g' "$file" 2>/dev/null || true
  # Add || "unknown" to userAgent
  sed -i '' 's/request\.headers\.get("user-agent")/request.headers.get("user-agent") || "unknown"/g' "$file" 2>/dev/null || true
done

# 3. Remove unused variables
echo -e "${YELLOW}🗑️  Removing unused variables...${NC}"
# This would require AST manipulation - skip for now

# 4. Fix async functions without await
echo -e "${YELLOW}⏳ Fixing async/await patterns...${NC}"
# This requires manual intervention per function

# 5. Fix console statements
echo -e "${YELLOW}🔇 Fixing console statements...${NC}"
find app -name "*.ts" -o -name "*.tsx" | while read file; do
  # Replace console.log with proper logging or remove
  sed -i '' 's/console\.log(/\/\/ console.log(/g' "$file" 2>/dev/null || true
  # Keep console.error and console.warn for now
done

# 6. Run type check
echo -e "${YELLOW}✅ Running type check...${NC}"
npm run type-check 2>&1 | tee /tmp/typecheck-errors.txt || true

# 7. Run lint check
echo -e "${YELLOW}🔍 Running lint check...${NC}"
npm run lint 2>&1 | tee /tmp/lint-errors.txt || true

# 8. Summary
echo -e "${GREEN}✨ Fix script completed!${NC}"
echo -e "${YELLOW}Check /tmp/typecheck-errors.txt and /tmp/lint-errors.txt for remaining issues${NC}"

# Count remaining errors
TYPECHECK_ERRORS=$(grep "error TS" /tmp/typecheck-errors.txt | wc -l | xargs)
LINT_ERRORS=$(grep "Error:" /tmp/lint-errors.txt | wc -l | xargs)

echo -e "${YELLOW}📊 Remaining errors:${NC}"
echo -e "  TypeScript: ${RED}${TYPECHECK_ERRORS}${NC}"
echo -e "  ESLint: ${RED}${LINT_ERRORS}${NC}"
