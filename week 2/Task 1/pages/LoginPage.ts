import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginLink: string;
  readonly usernameInput: string;
  readonly passwordInput: string;
  readonly loginButton: string;
  readonly welcomeMessage: string;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = '#login2';
    this.usernameInput = '#loginusername';
    this.passwordInput = '#loginpassword';
    this.loginButton = 'button[onclick="logIn()"]';
    this.welcomeMessage = '#nameofuser';
  }

  async navigateToLogin() {
    await this.page.click(this.loginLink);
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
} 