#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Database Initialization Script\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found. Please create it from .env.example');
  process.exit(1);
}

// Read DATABASE_URL from .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
if (!dbUrlMatch) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const dbUrl = dbUrlMatch[1].trim();
console.log(`📡 Database URL: ${dbUrl.replace(/\/\/.*@/, '//***:***@')}`);

// Determine database type from URL
let dbType = 'unknown';
if (dbUrl.startsWith('postgresql://')) {
  dbType = 'postgresql';
} else if (dbUrl.startsWith('file:')) {
  dbType = 'sqlite';
} else if (dbUrl.startsWith('mysql://')) {
  dbType = 'mysql';
}

console.log(`🗄️  Database type: ${dbType}\n`);

try {
  // Step 1: Generate Prisma Client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Step 2: Push database schema (development) or check if migrations exist
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n🚀 Pushing database schema...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('✅ Database schema pushed successfully');
    } catch (error) {
      console.error('❌ Failed to push database schema');
      console.error('\n💡 Possible solutions:');
      console.error('   1. Make sure your database server is running');
      console.error('   2. Check if the DATABASE_URL is correct');
      console.error('   3. Verify user permissions');
      console.error('   4. For local development, consider using SQLite:');
      console.error('      DATABASE_URL="file:./dev.db"');
      process.exit(1);
    }
  }

  // Step 3: Run seed script if it exists
  const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
  if (fs.existsSync(seedPath) && process.env.NODE_ENV !== 'production') {
    console.log('\n🌱 Running database seed...');
    try {
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.warn('⚠️  Database seed failed (this is okay for existing databases)');
    }
  }

  console.log('\n🎉 Database initialization complete!');
  console.log('\n📝 Next steps:');
  console.log('   • Run `npm run dev` to start the development server');
  console.log('   • Visit http://localhost:3000 to view the application');

} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  process.exit(1);
}