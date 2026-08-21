import { test, expect } from '@playwright/test';

test('/blog/search?q=X は /blog/?q=X へリダイレクトされ結果が表示される', async ({ page }) => {
  await page.goto('/blog/search?q=Next.js');

  await expect(page).toHaveURL(/\/blog\/\?q=Next\.js/);
  await expect(page.getByRole('heading', { name: /Next\.js/, level: 1 })).toBeVisible();
});

test('/blog/search（キーワードなし）は /blog/ へリダイレクトされる', async ({ page }) => {
  await page.goto('/blog/search');

  await expect(page).toHaveURL('/blog/');
});
