import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: Client-side auth is handled by AuthProvider
  // This middleware only handles static redirects and prevents caching issues
  
  const { pathname } = request.nextUrl;

  // Allow all requests to pass through
  // Auth checks are done client-side by AuthProvider and dashboard layout
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
};
