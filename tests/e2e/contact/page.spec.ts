import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/contact/');
});

test('見出しとフォームが表示される', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'お問い合わせ' })).toBeVisible();
  await expect(page.getByLabel('お名前')).toBeVisible();
  await expect(page.getByLabel('メールアドレス')).toBeVisible();
  await expect(page.getByLabel('件名')).toBeVisible();
  await expect(page.getByLabel('メッセージ')).toBeVisible();
  await expect(page.getByRole('button', { name: '送信する' })).toBeVisible();
});

test('送信成功で成功メッセージが表示されフォームが消える', async ({ page }) => {
  await page.route('/api/contact', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
  });

  await page.getByLabel('お名前').fill('山田 太郎');
  await page.getByLabel('メールアドレス').fill('test@example.com');
  await page.getByLabel('件名').fill('テスト件名');
  await page.getByLabel('メッセージ').fill('テストメッセージ');
  await page.getByRole('button', { name: '送信する' }).click();

  await expect(page.getByText('送信しました。お返事をお待ちください。')).toBeVisible();
  await expect(page.getByRole('button', { name: '送信する' })).not.toBeVisible();
});

test('送信失敗でエラーメッセージが表示されフォームは残る', async ({ page }) => {
  await page.route('/api/contact', (route) => {
    route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed to send email' }) });
  });

  await page.getByLabel('お名前').fill('山田 太郎');
  await page.getByLabel('メールアドレス').fill('test@example.com');
  await page.getByLabel('件名').fill('テスト件名');
  await page.getByLabel('メッセージ').fill('テストメッセージ');
  await page.getByRole('button', { name: '送信する' }).click();

  await expect(page.getByText('送信に失敗しました。時間をおいて再度お試しください。')).toBeVisible();
  await expect(page.getByRole('button', { name: '送信する' })).toBeVisible();
});
