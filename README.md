# EDS FUK - Cypress E2E Test Suite

Automated E2E test suite for the EDS FUK (Financial Management and Control) system — covering login security, annual report workflows, and process list/map approval flows across multiple user roles.

Built with Cypress and JavaScript using Page Object Model architecture.

> **Note:** This is a sanitized portfolio version. All internal URLs and credentials have been removed.

## Tech Stack

- **Cypress 15.12.0** — E2E test framework
- **cypress-mochawesome-reporter 4.0.2** — HTML test reporting
- **cypress-parallel 0.1.7** — parallel test execution
- **cypress-real-events 1.15.0** — native browser events
- **dayjs 1.11.18** — date/time manipulation
- **dotenv 17.2.3** — environment configuration
- **ESLint 9.38.0 + Prettier 3.6.2** — code quality

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **Browser:** Chrome, Edge or Firefox

## Installation

```bash
npm install
cp .env.example .env   # fill in credentials
```

## Running Tests

```bash
# All tests headless (default browser)
npm run cy:run

# Specific browser
npm run cy:run:chrome
npm run cy:run:edge
npm run cy:run:firefox

# Cypress GUI (interactive)
npx cypress open

# Parallel execution (4 threads)
npm run cy:parallel
npm run cy:parallel:chrome
npm run cy:parallel:edge
npm run cy:parallel:firefox

# Run 3 times consecutively
npm run cy:test:headless:3x

# Run specific spec (login_test)
npm run cy:test:cherrypick
```

## Project Structure

```
cypress/
  e2e/                            # Test specs
    login_test.js                 # Login tests (positive, negative, security)
    godisnji_izvestaj.js          # Annual report workflow tests
    odobravanje_liste_procesa.js  # Process list approval tests
    odobravanje_mape_procesa.js   # Process map approval tests
  fixtures/                       # Test data & file uploads
    users.json
    profile.json
    ExcelDoc.xlsx, PdFDoc.pdf, WordDoc.docx
  support/
    commands.js                   # Custom Cypress commands
    dateUtils.js                  # Date utility functions
    e2e.js                        # Global hooks & imports
    pageObjects/
      loginPage.js                # Login page interactions
      loginPageAsserts.js         # Login page assertions
      loginAPI.js                 # API-based authentication
      appNavigation.js            # App navigation helpers
      navigationAssertion.js      # Navigation assertions
      godisnjiIzvestaj.js         # Annual report page object
      processList.js              # Process list page object
      processMap.js               # Process map page object
```

## Architecture

### API-Based Login

Fast authentication by intercepting login API calls, bypassing the UI login flow:

```javascript
import LoginAPI from '../support/pageObjects/loginAPI';
const loginAPI = new LoginAPI();

loginAPI.loginAsAdmin();
```

### Page Object Model

UI interactions encapsulated in reusable page objects with separate assertion classes:

```javascript
import LoginPage from '../support/pageObjects/loginPage';
const loginPage = new LoginPage();

loginPage.enterUsername('admin');
loginPage.enterPassword('password');
loginPage.clickLogin();
```

### Cleanup (clean.js)

Every `npm run cy:*` command runs `npm run clean` before tests, which deletes:
- `cypress/screenshots/`
- `cypress/videos/`
- `cypress/reports/`

## Test Coverage

| Suite | Tests | Scope |
|---|---|---|
| Login | 9 | UI login, Enter key, token-based, negative (4), SQL injection, session |
| Annual Report | 1 | Request workflow |
| Process List Approval | 2 | Return from control/approval to rework |
| Process Map Approval | 3 | Final approval, return from control/approval to rework |

## Conventions

### Naming

- **Page Objects:** camelCase (e.g. `loginPage.js`, `processList.js`)
- **Classes:** PascalCase (e.g. `LoginPage`, `LoginAPI`)
- **Assertions:** separate files per page (e.g. `loginPageAsserts.js`, `navigationAssertion.js`)

### Import Pattern

```javascript
import LoginAPI from '../support/pageObjects/loginAPI';
import LoginPage from '../support/pageObjects/loginPage';
import { onLoginPageAsserts } from '../support/pageObjects/loginPageAsserts';
```

## Environment Variables

All sensitive values (URLs, credentials) are stored in `.env` and loaded via `dotenv`. See `.env.example` for the full list.

Key groups:
- **Base URL** — application URL
- **Credentials** — Admin, User 1, User 2, Director roles
- **Negative tests** — invalid credentials for login failure scenarios
- **Security tests** — SQL injection payloads

## Reporting

Tests generate a Mochawesome HTML report with:
- Pass/fail status per test
- Screenshots on failure
- Execution duration

Report output: `cypress/reports/html/`

## Other Root Files

- **`clean.js`** — pre-run cleanup script (screenshots, videos, reports)
- **`runThreeTimes.js`** — runs test suite 3 times consecutively
- **`Jenkinsfile`** — Jenkins CI/CD pipeline definition
- **`.eslintrc.json`** — ESLint configuration
- **`.prettierrc`** — Prettier configuration

## Author

[**Nikola Nikolić** — QA Automation Engineer](https://github.com/Gzingo)
