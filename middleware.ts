import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    // Log the error for debugging
    console.error('Root middleware error:', error);

    // Always return a response to prevent MIDDLEWARE_INVOCATION_FAILED
    // This ensures the app continues to work even if auth middleware fails
    return NextResponse.next({
      request,
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
