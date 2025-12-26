import { test } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'ID' }).fill('sato');
  await page.getByRole('textbox', { name: 'パスワード' }).fill('sato');
  await page.getByRole('button', { name: 'ログイン' }).click();

  await page.waitForURL('/');

  await page.context().storageState({ path: 'playwright/.auth/storageState.json' });
});
