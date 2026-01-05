import { test, expect } from '@playwright/test';

test('テーマカラーをトグルする（light ⇄ dark）', async ({ page }) => {
  await page.goto('/auth/?callbackUrl=%2F');

  const root = page.locator('html');

  // Arrange
  await expect(root).toHaveAttribute('data-theme', /^(light|dark)$/);
  const before = await root.getAttribute('data-theme');

  // Action
  await page.getByRole('button', { name: 'テーマカラーを変更する' }).click();

  // Assert
  const expected = before === 'light' ? 'dark' : 'light';
  await expect(root).toHaveAttribute('data-theme', expected);
});
