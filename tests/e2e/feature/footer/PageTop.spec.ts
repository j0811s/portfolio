import { test, expect } from '@playwright/test';

test('初期状態ではページトップボタンが非表示', async ({ page }) => {
  await page.goto('/blog/');

  const button = page.getByRole('button', { name: 'ページトップへ戻る' });
  await expect(button).toBeHidden();
});

const scrollDown = async (page: import('@playwright/test').Page) => {
  // React のハイドレーション完了を待ってからスクロール
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    const y = Math.min(300, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, Math.max(y, 100));
    window.dispatchEvent(new Event('scroll'));
  });
};

test('スクロール後にページトップボタンが表示される', async ({ page }) => {
  await page.goto('/blog/');

  await scrollDown(page);
  await page.waitForFunction(
    () => (window.scrollY || document.documentElement.scrollTop) >= 66,
    { timeout: 10000 }
  );
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')));

  const button = page.getByRole('button', { name: 'ページトップへ戻る' });
  await expect(button).toBeVisible();
});

test('ページトップボタンをクリックするとページ上部へスクロールする', async ({ page }) => {
  await page.goto('/blog/');

  await scrollDown(page);
  await page.waitForFunction(
    () => (window.scrollY || document.documentElement.scrollTop) >= 66,
    { timeout: 10000 }
  );
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')));

  const button = page.getByRole('button', { name: 'ページトップへ戻る' });
  await expect(button).toBeVisible();
  await button.click();

  await expect(button).toBeHidden({ timeout: 10000 });
});
