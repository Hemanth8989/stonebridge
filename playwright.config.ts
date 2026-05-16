import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'supplier-chromium',
      testDir: './e2e/specs/supplier',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174',
        storageState: 'e2e/.auth/supplier.json',
      },
    },
    {
      name: 'supplier-firefox',
      testDir: './e2e/specs/supplier',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5174',
        storageState: 'e2e/.auth/supplier.json',
      },
    },
    {
      name: 'fabricator-chromium',
      testDir: './e2e/specs/fabricator',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
        storageState: 'e2e/.auth/fabricator.json',
      },
    },
    {
      name: 'fabricator-firefox',
      testDir: './e2e/specs/fabricator',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5173',
        storageState: 'e2e/.auth/fabricator.json',
      },
    },
    {
      name: 'fabricator-mobile',
      testDir: './e2e/specs/fabricator',
      use: {
        ...devices['iPhone 14'],
        baseURL: 'http://localhost:5173',
        storageState: 'e2e/.auth/fabricator.json',
      },
    },
    {
      name: 'cross-portal',
      testDir: './e2e/specs/cross-portal',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'setup',
      testDir: './e2e/specs',
      testMatch: '**/*.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter=@sb/fabricator dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm --filter=@sb/supplier dev',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
  globalSetup: './e2e/fixtures/global-setup.ts',
  outputDir: 'test-results',
});
