import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// Sandboxed environments with a pre-installed Chromium can point tests at it
// instead of downloading browsers (e.g. Claude Code on the web sets this to
// /opt/pw-browsers/chromium-*/chrome-linux/chrome).
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
const chromiumLaunchOptions = chromiumExecutablePath
  ? // Sandboxed containers typically run as root; Chromium refuses to start
    // without --no-sandbox there. Only applied when the override is set.
    { launchOptions: { executablePath: chromiumExecutablePath, args: ['--no-sandbox'] } }
  : {}

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers.
     Desktop projects skip the mobile-emulation spec (it relies on touch /
     isMobile, which e.g. desktop Firefox does not support); mobile projects
     run ONLY that spec, since desktop-oriented specs interact with nav
     elements that are hidden at mobile breakpoints. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ...chromiumLaunchOptions },
      testIgnore: /mobile\.spec\.ts/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /mobile\.spec\.ts/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /mobile\.spec\.ts/,
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'], ...chromiumLaunchOptions },
      testMatch: /mobile\.spec\.ts/,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],

  /* Local runs reuse the dev server for fast iteration; CI builds and serves
     the production bundle so E2E exercises what actually ships. */
  webServer: {
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
})
