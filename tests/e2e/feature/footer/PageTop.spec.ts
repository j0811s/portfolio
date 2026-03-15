import { test, expect } from '@playwright/test';

test('初期状態ではページトップボタンが非表示', async ({ page }) => {
  await page.goto('/blog/');

  const button = page.getByRole('button', { name: 'ページトップへ戻る' });
  await expect(button).toBeHidden();
});

test('スクロール後にページトップボタンが表示される', async ({ page }) => {
  await page.goto('/blog/');

  await page.evaluate(() => window.scrollTo(0, 300));

  const button = page.getByRole('button', { name: 'ページトップへ戻る' });
  await expect(button).toBeVisible();
});

test('ページトップボタンをクリックするとページ上部へスクロールする', async ({ page }) => {
  await page.goto('/blog/');

  await page.evaluate(() => window.scrollTo(0, 500));

  await page.getByRole('button', { name: 'ページトップへ戻る' }).click();

  await expect(page).toHaveURL('/blog/');
  await page.waitForFunction(() => window.scrollY < 100);
});
