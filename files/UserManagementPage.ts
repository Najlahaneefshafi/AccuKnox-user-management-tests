import { Page, expect } from '@playwright/test';

export class UserManagementPage {
  constructor(private page: Page) {}

  // ── Navigation ────────────────────────────────────────────────────────────
  async navigateToSystemUsers() {
    await this.page.getByRole('link', { name: 'Admin' }).click();
    await this.page.waitForURL('**/viewSystemUsers', { timeout: 15_000 });
  }

  // ── Add User ──────────────────────────────────────────────────────────────
  async clickAddButton() {
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.waitForURL('**/saveSystemUser', { timeout: 10_000 });
  }

  async selectUserRole(role: 'ESS' | 'Admin') {
    const dropdown = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'User Role' })
      .locator('.oxd-select-wrapper');
    await dropdown.click();
    await this.page
      .getByRole('option', { name: role, exact: true })
      .click();
  }

  async fillEmployeeName(name: string) {
    const input = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Employee Name' })
      .locator('input');
    await input.fill(name);
    // Wait for auto-suggest and pick the first suggestion
    const suggestion = this.page.locator('.oxd-autocomplete-option').first();
    await suggestion.waitFor({ state: 'visible', timeout: 10_000 });
    await suggestion.click();
  }

  async selectStatus(status: 'Enabled' | 'Disabled') {
    const dropdown = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Status' })
      .locator('.oxd-select-wrapper');
    await dropdown.click();
    await this.page
      .getByRole('option', { name: status, exact: true })
      .click();
  }

  async fillUsername(username: string) {
    const input = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Username' })
      .locator('input');
    await input.fill(username);
  }

  async fillPassword(password: string) {
    const passwordInputs = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Password' })
      .locator('input[type="password"]');
    await passwordInputs.first().fill(password);
  }

  async fillConfirmPassword(password: string) {
    const row = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Confirm Password' });
    await row.locator('input[type="password"]').fill(password);
  }

  async saveUser() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async waitForSuccessToast() {
    await this.page
      .locator('.oxd-toast--success')
      .waitFor({ state: 'visible', timeout: 10_000 });
  }

  // ── Search ────────────────────────────────────────────────────────────────
  async searchByUsername(username: string) {
    const input = this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Username' })
      .locator('input');
    await input.fill(username);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForSelector('.oxd-table-body', { timeout: 10_000 });
  }

  async getTableRowCount(): Promise<number> {
    const noRecords = this.page.locator('.oxd-table-body .orangehrm-horizontal-padding');
    if (await noRecords.isVisible()) return 0;
    return this.page.locator('.oxd-table-body .oxd-table-row').count();
  }

  async getFirstRowText(): Promise<string> {
    return this.page
      .locator('.oxd-table-body .oxd-table-row')
      .first()
      .innerText();
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  async clickEditOnFirstResult() {
    await this.page
      .locator('.oxd-table-body .oxd-table-row')
      .first()
      .locator('button[title="Edit"], .oxd-icon-button')
      .first()
      .click();
    await this.page.waitForURL('**/saveSystemUser/*', { timeout: 10_000 });
  }

  async tickChangePassword() {
    const checkbox = this.page.locator('input[type="checkbox"]');
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async clickDeleteOnFirstResult() {
    const deleteBtn = this.page
      .locator('.oxd-table-body .oxd-table-row')
      .first()
      .locator('button')
      .last();
    await deleteBtn.click();
  }

  async confirmDelete() {
    await this.page
      .getByRole('button', { name: 'Yes, Delete' })
      .click();
    await this.waitForSuccessToast();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async assertOnSystemUsersPage() {
    await expect(this.page).toHaveURL(/viewSystemUsers/);
    await expect(
      this.page.getByRole('heading', { name: 'System Users' })
    ).toBeVisible();
  }

  async assertNoRecordsFound() {
    await expect(
      this.page.getByText('No Records Found')
    ).toBeVisible({ timeout: 8_000 });
  }

  async assertValidationErrors() {
    const errors = this.page.locator('.oxd-input-field-error-message, .oxd-text--span');
    await expect(errors.first()).toBeVisible({ timeout: 5_000 });
  }
}
