import { test, expect } from '@playwright/test';

// Define a base URL for your dummy login website
const BASE_URL = 'https://example-login.com';

// Define valid credentials for the happy path test
const VALID_USERNAME = 'testuser';
const VALID_PASSWORD = 'Test@1234';

// Function to generate a random string for invalid credentials
function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

test.describe('Login Functionality Tests', () => {

  // Before each test, navigate to the login page
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Assuming the login page is the base URL. Adjust if the login page is a sub-path (e.g., '/login')
    // await page.goto(`${BASE_URL}/login`);
  });

  /**
   * @testCaseID LFT_001
   * @title Positive Login Test: Successful login with valid credentials
   * @description Verifies that a user can successfully log in using correct username and password.
   */
  test('should allow successful login with valid credentials', async ({ page }) => {
    // Locate username, password input fields and the submit button
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // Enter valid credentials
    await usernameInput.fill(VALID_USERNAME);
    await passwordInput.fill(VALID_PASSWORD);

    // Click the login button and wait for navigation to the dashboard
    await Promise.all([
      page.waitForURL('**/dashboard'), // Assert URL redirect (replace with actual dashboard URL pattern)
      loginButton.click(),
    ]);

    // Assert successful redirection to the home/dashboard page
    // For demoblaze.com, this would be asserting the welcome message. For example-login.com, assuming /dashboard
    await expect(page).toHaveURL(/dashboard/); // Asserts URL contains /dashboard
    // Optional: Assert presence of a post-login element, e.g., a welcome message or dashboard element
    // await expect(page.locator('h1:has-text("Welcome, testuser")')).toBeVisible();
  });

  /**
   * @testCaseID LFT_002
   * @title Negative Login Test: Login with invalid credentials
   * @description Verifies that the system displays an error message for invalid login attempts.
   */
  test('should display an error message for invalid credentials', async ({ page }) => {
    // Generate random invalid credentials
    const invalidUsername = generateRandomString(10);
    const invalidPassword = generateRandomString(12);

    // Locate username, password input fields, submit button, and error message element
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');
    const errorMessage = page.locator('div[data-testid="error-message"]');

    // Enter invalid credentials
    await usernameInput.fill(invalidUsername);
    await passwordInput.fill(invalidPassword);

    // Click the login button
    await loginButton.click();

    // Assert that the URL remains the same (no redirection) or is still on the login page
    await expect(page).toHaveURL(BASE_URL); // Assert URL stays on the login page

    // Assert that the error message is visible and contains expected text
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Invalid username or password/); // Adjust text based on actual error message
  });

}); 