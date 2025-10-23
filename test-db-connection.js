#!/usr/bin/env node

// Test database connection
require('dotenv').config({ path: '.env.local' });

const { testDatabaseConnection, checkDatabaseHealth } = require('./lib/db.ts');

async function main() {
  console.log('🔍 Testing database connection...\n');

  try {
    const isConnected = await testDatabaseConnection();

    if (isConnected) {
      console.log('🎉 Database connection test passed!');

      const health = await checkDatabaseHealth();
      console.log('📊 Database health:', health);

      console.log('\n✅ Database is ready for use!');
    } else {
      console.error('❌ Database connection test failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database test error:', error.message);
    process.exit(1);
  }
}

main();