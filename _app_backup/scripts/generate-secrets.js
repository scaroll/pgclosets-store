#!/usr/bin/env node

/**
 * Generate secure random secrets for environment variables
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64');
}

function generateApiKey(prefix = '') {
  const random = crypto.randomBytes(24).toString('hex');
  return prefix ? `${prefix}_${random}` : random;
}

function generateGoogleAnalyticsId() {
  const random = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `G-${random}`;
}

function generateGtmId() {
  const random = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `GTM-${random}`;
}

function generateDatabaseUrl(options = {}) {
  const {
    user = 'pgclosets_user',
    password = generateSecret(16).replace(/[+/=]/g, '').substring(0, 24),
    host = 'localhost',
    port = '5432',
    database = 'pgclosets'
  } = options;

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

console.log('🔐 PG Closets - Environment Variable Generator\n');
console.log('Copy these values into your .env.local file:\n');

console.log('==========================================');
console.log('Security & Authentication');
console.log('==========================================');
console.log(`JWT_SECRET=${generateSecret(32)}`);
console.log(`CSRF_SECRET=${generateSecret(16)}`);
console.log(`NEXTAUTH_SECRET=${generateSecret(32)}`);
console.log(`GOOGLE_CLIENT_ID=your-google-client-id-here`);
console.log(`GOOGLE_CLIENT_SECRET=your-google-client-secret-here`);

console.log('\n==========================================');
console.log('Database Configuration');
console.log('==========================================');
console.log(`DATABASE_URL=${generateDatabaseUrl()}`);

console.log('\n==========================================');
console.log('Payment Processing (Stripe)');
console.log('==========================================');
console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_${generateApiKey().replace(/_/g, '')}`);
console.log(`STRIPE_SECRET_KEY=sk_test_${generateApiKey().replace(/_/g, '')}`);
console.log(`STRIPE_WEBHOOK_SECRET=whsec_${generateApiKey().replace(/_/g, '')}`);

console.log('\n==========================================');
console.log('Email Service (Resend)');
console.log('==========================================');
console.log(`RESEND_API_KEY=re_${generateApiKey().replace(/_/g, '')}`);
console.log('EMAIL_FROM=PG Closets <noreply@pgclosets.com>');
console.log('EMAIL_REPLY_TO=info@pgclosets.com');
console.log('ADMIN_EMAIL=admin@pgclosets.com');

console.log('\n==========================================');
console.log('Cache Configuration (Redis/Upstash)');
console.log('==========================================');
console.log('REDIS_URL=https://your-redis-url.upstash.io');
console.log(`REDIS_TOKEN=${generateSecret(32)}`);

console.log('\n==========================================');
console.log('External Services');
console.log('==========================================');
console.log(`OPENAI_API_KEY=sk-${generateApiKey().replace(/_/g, '')}`);
console.log('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key');

console.log('\n==========================================');
console.log('Analytics');
console.log('==========================================');
console.log(`NEXT_PUBLIC_GA_MEASUREMENT_ID=${generateGoogleAnalyticsId()}`);
console.log(`NEXT_PUBLIC_GA_ID=${generateGoogleAnalyticsId()}`);
console.log(`NEXT_PUBLIC_GTM_ID=${generateGtmId()}`);

console.log('\n==========================================');
console.log('Error Tracking (Sentry)');
console.log('==========================================');
console.log(`SENTRY_DSN=https://${generateApiKey()}@o123456.ingest.sentry.io/1234567`);
console.log(`NEXT_PUBLIC_SENTRY_DSN=https://${generateApiKey()}@o123456.ingest.sentry.io/1234567`);

console.log('\n==========================================');
console.log('Admin & Development');
console.log('==========================================');
console.log(`ADMIN_DASHBOARD_KEY=admin-${generateApiKey().replace(/_/g, '')}`);

console.log('\n==========================================');
console.log('Instructions');
console.log('==========================================');
console.log('1. Copy the values above into your .env.local file');
console.log('2. Replace placeholder values with actual API keys');
console.log('3. For production, generate new secrets for security');
console.log('4. Never commit .env.local to version control');
console.log('\n📝 For detailed setup instructions, see ENVIRONMENT_SETUP.md');