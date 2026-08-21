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

test('検索キーワードを入力すると結果が絞り込まれる', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
  await page.waitForLoadState('networkidle');

  const input = page.getByPlaceholder('キーワードで検索');
  await input.fill('Next.js');

  await expect(page).toHaveURL(/\/blog\/\?q=Next\.js/);
  await expect(page.getByRole('heading', { name: /Next\.js/, level: 1 })).toBeVisible();
});

test('0件になるキーワードを入力すると空メッセージが表示される', async ({ page }) => {
  await page.goto('/blog/');
  await page.waitForLoadState('networkidle');

  const input = page.getByPlaceholder('キーワードで検索');
  await input.fill('zzzzzzzzzz-nonexistent-keyword-zzzzzzzzzz');

  await expect(page.getByText('に一致する記事が見つかりませんでした。')).toBeVisible();
});

test('ページ番号をクリックすると遷移せず次のページが表示される', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: '2' }).click();

  await expect(page).toHaveURL(/\/blog\/\?page=2/);
});

test('/blog/page/2/ は /blog/?page=2 へリダイレクトされる', async ({ page }) => {
  await page.goto('/blog/page/2/');

  await expect(page).toHaveURL(/\/blog\/\?page=2/);
});
