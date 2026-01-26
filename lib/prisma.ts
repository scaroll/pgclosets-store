// Prisma proxy stub for optional database
import { PrismaClient } from '@prisma/client'

/**
 * In production we expect a real database. However, many routes are read-only and
 * should not crash the site when DATABASE_URL is missing. We provide a lightweight
 * stub that returns empty results for reads and throws for writes so the site can
 * continue rendering marketing pages without a DB.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL)

interface StubModel {
  findMany: () => Promise<unknown[]>
  findUnique: () => Promise<null>
  findFirst: () => Promise<null>
  count?: () => Promise<number>
  create: () => Promise<never>
  update?: () => Promise<never>
  delete?: () => Promise<never>
  insert?: () => Promise<never>
}

interface StubPrismaClient {
  product: StubModel
  category: StubModel
  review: StubModel
  user: StubModel
  order: StubModel
  booking: StubModel
  appointment: StubModel
  testimonial: StubModel
  blogPost: StubModel
  blockedDate: StubModel
  $disconnect: () => Promise<void>
  [key: string]: unknown
}

const createStub = (): StubPrismaClient => ({
  product: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
    update: () => Promise.reject(new Error('DATABASE_URL not configured')),
    delete: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  category: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  review: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  user: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  order: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  booking: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  appointment: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
    update: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  testimonial: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  blogPost: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    update: () => Promise.reject(new Error('DATABASE_URL not configured')),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
    delete: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  blockedDate: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.reject(new Error('DATABASE_URL not configured')),
  },
  $disconnect: () => Promise.resolve(),
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = hasDatabase
  ? globalForPrisma.prisma || new PrismaClient()
  : (createStub() as unknown as PrismaClient)

if (hasDatabase && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
