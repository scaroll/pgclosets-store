#!/bin/bash
set -e

echo "🔒 VERCEL PROJECT LOCK VERIFICATION"
echo "======================================"

# Load lock file to verify correct project
if [ -f .vercel-lock ]; then
    source .vercel-lock
    echo "✅ Project lock file found"
    echo "🎯 Locked to: $PROJECT_NAME"
    echo "📋 Project ID: $PROJECT_ID"
else
    echo "❌ CRITICAL: .vercel-lock file missing!"
    exit 1
fi

# MISSION CRITICAL: These IDs must match your pgclosets-store project
export VERCEL_ORG_ID="team_Xzht85INUsoW05STx9DMMyLX"
export VERCEL_PROJECT_ID="prj_ySW3kS1J66EbmuWRC6q6QN3gww6w"

# Verify we're targeting the correct project
if [ "$VERCEL_PROJECT_ID" != "$PROJECT_ID" ]; then
    echo "❌ CRITICAL: Project ID mismatch!"
    echo "Expected: $PROJECT_ID"
    echo "Found: $VERCEL_PROJECT_ID"
    exit 1
fi

echo "✅ Project verification passed"

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Verify project.json exists and has correct IDs
if [ ! -f .vercel/project.json ]; then
    echo "Creating .vercel/project.json..."
    mkdir -p .vercel
    echo "{\"orgId\":\"$VERCEL_ORG_ID\",\"projectId\":\"$VERCEL_PROJECT_ID\",\"projectName\":\"pgclosets-store\"}" > .vercel/project.json
fi

# Double-check we're deploying to the right project
echo "🚀 Deploying to project: pgclosets-store"
echo "📋 Project ID: $VERCEL_PROJECT_ID"
echo "🏢 Org ID: $VERCEL_ORG_ID"

# Check if we have a token
if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  No VERCEL_TOKEN found. Using authenticated Vercel CLI..."
    # Deploy with maximum specificity but no token
    vercel deploy \
      --yes \
      --scope "peoples-group" \
      --prod \
      --cwd $(pwd)
else
    echo "🔑 Using VERCEL_TOKEN for deployment..."
    # Deploy with token
    vercel deploy \
      --yes \
      --token=$VERCEL_TOKEN \
      --scope "peoples-group" \
      --prod \
      --cwd $(pwd)
fi

# Verify deployment went to correct project
echo "✅ Verifying deployment went to pgclosets-store..."
if [ -z "$VERCEL_TOKEN" ]; then
    vercel ls | head -5
else
    vercel ls --token=$VERCEL_TOKEN | head -5
fi

echo "🎯 SUCCESS: Deployment completed for pgclosets-store"
echo "🔗 Check: https://vercel.com/peoples-group/pgclosets-store"