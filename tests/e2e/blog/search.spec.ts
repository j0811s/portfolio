import { test, expect } from '@playwright/test';

test('検索フォームが表示される', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByRole('search')).toBeVisible();
  await expect(page.getByPlaceholder('キーワードで検索')).toBeVisible();
});

test('キーワードを入力してEnterで検索結果ページへ遷移する', async ({ page }) => {
  await page.goto('/blog/');

  await page.getByPlaceholder('キーワードで検索').fill('Next.js');
  await page.getByPlaceholder('キーワードで検索').press('Enter');

  await expect(page).toHaveURL(/\/blog\/search\/?\?q=Next\.js/);
});

test('検索結果ページに見出しと件数が表示される', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await expect(page.getByRole('heading', { name: /Next\.js/, level: 1 })).toBeVisible();
});

test('検索結果ページのフォームに入力値が残る', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await expect(page.getByPlaceholder('キーワードで検索')).toHaveValue('Next.js');
});

test('検索結果ページでリセットボタンが表示される', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await expect(page.getByRole('button', { name: 'リセット' })).toBeVisible();
});

test('リセットボタンをクリックするとブログ一覧へ戻る', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await page.getByRole('button', { name: 'リセット' }).click();

  await expect(page).toHaveURL('/blog/');
});

test('検索結果ページでパンくずリストが表示される', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await expect(page.getByRole('link', { name: '投稿' }).first()).toBeVisible();
});
