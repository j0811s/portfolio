import { test, expect } from '@playwright/test';

// スクリーンリーダーの利用者が本文へ移動できるよう、オフラインページは main ランドマークを持つ
test('オフラインページの本文が main ランドマークに含まれる', async ({ page }) => {
  await page.goto('/offline/');

  const main = page.getByRole('main');
  await expect(main).toHaveCount(1);
  await expect(main).toContainText('オフラインです');
});
