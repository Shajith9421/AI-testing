import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly siteHeader: string;
  readonly categoryHeader: string;
  readonly featuresItemsHeader: string;

  constructor(page: Page) {
    this.page = page;
    this.siteHeader = 'h2:has-text("Full-Fledged practice website for Automation Engineers")'; // Main heading
    this.categoryHeader = 'h2:has-text("Category")'; // Category section header
    this.featuresItemsHeader = 'h2:has-text("Features Items")'; // Features Items section header
  }

  async verifyHomePageLoaded() {
    await expect(this.page.locator(this.siteHeader)).toBeVisible();
    await expect(this.page.locator(this.categoryHeader)).toBeVisible();
    await expect(this.page.locator(this.featuresItemsHeader)).toBeVisible();
  }
} 