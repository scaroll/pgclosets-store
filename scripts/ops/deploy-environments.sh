#!/bin/bash

# Enterprise Multi-Environment Deployment Pipeline
# Supports: development, staging, production environments

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="$PROJECT_ROOT/logs/deploy-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check if required tools are installed
check_prerequisites() {
    log "Checking prerequisites..."

    # Check for required commands
    for cmd in node npm vercel git curl jq; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Required command '$cmd' is not installed"
            exit 1
        fi
    done

    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE_VERSION="20"
    if [[ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "${NODE_VERSION%%.*}" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]]; then
        log_error "Node.js version $REQUIRED_NODE_VERSION or higher is required (current: $NODE_VERSION)"
        exit 1
    fi

    # Check if logged into Vercel
    if ! vercel whoami &> /dev/null; then
        log_error "Not logged into Vercel. Run 'vercel login' first."
        exit 1
    fi

    # Check environment variables
    check_env_vars

    log "✅ Prerequisites check passed"
}

# Check required environment variables
check_env_vars() {
    local env_file="$1"

    if [[ -n "$env_file" && -f "$env_file" ]]; then
        source "$env_file"
    fi

    local required_vars=("VERCEL_TOKEN" "VERCEL_ORG_ID" "VERCEL_PROJECT_ID")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
}

# Function to validate current state
validate_deployment_state() {
    local environment="$1"

    log "Validating deployment state for $environment environment..."

    # Check git state
    if [[ "$environment" != "development" ]]; then
        # Check if working directory is clean
        if ! git diff-index --quiet HEAD --; then
            log_error "Working directory is not clean. Commit or stash changes first."
            exit 1
        fi

        # Check if we're on the correct branch
        local expected_branch
        case "$environment" in
            "staging")
                expected_branch="develop"
                ;;
            "production")
                expected_branch="main"
                ;;
            *)
                expected_branch="main"
                ;;
        esac

        local current_branch=$(git rev-parse --abbrev-ref HEAD)
        if [[ "$current_branch" != "$expected_branch" ]]; then
            log_error "Must be on '$expected_branch' branch to deploy to $environment. Current branch: $current_branch"
            exit 1
        fi
    fi

    log "✅ Deployment state validation passed"
}

# Function to run tests
run_tests() {
    log "Running test suite..."

    cd "$PROJECT_ROOT"

    # Type checking
    log_info "Running TypeScript type checking..."
    npm run type-check

    # Linting
    log_info "Running ESLint..."
    npm run lint

    # Unit tests
    log_info "Running unit tests..."
    npm run test

    # Security audit
    log_info "Running security audit..."
    npm run security:audit

    # Build test
    log_info "Testing production build..."
    npm run build

    log "✅ All tests passed"
}

# Function to build the application
build_application() {
    local environment="$1"

    log "Building application for $environment environment..."

    cd "$PROJECT_ROOT"

    # Set environment-specific variables
    export NODE_ENV=production
    export NEXT_PUBLIC_ENVIRONMENT="$environment"

    # Clean previous build
    rm -rf .next out dist build

    # Build application
    npm run build:production

    # Verify build output
    if [[ ! -d ".next" ]]; then
        log_error "Build failed - .next directory not found"
        exit 1
    fi

    log "✅ Application built successfully"
}

# Function to deploy to environment
deploy_to_environment() {
    local environment="$1"
    local alias_domain="$2"

    log "Deploying to $environment environment..."

    cd "$PROJECT_ROOT"

    # Environment-specific deployment
    case "$environment" in
        "development")
            deploy_development
            ;;
        "staging")
            deploy_staging "$alias_domain"
            ;;
        "production")
            deploy_production "$alias_domain"
            ;;
        *)
            log_error "Unknown environment: $environment"
            exit 1
            ;;
    esac

    log "✅ Deployment to $environment completed"
}

# Development deployment
deploy_development() {
    log_info "Deploying to development environment..."

    # Deploy to Vercel without production flag
    vercel --confirm

    # Get deployment URL
    local deployment_url=$(vercel ls --scope "$VERCEL_ORG_ID" 2>/dev/null | grep "$VERCEL_PROJECT_ID" | head -n1 | awk '{print $2}')

    log "🚀 Development deployment available at: $deployment_url"
}

# Staging deployment
deploy_staging() {
    local alias_domain="$1"

    log_info "Deploying to staging environment..."

    # Deploy to Vercel with production flag
    vercel --prod --confirm

    # Set staging alias
    if [[ -n "$alias_domain" ]]; then
        vercel alias --confirm "$alias_domain"
        log "🚀 Staging deployment available at: https://$alias_domain"
    else
        local deployment_url=$(vercel ls --scope "$VERCEL_ORG_ID" 2>/dev/null | grep "$VERCEL_PROJECT_ID" | head -n1 | awk '{print $2}')
        log "🚀 Staging deployment available at: $deployment_url"
    fi

    # Run smoke tests
    run_smoke_tests "staging"
}

# Production deployment
deploy_production() {
    local alias_domain="$1"

    log_info "Deploying to production environment..."

    # Additional safety checks for production
    if [[ -z "$FORCE_DEPLOY" ]]; then
        log_warning "Deploying to PRODUCTION environment. You have 10 seconds to cancel (Ctrl+C)..."
        sleep 10
    fi

    # Deploy to Vercel with production flag
    vercel --prod --confirm

    # Set production aliases
    if [[ -n "$alias_domain" ]]; then
        # Set primary domain
        vercel alias --confirm "$alias_domain"

        # Set additional domains if configured
        if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
            IFS=',' read -ra DOMAINS <<< "$ADDITIONAL_DOMAINS"
            for domain in "${DOMAINS[@]}"; do
                vercel alias --confirm "$(echo "$domain" | xargs)" || log_warning "Failed to set alias for $domain"
            done
        fi

        log "🚀 Production deployment available at: https://$alias_domain"
    else
        log_error "Production alias domain is required"
        exit 1
    fi

    # Run comprehensive smoke tests
    run_smoke_tests "production"

    # Warm up caches
    warm_up_caches "$alias_domain"
}

# Function to run smoke tests
run_smoke_tests() {
    local environment="$1"
    local base_url

    case "$environment" in
        "staging")
            base_url="https://pgclosets-staging.vercel.app"
            ;;
        "production")
            base_url="https://www.pgclosets.com"
            ;;
        *)
            log_error "Unknown environment for smoke tests: $environment"
            return
            ;;
    esac

    log_info "Running smoke tests against $base_url..."

    # Health check
    local health_response=$(curl -s -w "%{http_code}" -o /dev/null "$base_url/api/health")
    if [[ "$health_response" != "200" ]]; then
        log_error "Health check failed with status: $health_response"
        exit 1
    fi

    # Basic page load tests
    local pages=("/" "/products" "/book" "/contact")
    for page in "${pages[@]}"; do
        local response_code=$(curl -s -w "%{http_code}" -o /dev/null "$base_url$page")
        if [[ "$response_code" != "200" ]]; then
            log_error "Page $page failed with status: $response_code"
            exit 1
        fi
    done

    log "✅ Smoke tests passed"
}

# Function to warm up caches
warm_up_caches() {
    local base_url="$1"

    log_info "Warming up caches..."

    # Key pages to warm
    local pages=(
        "/"
        "/products"
        "/book"
        "/contact"
        "/about"
        "/sitemap.xml"
        "/robots.txt"
    )

    for page in "${pages[@]}"; do
        curl -s -o /dev/null "$base_url$page" &
    done

    wait
    log "✅ Cache warming completed"
}

# Function to monitor deployment
monitor_deployment() {
    local environment="$1"
    local base_url="$2"

    log_info "Monitoring deployment health for the next 5 minutes..."

    local end_time=$(($(date +%s) + 300)) # 5 minutes from now

    while [[ $(date +%s) -lt $end_time ]]; do
        local health_response=$(curl -s -w "%{http_code}" -o /dev/null "$base_url/api/health")

        if [[ "$health_response" == "200" ]]; then
            log "✅ Deployment is healthy"
            break
        else
            log_warning "Health check failed (status: $health_response). Retrying in 30 seconds..."
            sleep 30
        fi
    done

    # Final check
    local final_health=$(curl -s -w "%{http_code}" -o /dev/null "$base_url/api/health")
    if [[ "$final_health" != "200" ]]; then
        log_error "Final health check failed. Deployment may be unhealthy."
        exit 1
    fi

    log "✅ Deployment monitoring completed successfully"
}

# Function to send notifications
send_notification() {
    local environment="$1"
    local status="$2"
    local url="$3"

    if [[ -n "${SLACK_WEBHOOK:-}" ]]; then
        local color="good"
        local emoji=":white_check_mark:"

        if [[ "$status" == "failed" ]]; then
            color="danger"
            emoji=":x:"
        fi

        local payload=$(cat <<EOF
{
    "attachments": [
        {
            "color": "$color",
            "title": "$emoji PG Closets Deployment - $environment",
            "title_link": "$url",
            "fields": [
                {
                    "title": "Environment",
                    "value": "$environment",
                    "short": true
                },
                {
                    "title": "Status",
                    "value": "$status",
                    "short": true
                },
                {
                    "title": "Deployed by",
                    "value": "$(git config user.name || 'Unknown')",
                    "short": true
                },
                {
                    "title": "Commit",
                    "value": "$(git rev-parse --short HEAD)",
                    "short": true
                },
                {
                    "title": "Timestamp",
                    "value": "$(date)",
                    "short": true
                }
            ]
        }
    ]
}
EOF
        )

        curl -X POST "$SLACK_WEBHOOK" \
            -H 'Content-type: application/json' \
            --data "$payload" || log_warning "Failed to send Slack notification"
    fi
}

# Function to rollback deployment
rollback_deployment() {
    local environment="$1"

    log_error "Rolling back $environment deployment..."

    cd "$PROJECT_ROOT"

    # Get previous deployment
    local previous_deployment=$(vercel ls --scope "$VERCEL_ORG_ID" --limit 2 --no-rewrite 2>/dev/null | grep "$VERCEL_PROJECT_ID" | tail -n1 | awk '{print $2}')

    if [[ -n "$previous_deployment" ]]; then
        vercel promote "$previous_deployment" --confirm
        log "✅ Rollback completed to: $previous_deployment"

        # Send rollback notification
        send_notification "$environment" "rolled_back" "$previous_deployment"
    else
        log_error "No previous deployment found for rollback"
        exit 1
    fi
}

# Main function
main() {
    local environment="$1"
    local alias_domain="$2"
    local skip_tests="${3:-false}"

    log "🚀 Starting PG Closets deployment pipeline"
    log "Environment: $environment"
    log "Alias Domain: $alias_domain"
    log "Skip Tests: $skip_tests"

    # Create logs directory
    mkdir -p "$(dirname "$LOG_FILE")"

    # Trap for cleanup
    trap 'log_error "Deployment failed. Check logs at: $LOG_FILE"; exit 1' ERR

    # Execute deployment pipeline
    check_prerequisites
    validate_deployment_state "$environment"

    if [[ "$skip_tests" != "true" ]]; then
        run_tests
    fi

    build_application "$environment"

    # Attempt deployment
    if deploy_to_environment "$environment" "$alias_domain"; then
        # Get deployment URL
        local deployment_url
        case "$environment" in
            "staging")
                deployment_url="https://pgclosets-staging.vercel.app"
                ;;
            "production")
                deployment_url="https://$alias_domain"
                ;;
            *)
                deployment_url="Development deployment (check Vercel dashboard)"
                ;;
        esac

        # Monitor deployment
        if [[ "$environment" != "development" ]]; then
            monitor_deployment "$environment" "$deployment_url"
        fi

        # Send success notification
        send_notification "$environment" "success" "$deployment_url"

        log "🎉 Deployment completed successfully!"
        log "📊 Logs available at: $LOG_FILE"

    else
        # Deployment failed
        send_notification "$environment" "failed" "N/A"
        log_error "Deployment failed"
        exit 1
    fi
}

# Script usage
usage() {
    echo "Usage: $0 <environment> [alias_domain] [skip_tests]"
    echo ""
    echo "Environments:"
    echo "  development    Deploy to development environment"
    echo "  staging       Deploy to staging environment"
    echo "  production    Deploy to production environment"
    echo ""
    echo "Examples:"
    echo "  $0 development"
    echo "  $0 staging staging.pgclosets.com"
    echo "  $0 production www.pgclosets.com"
    echo "  $0 production www.pgclosets.com true  # Skip tests"
    echo ""
    echo "Environment Variables:"
    echo "  VERCEL_TOKEN         Vercel authentication token"
    echo "  VERCEL_ORG_ID        Vercel organization ID"
    echo "  VERCEL_PROJECT_ID    Vercel project ID"
    echo "  SLACK_WEBHOOK        Slack webhook URL for notifications"
    echo "  ADDITIONAL_DOMAINS   Comma-separated additional domains (production only)"
    echo "  FORCE_DEPLOY         Skip production deployment confirmation"
    exit 1
}

# Parse command line arguments
if [[ $# -lt 1 ]]; then
    usage
fi

ENVIRONMENT="$1"
ALIAS_DOMAIN="${2:-}"
SKIP_TESTS="${3:-false}"

# Validate environment
case "$ENVIRONMENT" in
    "development"|"staging"|"production")
        ;;
    *)
        log_error "Invalid environment: $ENVIRONMENT"
        usage
        ;;
esac

# Load environment-specific variables
ENV_FILE="$PROJECT_ROOT/.env.$ENVIRONMENT"
if [[ -f "$ENV_FILE" ]]; then
    log_info "Loading environment variables from $ENV_FILE"
    source "$ENV_FILE"
fi

# Run main function
main "$ENVIRONMENT" "$ALIAS_DOMAIN" "$SKIP_TESTS"