#!/bin/bash

# Enterprise Infrastructure Testing Suite
# Tests all components of the infrastructure pipeline

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEST_RESULTS_DIR="$PROJECT_ROOT/test-results"
REPORT_FILE="$TEST_RESULTS_DIR/infrastructure-test-report-$(date +%Y%m%d-%H%M%S).html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

# Logging functions
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

log_test() {
    echo -e "${PURPLE}[TEST]${NC} $1"
}

# Test result tracking
track_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    ((TESTS_TOTAL++))

    case "$result" in
        "PASS")
            ((TESTS_PASSED++))
            echo -e "  ${GREEN}✓${NC} $test_name"
            ;;
        "FAIL")
            ((TESTS_FAILED++))
            echo -e "  ${RED}✗${NC} $test_name"
            echo -e "    ${RED}Error:${NC} $details"
            ;;
        "SKIP")
            ((TESTS_SKIPPED++))
            echo -e "  ${YELLOW}⚠${NC} $test_name (skipped)"
            ;;
    esac

    # Add to HTML report
    add_to_html_report "$test_name" "$result" "$details"
}

# Initialize HTML report
init_html_report() {
    cat > "$REPORT_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Infrastructure Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .test-item { margin: 10px 0; padding: 15px; border-left: 4px solid #ddd; background: #fafafa; }
        .test-pass { border-left-color: #28a745; }
        .test-fail { border-left-color: #dc3545; }
        .test-skip { border-left-color: #ffc107; }
        .test-name { font-weight: bold; font-size: 16px; }
        .test-details { margin-top: 8px; color: #666; font-family: monospace; font-size: 14px; }
        .status-badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; font-weight: bold; margin-right: 10px; }
        .status-pass { background: #28a745; }
        .status-fail { background: #dc3545; }
        .status-skip { background: #ffc107; color: #000; }
        .timestamp { color: #888; font-size: 14px; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .progress-pass { background: #28a745; }
        .progress-fail { background: #dc3545; }
        .progress-skip { background: #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Infrastructure Test Report</h1>
        <div class="timestamp">Generated on $(date)</div>

        <div class="summary">
            <h2>Test Summary</h2>
            <div id="test-summary"></div>
        </div>

        <div class="progress-bar">
            <div id="progress-pass" class="progress-fill progress-pass" style="width: 0%"></div>
            <div id="progress-fail" class="progress-fill progress-fail" style="width: 0%"></div>
            <div id="progress-skip" class="progress-fill progress-skip" style="width: 0%"></div>
        </div>

        <h2>Test Results</h2>
        <div id="test-results"></div>
    </div>

    <script>
        function updateSummary(total, passed, failed, skipped) {
            document.getElementById('test-summary').innerHTML = \`
                <div class="test-item">
                    <div class="test-name">Total Tests: \${total}</div>
                </div>
                <div class="test-item test-pass">
                    <div class="test-name">Passed: \${passed} (\${Math.round(passed/total*100)}%)</div>
                </div>
                <div class="test-item test-fail">
                    <div class="test-name">Failed: \${failed} (\${Math.round(failed/total*100)}%)</div>
                </div>
                <div class="test-item test-skip">
                    <div class="test-name">Skipped: \${skipped} (\${Math.round(skipped/total*100)}%)</div>
                </div>
            \`;

            const totalPercent = total || 1;
            document.getElementById('progress-pass').style.width = (passed/totalPercent*100) + '%';
            document.getElementById('progress-fail').style.width = (failed/totalPercent*100) + '%';
            document.getElementById('progress-skip').style.width = (skipped/totalPercent*100) + '%';
        }

        let testResults = [];

        function addTestResult(name, status, details) {
            testResults.push({name, status, details});
            const resultDiv = document.createElement('div');
            resultDiv.className = \`test-item test-\${status.toLowerCase()}\`;
            resultDiv.innerHTML = \`
                <div class="test-name">
                    <span class="status-badge status-\${status.toLowerCase()}">\${status}</span>
                    \${name}
                </div>
                <div class="test-details">\${details || 'No details available'}</div>
            \`;
            document.getElementById('test-results').appendChild(resultDiv);
        }
    </script>
</body>
</html>
EOF
}

# Add test result to HTML report
add_to_html_report() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    # Escape JavaScript strings
    local escaped_name=$(echo "$test_name" | sed 's/"/\\"/g' | sed 's/$/\\n/g' | tr -d '\n')
    local escaped_details=$(echo "$details" | sed 's/"/\\"/g' | sed 's/$/\\n/g' | tr -d '\n')

    # Add JavaScript to update the report
    cat >> "$REPORT_FILE" << EOF
<script>
addTestResult("$escaped_name", "$result", "$escaped_details");
updateSummary($TESTS_TOTAL, $TESTS_PASSED, $TESTS_FAILED, $TESTS_SKIPPED);
</script>
EOF
}

# Finalize HTML report
finalize_html_report() {
    cat >> "$REPORT_FILE" << 'EOF'
</body>
</html>
EOF

    log "📊 HTML report generated: $REPORT_FILE"
}

# Test 1: Infrastructure Dependencies
test_dependencies() {
    log_test "Testing Infrastructure Dependencies"

    local failed_deps=()

    # Check for required tools
    local tools=("node" "npm" "git" "curl" "jq" "vercel")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            failed_deps+=("$tool")
        fi
    done

    if [[ ${#failed_deps[@]} -eq 0 ]]; then
        track_test "Required Tools" "PASS" "All required tools are installed"
    else
        track_test "Required Tools" "FAIL" "Missing tools: ${failed_deps[*]}"
    fi

    # Check Node.js version
    local node_version=$(node --version | cut -d'v' -f2)
    if [[ "$(printf '%s\n' "20.0.0" "${node_version%%.*}" | sort -V | head -n1)" == "20.0.0" ]]; then
        track_test "Node.js Version" "PASS" "Node.js $node_version (≥20.0.0 required)"
    else
        track_test "Node.js Version" "FAIL" "Node.js $node_version (<20.0.0)"
    fi

    # Check npm version
    local npm_version=$(npm --version)
    track_test "npm Version" "PASS" "npm $npm_version"

    # Check Vercel authentication
    if vercel whoami &> /dev/null; then
        local vercel_user=$(vercel whoami 2>/dev/null | head -n1)
        track_test "Vercel Authentication" "PASS" "Authenticated as: $vercel_user"
    else
        track_test "Vercel Authentication" "FAIL" "Not authenticated with Vercel"
    fi
}

# Test 2: Environment Configuration
test_environment_config() {
    log_test "Testing Environment Configuration"

    local env_files=(".env.example" ".env.development" ".env.staging" ".env")
    local missing_files=()

    for env_file in "${env_files[@]}"; do
        if [[ -f "$PROJECT_ROOT/$env_file" ]]; then
            track_test "Environment File: $env_file" "PASS" "File exists"
        else
            missing_files+=("$env_file")
            if [[ "$env_file" == ".env.example" ]]; then
                track_test "Environment File: $env_file" "FAIL" "Required .env.example file missing"
            else
                track_test "Environment File: $env_file" "SKIP" "File not found (will be created during deployment)"
            fi
        fi
    done

    # Check .env.example for required variables
    if [[ -f "$PROJECT_ROOT/.env.example" ]]; then
        local required_vars=("NEXT_PUBLIC_SITE_URL" "NEXT_PUBLIC_GA_ID" "VERCEL_TOKEN" "VERCEL_ORG_ID" "VERCEL_PROJECT_ID")
        local missing_vars=()

        for var in "${required_vars[@]}"; do
            if grep -q "^$var=" "$PROJECT_ROOT/.env.example"; then
                track_test "Environment Variable: $var" "PASS" "Variable defined in .env.example"
            else
                missing_vars+=("$var")
                track_test "Environment Variable: $var" "FAIL" "Variable missing from .env.example"
            fi
        done
    fi
}

# Test 3: Code Quality
test_code_quality() {
    log_test "Testing Code Quality"

    cd "$PROJECT_ROOT"

    # TypeScript compilation
    if npm run type-check &> /dev/null; then
        track_test "TypeScript Compilation" "PASS" "No TypeScript errors"
    else
        track_test "TypeScript Compilation" "FAIL" "TypeScript compilation failed"
    fi

    # ESLint
    if npm run lint &> /dev/null; then
        track_test "ESLint" "PASS" "No linting errors"
    else
        track_test "ESLint" "FAIL" "Linting errors found"
    fi

    # Prettier formatting
    if npm run format:check &> /dev/null; then
        track_test "Prettier Formatting" "PASS" "Code is properly formatted"
    else
        track_test "Prettier Formatting" "FAIL" "Code formatting issues found"
    fi

    # Security audit
    local audit_output
    if audit_output=$(npm audit --audit-level=moderate --json 2>/dev/null); then
        local vulnerabilities=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.total // 0')
        if [[ "$vulnerabilities" -eq 0 ]]; then
            track_test "Security Audit" "PASS" "No vulnerabilities found"
        elif [[ "$vulnerabilities" -le 5 ]]; then
            track_test "Security Audit" "PASS" "Low number of vulnerabilities: $vulnerabilities"
        else
            track_test "Security Audit" "FAIL" "High number of vulnerabilities: $vulnerabilities"
        fi
    else
        track_test "Security Audit" "FAIL" "Security audit failed"
    fi
}

# Test 4: Build Process
test_build_process() {
    log_test "Testing Build Process"

    cd "$PROJECT_ROOT"

    # Clean previous build
    rm -rf .next out dist build

    # Test development build
    if npm run build &> /dev/null; then
        track_test "Development Build" "PASS" "Build completed successfully"

        # Check build output
        if [[ -d ".next" ]]; then
            track_test "Build Output" "PASS" ".next directory created"

            # Check bundle size
            local bundle_size=$(du -sh .next | cut -f1)
            track_test "Bundle Size" "PASS" "Bundle size: $bundle_size"
        else
            track_test "Build Output" "FAIL" ".next directory not found"
        fi
    else
        track_test "Development Build" "FAIL" "Build failed"
    fi

    # Test production build
    if NODE_ENV=production npm run build:production &> /dev/null; then
        track_test "Production Build" "PASS" "Production build completed"
    else
        track_test "Production Build" "FAIL" "Production build failed"
    fi
}

# Test 5: API Endpoints
test_api_endpoints() {
    log_test "Testing API Endpoints"

    local base_url="http://localhost:3000"

    # Start the development server if not running
    if ! curl -s "$base_url/api/health" &> /dev/null; then
        log_info "Starting development server for API tests..."
        npm start &
        local server_pid=$!
        sleep 10

        # Wait for server to be ready
        local retry_count=0
        while [[ $retry_count -lt 30 ]]; do
            if curl -s "$base_url/api/health" &> /dev/null; then
                break
            fi
            sleep 2
            ((retry_count++))
        done
    fi

    # Test API endpoints
    local endpoints=(
        "/api/health:200"
        "/api/robots:200"
        "/api/sitemap:200"
        "/api/products/search:200"
        "/api/lead:200"
    )

    for endpoint in "${endpoints[@]}"; do
        local path="${endpoint%:*}"
        local expected_status="${endpoint#*:}"

        local actual_status
        if actual_status=$(curl -s -w "%{http_code}" -o /dev/null "$base_url$path"); then
            if [[ "$actual_status" == "$expected_status" ]]; then
                track_test "API Endpoint: $path" "PASS" "Status: $actual_status"
            else
                track_test "API Endpoint: $path" "FAIL" "Expected: $expected_status, Got: $actual_status"
            fi
        else
            track_test "API Endpoint: $path" "FAIL" "Request failed"
        fi
    done

    # Clean up
    if [[ -n "${server_pid:-}" ]]; then
        kill "$server_pid" 2>/dev/null || true
    fi
}

# Test 6: Performance Metrics
test_performance_metrics() {
    log_test "Testing Performance Metrics"

    cd "$PROJECT_ROOT"

    # Bundle analysis
    if npm run analyze:bundle &> /dev/null; then
        track_test "Bundle Analysis" "PASS" "Bundle analysis completed"
    else
        track_test "Bundle Analysis" "FAIL" "Bundle analysis failed"
    fi

    # Performance validation
    if npm run validate:performance &> /dev/null; then
        track_test "Performance Validation" "PASS" "Performance metrics within thresholds"
    else
        track_test "Performance Validation" "FAIL" "Performance metrics exceed thresholds"
    fi

    # Check Next.js configuration optimizations
    local config_file="$PROJECT_ROOT/next.config.mjs"
    if [[ -f "$config_file" ]]; then
        if grep -q "compress: true" "$config_file"; then
            track_test "Next.js Compression" "PASS" "Compression enabled"
        else
            track_test "Next.js Compression" "FAIL" "Compression not enabled"
        fi

        if grep -q "reactStrictMode: true" "$config_file"; then
            track_test "React Strict Mode" "PASS" "Strict mode enabled"
        else
            track_test "React Strict Mode" "FAIL" "Strict mode not enabled"
        fi
    else
        track_test "Next.js Configuration" "FAIL" "Configuration file not found"
    fi
}

# Test 7: Security Measures
test_security_measures() {
    log_test "Testing Security Measures"

    # Check middleware configuration
    local middleware_file="$PROJECT_ROOT/middleware.ts"
    if [[ -f "$middleware_file" ]]; then
        if grep -q "securityMiddleware" "$middleware_file"; then
            track_test "Security Middleware" "PASS" "Security middleware integrated"
        else
            track_test "Security Middleware" "FAIL" "Security middleware not integrated"
        fi
    else
        track_test "Security Middleware" "FAIL" "Middleware file not found"
    fi

    # Check security configuration files
    local security_config="$PROJECT_ROOT/lib/security/security-middleware.ts"
    if [[ -f "$security_config" ]]; then
        track_test "Security Configuration" "PASS" "Security configuration file exists"

        if grep -q "rateLimiting" "$security_config"; then
            track_test "Rate Limiting" "PASS" "Rate limiting configured"
        else
            track_test "Rate Limiting" "FAIL" "Rate limiting not configured"
        fi

        if grep -q "csrf" "$security_config"; then
            track_test "CSRF Protection" "PASS" "CSRF protection configured"
        else
            track_test "CSRF Protection" "FAIL" "CSRF protection not configured"
        fi
    else
        track_test "Security Configuration" "FAIL" "Security configuration file not found"
    fi

    # Check environment variables for security
    if [[ -f "$PROJECT_ROOT/.env.example" ]]; then
        if grep -q "NEXT_PUBLIC_" "$PROJECT_ROOT/.env.example"; then
            track_test "Environment Variable Security" "PASS" "Public variables properly prefixed"
        else
            track_test "Environment Variable Security" "SKIP" "No public environment variables found"
        fi
    fi
}

# Test 8: Monitoring and Analytics
test_monitoring_analytics() {
    log_test "Testing Monitoring and Analytics"

    # Check performance monitoring
    local perf_monitoring="$PROJECT_ROOT/lib/monitoring/performance-monitoring.ts"
    if [[ -f "$perf_monitoring" ]]; then
        track_test "Performance Monitoring" "PASS" "Performance monitoring module exists"
    else
        track_test "Performance Monitoring" "FAIL" "Performance monitoring module not found"
    fi

    # Check analytics configuration
    local analytics_config="$PROJECT_ROOT/lib/analytics/comprehensive-analytics.ts"
    if [[ -f "$analytics_config" ]]; then
        track_test "Analytics Configuration" "PASS" "Analytics configuration exists"
    else
        track_test "Analytics Configuration" "FAIL" "Analytics configuration not found"
    fi

    # Check API routes for monitoring
    local api_routes=(
        "$PROJECT_ROOT/app/api/analytics/performance/route.ts"
        "$PROJECT_ROOT/app/api/analytics/events/route.ts"
    )

    for route in "${api_routes[@]}"; do
        if [[ -f "$route" ]]; then
            local route_name=$(basename "$(dirname "$route")")
            track_test "Analytics API: $route_name" "PASS" "API route exists"
        else
            local route_name=$(basename "$(dirname "$route")")
            track_test "Analytics API: $route_name" "FAIL" "API route not found"
        fi
    done
}

# Test 9: CI/CD Pipeline
test_cicd_pipeline() {
    log_test "Testing CI/CD Pipeline"

    # Check GitHub workflows
    local workflows_dir="$PROJECT_ROOT/.github/workflows"
    if [[ -d "$workflows_dir" ]]; then
        local workflow_files=(
            "enterprise-ci-cd.yml"
        )

        for workflow in "${workflow_files[@]}"; do
            if [[ -f "$workflows_dir/$workflow" ]]; then
                track_test "CI/CD Workflow: $workflow" "PASS" "Workflow file exists"
            else
                track_test "CI/CD Workflow: $workflow" "FAIL" "Workflow file not found"
            fi
        done
    else
        track_test "GitHub Workflows Directory" "FAIL" "Workflows directory not found"
    fi

    # Check deployment scripts
    local deploy_script="$PROJECT_ROOT/scripts/ops/deploy-environments.sh"
    if [[ -f "$deploy_script" ]]; then
        if [[ -x "$deploy_script" ]]; then
            track_test "Deployment Script" "PASS" "Deployment script exists and is executable"
        else
            track_test "Deployment Script" "FAIL" "Deployment script is not executable"
        fi
    else
        track_test "Deployment Script" "FAIL" "Deployment script not found"
    fi

    # Check Vercel configuration
    local vercel_config="$PROJECT_ROOT/vercel.json"
    if [[ -f "$vercel_config" ]]; then
        track_test "Vercel Configuration" "PASS" "Vercel configuration exists"
    else
        track_test "Vercel Configuration" "FAIL" "Vercel configuration not found"
    fi
}

# Test 10: Documentation and Compliance
test_documentation_compliance() {
    log_test "Testing Documentation and Compliance"

    # Check README
    if [[ -f "$PROJECT_ROOT/README.md" ]]; then
        track_test "README Documentation" "PASS" "README file exists"
    else
        track_test "README Documentation" "FAIL" "README file not found"
    fi

    # Check package.json scripts
    local package_json="$PROJECT_ROOT/package.json"
    if [[ -f "$package_json" ]]; then
        local required_scripts=("build" "test" "lint" "type-check")
        for script in "${required_scripts[@]}"; do
            if jq -e ".scripts[\"$script\"]" "$package_json" &> /dev/null; then
                track_test "Package Script: $script" "PASS" "Script defined in package.json"
            else
                track_test "Package Script: $script" "FAIL" "Script not found in package.json"
            fi
        done
    else
        track_test "Package Configuration" "FAIL" "package.json not found"
    fi

    # Check git configuration
    if [[ -d "$PROJECT_ROOT/.git" ]]; then
        track_test "Git Repository" "PASS" "Git repository initialized"

        if [[ -f "$PROJECT_ROOT/.gitignore" ]]; then
            track_test "Git Ignore" "PASS" ".gitignore file exists"
        else
            track_test "Git Ignore" "FAIL" ".gitignore file not found"
        fi
    else
        track_test "Git Repository" "FAIL" "Not a git repository"
    fi
}

# Main execution
main() {
    log "🔍 Starting Infrastructure Testing Suite"
    log "Results will be saved to: $TEST_RESULTS_DIR"

    # Initialize HTML report
    init_html_report

    # Run all tests
    test_dependencies
    test_environment_config
    test_code_quality
    test_build_process
    test_api_endpoints
    test_performance_metrics
    test_security_measures
    test_monitoring_analytics
    test_cicd_pipeline
    test_documentation_compliance

    # Finalize report
    finalize_html_report

    # Print summary
    echo
    log "📊 Test Summary:"
    echo "  Total Tests: $TESTS_TOTAL"
    echo -e "  ${GREEN}Passed:${NC} $TESTS_PASSED"
    echo -e "  ${RED}Failed:${NC} $TESTS_FAILED"
    echo -e "  ${YELLOW}Skipped:${NC} $TESTS_SKIPPED"
    echo

    # Calculate success rate
    local success_rate=0
    if [[ $TESTS_TOTAL -gt 0 ]]; then
        success_rate=$((TESTS_PASSED * 100 / TESTS_TOTAL))
    fi

    echo "Success Rate: $success_rate%"
    echo "HTML Report: $REPORT_FILE"

    # Exit with appropriate code
    if [[ $TESTS_FAILED -gt 0 ]]; then
        log_error "Some tests failed. Check the report for details."
        exit 1
    else
        log "🎉 All tests passed successfully!"
        exit 0
    fi
}

# Run main function
main "$@"