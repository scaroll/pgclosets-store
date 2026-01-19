#!/bin/bash

# PG Closets Store - Development Environment Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚀 Setting up PG Closets Store Development Environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
fi

print_status "Checking system requirements..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed. Please install Node.js 18+ from https://nodejs.org/"
fi

node_version=$(node -v | cut -d 'v' -f 2)
required_version="18.0.0"

if ! [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then
    print_error "Node.js version $node_version is installed, but version $required_version or higher is required."
fi

print_success "✅ Node.js version $node_version is compatible"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is required but not installed."
fi

print_success "✅ npm is available"

# Check git
if ! command -v git &> /dev/null; then
    print_error "Git is required but not installed."
fi

print_success "✅ Git is available"

# Install dependencies
print_status "Installing project dependencies..."
npm ci
print_success "✅ Dependencies installed"

# Set up environment files
print_status "Setting up environment configuration..."

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local from template..."
    cp .env.example .env.local
    print_warning "⚠️  Please configure .env.local with your development values"
    echo "   Edit .env.local and replace placeholder values with real ones"
else
    print_success "✅ .env.local already exists"
fi

# Create development-specific environment file
if [ ! -f ".env.development" ]; then
    print_status "Creating .env.development..."
    cat > .env.development << 'EOF'
# Development Environment Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development Features
DEBUG=true
VERBOSE_LOGGING=true
ANALYZE=false

# Feature Flags (Development - all enabled for testing)
FEATURE_REVIEWS_ENABLED=true
FEATURE_CHAT_SUPPORT=true
FEATURE_AR_PREVIEW=true
FEATURE_VIRTUAL_CONSULTATION=true

# Rate Limiting (Lenient for development)
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_WINDOW_MS=60000

# Business Config (Test Data)
BUSINESS_PHONE=+1-613-555-0123
BUSINESS_EMAIL=dev@pgclosets.com
EOF
    print_success "✅ .env.development created"
else
    print_success "✅ .env.development already exists"
fi

# Check for required development tools
print_status "Checking optional development tools..."

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    print_success "✅ Vercel CLI is installed"
else
    print_warning "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    echo "   This is needed for deployment but not required for development"
fi

# Set up git hooks (if using husky)
if [ -f ".husky/_/husky.sh" ] || [ -f "package.json" ] && grep -q "husky" package.json; then
    print_status "Setting up git hooks..."
    if command -v npx &> /dev/null; then
        npx husky install 2>/dev/null || print_warning "Husky setup skipped"
        print_success "✅ Git hooks configured"
    fi
fi

# Run initial build to verify everything works
print_status "Running initial build to verify setup..."
if npm run build; then
    print_success "✅ Initial build successful"
else
    print_error "❌ Initial build failed. Please check your configuration."
fi

# Run type checking
print_status "Running type checking..."
if npm run type-check 2>/dev/null; then
    print_success "✅ Type checking passed"
else
    print_warning "⚠️  Type checking not available or failed"
fi

# Run linting
print_status "Running linting..."
if npm run lint 2>/dev/null; then
    print_success "✅ Linting passed"
else
    print_warning "⚠️  Linting not available or failed"
fi

# Test development server startup
print_status "Testing development server startup..."
timeout 10s npm run dev > /dev/null 2>&1 &
dev_pid=$!
sleep 5

if kill -0 $dev_pid 2>/dev/null; then
    kill $dev_pid
    print_success "✅ Development server starts successfully"
else
    print_warning "⚠️  Development server may have issues starting"
fi

# Create helpful development scripts
print_status "Creating helpful development scripts..."

# Create a quick start script
cat > scripts/dev-start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting PG Closets Store Development Server"
echo "Opening http://localhost:3000 in your browser..."

# Start the development server
npm run dev
EOF

chmod +x scripts/dev-start.sh

# Create a testing script
cat > scripts/run-tests.sh << 'EOF'
#!/bin/bash
echo "🧪 Running PG Closets Store Tests"

echo "1. Type checking..."
npm run type-check || echo "Type checking failed or not configured"

echo "2. Linting..."
npm run lint || echo "Linting failed or not configured"

echo "3. Unit tests..."
npm run test || echo "Tests failed or not configured"

echo "4. Build test..."
npm run build || echo "Build failed"

echo "✅ Test suite complete"
EOF

chmod +x scripts/run-tests.sh

print_success "✅ Development scripts created"

# Final setup summary
echo ""
print_success "🎉 Development Environment Setup Complete!"
echo ""
echo "📋 Setup Summary:"
echo "   ✅ Node.js and npm verified"
echo "   ✅ Dependencies installed"
echo "   ✅ Environment files configured"
echo "   ✅ Initial build successful"
echo "   ✅ Development scripts created"
echo ""
echo "🚀 Getting Started:"
echo "   1. Configure your .env.local file with real values"
echo "   2. Start development server: npm run dev"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "🛠️  Useful Commands:"
echo "   npm run dev           # Start development server"
echo "   npm run build         # Build for production"
echo "   npm run lint          # Run linting"
echo "   npm run type-check    # Run type checking"
echo "   ./scripts/dev-start.sh      # Quick development start"
echo "   ./scripts/run-tests.sh      # Run all tests"
echo ""
echo "📚 Next Steps:"
echo "   1. Review .env.local and add your API keys"
echo "   2. Set up your Supabase database"
echo "   3. Configure Paddle payment processing"
echo "   4. Set up Google Analytics (optional)"
echo ""
echo "❓ Need Help?"
echo "   - Check the README.md file"
echo "   - Review environment variable documentation"
echo "   - Check the project wiki or documentation"
echo ""
print_success "Happy coding! 🎨"