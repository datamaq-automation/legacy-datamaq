import { defineConfig, devices } from '@playwright/test'

const E2E_PORT = 4173
const E2E_BASE_URL = `http://127.0.0.1:${E2E_PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: `npm run dev -- --mode e2e --host 127.0.0.1 --port ${E2E_PORT}`,
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
