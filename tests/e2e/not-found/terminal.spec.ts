import { test, expect, type Locator, type Page } from '@playwright/test';

// ターミナルの出力は wterm の DOM（.wterm 内の .term-row）に依存して検証する。
// wterm のメジャー更新で壊れた場合は、まずこのクラス名と入力欄の aria-label を確認する。

const NOT_FOUND_PATH = '/this-page-does-not-exist/';
const PROMPT_MARK = '❯';

async function openTerminal(page: Page) {
  const response = await page.goto(NOT_FOUND_PATH);
  expect(response?.status()).toBe(404);

  const terminal = page.locator('.wterm');
  // グリーティングが描画されれば BashShell の attach まで完了している
  await expect(terminal).toContainText('HTTP 404 — Page Not Found');
  const input = page.getByRole('textbox', { name: 'Terminal' });
  return { terminal, input };
}

async function runCommand(input: Locator, command: string) {
  await input.focus();
  await input.pressSequentially(command);
  await input.press('Enter');
}

/** コマンドの出力が終わり、次のプロンプトが表示されるまで待つ */
async function waitForNextPrompt(terminal: Locator) {
  await expect(terminal.locator('.term-row').filter({ hasText: PROMPT_MARK })).toHaveCount(2);
}

test('存在しないページで 404 のターミナルが表示される', async ({ page }) => {
  const { terminal } = await openTerminal(page);

  await expect(page.getByRole('heading', { name: 'ページが見つかりませんでした' })).toBeVisible();
  await expect(terminal).toContainText('find: "requested-page": No such file or directory');
});

test('ターミナルが画面幅からはみ出さない', async ({ page }) => {
  await openTerminal(page);

  // innerWidth はモバイルで横にはみ出すと縮小表示に合わせて広がるため、layout viewport の幅（clientWidth）と比べる
  const { viewportWidth, documentWidth, windowRight } = await page.evaluate(() => {
    const terminalWindow = document.querySelector('.wterm')?.closest('[class*="window"]');
    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      windowRight: terminalWindow?.getBoundingClientRect().right ?? Number.POSITIVE_INFINITY,
    };
  });
  expect(windowRight).toBeLessThanOrEqual(viewportWidth);
  expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
});

test('ls でファイル一覧が表示される', async ({ page }) => {
  const { terminal, input } = await openTerminal(page);

  await runCommand(input, 'ls');
  await waitForNextPrompt(terminal);

  // README.md はグリーティング（Try: ls, cat README.md）にも含まれるため、ls でしか出ないファイル名で判定する
  for (const file of ['top.sh', 'blog.sh', 'contact.sh']) {
    await expect(terminal).toContainText(file);
  }
});

test('cat README.md でファイルの中身が表示される', async ({ page }) => {
  const { terminal, input } = await openTerminal(page);

  await runCommand(input, 'cat README.md');

  await expect(terminal).toContainText('Welcome! This page does not exist.');
  await expect(terminal).toContainText('bash blog.sh');
});

test('bash blog.sh で「/blog/」に遷移する', async ({ page }) => {
  const { terminal, input } = await openTerminal(page);

  await runCommand(input, 'bash blog.sh');

  await expect(terminal).toContainText('[OK] Redirecting To /blog/');
  // 出力が終わってから、遷移用のマーカーが画面に出ていないことを確認する（遷移は 1 秒後）
  await waitForNextPrompt(terminal);
  await expect(terminal).not.toContainText('WTERM_NAV:');
  await page.waitForURL('/blog/');
  await expect(page.getByRole('heading', { name: '投稿' })).toBeVisible();
});
