import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';

// Helper function to generate random invalid credentials
const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
    await page.goto('/'); // Navigates to base URL defined in playwright.config.ts
  });

  test('should allow a registered user to login successfully and verify homepage', async ({ page }) => {
    // 1. Navigate to the login page using the POM method
    await loginPage.navigateToLoginPage();

    // 2. Enter valid credentials (replace with actual working credentials for automationexercise.com)
    //    You might need to register a user on the site first or use known test credentials.
    await loginPage.login('test@test.com', 'password'); 

    // 3. Verify successful redirection or presence of a logged-in indicator
    // On automationexercise.com, after successful login, the "Signup / Login" link changes to "Logged in as Username" or similar
    // I will look for the "Logged in as" link text, assuming it appears.
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    // 4. Verify homepage elements are visible
    await homePage.verifyHomePageLoaded();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // 1. Navigate to the login page using the POM method
    await loginPage.navigateToLoginPage();

    // 2. Generate random invalid credentials
    const invalidEmail = `invalid_${generateRandomString(8)}@example.com`;
    const invalidPassword = generateRandomString(10);

    // 3. Enter invalid credentials and click login
    await loginPage.login(invalidEmail, invalidPassword);

    // 4. Assert error message is displayed and URL hasn't changed
    // Assuming an error message appears on the same page, e.g., a div or p with an error class.
    // You may need to inspect the actual error element on automationexercise.com for a more precise locator.
    const errorMessage = page.locator('.form-row.login-form p'); // Placeholder locator - adjust as needed
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Incorrect email or password/); // Adjust based on actual error text

    // Assert URL hasn't changed (still on login page)
    await expect(page).toHaveURL(/login/);
  });

  test('should not allow guest user to checkout without login/purchase details', async ({ page }) => {
    // This test case is largely dependent on the specific product and checkout flow of the previous dummy site (demoblaze.com).
    // Adapting it fully to automationexercise.com requires more detailed knowledge of its product selection and checkout process.
    // For now, this test will be adjusted to a generic product addition and a basic check for cart visibility.
    // Further refinement will be needed to fully replicate the original intent on automationexercise.com.

    const productName = 'Blue Top'; // Using a product name visible on automationexercise.com

    // Pre-condition: Guest user tries to add item to cart directly from homepage
    // Assuming a direct add to cart button is available for a product on the homepage.
    // You might need to adjust this locator if product selection involves more steps.
    await productPage.addProductToCartFromListing(productName);

    // On automationexercise.com, after adding to cart, a modal appears with "View Cart" and "Continue Shopping"
    // I will click "Continue Shopping" for now.
    await page.locator('button:has-text("Continue Shopping")').click();

    // Navigate to cart
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productName);

    // Attempt to proceed to checkout as a guest - this often requires registration or login on live sites.
    await cartPage.proceedToCheckout();

    // Assert that the user is redirected to the login/signup page or an order placement page requiring details.
    // On automationexercise.com, clicking "Proceed to Checkout" from the cart as a guest redirects to the login/signup page.
    await expect(page).toHaveURL(/login/); // Expect redirection to login/signup page
    console.log(`Guest user redirected to login/signup page as expected before checkout.`);

    // Clean up if needed (e.g., remove item from cart, though navigating away often clears it)
  });
}); 