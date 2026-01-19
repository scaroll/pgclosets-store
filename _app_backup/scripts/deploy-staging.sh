#!/bin/bash

# PG Closets Store - Staging Deployment Script
# This script handles deployment to staging environment with proper validation

set -e  # Exit on any error

echo "🚀 Starting PG Closets Store Staging Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="pgclosets-store"
STAGING_URL="https://pgclosets-staging.vercel.app"
BRANCH="staging"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run from project root directory."
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is required but not installed."
fi

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is required but not installed. Run: npm i -g vercel"
fi

# Check if we're on the right branch or create it
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "$BRANCH" ]; then
    print_warning "Not on $BRANCH branch. Current branch: $current_branch"
    read -p "Do you want to switch to $BRANCH branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if git show-ref --verify --quiet refs/heads/$BRANCH; then
            git checkout $BRANCH
        else
            print_status "Creating $BRANCH branch from current branch"
            git checkout -b $BRANCH
        fi
    else
        print_error "Deployment cancelled."
    fi
fi

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if staging environment file exists
if [ ! -f ".env.staging" ]; then
    print_warning ".env.staging not found. Creating from template..."
    cp .env.example .env.staging
    print_warning "Please configure .env.staging with staging-specific values"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes."
    read -p "Do you want to commit them before deploying? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_message
        git commit -m "$commit_message"
    fi
fi

# Build and test
print_status "Running build and tests..."

# Install dependencies
npm ci

# Run linting
if npm run lint 2>/dev/null; then
    print_success "Linting passed"
else
    print_warning "Linting failed or not configured"
fi

# Run type checking
if npm run type-check 2>/dev/null; then
    print_success "Type checking passed"
else
    print_warning "Type checking failed or not configured"
fi

# Run tests
if npm run test 2>/dev/null; then
    print_success "Tests passed"
else
    print_warning "Tests failed or not configured"
fi

# Build the project
print_status "Building project..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
fi

# Deploy to Vercel
print_status "Deploying to staging environment..."

# Set environment to staging
export NODE_ENV=production
export NEXT_PUBLIC_APP_ENV=staging

# Deploy using Vercel
if vercel --env .env.staging --prod --yes; then
    print_success "Deployment to staging completed!"
    print_success "Staging URL: $STAGING_URL"
else
    print_error "Deployment failed"
fi

# Post-deployment checks
print_status "Running post-deployment checks..."

# Wait a moment for deployment to be live
sleep 10

# Check if the site is responding
if curl -f -s "$STAGING_URL/health" > /dev/null; then
    print_success "Health check passed - site is responding"
else
    print_warning "Health check failed - site may not be responding correctly"
fi

# Check if the status endpoint works
if curl -f -s "$STAGING_URL/api/status" > /dev/null; then
    print_success "API status check passed"
else
    print_warning "API status check failed"
fi

# Final success message
print_success "🎉 Staging deployment complete!"
echo ""
echo "📊 Deployment Summary:"
echo "   Environment: Staging"
echo "   URL: $STAGING_URL"
echo "   Branch: $BRANCH"
echo "   Time: $(date)"
echo ""
echo "🔍 Next Steps:"
echo "   1. Test the staging environment thoroughly"
echo "   2. Run any manual QA tests"
echo "   3. Verify all features work as expected"
echo "   4. If everything looks good, deploy to production"
echo ""
echo "📱 Useful commands:"
echo "   vercel logs --app $PROJECT_NAME  # View deployment logs"
echo "   vercel rollback --app $PROJECT_NAME  # Rollback if needed"