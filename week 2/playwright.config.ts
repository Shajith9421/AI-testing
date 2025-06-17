import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Task 1 - chromium',
      testDir: './Task 1/tests',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.demoblaze.com/' },
    },
    {
      name: 'Task 1 - firefox',
      testDir: './Task 1/tests',
      use: { ...devices['Desktop Firefox'], baseURL: 'https://www.demoblaze.com/' },
    },
    {
      name: 'Task 1 - webkit',
      testDir: './Task 1/tests',
      use: { ...devices['Desktop Safari'], baseURL: 'https://www.demoblaze.com/' },
    },
    {
      name: 'Task 3 - chromium',
      testDir: './Task 3',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://example-login.com/' },
    },
    {
      name: 'Task 3 - firefox',
      testDir: './Task 3',
      use: { ...devices['Desktop Firefox'], baseURL: 'https://example-login.com/' },
    },
    {
      name: 'Task 3 - webkit',
      testDir: './Task 3',
      use: { ...devices['Desktop Safari'], baseURL: 'https://example-login.com/' },
    },
    {
      name: 'Task 4 - chromium',
      testDir: './Task 4',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://example-login.com/' },
    },
    {
      name: 'Task 4 - firefox',
      testDir: './Task 4',
      use: { ...devices['Desktop Firefox'], baseURL: 'https://example-login.com/' },
    },
    {
      name: 'Task 4 - webkit',
      testDir: './Task 4',
      use: { ...devices['Desktop Safari'], baseURL: 'https://example-login.com/' },
    },
  ],
}); 