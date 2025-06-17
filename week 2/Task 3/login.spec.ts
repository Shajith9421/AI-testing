import { test, expect } from '@playwright/test';
import { LoginPage } from '../Task 1/pages/LoginPage'; // Import the LoginPage POM

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

test.describe('Login Functionality Tests (Task 3)', () => {
  let loginPage: LoginPage;

  // Before each test, navigate to the base URL and then to the login page
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/'); // Go to the base URL defined in playwright.config.ts
    await loginPage.navigateToLoginPage(); // Navigate to the login page using POM
  });

  /**
   * @testCaseID LFT_001
   * @title Positive Login Test: Successful login with valid credentials
   * @description Verifies that a user can successfully log in using correct email and password.
   */
  test('should allow successful login with valid credentials', async ({ page }) => {
    // Enter valid credentials using POM method (replace with actual working credentials for automationexercise.com)
    await loginPage.login('test@test.com', 'password');

    // Assert successful redirection to the home page or presence of a logged-in indicator
    // On automationexercise.com, after successful login, the "Signup / Login" link changes to "Logged in as Username" or similar
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
    await expect(page).toHaveURL('/'); // Should redirect to the home page after login
  });

  /**
   * @testCaseID LFT_002
   * @title Negative Login Test: Login with invalid credentials
   * @description Verifies that the system displays an error message for invalid login attempts.
   */
  test('should display an error message for invalid credentials', async ({ page }) => {
    // Generate random invalid credentials
    const invalidEmail = `invalid_${generateRandomString(8)}@example.com`;
    const invalidPassword = generateRandomString(10);

    // Enter invalid credentials and click login using POM method
    await loginPage.login(invalidEmail, invalidPassword);

    // Assert that the URL remains on the login page
    await expect(page).toHaveURL(/login/); // Assert URL stays on the login page

    // Assert that the error message is visible and contains expected text
    // You may need to inspect the actual error element on automationexercise.com for a more precise locator.
    const errorMessage = page.locator('.form-group.has-error'); // Placeholder locator - adjust as needed based on inspection
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Incorrect email or password/); // Adjust text based on actual error message
  });

}); 