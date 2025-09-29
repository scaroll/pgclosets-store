#!/bin/bash

# PG Closets Store - Consistent Vercel Deployment Script
# This ensures Claude Code always deploys to the same project

echo "🚀 Deploying PG Closets Store to Vercel..."
echo "Project ID: prj_ySW3kS1J66EbmuWRC6q6QN3gww6w"
echo "Team: Peoples Group"

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if .vercel/project.json exists
if [ ! -f ".vercel/project.json" ]; then
    echo "❌ Error: .vercel/project.json not found!"
    echo "Run 'vercel link' to connect to the existing project"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Build the project
echo "🏗️  Building project..."
npm run build

# Deploy to Vercel (will use the linked project)
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Visit: https://pgclosets-store.vercel.app"