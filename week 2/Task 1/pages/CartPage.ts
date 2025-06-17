import { Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: string;
  readonly proceedToCheckoutButton: string;
  readonly productInCart: (productName: string) => string;
  readonly deleteItemLink: (productName: string) => string;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = 'a[href="/view_cart"]';
    this.proceedToCheckoutButton = 'text="Proceed To Checkout"';
    this.productInCart = (productName: string) => `//table[@id="cart_info_table"]//td[@class="cart_description"]/a[text()='${productName}']`;
    this.deleteItemLink = (productName: string) => `//table[@id="cart_info_table"]//td[@class="cart_description"]/a[text()='${productName}']/ancestor::tr//a[@class="cart_quantity_delete"]`;
  }

  async navigateToCart() {
    await this.page.click(this.cartLink);
    await this.page.waitForURL('**/view_cart');
  }

  async verifyProductInCart(productName: string) {
    await expect(this.page.locator(this.productInCart(productName))).toBeVisible();
  }

  async proceedToCheckout() {
    await this.page.click(this.proceedToCheckoutButton);
  }

  async deleteItem(productName: string) {
    await this.page.click(this.deleteItemLink(productName));
  }
} 