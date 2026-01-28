import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Validates that required environment variables are set
 * @throws {Error} If required environment variables are missing
 */
function validateEnvVars(): {
  url: string;
  key: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please check your .env.local file or Vercel environment variables.'
    );
  }
  if (!key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please check your .env.local file or Vercel environment variables.'
    );
  }

  return { url, key };
}

export async function getSupabaseServerClient() {
  try {
    const { url, key } = validateEnvVars();
    const cookieStore = await cookies();

    return createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    });
  } catch (error) {
    console.error('Failed to initialize Supabase server client:', error);
    throw error;
  }
}
