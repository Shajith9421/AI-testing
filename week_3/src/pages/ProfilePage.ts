import { Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly profileNameSelector = 'h1.profile-name';

  constructor(page: Page) {
    this.page = page;
  }

  async getProfileName(): Promise<string> {
    return (await this.page.textContent(this.profileNameSelector)) || '';
  }
}
