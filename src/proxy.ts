import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: '/((?!api|auth|_next/static|_next/image|favicon.ico).*)',
}

async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/auth', req.url);

    // 元いたURLを保持するために追加
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default proxy;
