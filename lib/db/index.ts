import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

/**
 * Database connection module
 *
 * Uses a single connection pattern (no pooling) as required:
 * - Local development: SQLite file database
 * - Production (Vercel): libSQL via DATABASE_URL
 *
 * Environment variables:
 * - DATABASE_URL: Full connection string (libsql:// for production, file:./ for local)
 * - Local default: file:./local.db
 */

let db: ReturnType<typeof drizzle> | null = null
let sqlite: Database.Database | null = null

export function getDb() {
  if (db) {
    return db
  }

  const databaseUrl = process.env.DATABASE_URL || 'file:./local.db'

  // For libSQL in production, we'd use @libsql/client but for serverless
  // we create a new connection per request via this function
  if (databaseUrl.startsWith('libsql://') || databaseUrl.startsWith('wss://')) {
    // libSQL/Turso for production
    const { createClient } = require('@libsql/client')
    const client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    })
    db = drizzle(client, { schema })
    return db
  }

  // Local development with SQLite file
  const dbPath = databaseUrl.replace('file:', '').replace('./', '')
  sqlite = new Database(dbPath)

  // Enable WAL mode for better concurrent access
  sqlite.pragma('journal_mode = WAL')

  db = drizzle(sqlite, { schema })
  return db
}

/**
 * Close the database connection
 * Useful for cleanup in scripts or testing
 */
export function closeDb() {
  if (sqlite) {
    sqlite.close()
    sqlite = null
    db = null
  }
}

// Export schema for use in queries
export * from './schema'
export { schema }
