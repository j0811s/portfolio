import { test, expect } from '@playwright/test';

test('オフライン時にフォールバックページが表示される', async ({ page, context }) => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'SW offline simulation is Chromium-only in Playwright');

  await page.goto('/');

  // Service Workerがアクティブ化し、fetchイベントを処理できる状態になるまで待つ
  // (waitForFunctionにasync述語を渡すと常にtruthyなPromiseが返り実質no-opになるため、
  //  同期的な述語でnavigator.serviceWorker.controllerを確認する。最終レビューで判明・実測検証済み)
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);

  await context.setOffline(true);
  try {
    await page.goto('/');
    await expect(page.getByText('オフラインです')).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
