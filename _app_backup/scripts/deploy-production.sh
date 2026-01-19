#!/bin/bash

# PG Closets Store - Production Deployment Script
# This script handles deployment to production with comprehensive checks

set -e  # Exit on any error

echo "🚀 Starting PG Closets Store Production Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="pgclosets-store"
PRODUCTION_URL="https://www.pgclosets.com"
BRANCH="master"
STAGING_URL="https://pgclosets-staging.vercel.app"

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

print_critical() {
    echo -e "${PURPLE}[CRITICAL]${NC} $1"
}

# Critical production deployment confirmation
print_critical "🔥 PRODUCTION DEPLOYMENT WARNING 🔥"
echo ""
echo "You are about to deploy to PRODUCTION environment."
echo "This will affect the live website at: $PRODUCTION_URL"
echo ""
echo "⚠️  Please confirm you have:"
echo "   ✅ Tested thoroughly on staging"
echo "   ✅ Verified all features work correctly"
echo "   ✅ Checked all environment variables"
echo "   ✅ Reviewed all changes"
echo "   ✅ Obtained necessary approvals"
echo ""
read -p "Are you absolutely sure you want to deploy to production? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    print_error "Production deployment cancelled. Please type 'yes' to confirm."
fi

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

# Check if we're on the master branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "$BRANCH" ]; then
    print_error "Production deployments must be from $BRANCH branch. Current branch: $current_branch"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_error "You have uncommitted changes. Please commit or stash them before deploying to production."
fi

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production not found. Production deployment requires proper environment configuration."
fi

# Comprehensive pre-deployment checks
print_status "Running comprehensive pre-deployment checks..."

# Check if staging is healthy
print_status "Verifying staging environment health..."
if curl -f -s "$STAGING_URL/health" > /dev/null; then
    print_success "Staging environment is healthy"
else
    print_warning "Staging environment health check failed"
    read -p "Continue with production deployment? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled due to staging health check failure."
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run comprehensive tests
print_status "Running comprehensive test suite..."

# Linting
if npm run lint; then
    print_success "✅ Linting passed"
else
    print_error "❌ Linting failed - fix errors before production deployment"
fi

# Type checking
if npm run type-check 2>/dev/null; then
    print_success "✅ Type checking passed"
else
    print_error "❌ Type checking failed - fix errors before production deployment"
fi

# Tests
if npm run test 2>/dev/null; then
    print_success "✅ Tests passed"
else
    print_error "❌ Tests failed - fix errors before production deployment"
fi

# Security audit
print_status "Running security audit..."
if npm audit --audit-level moderate; then
    print_success "✅ Security audit passed"
else
    print_warning "⚠️  Security vulnerabilities found"
    read -p "Continue with deployment? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled due to security audit failures."
    fi
fi

# Build the project
print_status "Building production build..."
export NODE_ENV=production
export NEXT_PUBLIC_APP_ENV=production

if npm run build; then
    print_success "✅ Production build completed successfully"
else
    print_error "❌ Production build failed"
fi

# Final confirmation
print_critical "🚨 FINAL PRODUCTION DEPLOYMENT CONFIRMATION 🚨"
echo ""
echo "All checks have passed. Ready for production deployment."
echo ""
echo "📊 Deployment Summary:"
echo "   Target: $PRODUCTION_URL"
echo "   Branch: $BRANCH"
echo "   Environment: production"
echo "   Time: $(date)"
echo ""
read -p "Final confirmation - Deploy to production now? (DEPLOY/cancel): " final_confirmation

if [ "$final_confirmation" != "DEPLOY" ]; then
    print_error "Production deployment cancelled. Please type 'DEPLOY' to confirm."
fi

# Create deployment tag
print_status "Creating deployment tag..."
timestamp=$(date +"%Y%m%d-%H%M%S")
tag_name="production-deploy-$timestamp"
git tag -a "$tag_name" -m "Production deployment $timestamp"

# Deploy to Vercel
print_status "🚀 Deploying to production environment..."

# Deploy using Vercel with production settings
if vercel --env .env.production --prod --yes; then
    print_success "🎉 Production deployment completed!"
    print_success "Production URL: $PRODUCTION_URL"
    
    # Push tags to remote
    git push origin --tags
else
    print_error "❌ Production deployment failed"
fi

# Post-deployment verification
print_status "Running post-deployment verification..."

# Wait for deployment to be fully live
print_status "Waiting for deployment to be fully live..."
sleep 30

# Comprehensive health checks
print_status "Running comprehensive health checks..."

checks_passed=0
total_checks=5

# 1. Basic connectivity
if curl -f -s "$PRODUCTION_URL" > /dev/null; then
    print_success "✅ Site is responding"
    ((checks_passed++))
else
    print_error "❌ Site is not responding"
fi

# 2. Health endpoint
if curl -f -s "$PRODUCTION_URL/health" > /dev/null; then
    print_success "✅ Health endpoint responding"
    ((checks_passed++))
else
    print_error "❌ Health endpoint not responding"
fi

# 3. API status
if curl -f -s "$PRODUCTION_URL/api/status" > /dev/null; then
    print_success "✅ API status endpoint responding"
    ((checks_passed++))
else
    print_error "❌ API status endpoint not responding"
fi

# 4. Database connectivity
status_response=$(curl -s "$PRODUCTION_URL/api/status")
if echo "$status_response" | grep -q '"database":{"status":"operational"'; then
    print_success "✅ Database connectivity verified"
    ((checks_passed++))
else
    print_warning "⚠️  Database connectivity check inconclusive"
fi

# 5. Core page loads
if curl -f -s "$PRODUCTION_URL/products" > /dev/null; then
    print_success "✅ Products page loading"
    ((checks_passed++))
else
    print_warning "⚠️  Products page not loading correctly"
fi

# Summary
echo ""
print_status "📊 Post-Deployment Health Summary:"
echo "   Checks passed: $checks_passed/$total_checks"
echo ""

if [ "$checks_passed" -eq "$total_checks" ]; then
    print_success "🎉 All health checks passed! Production deployment successful!"
elif [ "$checks_passed" -ge 3 ]; then
    print_warning "⚠️  Most health checks passed, but some issues detected. Monitor closely."
else
    print_error "❌ Multiple health checks failed. Consider immediate rollback!"
fi

# Final success message and next steps
echo ""
print_success "🚀 PRODUCTION DEPLOYMENT COMPLETE 🚀"
echo ""
echo "📈 Production Environment:"
echo "   URL: $PRODUCTION_URL"
echo "   Deployment Tag: $tag_name"
echo "   Time: $(date)"
echo ""
echo "📋 Recommended Next Steps:"
echo "   1. Monitor error rates and performance metrics"
echo "   2. Verify key user journeys work correctly"
echo "   3. Check payment processing (if applicable)"
echo "   4. Monitor customer support channels"
echo "   5. Update team/stakeholders on successful deployment"
echo ""
echo "🛠️  Useful Commands:"
echo "   vercel logs --app $PROJECT_NAME        # View production logs"
echo "   vercel rollback --app $PROJECT_NAME    # Rollback if critical issues"
echo ""
echo "🆘 Emergency Rollback:"
echo "   If critical issues are discovered, run:"
echo "   ./scripts/emergency-rollback.sh"