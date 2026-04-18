import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private usernameInput = this.page.getByPlaceholder('Username');
  private passwordInput = this.page.getByPlaceholder('Password');
  private loginButton   = this.page.getByRole('button', { name: 'Login' });

  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard/index', { timeout: 15_000 });
  }
}
