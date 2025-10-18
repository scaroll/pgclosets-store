import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type FallbackResponse<T = unknown> = Promise<{
  data: T | null;
  error: { message: string };
}>;

const createFallbackClient = () => {
  const buildResponse = <T = unknown>(): FallbackResponse<T> =>
    Promise.resolve({
      data: null,
      error: { message: "Supabase not configured" },
    });

  return {
    from: () => ({
      select: () => ({
        limit: () => buildResponse(),
      }),
      insert: () => buildResponse(),
      upsert: () => buildResponse(),
      update: () => buildResponse(),
      delete: () => buildResponse(),
    }),
  } as any;
};

export async function createClient() {
  const cookieStore = await cookies();

  // Fallback for when Supabase is not configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.warn("Supabase not configured, using fallback client");
    return createFallbackClient();
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
