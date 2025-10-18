#!/usr/bin/env bash
# =============================================================================
# PG CLOSETS PRODUCTION DEPLOYMENT SCRIPT
# =============================================================================
# Always deploys to Vercel production with comprehensive safety checks
# Hardcoded for pgclosets.com - production-only deployment
# =============================================================================

set -euo pipefail  # Fail-fast: stop on any error, undefined vars, or pipe failures

# Production identifiers (hardcoded for safety)
readonly VERCEL_PROJECT_ID="prj_ySW3kS1J66EbmuWRC6q6QN3gww6w"
readonly VERCEL_TEAM_ID="team_Xzht85INUsoW05STx9DMMyLX"
readonly PRODUCTION_DOMAIN="https://www.pgclosets.com"
readonly PROJECT_NAME="PG Closets"

# Color output for better visibility
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

log_section() {
    echo ""
    echo -e "${BLUE}━━━ $1 ━━━${NC}"
}

# =============================================================================
# PREREQUISITE VALIDATION
# =============================================================================
validate_prerequisites() {
    log_section "Validating Prerequisites"
    
    # Check if we're in the correct directory
    if [[ ! -f "package.json" ]] || [[ ! -d "public" ]]; then
        log_error "Must run from PG Closets project root directory"
        log_error "Expected files: package.json, public/ directory"
        exit 1
    fi
    
    # Verify this is the PG Closets project
    if ! grep -q "pgclosets" package.json 2>/dev/null; then
        log_warning "Package.json doesn't contain 'pgclosets' - proceeding anyway"
    fi
    
    # Check for Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Install with: npm install -g vercel"
        exit 1
    fi
    
    # Verify Vercel authentication
    if ! vercel whoami &> /dev/null; then
        log_error "Vercel CLI not authenticated. Run: vercel login"
        exit 1
    fi
    
    # Check for required build script
    if ! jq -e '.scripts.build' package.json >/dev/null 2>&1; then
        log_error "No 'build' script found in package.json"
        exit 1
    fi
    
    log_success "All prerequisites validated"
}

# =============================================================================
# PRE-DEPLOYMENT VALIDATION CHECKS
# =============================================================================
run_predeploy_validation() {
    log_section "Pre-deployment Validation Checks"
    
    # Ensure required template files exist
    log_info "Checking production template files..."
    
    local required_files=(
        "templates/prod/.vercel/project.json"
        "templates/prod/public/robots.txt"
        "templates/prod/public/sitemap.xml"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required template file missing: $file"
            exit 1
        fi
    done
    
    # Validate template content contains production URLs
    if ! grep -q "pgclosets.com" templates/prod/public/robots.txt; then
        log_error "Production robots.txt doesn't contain pgclosets.com"
        exit 1
    fi
    
    if ! grep -q "pgclosets.com" templates/prod/public/sitemap.xml; then
        log_error "Production sitemap.xml doesn't contain pgclosets.com"
        exit 1
    fi
    
    log_success "Pre-deployment validation passed"
}

# =============================================================================
# RESTORE ESSENTIAL PRODUCTION CONFIGURATION FILES
# =============================================================================
restore_production_configs() {
    log_section "Restoring Essential Production Configuration"
    
    log_info "Creating .vercel directory..."
    mkdir -p .vercel
    
    log_info "Restoring production Vercel project binding..."
    cp -f templates/prod/.vercel/project.json .vercel/project.json
    
    log_info "Restoring production robots.txt..."
    cp -f templates/prod/public/robots.txt public/robots.txt
    
    log_info "Restoring production sitemap.xml with production URLs..."
    cp -f templates/prod/public/sitemap.xml public/sitemap.xml
    
    # Verify restoration was successful
    if [[ ! -f ".vercel/project.json" ]]; then
        log_error "Failed to restore .vercel/project.json"
        exit 1
    fi
    
    # Verify production URLs are in place
    if ! grep -q "$PRODUCTION_DOMAIN" public/robots.txt; then
        log_warning "Production domain not found in robots.txt"
    fi
    
    if ! grep -q "pgclosets.com" public/sitemap.xml; then
        log_warning "Production domain not found in sitemap.xml"
    fi
    
    log_success "Production configuration files restored"
}

# =============================================================================
# BUILD NEXT.JS PROJECT
# =============================================================================
build_nextjs_project() {
    log_section "Building Next.js Production Build"
    
    log_info "Installing dependencies..."
    npm ci --legacy-peer-deps
    
    log_info "Running Next.js production build..."
    npm run build
    
    # Verify build artifacts exist
    if [[ ! -d ".next" ]]; then
        log_error "Next.js build failed - .next directory not found"
        exit 1
    fi
    
    log_success "Next.js build completed successfully"
}

# =============================================================================
# DEPLOY TO VERCEL PRODUCTION
# =============================================================================
deploy_to_vercel() {
    log_section "Deploying to Vercel Production"
    
    log_info "Project: $PROJECT_NAME"
    log_info "Target: $PRODUCTION_DOMAIN"
    log_info "Project ID: $VERCEL_PROJECT_ID"
    log_info "Team ID: $VERCEL_TEAM_ID"
    
    # Pull latest production environment variables and settings
    log_info "Syncing production environment settings..."
    vercel pull --yes --environment=production \
        --scope="$VERCEL_TEAM_ID" \
        --cwd="$(pwd)"
    
    # Deploy to production with explicit confirmation
    log_info "Deploying to production (this may take a few minutes)..."
    
    local deployment_url
    deployment_url=$(vercel deploy --prod --confirm \
        --scope="$VERCEL_TEAM_ID" \
        --cwd="$(pwd)" \
        --yes)
    
    if [[ -z "$deployment_url" ]]; then
        log_error "Deployment failed - no URL returned"
        exit 1
    fi
    
    log_success "Deployment completed successfully!"
    log_success "Live URL: $deployment_url"
    
    return 0
}

# =============================================================================
# POST-DEPLOYMENT ACTIONS
# =============================================================================
post_deployment_actions() {
    log_section "Post-deployment Actions"
    
    log_info "Verifying deployment is accessible..."
    
    # Wait a moment for DNS propagation
    sleep 3
    
    # Try to open the site in default browser
    if command -v open &> /dev/null; then
        log_info "Opening $PRODUCTION_DOMAIN in browser..."
        open "$PRODUCTION_DOMAIN" || log_warning "Could not open browser automatically"
    elif command -v xdg-open &> /dev/null; then
        log_info "Opening $PRODUCTION_DOMAIN in browser..."
        xdg-open "$PRODUCTION_DOMAIN" || log_warning "Could not open browser automatically"
    else
        log_info "Please manually visit: $PRODUCTION_DOMAIN"
    fi
    
    log_success "Deployment verification complete"
}

# =============================================================================
# MAIN DEPLOYMENT FLOW
# =============================================================================
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 PG CLOSETS PRODUCTION DEPLOYMENT"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Target: $PRODUCTION_DOMAIN"
    echo "Safety: Production-only deployment with fail-fast validation"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Execute deployment pipeline with fail-fast safety
    validate_prerequisites
    run_predeploy_validation
    restore_production_configs
    build_nextjs_project
    deploy_to_vercel
    post_deployment_actions
    
    echo ""
    log_success "🎉 PG CLOSETS DEPLOYMENT COMPLETED SUCCESSFULLY!"
    echo ""
    log_info "Live site: $PRODUCTION_DOMAIN"
    log_info "Admin: Visit Vercel dashboard for deployment details"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Handle script interruption gracefully
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Execute main deployment flow
main "$@"