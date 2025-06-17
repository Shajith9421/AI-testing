import { test, expect } from '@playwright/test';
import * as testData from './test-data.json';

// Define a base URL for your dummy login website
const BASE_URL = 'https://example-login.com';

test.describe('Data-Driven Login Tests', () => {

  // Before each test, navigate to the login page
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // Iterate over each credential set in the test data
  for (const data of testData) {
    const { username, password, expected } = data;

    test(`Login with username: ${username || '[empty]'} and password: ${password || '[empty]'} - expected: ${expected}`, async ({ page }) => {
      // Locate username, password input fields and the submit button
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      const loginButton = page.locator('button[type="submit"]');
      const errorMessage = page.locator('div[data-testid="error-message"]');

      // Enter credentials
      await usernameInput.fill(username);
      await passwordInput.fill(password);

      // Click the login button
      await loginButton.click();

      if (expected === 'success') {
        // Assert successful login: URL redirection to dashboard
        await expect(page).toHaveURL(/dashboard/); // Adjust with actual dashboard URL pattern
        console.log(`✅ Login successful for username: ${username}`);
        // Optional: Assert presence of a post-login element
        // await expect(page.locator('h1:has-text("Welcome, ")')).toBeVisible();
      } else {
        // Assert failed login: URL remains on login page and error message is visible
        await expect(page).toHaveURL(BASE_URL); // Assert URL stays on the login page
        await expect(errorMessage).toBeVisible();
        // You might want to refine the error message assertion based on actual messages from the dummy site
        console.log(`❌ Login failed as expected for username: ${username}. Error message visible.`);
      }
    });
  }
}); 