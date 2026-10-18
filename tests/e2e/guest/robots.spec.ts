import { test, expect } from '@playwright/test';

test('未ログインでも robots.txt を取得でき、AI クローラーを拒否している', async ({ request }) => {
  const res = await request.get('/robots.txt', { maxRedirects: 0 });

  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/plain');
  const body = await res.text();
  expect(body).toMatch(/User-Agent: GPTBot\s+Disallow: \//);
  expect(body).toMatch(/User-Agent: ClaudeBot\s+Disallow: \//);
  expect(body).not.toContain('Sitemap:');
});

test('未ログインでは sitemap.xml を取得できず、ログイン画面へリダイレクトされる', async ({ request }) => {
  const res = await request.get('/sitemap.xml', { maxRedirects: 0 });

  expect(res.status()).toBe(307);
  expect(res.headers().location).toContain('/auth');
  expect(res.headers().location).toContain('callbackUrl=%2Fsitemap.xml');
});
