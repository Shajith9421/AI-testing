import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';

// Test data and configuration
const TEST_URL = 'https://example-login.com';
const VALID_CREDENTIALS = {
  username: 'testuser',
  password: 'Test@1234'
};

// Helper function to generate random invalid credentials
const generateInvalidCredentials = () => {
  const randomString = Math.random().toString(36).substring(2);
  return {
    username: `invalid_${randomString}`,
    password: `wrong_${randomString}`
  };
};

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;
  let productPage: ProductPage;

  // Before each test, navigate to the base URL
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
    await page.goto('/');
  });

  test('1. should allow a registered user to login successfully and verify homepage', async ({ page }) => {
    // 1. Navigates to the login page
    await loginPage.navigateToLogin();

    // 2. Enter valid credentials
    // 3. Click the login button
    await loginPage.login('testuser', 'testpassword'); // Replace with actual test user

    // 4. Verifies successful redirection to the home page (by checking welcome message)
    await expect(page.locator(loginPage.welcomeMessage)).toBeVisible();
    // 5. Asserts presence of home page confirmation element
    await expect(page.locator(loginPage.welcomeMessage)).toHaveText(/Welcome testuser/);

    // Verify homepage elements are visible
    await homePage.verifyHomePageLoaded();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Generate random invalid credentials
    const invalidCreds = generateInvalidCredentials();

    // Enter invalid credentials
    await page.fill('input[name="username"]', invalidCreds.username);
    await page.fill('input[name="password"]', invalidCreds.password);

    // Click submit button
    await page.click('button[type="submit"]');

    // Assert error message is displayed
    const errorMessage = await page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid username or password');

    // Assert URL hasn't changed (still on login page)
    expect(page.url()).toBe(TEST_URL);
  });

  test('should not allow guest user to checkout without login/purchase details', async ({ page }) => {
    const productName = 'Samsung galaxy s6'; // Example product name

    // Pre-condition: Guest user tries to add item to cart
    await productPage.selectProduct(productName);
    await productPage.addProductToCart();

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });
    await page.waitForTimeout(1000); // Small delay to ensure alert is processed

    // Navigate to cart
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productName);

    // Attempt to proceed to checkout as a guest
    await cartPage.proceedToCheckout();

    // Assert that the purchase button is still visible in the modal,
    // implying that the purchase has not completed without filling details.
    // On demoblaze.com, attempting to "Place Order" without filling the form
    // does not redirect to login, but rather prevents the order from being placed.
    // This test verifies that a guest cannot complete the purchase immediately.
    await expect(page.locator(cartPage.placeOrderButton)).toBeVisible();
    // Alternatively, you could check for an error message or that the thank you message is NOT visible
    await expect(page.locator(loginPage.welcomeMessage)).not.toBeVisible(); // No welcome message for guest
  });
}); 