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
    await loginPage.navigateToLogin();
    await loginPage.login('testuser', 'testpassword'); // Use a valid test user
    await expect(page.locator(loginPage.welcomeMessage)).toBeVisible();
    await homePage.verifyHomePageLoaded();
  });

  test('should add an item to cart and checkout with discount for a registered user', async ({ page }) => {
    const productName = 'Iphone 6'; // Changed to Iphone 6 as Iphone 15 is not on the demo site
    const discountCode = 'DISCOUNT10'; // Example discount code

    // 6. Search for the product (navigate directly for demo site)
    // For demoblaze, we click on the product directly as there's no search bar.
    await productPage.selectProduct(productName);

    // 7. Add an item to the cart
    await productPage.addProductToCart();

    // Handle the alert after adding to cart
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });
    // Wait for the alert to be handled before navigating away
    await page.waitForTimeout(1000); // Small delay to ensure alert is processed

    // 8. Click check out the cart (Navigate to cart first)
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productName);
    await cartPage.proceedToCheckout();

    // Fill checkout form
    await checkoutPage.fillCheckoutForm(
      'John Doe',
      'USA',
      'New York',
      '1234567890123456',
      '12',
      '2025'
    );

    // 9. Apply discount in shopping cart
    // NOTE: The demoblaze.com website does not have an explicit discount code input field.
    // This step is conceptual for a generic e-commerce site.
    await checkoutPage.applyDiscount(discountCode);

    // Complete purchase
    await checkoutPage.completePurchase();

    // Verify purchase success
    await checkoutPage.verifyPurchaseSuccess();
  });

  test('should remove an item from the cart', async ({ page }) => {
    const productName = 'Samsung galaxy s6'; // Example product name

    // Add item to cart
    await productPage.selectProduct(productName);
    await productPage.addProductToCart();

    // Handle the alert after adding to cart
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });
    await page.waitForTimeout(1000); // Small delay to ensure alert is processed

    // Navigate to cart and verify item
    await cartPage.navigateToCart();
    await cartPage.verifyProductInCart(productName);

    // Remove the item from the cart
    await cartPage.deleteItem(productName);

    // Assert that the item is no longer visible in the cart
    await expect(page.locator(cartPage.productInCart(productName))).not.toBeVisible();
  });
}); 