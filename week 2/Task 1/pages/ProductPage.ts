import { Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productDetailLink: (productName: string) => string;
  readonly addToCartButtonOnDetailPage: string;
  readonly productCard: (productName: string) => string;
  readonly addToCartButtonOnListing: (productName: string) => string;

  constructor(page: Page) {
    this.page = page;
    this.productDetailLink = (productName: string) => `a:has-text('${productName}')`;
    this.addToCartButtonOnDetailPage = 'button.btn.btn-default.cart';
    this.productCard = (productName: string) => `div.col-sm-4:has(p:has-text('${productName}')) div.single-products`;
    this.addToCartButtonOnListing = (productName: string) => `div.col-sm-4:has(p:has-text('${productName}')) a.add-to-cart`;
  }

  async selectProduct(productName: string) {
    await this.page.click(this.productDetailLink(productName));
  }

  async addProductToCartFromDetailPage() {
    await this.page.click(this.addToCartButtonOnDetailPage);
  }

  async addProductToCartFromListing(productName: string) {
    await this.page.hover(this.productCard(productName));
    await this.page.click(this.addToCartButtonOnListing(productName));
  }
} 