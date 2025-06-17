import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameInput: string;
  readonly countryInput: string;
  readonly cityInput: string;
  readonly creditCardInput: string;
  readonly monthInput: string;
  readonly yearInput: string;
  readonly purchaseButton: string;
  readonly thankYouMessage: string;
  readonly discountCodeInput: string;
  readonly applyDiscountButton: string;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = '#name';
    this.countryInput = '#country';
    this.cityInput = '#city';
    this.creditCardInput = '#card';
    this.monthInput = '#month';
    this.yearInput = '#year';
    this.purchaseButton = 'button[onclick="purchaseOrder()"]';
    this.thankYouMessage = '.sweet-alert h2';
    this.discountCodeInput = '#discountCode';
    this.applyDiscountButton = '#applyDiscount';
  }

  async fillCheckoutForm(name: string, country: string, city: string, creditCard: string, month: string, year: string) {
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.countryInput, country);
    await this.page.fill(this.cityInput, city);
    await this.page.fill(this.creditCardInput, creditCard);
    await this.page.fill(this.monthInput, month);
    await this.page.fill(this.yearInput, year);
  }

  async applyDiscount(discountCode: string) {
    console.log(`Attempting to apply discount code: ${discountCode}`);
    await this.page.waitForSelector(this.discountCodeInput, { state: 'visible', timeout: 5000 }).catch(() => {
      console.log('Discount code input field not found on this page. Skipping discount application.');
    });
    if (await this.page.locator(this.discountCodeInput).isVisible()) {
      await this.page.fill(this.discountCodeInput, discountCode);
      await this.page.click(this.applyDiscountButton);
      console.log('Discount code filled and apply button clicked (if locators existed).');
    }
  }

  async completePurchase() {
    await this.page.click(this.purchaseButton);
  }

  async verifyPurchaseSuccess() {
    await expect(this.page.locator(this.thankYouMessage)).toHaveText('Thank you for your purchase!');
  }
} 