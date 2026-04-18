# AccuKnox User Management Tests

> **AccuKnox QA Trainee Practical Assessment** — End-to-End automation for the User Management module of OrangeHRM using **Playwright + TypeScript**.

---

## 📋 Test Coverage

| Test Case ID | Scenario | Type |
|---|---|---|
| TC_UM_001 | Navigate to Admin Module & verify System Users page | Positive |
| TC_UM_002 | Add a new ESS user with valid data | Positive |
| TC_UM_003 | Required field validation on Add User form | Negative |
| TC_UM_004 | Search for created user by exact username | Positive |
| TC_UM_005 | Search with partial username | Positive |
| TC_UM_006 | Edit all editable user fields (role, status, username, password) | Positive |
| TC_UM_007 | Validate updated details appear correctly in search | Positive |
| TC_UM_008 | Mismatched passwords show validation error | Negative |
| TC_UM_009 | Delete user and confirm success toast | Positive |
| TC_UM_010 | Deleted user no longer appears in search | Positive |

---

## 🏗️ Project Structure

```
AccuKnox-user-management-tests/
├── pages/
│   ├── LoginPage.ts              # POM – Login screen interactions
│   └── UserManagementPage.ts    # POM – System Users CRUD interactions
├── tests/
│   └── userManagement.spec.ts   # All 10 test cases
├── test-cases/
│   └── UserManagement_TestCases.xlsx  # Manual test case document
├── playwright.config.ts         # Playwright configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** ≥ 18.x  
- **npm** ≥ 9.x  

---

## 🚀 Project Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/AccuKnox-user-management-tests.git
cd AccuKnox-user-management-tests

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

---

## ▶️ Running the Tests

### Run all tests (headless, all browsers)
```bash
npm test
```

### Run in a specific browser
```bash
npm run test:chromium    # Chrome only
npm run test:firefox     # Firefox only
```

### Run with browser visible (headed mode)
```bash
npm run test:headed
```

### Run with interactive Playwright UI
```bash
npm run test:ui
```

### Run a specific test by title
```bash
npx playwright test -g "TC_UM_002"
```

### View HTML report after a run
```bash
npm run report
```

---

## 🔧 Configuration

All settings are in `playwright.config.ts`:

| Setting | Value | Reason |
|---|---|---|
| `baseURL` | `https://opensource-demo.orangehrmlive.com` | AUT URL |
| `timeout` | 60 s | Network latency on demo site |
| `fullyParallel` | `false` | Shared demo site; avoid race conditions |
| `workers` | 1 | Serial execution |
| `retries` | 1 | Flakiness handling for demo site |
| `screenshot` | `only-on-failure` | Debug artifacts |
| `video` | `retain-on-failure` | Debug artifacts |

---

## 📦 Playwright Version

```
@playwright/test: ^1.44.0
```

Verify after install:
```bash
npx playwright --version
```

---

## 🏛️ Architecture — Page Object Model

### `LoginPage`
Encapsulates login form interactions. Used at the start of every test.

### `UserManagementPage`
Encapsulates all System Users page interactions:
- `navigateToSystemUsers()` — clicks Admin nav link
- `clickAddButton()` — opens Add User form
- `selectUserRole()` / `selectStatus()` — dropdown selectors
- `fillEmployeeName()` — handles auto-suggest
- `fillUsername()` / `fillPassword()` / `fillConfirmPassword()`
- `saveUser()` / `waitForSuccessToast()`
- `searchByUsername()` — fills search form and clicks Search
- `clickEditOnFirstResult()` — opens Edit form for first row
- `clickDeleteOnFirstResult()` / `confirmDelete()`
- `assertNoRecordsFound()` / `assertValidationErrors()`

---

## 🐛 Known Issues & Observations

| ID | Observation | Severity |
|---|---|---|
| BUG_001 | Employee Name auto-suggest sometimes requires clearing and retyping for results to appear | Medium |
| BUG_002 | No password strength indicator; weak passwords accepted without warning | Low |
| BUG_003 | Post-save, list briefly appears blank before populating | Low |
| BUG_004 | Reset button doesn't clear Username filter in Firefox on occasion | Medium |
| OBS_001 | Shared public demo site may have stale data from other users; tests use `Date.now()` suffix for unique usernames | Info |

---

## 📄 Test Case Document

A detailed manual test case spreadsheet is included at:

```
test-cases/UserManagement_TestCases.xlsx
```

Columns: Test Case ID · Test Scenario · Pre-conditions · Test Steps · Test Data · Expected Result · Status

---

## 👤 Author

Submitted for **AccuKnox QA Trainee Practical Assessment**  
Application Under Test: [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com)
