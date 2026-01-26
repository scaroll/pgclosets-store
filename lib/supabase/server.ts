// Supabase server client stub
// This is a placeholder for when Supabase is configured

import { prisma } from '../prisma';

// Re-export prisma as a fallback when Supabase isn't configured
export { prisma };

interface MockAuthUser {
  id: string | null
  email?: string | null
}

interface MockAuthResponse {
  data: {
    user: MockAuthUser | null
    session: unknown | null
  }
  error: { message: string } | null
}

interface MockDataResponse<T = unknown> {
  data: T | null
  error: null
}

interface MockQueryBuilder {
  eq: (_column: string, _value: unknown) => Promise<MockDataResponse>
  single: () => Promise<MockDataResponse<null>>
  order: (_column: string, _options?: unknown) => Promise<MockDataResponse>
  limit: (_count: number) => Promise<MockDataResponse>
}

interface MockTable {
  select: (_columns?: string) => MockQueryBuilder
  insert: (_data: unknown) => Promise<MockDataResponse<null>>
  update: (_data: unknown) => {
    eq: (_column: string, _value: unknown) => Promise<MockDataResponse<null>>
  }
  delete: () => {
    eq: (_column: string, _value: unknown) => Promise<MockDataResponse<null>>
  }
}

interface MockStorageBucket {
  upload: (_path: string, _file: unknown) => Promise<MockDataResponse<null>>
  getPublicUrl: (_path: string) => { data: { publicUrl: string } }
  remove: (_paths: string[]) => Promise<MockDataResponse<null>>
}

interface MockSupabaseClient {
  from: (_table: string) => MockTable
  auth: {
    getUser: () => Promise<MockAuthResponse>
    signInWithPassword: (_credentials: unknown) => Promise<MockAuthResponse>
    signUp: (_credentials: unknown) => Promise<MockAuthResponse>
    signOut: () => Promise<{ error: null }>
  }
  storage: {
    from: (_bucket: string) => MockStorageBucket
  }
}

/**
 * Create a Supabase server client
 * When Supabase is configured, this will return an actual client
 * For now, it returns a mock that uses Prisma instead
 */
export function createClient(): MockSupabaseClient {
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
function createMockClient(): MockSupabaseClient {
  return {
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
      signUp: () =>
        Promise.resolve({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: `/storage/${_path}` } }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  };
}

/**
 * Get user from request
 */
export async function getUser(): Promise<MockAuthUser | null> {
  const client = createClient();
  const { data } = await client.auth.getUser();
  return data.user;
}
