import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';

test.describe('Shopping Cart and Checkout Functionality', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let homePage: HomePage;

  // Before each test, navigate to the base URL and log in
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    homePage = new HomePage(page);

    await page.goto('/');
    // Pre-condition: Only registered users can add items to the cart and checkout
    // Log in a valid user before proceeding with cart operations.
    await loginPage.navigateToLoginPage();
    await loginPage.login('test@test.com', 'password');
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
    await homePage.verifyHomePageLoaded();
  });

  test('should add an item to cart and checkout for a registered user', async ({ page }) => {
    const productName = 'Blue Top';

    // Add an item to the cart from the product listing
    await productPage.addProductToCartFromListing(productName);

    // Click 'Continue Shopping' in the modal that appears after adding to cart
    await page.locator('button:has-text("Continue Shopping")').click();

    // Navigate to cart
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productName);
    await cartPage.proceedToCheckout();

    // Fill payment form (replace with valid payment details for the site)
    // These are dummy values; use actual valid test card details if required for testing.
    await checkoutPage.fillPaymentForm(
      'Test User',
      '4000 0000 0000 0000',
      '123',
      '12',
      '2025'
    );

    // Complete purchase
    await checkoutPage.completePurchase();

    // Verify purchase success
    await checkoutPage.verifyPurchaseSuccess();
  });

  test('should remove an item from the cart', async ({ page }) => {
    const productName = 'Men Tshirt';

    // Add item to cart
    await productPage.addProductToCartFromListing(productName);

    // Click 'Continue Shopping' in the modal that appears after adding to cart
    await page.locator('button:has-text("Continue Shopping")').click();

    // Navigate to cart and verify item
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productName);

    // Remove the item from the cart
    await cartPage.deleteItem(productName);

    // Assert that the item is no longer visible in the cart
    await expect(page.locator(cartPage.productInCart(productName))).not.toBeVisible();
  });
}); 