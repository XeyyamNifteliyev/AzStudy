import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    locale: "en-US",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-rtl-ar",
      use: { ...devices["Desktop Chrome"], locale: "ar" },
    },
    // QA-6: cross-browser smoke coverage. Only smoke.spec + core-web-vitals run
    // here so the suite stays fast while still catching engine-specific issues.
    {
      name: "firefox-smoke",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /smoke\.spec\.ts|core-web-vitals\.spec\.ts/,
    },
    {
      name: "webkit-smoke",
      use: { ...devices["Desktop Safari"] },
      testMatch: /smoke\.spec\.ts|core-web-vitals\.spec\.ts/,
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { DEV_AUTH_ENABLED: "1" },
  },
});
