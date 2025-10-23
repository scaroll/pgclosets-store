#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dbType = args[0];

if (!dbType || !['postgresql', 'sqlite'].includes(dbType)) {
  console.error('Usage: node scripts/switch-database.js [postgresql|sqlite]');
  process.exit(1);
}

const prismaDir = path.join(process.cwd(), 'prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');
const envPath = path.join(process.cwd(), '.env.local');

console.log(`🔄 Switching to ${dbType} database...`);

try {
  // Backup current schema
  if (fs.existsSync(schemaPath)) {
    fs.copyFileSync(schemaPath, path.join(prismaDir, 'schema.prisma.backup'));
    console.log('📦 Backed up current schema');
  }

  // Copy appropriate schema
  const sourceSchema = dbType === 'sqlite'
    ? path.join(prismaDir, 'schema-sqlite.prisma')
    : path.join(prismaDir, 'schema.prisma');

  if (!fs.existsSync(sourceSchema)) {
    console.error(`❌ Schema file not found: ${sourceSchema}`);
    process.exit(1);
  }

  fs.copyFileSync(sourceSchema, schemaPath);
  console.log(`✅ Switched to ${dbType} schema`);

  // Update .env.local if SQLite
  if (dbType === 'sqlite') {
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Comment out PostgreSQL DATABASE_URL and add SQLite one
    envContent = envContent.replace(
      /^DATABASE_URL=postgresql:.*$/m,
      '# DATABASE_URL=postgresql://user:password@localhost:5432/pgclosets'
    );

    if (!envContent.includes('DATABASE_URL=file:')) {
      envContent += '\nDATABASE_URL=file:./dev.db';
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env.local for SQLite');
  }

  console.log('\n🎉 Database switch complete!');
  console.log('\n📝 Next steps:');
  console.log(`   • npx prisma generate`);
  console.log(`   • npx prisma db push`);
  console.log(`   • npm run dev`);

} catch (error) {
  console.error('❌ Failed to switch database:', error.message);
  process.exit(1);
}