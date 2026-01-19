// Re-export prisma client from the correct location
import { prisma } from './prisma';

export { prisma };

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<{ connected: boolean; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    return { connected: true, latency };
  } catch (error) {
    return { connected: false, error: String(error) };
  }
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  connected: boolean;
  latency?: number;
  error?: string;
}> {
  const connectionResult = await testDatabaseConnection();
  return {
    healthy: connectionResult.connected && (connectionResult.latency || 0) < 1000,
    ...connectionResult,
  };
}
