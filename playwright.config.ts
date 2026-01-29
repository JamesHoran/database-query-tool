import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 6,
  reporter: 'html',
  use: {
    baseURL: process.env.BASEURL || 'http://localhost:3001',
    trace: 'on-first-retry',
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Skip webServer when testing production (BASEURL is set)
  ...(process.env.BASEURL ? {} : {
    webServer: {
      command: 'PORT=3001 pnpm run dev',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.UI_MODE,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
      },
    },
  }),
});
