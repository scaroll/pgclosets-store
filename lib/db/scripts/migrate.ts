import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { getDb, closeDb } from '../index'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Migration runner script
 *
 * Usage:
 *   npx tsx lib/db/scripts/migrate.ts
 */

async function runMigrations() {
  const db = getDb()
  const migrationsFolder = path.join(__dirname, '../../../drizzle')

  console.log('Running database migrations...')
  console.log(`Migrations folder: ${migrationsFolder}`)

  await migrate(db, { migrationsFolder })

  console.log('Migrations completed successfully!')

  closeDb()
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
