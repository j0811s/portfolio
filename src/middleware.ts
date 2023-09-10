import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}

function middleware(req: NextRequest): NextResponse {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (process.env.NODE_ENV === 'production' && basicAuth) {
    const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
    const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;
    const authValue = basicAuth.split(' ')[1] ?? '';
    const [user, pwd] = atob(authValue).split(':');

    if (user === BASIC_AUTH_USER && pwd === BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  url.pathname = '/api/basic-auth';

  return NextResponse.rewrite(url);
}

export { middleware };