import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME, verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const auth = token ? await verifyToken(token) : null;

  const isAdminPath = pathname.startsWith('/admin');
  const isMyBookings = pathname.startsWith('/my-bookings');

  if (!auth) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && auth.role !== 'admin') {
    const home = request.nextUrl.clone();
    home.pathname = '/';
    home.search = '';
    return NextResponse.redirect(home);
  }

  void isMyBookings;
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/my-bookings/:path*'],
};
