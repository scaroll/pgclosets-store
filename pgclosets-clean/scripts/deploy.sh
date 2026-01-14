#!/bin/bash

# PG Closets Production Deployment Script

set -e  # Exit on any error

echo "🚀 Starting PG Closets production deployment..."

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
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Run tests
print_status "Running tests..."
npm run test

# Clean previous build
print_status "Cleaning previous build..."
npm run clean

# Set production environment
export NODE_ENV=production

# Build for production
print_status "Building for production..."
npm run build:production

# Verify build output
if [ -d ".next" ]; then
    print_success "Build completed successfully!"

    # Display build size information
    echo ""
    print_status "Build size analysis:"
    du -sh .next

    # Check for critical files
    if [ -f ".next/static/chunks/app/layout-*.js" ]; then
        print_success "Core app files generated"
    else
        print_warning "Core app files may be missing"
    fi

    if [ -f ".next/static/chunks/app/page-*.js" ]; then
        print_success "Homepage files generated"
    else
        print_warning "Homepage files may be missing"
    fi

else
    print_error "Build failed - .next directory not found"
    exit 1
fi

# Optional: Start the production server for testing
if [ "$1" = "--start" ]; then
    print_status "Starting production server..."
    npm start
fi

# Optional: Analyze bundle size
if [ "$1" = "--analyze" ]; then
    print_status "Analyzing bundle size..."
    npm run build:analyze
fi

print_success "Production deployment completed successfully!"
echo ""
print_status "Next steps:"
echo "  1. Deploy .next directory to your hosting platform"
echo "  2. Ensure environment variables are set"
echo "  3. Run 'npm start' on the server"
echo ""
print_status "Available commands:"
echo "  npm start                 - Start production server"
echo "  npm run build:analyze     - Analyze bundle size"
echo "  npm run build:standalone  - Build for Docker/standalone"