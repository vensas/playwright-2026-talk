import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the "Deploy or Die" demo.
 * See https://playwright.dev/docs/test-configuration.
 *
 * The projects divide the tests into two groups:
 *   - "mocked"      — tests that replace the API with `page.route`. These are fast.
 *   - "integration" — tests that use the real backend and a real database.
 *
 * Set SKIP_CONTAINERS=1 to prevent the container start. Use this when you run
 * only the mocked tests, because the containers need about 30 seconds.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // New in 1.62: retries run one after the other at the end of the test run.
  // A test that fails only because of parallel load thus becomes easy to find.
  retryStrategy: 'isolated',

  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3000',

    // New in 1.63: the trace records the accessibility tree and the screen
    // content in addition to the DOM. The trace viewer shows all three.
    trace: {
      mode: 'on',
      snapshots: { dom: true, aria: true, screen: true },
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  globalSetup: require.resolve('./tests/global.setup'),
  globalTeardown: require.resolve('./tests/global.teardown'),

  projects: [
    {
      name: 'mocked',
      testIgnore: /integration\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'integration',
      testMatch: /integration\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /integration\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /integration\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      testIgnore: /integration\.spec\.ts/,
      use: { ...devices['Pixel 8'] },
    },
  ],

  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
