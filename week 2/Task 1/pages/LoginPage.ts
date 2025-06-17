import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signupLoginLink: string;
  readonly emailInput: string;
  readonly passwordInput: string;
  readonly loginButton: string;

  constructor(page: Page) {
    this.page = page;
    this.signupLoginLink = 'a[href="/login"]';
    this.emailInput = 'input[data-qa="login-email"]';
    this.passwordInput = 'input[data-qa="login-password"]';
    this.loginButton = 'button[data-qa="login-button"]';
  }

  async navigateToLoginPage() {
    await this.page.click(this.signupLoginLink);
    await this.page.waitForURL('**/login');
  }

  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
} 