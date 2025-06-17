import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly carousel: string;
  readonly categories: string;

  constructor(page: Page) {
    this.page = page;
    this.carousel = '#carouselExampleIndicators';
    this.categories = '#cat';
  }

  async verifyHomePageLoaded() {
    await expect(this.page.locator(this.carousel)).toBeVisible();
    await expect(this.page.locator(this.categories)).toBeVisible();
  }
} 