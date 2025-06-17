import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly welcomeText: Locator;
    readonly logoutButton: Locator;
    readonly appLogo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.welcomeText = page.locator('.app_logo');
        this.logoutButton = page.locator('#react-burger-menu-btn');
        this.appLogo = page.locator('.app_logo');
    }

    async verifyUserIsOnDashboard() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.appLogo).toBeVisible();
    }

    async getWelcomeText(): Promise<string | null> {
        return await this.welcomeText.textContent();
    }

    async logout() {
        await this.page.locator('#react-burger-menu-btn').click();
        await this.page.locator('#logout_sidebar_link').click();
    }
} 