import { test, expect } from '@playwright/test';

test('「投稿」見出しが表示される', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
});

test('パンくずリストが表示される', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByRole('link', { name: 'トップページ' }).first()).toBeVisible();
});

test('記事カードが1件以上表示される', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.locator('article').first()).toBeVisible();
});

test('サイドバーのカテゴリー一覧が表示される', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByText('カテゴリー')).toBeVisible();
});

test('サイドバーのタグ一覧が表示される', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.locator('aside').getByText('タグ')).toBeVisible();
});

test('記事カードをクリックすると記事詳細ページへ遷移する', async ({ page }) => {
  await page.goto('/blog/');

  const articleLink = page.locator('a:has(article)').first();
  await articleLink.waitFor();
  await Promise.all([
    page.waitForURL(/\/blog\/.+\//, { timeout: 15000 }),
    articleLink.evaluate((el) => (el as HTMLAnchorElement).click()),
  ]);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});
