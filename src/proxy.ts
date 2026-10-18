import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher:
    // 前方一致で公開範囲が広がらないよう、ディレクトリは「/」か終端、ファイルは「.」をエスケープして終端で区切る。
    // 追加・変更したら tests/e2e/guest/proxy-matcher.spec.ts の PUBLIC_PATHS / LOOKALIKE_PATHS も更新する
    '/((?!api/|api$|auth/|auth$|offline/|offline$|robots\\.txt$|manifest\\.webmanifest$|icon-192\\.png$|icon-maskable-512\\.png$|logo\\.png$|sw\\.js$|favicon\\.ico$|_next/static/|_next/image/|_next/image$).*)',
};

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
