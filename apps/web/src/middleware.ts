import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_EMAIL_COOKIE, ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from '@/lib/admin/constants';
import { isAllowedMockAdminEmail, normalizeAdminEmail } from '@/lib/admin/mockAdmins';

function readAdminEmailCookie(request: NextRequest): string | null {
  const raw = request.cookies.get(ADMIN_EMAIL_COOKIE)?.value;
  if (!raw) return null;
  try {
    return normalizeAdminEmail(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const email = readAdminEmailCookie(request);

  if (
    session !== ADMIN_SESSION_VALUE ||
    !email ||
    !isAllowedMockAdminEmail(email)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
