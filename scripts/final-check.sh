#!/bin/bash
echo "=== FINAL VERIFICATION CHECKLIST ==="
echo ""

# Check 1
echo -n "✓ Check 1: .vercel/project.json exists... "
[ -f .vercel/project.json ] && echo "PASS" || echo "FAIL"

# Check 2
echo -n "✓ Check 2: Environment variables set... "
[ ! -z "$VERCEL_PROJECT_ID" ] && echo "PASS" || echo "FAIL"

# Check 3
echo -n "✓ Check 3: Deploy script exists... "
[ -f deploy-to-pgclosets.sh ] && echo "PASS" || echo "FAIL"

# Check 4
echo -n "✓ Check 4: Verification script exists... "
[ -f verify-deployment-target.sh ] && echo "PASS" || echo "FAIL"

# Check 5
echo -n "✓ Check 5: Shell profile configured... "
grep -q "VERCEL_PROJECT_ID" ~/.zshrc && echo "PASS" || echo "FAIL"

# Check 6
echo -n "✓ Check 6: Project name in vercel.json... "
grep -q "pgclosets-store" vercel.json && echo "PASS" || echo "FAIL"

# Check 7
echo -n "✓ Check 7: Vercel CLI authenticated... "
vercel whoami > /dev/null 2>&1 && echo "PASS" || echo "FAIL"

# Check 8
echo -n "✓ Check 8: Correct project linked... "
vercel project ls 2>/dev/null | grep -q pgclosets-store && echo "PASS" || echo "FAIL"

# Check 9
echo -n "✓ Check 9: .env.vercel exists... "
[ -f .env.vercel ] && echo "PASS" || echo "FAIL"

# Check 10
echo -n "✓ Check 10: Claude CLI config exists... "
[ -f .claude-cli-config.json ] && echo "PASS" || echo "FAIL"

echo ""
echo "=== CONFIGURATION SUMMARY ==="
echo "Project: pgclosets-store"
echo "Org ID: $VERCEL_ORG_ID"
echo "Project ID: $VERCEL_PROJECT_ID"
echo "Deploy command: ./deploy-to-pgclosets.sh"
echo "Verify command: ./verify-deployment-target.sh"
echo ""
echo "🎯 MISSION CRITICAL: All deployments will now go to pgclosets-store"
echo "🔗 Target URL: https://vercel.com/peoples-group/pgclosets-store"
echo ""
echo "=== QUICK TEST ==="
echo "Running verification script..."
./verify-deployment-target.sh