import { test, expect } from '@playwright/test';

test('「メニューを開く」ボタンが表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'メニューを開く' })).toBeVisible();
});

test('ボタンをクリックするとドロワーが開く', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'メニューを開く' }).click();

  await expect(page.locator('dialog')).toBeVisible();
});

test('ドロワー内にナビゲーションリンクが表示される', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'メニューを開く' }).click();
  await expect(page.locator('dialog')).toBeVisible();

  const drawer = page.locator('dialog');
  await expect(drawer.getByRole('link', { name: /トップページ/ })).toBeVisible();
  await expect(drawer.getByRole('link', { name: /投稿/ })).toBeVisible();
  await expect(drawer.getByRole('link', { name: /GitHub/ })).toBeVisible();
});

test('「閉じる」ボタンをクリックするとドロワーが閉じる', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'メニューを開く' }).click();
  await expect(page.locator('dialog')).toBeVisible();

  await page.getByRole('button', { name: /閉じる/ }).click();

  await expect(page.locator('dialog')).not.toBeVisible();
});

test('Escape キーでドロワーが閉じる', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'メニューを開く' }).click();
  await expect(page.locator('dialog')).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.locator('dialog')).not.toBeVisible();
});

test('ドロワーのリンクをクリックするとページ遷移する', async ({ page }) => {
  await page.goto('/blog/');

  await page.getByRole('button', { name: 'メニューを開く' }).click();
  await expect(page.locator('dialog')).toBeVisible();

  await page.locator('dialog').getByRole('link', { name: /トップページ/ }).click();

  await page.waitForURL('/');
});
