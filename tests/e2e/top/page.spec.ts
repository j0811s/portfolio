import { test, expect } from '@playwright/test';

test('「投稿を見る」をクリックで「/blog/」に遷移する', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: '投稿を見る' }).first().click();

  await page.waitForURL('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
});
