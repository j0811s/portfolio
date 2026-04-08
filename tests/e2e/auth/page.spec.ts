import { test, expect } from '@playwright/test';

test('誤ったIDとパスワードを入力するとエラーメッセージが表示される', async ({ page }) => {
  await page.goto('/auth/?callbackUrl=%2F');
  await page.getByRole('textbox', { name: 'ID' }).click();
  await page.getByRole('textbox', { name: 'ID' }).fill('aa');
  await page.getByRole('textbox', { name: 'パスワード' }).click();
  await page.getByRole('textbox', { name: 'パスワード' }).fill('aa');
  await page.getByRole('button', { name: 'ログイン' }).click();

  await expect(page.getByRole('paragraph')).toContainText('IDまたはパスワードが間違っています');
});

test('正しいIDとパスワードを入力するとTOPに遷移する', async ({ page }) => {
  await page.goto('/auth/?callbackUrl=%2F');
  await page.getByRole('textbox', { name: 'ID' }).click();
  await page.getByRole('textbox', { name: 'ID' }).fill(process.env.AUTH_USERNAME ?? '');
  await page.getByRole('textbox', { name: 'パスワード' }).click();
  await page.getByRole('textbox', { name: 'パスワード' }).fill(process.env.AUTH_PASSWORD ?? '');
  await page.getByRole('button', { name: 'ログイン' }).click();

  await page.waitForURL('/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '経験' })).toBeVisible();
});
