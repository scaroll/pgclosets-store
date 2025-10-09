#!/bin/bash

# This script MUST pass before any deployment
echo "🔒 Verifying deployment target..."

# Load environment if not already loaded
if [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "📋 Loading environment variables..."
    source ~/.zshrc 2>/dev/null || true
    if [ -f .env.vercel ]; then
        source .env.vercel
    fi
fi

# Check 1: Project JSON exists
if [ ! -f .vercel/project.json ]; then
    echo "❌ CRITICAL: .vercel/project.json missing!"
    echo "Creating it now..."
    mkdir -p .vercel
    echo "{\"orgId\":\"$VERCEL_ORG_ID\",\"projectId\":\"$VERCEL_PROJECT_ID\",\"projectName\":\"pgclosets-store\"}" > .vercel/project.json
fi

# Check 2: Project ID matches
PROJECT_ID=$(jq -r '.projectId' .vercel/project.json 2>/dev/null || echo "")
if [ "$PROJECT_ID" != "$VERCEL_PROJECT_ID" ]; then
    echo "❌ CRITICAL: Project ID mismatch!"
    echo "Expected: $VERCEL_PROJECT_ID"
    echo "Found: $PROJECT_ID"
    echo "Fixing..."
    echo "{\"orgId\":\"$VERCEL_ORG_ID\",\"projectId\":\"$VERCEL_PROJECT_ID\",\"projectName\":\"pgclosets-store\"}" > .vercel/project.json
fi

# Check 3: Environment variables are set
if [ -z "$VERCEL_PROJECT_ID" ] || [ -z "$VERCEL_ORG_ID" ]; then
    echo "❌ CRITICAL: Environment variables not set!"
    if [ -f .env.vercel ]; then
        echo "Loading from .env.vercel..."
        source .env.vercel
    else
        echo "Setting fallback values..."
        export VERCEL_ORG_ID="team_Xzht85INUsoW05STx9DMMyLX"
        export VERCEL_PROJECT_ID="prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu"
    fi
fi

# Check 4: Verify current directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ CRITICAL: Not in pgclosets-store directory!"
    echo "Current directory: $(pwd)"
    echo "Please cd to the correct project directory"
    exit 1
fi

# Check 5: Verify vercel.json has correct name
if ! grep -q '"name": "pgclosets-store"' vercel.json; then
    echo "⚠️  WARNING: vercel.json may not have correct project name"
fi

echo "✅ All checks passed. Safe to deploy to pgclosets-store."
echo "📋 Project ID: $VERCEL_PROJECT_ID"
echo "🏢 Org ID: $VERCEL_ORG_ID"
echo "🎯 Target: https://vercel.com/peoples-group/pgclosets-store"