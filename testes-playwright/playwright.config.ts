import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost/projeto/public/';

export default defineConfig({
  testDir: './tests',
  use: { 
    baseURL: BASE_URL, 
    screenshot: 'only-on-failure' 
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
