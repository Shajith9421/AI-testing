import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../Task 1/pages/LoginPage'; // Import the LoginPage POM

// Define the path to your test data JSON file
const TEST_DATA_PATH = path.join(__dirname, 'test-data.json');

// Read and parse the test data synchronously
const testData = JSON.parse(fs.readFileSync(TEST_DATA_PATH, 'utf-8'));

test.describe('Data-Driven Login Tests (Task 4)', () => {
  let loginPage: LoginPage;

  // Before each test, navigate to the base URL and then to the login page
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/'); // Go to the base URL defined in playwright.config.ts
    await loginPage.navigateToLoginPage(); // Navigate to the login page using POM
  });

  // Iterate over each credential set in the test data
  for (const data of testData) {
    const { username, password, expected } = data;

    test(`Login with username: ${username || '[empty]'} and password: ${password || '[empty]'} - expected: ${expected}`, async ({ page }) => {
      // Perform login using the LoginPage POM method
      await loginPage.login(username, password);

      if (expected === 'success') {
        // Assert successful login: presence of a logged-in indicator
        await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
        await expect(page).toHaveURL('/'); // Should redirect to the home page after login
        console.log(`✅ Login successful for username: ${username}`);
      } else {
        // Assert failed login: URL remains on login page and error message is visible
        await expect(page).toHaveURL(/login/); // Assert URL stays on the login page
        const errorMessage = page.locator('.form-group.has-error'); // Placeholder locator - adjust as needed based on inspection
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/Incorrect email or password/); // Adjust text based on actual error message
        console.log(`❌ Login failed as expected for username: ${username}. Error message visible.`);
      }
    });
  }
}); 