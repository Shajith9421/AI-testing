import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameOnCardInput: string;
  readonly cardNumberInput: string;
  readonly cvcInput: string;
  readonly expiryMonthInput: string;
  readonly expiryYearInput: string;
  readonly placeOrderButton: string;
  readonly orderPlacedMessage: string;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = 'input[data-qa="name-on-card"]';
    this.cardNumberInput = 'input[data-qa="card-number"]';
    this.cvcInput = 'input[data-qa="cvc"]';
    this.expiryMonthInput = 'input[data-qa="expiry-month"]';
    this.expiryYearInput = 'input[data-qa="expiry-year"]';
    this.placeOrderButton = 'button[data-qa="pay-button"]';
    this.orderPlacedMessage = 'h2.title.text-center';
  }

  async fillPaymentForm(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {
    await this.page.fill(this.nameOnCardInput, nameOnCard);
    await this.page.fill(this.cardNumberInput, cardNumber);
    await this.page.fill(this.cvcInput, cvc);
    await this.page.fill(this.expiryMonthInput, expiryMonth);
    await this.page.fill(this.expiryYearInput, expiryYear);
  }

  async completePurchase() {
    await this.page.click(this.placeOrderButton);
  }

  async verifyPurchaseSuccess() {
    await expect(this.page.locator(this.orderPlacedMessage)).toBeVisible();
    await expect(this.page.locator(this.orderPlacedMessage)).toHaveText('Order Placed!');
  }
} 