#!/bin/bash

echo "🚀 Setting up PG Closets Store environment variables..."

# Core Analytics
echo "Setting up GA4..."
echo "G-M01QFYXCDN" | vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID production

# Jobber Integration
echo "Setting up Jobber integration..."
echo "83a3d24e-c18d-441c-80d1-d85419ea28ae" | vercel env add JOBBER_CLIENT_HUB_ID production

# Contact Information
echo "Setting up contact information..."
echo "info@pgclosets.ca" | vercel env add NEXT_PUBLIC_CONTACT_EMAIL production
echo "(613) 262-2604" | vercel env add NEXT_PUBLIC_CONTACT_PHONE production

# Application URL
echo "Setting up app URL..."
echo "https://pgclosets-store-469agvj9a-peoples-group.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

echo "✅ Core environment variables configured!"
echo ""
echo "📋 Next steps to complete setup:"
echo "1. Set GA4_API_SECRET (get from GA4 > Admin > Data Streams > Measurement Protocol API secrets)"
echo "2. Set SLACK_WEBHOOK_URL (optional - for lead notifications)"
echo "3. Set up Jobber webhook: https://pgclosets-store-469agvj9a-peoples-group.vercel.app/api/webhooks/jobber"
echo ""
echo "🌐 Your PG Closets store is live at:"
echo "https://pgclosets-store-469agvj9a-peoples-group.vercel.app"