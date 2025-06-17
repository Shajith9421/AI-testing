import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Login Functionality', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigateToLogin();
    });

    test('should allow a user to login successfully', async ({ page }) => {
        await loginPage.enterUsername('standard_user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.submitLogin();
        await dashboardPage.verifyUserIsOnDashboard();
        expect(await dashboardPage.getWelcomeText()).toContain('Swag Labs');
    });

    test('should display an error message for invalid credentials', async ({ page }) => {
        await loginPage.enterUsername('invalid_user');
        await loginPage.enterPassword('invalid_password');
        await loginPage.submitLogin();
        expect(await loginPage.getErrorMessage()).toContain('Username and password do not match any user in this service');
    });

    test('should allow a user to logout successfully', async ({ page }) => {
        await loginPage.enterUsername('standard_user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.submitLogin();
        await dashboardPage.verifyUserIsOnDashboard();
        await dashboardPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
}); 