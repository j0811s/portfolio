import { test, expect } from '@playwright/test';

// src/proxy.ts の matcher で認証の対象外にしているパスは、そのものだけが未ログインで取得でき、
// 同じ文字列で始まる別のパスは認証の対象のままであること（前方一致による公開範囲の拡大を防ぐ）

const PUBLIC_PATHS = [
  '/auth/',
  '/api/auth/csrf/',
  '/offline/',
  '/sw.js',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-maskable-512.png',
  '/logo.png',
  '/favicon.ico',
  '/robots.txt',
];

const LOOKALIKE_PATHS = [
  // 末尾に文字を足したもの（終端の固定を検証）
  '/authx/',
  '/apix/',
  '/offline-x/',
  '/robots.txtx',
  '/sw.jsx',
  '/manifest.webmanifestx',
  '/icon-192.pngx',
  '/icon-maskable-512.pngx',
  '/logo.pngx',
  '/favicon.icox',
  '/_next/staticx/',
  '/_next/imagex/',
  // 「.」を別の文字に置き換えたもの（「.」のエスケープを検証）
  // 拡張子の無いパスは trailingSlash の 308 が先に返るため、末尾に「/」を付ける
  '/swxjs/',
  '/logoxpng/',
  '/favicon_ico/',
];

// trailingSlash: true のため、末尾スラッシュの無いディレクトリは認証より先に 308 で正規化される
const DIRECTORY_PATHS = ['/auth', '/offline'];

for (const path of PUBLIC_PATHS) {
  test(`未ログインで ${path} を取得できる`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 });

    expect(res.status()).toBe(200);
  });
}

for (const path of DIRECTORY_PATHS) {
  test(`${path} は /auth?callbackUrl= ではなく ${path}/ へ正規化される`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 });

    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(`${path}/`);
  });
}

for (const path of LOOKALIKE_PATHS) {
  test(`${path} は認証の対象のままで /auth へリダイレクトされる`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 });

    expect(res.status()).toBe(307);
    expect(res.headers().location).toContain('/auth');
  });
}
