import { test, expect, type Page } from '@playwright/test';

/** サイドメニューのリンク（例: `/blog/tags/react`）を、記事のあるタグ・カテゴリー・年の一覧として取り出す */
async function firstAsideLink(page: Page, prefix: string) {
  await page.goto('/blog/');
  await page.locator('a:has(article)').first().waitFor();
  const postHref = await page.locator('a:has(article)').first().getAttribute('href');
  await page.goto(postHref!);

  const href = await page.locator(`aside a[href^="${prefix}"]`).first().getAttribute('href');
  expect(href).toBeTruthy();
  return href!.replace(/\/$/, '');
}

for (const { name, prefix } of [
  { name: 'タグ別', prefix: '/blog/tags/' },
  { name: 'カテゴリー別', prefix: '/blog/categories/' },
  { name: '年別アーカイブ', prefix: '/blog/archive/' },
]) {
  test(`${name}一覧: 1 ページ目は表示され、記事数を超えるページ番号や不正な番号は 404 になる`, async ({
    page,
  }) => {
    const base = await firstAsideLink(page, prefix);

    const first = await page.goto(`${base}/page/1/`);
    expect(first?.status()).toBe(200);
    await expect(page.locator('a:has(article)').first()).toBeVisible();

    // 1 ページ 12 件なので、999 ページ目はどのタグ・カテゴリー・年でも記事数を超える
    const outOfRange = await page.goto(`${base}/page/999/`);
    expect(outOfRange?.status()).toBe(404);

    const invalid = await page.goto(`${base}/page/abc/`);
    expect(invalid?.status()).toBe(404);
  });
}
