import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog/');
  await page.locator('article').first().waitFor();
  await page.locator('article').first().click();
  await expect(page).toHaveURL(/\/blog\/.+\//);
});

test('記事タイトル（h1）が表示される', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('パンくずリストが表示される', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'トップページ' }).first()).toBeVisible();
  await expect(page.locator('nav').getByRole('link', { name: '投稿' }).first()).toBeVisible();
});

test('「一覧へ戻る」ボタンが表示され、クリックすると /blog/ へ遷移する', async ({ page }) => {
  const backButton = page.getByRole('link', { name: '一覧へ戻る' });
  await expect(backButton).toBeVisible();

  await backButton.click();

  await page.waitForURL('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
});

test('サイドバーが表示される', async ({ page }) => {
  await expect(page.getByText('カテゴリー')).toBeVisible();
});
