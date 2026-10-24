import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const E2E_PORT = 3100;
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

// 未ログイン状態で実行するテスト（guest プロジェクトのみが対象、ログイン済みプロジェクトからは除外）
const GUEST_SPECS = /e2e\/(auth\/page|guest\/[^/]+)\.spec\.ts$/;

export default defineConfig({
  testDir: 'tests/e2e',
  reporter: [
    ['html', { open: 'on-failure' }],
  ],
  // 開発サーバーは初回アクセス時のコンパイル待ちで page.goto がタイムアウトしやすいため、
  // 本番ビルドを e2e 専用ポートで毎回起動する（手元の開発サーバーを再利用しない）
  webServer: [
    {
      command: `npm run build && npx next start -p ${E2E_PORT}`,
      url: E2E_BASE_URL,
      timeout: 300 * 1000,
      reuseExistingServer: false,
      env: {
        // dotenv で読み込んだ .env.local の NODE_ENV が引き継がれると本番ビルドが失敗するため明示する
        NODE_ENV: 'production',
        // モックが外れても本物のメールを送らないよう、Resend のキーを空にする
        RESEND_API_KEY: '',
        // ログイン後のリダイレクト先を e2e 用ポートに合わせる
        NEXTAUTH_URL: E2E_BASE_URL,
        // 本番のアナリティクスにテストのページビューを送らないよう、GTM・GA を読み込ませない
        // （外部スクリプトの読み込みで load イベントが遅れることも防ぐ）
        GA_ID: '',
        GTM_ID: '',
      },
    }
  ],
  use: {
    baseURL: `${E2E_BASE_URL}/`,
    // Service Worker がページを制御すると page.route がリクエストを横取りできず、
    // API のモックが不定期にすり抜けるため既定でブロックする（オフラインのテストのみ許可）
    serviceWorkers: 'block',
    headless: true,
    // retries を使わないため、失敗したテストのトレースを残す（on-first-retry では記録されない）
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
  },
  projects: [
    // 認証状態を作成
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    // 未ログイン（ログイン画面）
    {
      name: 'guest',
      testMatch: GUEST_SPECS,
      use: { ...devices['Desktop Chrome'] },
    },
    // ログイン済み
    {
      name: 'Desktop Chrome',
      testIgnore: GUEST_SPECS,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
    {
      name: 'Desktop Safari',
      testIgnore: GUEST_SPECS,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
    {
      name: 'iPhone 15',
      testIgnore: GUEST_SPECS,
      dependencies: ['setup'],
      use: {
        ...devices['iPhone 15'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
    {
      name: 'Pixel 7',
      testIgnore: GUEST_SPECS,
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 7'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
  ],
});
