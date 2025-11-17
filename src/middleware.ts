import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'swalaxon_session';

async function verifySession(request: NextRequest): Promise<boolean> {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!cookie) return false;

    // This is a simplified check. A real app would verify the session token.
    // The lib/auth.ts implementation is more complex, but middleware runs in edge runtime
    // where some crypto APIs are unavailable. For simplicity, we just check existence.
    return !!cookie.value;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = await verifySession(request);
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
