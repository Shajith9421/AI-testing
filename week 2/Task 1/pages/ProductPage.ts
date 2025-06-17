import { Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productLink: (productName: string) => string;
  readonly addToCartButton: string;

  constructor(page: Page) {
    this.page = page;
    this.productLink = (productName: string) => `text=${productName}`;
    this.addToCartButton = '.btn.btn-success.btn-lg';
  }

  async selectProduct(productName: string) {
    await this.page.click(this.productLink(productName));
  }

  async addProductToCart() {
    await this.page.click(this.addToCartButton);
  }
} 