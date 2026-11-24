import { test, expect } from '@playwright/test';

// Service Worker によるオフラインのフォールバックを検証するため、既定のブロックを解除する
test.use({ serviceWorkers: 'allow' });

test('オフライン時にフォールバックページが表示される', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'SW offline simulation is Chromium-only in Playwright');

  await page.goto('/');

  // Service Workerがアクティブ化し、fetchイベントを処理できる状態になるまで待つ
  // (waitForFunctionにasync述語を渡すと常にtruthyなPromiseが返り実質no-opになるため、
  //  同期的な述語でnavigator.serviceWorker.controllerを確認する。最終レビューで判明・実測検証済み)
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);

  await context.setOffline(true);
  try {
    // オフライン時の遷移先は動的ルートの /blog/ にする。ISR のページ（/ など）は `next start` だと
    // `stale-while-revalidate` 付きで返るため、オフラインでもブラウザの HTTP キャッシュから表示されてしまう
    // （本番の Vercel はブラウザに `max-age=0, must-revalidate` を返すので起きない）
    await page.goto('/blog/');
    await expect(page.getByText('オフラインです')).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
