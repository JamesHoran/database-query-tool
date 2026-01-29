import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
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

export async function updateSession(request: NextRequest) {
  try {
    const { url, key } = validateEnvVars();

    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Optional: Add redirect logic for protected routes here
    // For now, all routes are public - authentication is optional

    return supabaseResponse;
  } catch (error) {
    // Log middleware errors for debugging but don't block the request
    console.error('Middleware error:', error);

    // Return a basic response if Supabase fails
    // This prevents MIDDLEWARE_INVOCATION_FAILED from blocking all requests
    return NextResponse.next({
      request,
    });
  }
}
