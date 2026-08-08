import { test, expect } from '@playwright/test';

test('オフライン時にフォールバックページが表示される', async ({ page, context }) => {
  await page.goto('/');

  // Service Workerのインストールと/offline/のプリキャッシュ完了を待つ
  // (next.config.tsのtrailingSlash: trueにより/offlineは308で/offline/にリダイレクトされるため、
  //  末尾スラッシュ付きのURLでキャッシュする。Task 2の実装検証で判明した)
  await page.waitForFunction(async () => {
    if (!('caches' in window)) return false;
    const cache = await caches.open('static-v1');
    const match = await cache.match('/offline/');
    return !!match;
  });

  await context.setOffline(true);
  try {
    await page.goto('/');
    await expect(page.getByText('オフラインです')).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
