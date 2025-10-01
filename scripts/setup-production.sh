#!/bin/bash

# Production Setup Script for PG Closets Store
# This script helps set up environment variables for Vercel production deployment

set -e

echo "🚀 PG Closets Store - Production Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed${NC}"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✓ Vercel CLI found${NC}"
echo ""

# Authenticate
echo "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}Not authenticated. Please log in:${NC}"
    vercel login
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Link project if needed
if [ ! -d ".vercel" ]; then
    echo -e "${YELLOW}Project not linked. Linking now...${NC}"
    vercel link
fi

echo ""
echo "Setting up environment variables for production..."
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_description=$2
    local is_public=$3

    echo -e "${YELLOW}Setting up: $var_name${NC}"
    echo "Description: $var_description"

    if [ "$is_public" = "public" ]; then
        echo "(This will be visible in the browser)"
    fi

    read -p "Enter value (or press Enter to skip): " var_value

    if [ -n "$var_value" ]; then
        vercel env add "$var_name" production <<< "$var_value"
        echo -e "${GREEN}✓ Added $var_name${NC}"
    else
        echo -e "${YELLOW}⊘ Skipped $var_name${NC}"
    fi
    echo ""
}

# Required Environment Variables
echo "=== REQUIRED VARIABLES ==="
echo ""

add_env_var "SUPABASE_SERVICE_ROLE_KEY" "Supabase service role key for database access" "private"
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "Supabase project URL" "public"

# Payment Processing
echo "=== PAYMENT PROCESSING (Paddle) ==="
echo ""

add_env_var "PADDLE_API_KEY" "Paddle API key for payment processing" "private"
add_env_var "PADDLE_WEBHOOK_SECRET" "Paddle webhook secret for verification" "private"
add_env_var "NEXT_PUBLIC_PADDLE_VENDOR_ID" "Paddle vendor ID" "public"
add_env_var "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN" "Paddle client token" "public"

# Security
echo "=== SECURITY ==="
echo ""

# Generate JWT secret if not provided
read -p "Enter JWT_SECRET (or press Enter to generate): " jwt_secret
if [ -z "$jwt_secret" ]; then
    jwt_secret=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated JWT_SECRET: $jwt_secret${NC}"
fi
vercel env add JWT_SECRET production <<< "$jwt_secret"

# Generate NextAuth secret if not provided
read -p "Enter NEXTAUTH_SECRET (or press Enter to generate): " nextauth_secret
if [ -z "$nextauth_secret" ]; then
    nextauth_secret=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated NEXTAUTH_SECRET: $nextauth_secret${NC}"
fi
vercel env add NEXTAUTH_SECRET production <<< "$nextauth_secret"

echo ""

# Analytics
echo "=== ANALYTICS ==="
echo ""

add_env_var "NEXT_PUBLIC_GA_MEASUREMENT_ID" "Google Analytics Measurement ID (G-XXXXXXXXXX)" "public"
add_env_var "NEXT_PUBLIC_GTM_ID" "Google Tag Manager ID (GTM-XXXXXXX)" "public"
add_env_var "NEXT_PUBLIC_FACEBOOK_PIXEL_ID" "Facebook Pixel ID" "public"

# Email Services
echo "=== EMAIL SERVICES ==="
echo ""

add_env_var "SENDGRID_API_KEY" "SendGrid API key for sending emails" "private"
add_env_var "RESEND_API_KEY" "Resend API key (alternative to SendGrid)" "private"
add_env_var "EMAIL_FROM" "From email address (e.g., noreply@pgclosets.com)" "private"

# Vercel Services
echo "=== VERCEL SERVICES ==="
echo ""

add_env_var "BLOB_READ_WRITE_TOKEN" "Vercel Blob Storage token" "private"
add_env_var "POSTGRES_URL" "Vercel Postgres connection URL" "private"
add_env_var "EDGE_CONFIG" "Vercel Edge Config URL" "private"

# Cron Protection
echo "=== CRON PROTECTION ==="
echo ""

read -p "Enter CRON_SECRET (or press Enter to generate): " cron_secret
if [ -z "$cron_secret" ]; then
    cron_secret=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated CRON_SECRET: $cron_secret${NC}"
fi
vercel env add CRON_SECRET production <<< "$cron_secret"

echo ""
echo "=== SETUP COMPLETE ==="
echo ""
echo -e "${GREEN}✓ Production environment variables configured${NC}"
echo ""
echo "Next steps:"
echo "1. Review your environment variables: vercel env ls"
echo "2. Deploy to production: vercel --prod"
echo "3. Monitor deployment: vercel logs <deployment-url>"
echo ""
echo -e "${YELLOW}Important Notes:${NC}"
echo "• Keep your secrets secure and never commit them to git"
echo "• You can update variables anytime with: vercel env rm <name> && vercel env add <name>"
echo "• Preview deployments will need separate environment variables"
echo ""
