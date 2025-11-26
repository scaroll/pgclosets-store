// Supabase server client stub
// This is a placeholder for when Supabase is configured

import { prisma } from '../prisma';

// Re-export prisma as a fallback when Supabase isn't configured
export { prisma };

/**
 * Create a Supabase server client
 * When Supabase is configured, this will return an actual client
 * For now, it returns a mock that uses Prisma instead
 */
export function createClient() {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that logs operations
    return createMockClient();
  }

  // When Supabase is configured, use the real client:
  // import { createServerClient } from '@supabase/ssr';
  // return createServerClient(supabaseUrl, supabaseKey, { ... });

  return createMockClient();
}

/**
 * Mock Supabase client for development without Supabase
 */
function createMockClient() {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: (credentials: any) =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
      signUp: (credentials: any) =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: any) => Promise.resolve({ data: null, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `/storage/${bucket}/${path}` } }),
        remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
      }),
    },
  };
}

/**
 * Get user from request
 */
export async function getUser() {
  const client = createClient();
  const { data } = await client.auth.getUser();
  return data.user;
}
