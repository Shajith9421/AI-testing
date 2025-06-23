import { test, expect } from '../../src/fixtures/pageFixtures';
import { faker } from '@faker-js/faker';
import { BASE_URL } from '../../environment/env';
import { LOGIN_USERNAME_INPUT, LOGIN_PASSWORD_INPUT, LOGIN_BUTTON } from '../../src/pages/locator_constants';

// Enhanced login test using POM, fixtures, and random data

test('login flow - demo.playwright.dev with POM', async ({ loginPage }) => {
  const username = faker.internet.userName();
  const password = faker.internet.password();

  console.log(`Attempting login with username: ${username}`);

  await loginPage.goto('https://demo.playwright.dev/login');
  await loginPage.login(username, password);

  // Assertion: Should remain on login page (invalid creds)
  await expect(loginPage.page).toHaveURL('https://demo.playwright.dev/login');
  await expect(loginPage.page.locator(LOGIN_USERNAME_INPUT)).toBeVisible();

  // Logging
  console.log('Login attempt complete, assertion for failed login passed.');
}); 