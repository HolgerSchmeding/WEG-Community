import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is currently a placeholder.
// It can be used in the future to protect routes based on
// user authentication status.
//
// For example, you could check for a valid session cookie
// and redirect unauthenticated users to a login page.

export function middleware(request: NextRequest) {
  // const isAuthenticated = false; // Replace with actual auth check
  // if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  return NextResponse.next();
}

export const config = {
  // Matcher specifying which paths to run the middleware on.
  // Adjust this to match your protected routes.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
