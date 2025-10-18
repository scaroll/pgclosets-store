import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma client instance.
// This is done to prevent creating a new client on every hot reload in development.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize the Prisma client.
// In production, a new client is created.
// In development, the global instance is used if it exists, otherwise a new one is created.
const prisma = global.prisma || new PrismaClient();

// In development, assign the created client to the global variable.
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
