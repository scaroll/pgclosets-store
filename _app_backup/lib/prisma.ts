// @ts-nocheck - Prisma proxy stub for optional database
import { PrismaClient } from '@prisma/client'

/**
 * In production we expect a real database. However, many routes are read-only and
 * should not crash the site when DATABASE_URL is missing. We provide a lightweight
 * stub that returns empty results for reads and throws for writes so the site can
 * continue rendering marketing pages without a DB.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL)

const stub: Partial<PrismaClient> = {
  product: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    create: () => {
      throw new Error('DATABASE_URL not configured')
    },
    update: () => {
      throw new Error('DATABASE_URL not configured')
    },
  },
  category: {
    findMany: () => Promise.resolve([]),
  },
  review: {
    findMany: () => Promise.resolve([]),
    create: () => {
      throw new Error('DATABASE_URL not configured')
    },
  },
  user: {
    findUnique: () => Promise.resolve(null),
    create: () => {
      throw new Error('DATABASE_URL not configured')
    },
  },
  order: {
    create: () => {
      throw new Error('DATABASE_URL not configured')
    },
  },
  booking: {
    create: () => {
      throw new Error('DATABASE_URL not configured')
    },
    findMany: () => Promise.resolve([]),
  },
  testimonial: {
    findMany: () => Promise.resolve([]),
  },
  blogPost: {
    findMany: () => Promise.resolve([]),
  },
  $disconnect: () => Promise.resolve(),
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = hasDatabase
  ? globalForPrisma.prisma || new PrismaClient()
  : (stub as unknown as PrismaClient)

if (hasDatabase && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
