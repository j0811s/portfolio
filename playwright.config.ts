import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  reporter: [
    ['html', { open: 'on-failure' }],
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      timeout: 120 * 1000,
      // reuseExistingServer: !process.env.CI,
    }
  ],
  use: {
    baseURL: 'http://localhost:3000/',
    headless: true,
    trace: 'on-first-retry',
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
      testMatch: /auth\/page\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // ログイン済み
    {
      name: 'Desktop Chrome',
      testIgnore: /auth\/page\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
    {
      name: 'Desktop Safari',
      testIgnore: /auth\/page\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
    {
      name: 'iPhone 15',
      testIgnore: /auth\/page\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['iPhone 15'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
    {
      name: 'Pixel 7',
      testIgnore: /auth\/page\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 7'],
        storageState: 'playwright/.auth/storageState.json',
      },
    },
  ],
});
