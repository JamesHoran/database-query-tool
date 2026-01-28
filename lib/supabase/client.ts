'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

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

export function getSupabaseBrowserClient() {
  if (!supabaseClient) {
    try {
      const { url, key } = validateEnvVars();
      supabaseClient = createBrowserClient<Database>(url, key);
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }
  return supabaseClient;
}

// Convenience export
export function getSupabaseClient() {
  return getSupabaseBrowserClient();
}
