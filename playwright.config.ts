import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/junit-e2e.xml' }],
    ['line']
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.spec\.ts$/,
      testIgnore: [
        '**/smoke.spec.ts',
        '**/visual.spec.ts',
        '**/accessibility/*.spec.ts'
      ],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['**/cross-browser.spec.ts'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['**/cross-browser.spec.ts'],
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
      testMatch: ['**/cross-browser.spec.ts'],
    },

    // Mobile Browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: ['**/quote-flow.spec.ts', '**/navigation.spec.ts', '**/product-browsing.spec.ts'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: ['**/quote-flow.spec.ts', '**/navigation.spec.ts'],
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
      testMatch: ['**/cross-browser.spec.ts'],
    },

    // Specialized Test Suites
    {
      name: 'smoke-tests',
      testMatch: '**/*.smoke.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-tests',
      testMatch: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'accessibility-tests',
      testMatch: '**/accessibility/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});