import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { UserManagementPage } from '../pages/UserManagementPage';

// ── Shared test data ──────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { username: 'Admin', password: 'admin123' };

// Use a timestamp suffix so each CI run uses a unique username
const TIMESTAMP = Date.now();
const NEW_USERNAME     = `qa_user_${TIMESTAMP}`;
const UPDATED_USERNAME = `qa_upd_${TIMESTAMP}`;
const PASSWORD         = 'Test@1234';
const NEW_PASSWORD     = 'NewPass@5678';

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_001 – Navigate to Admin Module
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_001 – Navigate to Admin Module and verify System Users page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
  await umPage.navigateToSystemUsers();
  await umPage.assertOnSystemUsersPage();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_002 – Add a New System User with Valid Data
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_002 – Add a new ESS user with valid data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();

  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  // Verify redirect back to system users list
  await expect(page).toHaveURL(/viewSystemUsers/);
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_003 – Required Field Validation on Add User Form (Negative)
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_003 – Required field validation on Add User form', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();

  // Submit without filling anything
  await umPage.saveUser();
  await umPage.assertValidationErrors();

  // Still on the Add page
  await expect(page).toHaveURL(/saveSystemUser/);
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_004 – Search for the Newly Created User by Exact Username
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_004 – Search for created user by exact username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

  // Create user first
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();
  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  // Now search
  await umPage.searchByUsername(NEW_USERNAME);
  const rows = await umPage.getTableRowCount();
  expect(rows).toBe(1);

  const rowText = await umPage.getFirstRowText();
  expect(rowText).toContain(NEW_USERNAME);
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_005 – Search with Partial Username
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_005 – Search with partial username returns results', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

  // Create user first
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();
  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  // Search by partial (first 7 chars: "qa_user")
  const partial = NEW_USERNAME.slice(0, 7);
  await umPage.searchByUsername(partial);

  const rows = await umPage.getTableRowCount();
  expect(rows).toBeGreaterThanOrEqual(1);
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_006 – Edit All Editable User Details
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_006 – Edit user role, status, username, and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

  // Create user first
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();
  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  // Search and open edit
  await umPage.searchByUsername(NEW_USERNAME);
  await umPage.clickEditOnFirstResult();

  // Edit all possible fields
  await umPage.selectUserRole('Admin');
  await umPage.selectStatus('Disabled');
  await umPage.fillUsername(UPDATED_USERNAME);
  await umPage.tickChangePassword();
  await umPage.fillPassword(NEW_PASSWORD);
  await umPage.fillConfirmPassword(NEW_PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  await expect(page).toHaveURL(/viewSystemUsers/);
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_007 – Validate Updated User Details
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_007 – Validate updated username appears in search results', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

  // Create + edit user flow
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();
  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  await umPage.searchByUsername(NEW_USERNAME);
  await umPage.clickEditOnFirstResult();
  await umPage.selectUserRole('Admin');
  await umPage.selectStatus('Disabled');
  await umPage.fillUsername(UPDATED_USERNAME);
  await umPage.tickChangePassword();
  await umPage.fillPassword(NEW_PASSWORD);
  await umPage.fillConfirmPassword(NEW_PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  // Now validate by searching updated username
  await umPage.searchByUsername(UPDATED_USERNAME);
  const rows = await umPage.getTableRowCount();
  expect(rows).toBe(1);

  const rowText = await umPage.getFirstRowText();
  expect(rowText).toContain(UPDATED_USERNAME);
  expect(rowText).toContain('Admin');
  expect(rowText).toContain('Disabled');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_008 – Mismatched Passwords Validation (Negative)
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_008 – Mismatched passwords show validation error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();

  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(`qa_mismatch_${TIMESTAMP}`);
  await umPage.fillPassword('Test@1234');
  await umPage.fillConfirmPassword('WrongPass@999'); // mismatch

  await umPage.saveUser();

  // Should remain on the Add page and show error
  await expect(page).toHaveURL(/saveSystemUser/);
  await expect(
    page.getByText('Passwords do not match')
  ).toBeVisible({ timeout: 5_000 });
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_009 – Delete the Created User
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_009 – Delete user and confirm success toast', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

  // Create user first
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();
  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  // Search and delete
  await umPage.searchByUsername(NEW_USERNAME);
  await umPage.clickDeleteOnFirstResult();
  await umPage.confirmDelete();

  // Verify toast and page is still on users list
  await expect(page).toHaveURL(/viewSystemUsers/);
});

// ─────────────────────────────────────────────────────────────────────────────
// TC_UM_010 – Search for Deleted User – Verify Absence
// ─────────────────────────────────────────────────────────────────────────────
test('TC_UM_010 – Deleted user no longer appears in search', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const umPage    = new UserManagementPage(page);

  await loginPage.navigate();
  await loginPage.login(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

  // Create + delete
  await umPage.navigateToSystemUsers();
  await umPage.clickAddButton();
  await umPage.selectUserRole('ESS');
  await umPage.fillEmployeeName('Paul');
  await umPage.selectStatus('Enabled');
  await umPage.fillUsername(NEW_USERNAME);
  await umPage.fillPassword(PASSWORD);
  await umPage.fillConfirmPassword(PASSWORD);
  await umPage.saveUser();
  await umPage.waitForSuccessToast();

  await umPage.searchByUsername(NEW_USERNAME);
  await umPage.clickDeleteOnFirstResult();
  await umPage.confirmDelete();

  // Search again – should show no records
  await umPage.searchByUsername(NEW_USERNAME);
  await umPage.assertNoRecordsFound();
});
