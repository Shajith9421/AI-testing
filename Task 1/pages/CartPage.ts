import { Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: string;
  readonly placeOrderButton: string;
  readonly productInCart: (productName: string) => string;
  readonly deleteItemLink: (productName: string) => string;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = '#cartur';
    this.placeOrderButton = '.btn.btn-success';
    this.productInCart = (productName: string) => `//td[text()='${productName}']`;
    this.deleteItemLink = (productName: string) => `//td[text()='${productName}']/following-sibling::td/a[text()='Delete']`;
  }

  async navigateToCart() {
    await this.page.click(this.cartLink);
  }

  async verifyProductInCart(productName: string) {
    await expect(this.page.locator(this.productInCart(productName))).toBeVisible();
  }

  async proceedToCheckout() {
    await this.page.click(this.placeOrderButton);
  }

  async deleteItem(productName: string) {
    await this.page.click(this.deleteItemLink(productName));
  }
} 