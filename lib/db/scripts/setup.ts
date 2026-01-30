import { getDb, closeDb } from '../index'
import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Database setup script
 * Creates tables and optionally runs migrations
 *
 * Usage:
 *   npx tsx lib/db/scripts/setup.ts          # Create tables only
 *   npx tsx lib/db/scripts/setup.ts --migrate # Run migrations
 */

async function setup() {
  const db = getDb()
  const args = process.argv.slice(2)
  const shouldMigrate = args.includes('--migrate')

  console.log('Setting up database...')

  if (shouldMigrate) {
    // Run Drizzle migrations
    const migrationsFolder = path.join(__dirname, '../../../drizzle')
    console.log(`Running migrations from ${migrationsFolder}...`)
    await migrate(db, { migrationsFolder })
    console.log('Migrations completed')
  } else {
    // Create tables directly using SQL
    console.log('Creating tables...')

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `)

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        images TEXT DEFAULT '[]',
        featured INTEGER NOT NULL DEFAULT 0,
        in_stock INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (category) REFERENCES categories(slug)
      )
    `)

    console.log('Tables created successfully')
  }

  // Verify tables exist
  const tables = await db.all(sql`
    SELECT name FROM sqlite_master WHERE type='table' AND name IN ('categories', 'products')
  `)
  console.log(`Verified tables: ${tables.map((t: any) => t.name).join(', ')}`)

  console.log('Database setup completed!')

  closeDb()
}

setup().catch((error) => {
  console.error('Setup failed:', error)
  process.exit(1)
})
