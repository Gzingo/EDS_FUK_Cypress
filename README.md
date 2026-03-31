# EDS FUK - Cypress Test Automation Framework

Test automation framework for EDS FUK (Financial Management and Control) system. Built with Cypress and JavaScript using Page Object Model architecture.

## Tech Stack

- **Cypress** with JavaScript
- **Page Object Model** for UI abstraction
- **API-based login** for fast test setup
- **cypress-mochawesome-reporter** for HTML reports
- **cypress-parallel** for parallel test execution
- **dotenv** for environment configuration
- **ESLint + Prettier** for code quality

## Project Structure

```
EDS_FUK_UI/
├── cypress/
│   ├── e2e/                            # Test specs
│   │   ├── login_test.js               # Login tests (positive, negative, security)
│   │   ├── godisnji_izvestaj.js        # Annual report workflow tests
│   │   ├── odobravanje_liste_procesa.js # Process list approval tests
│   │   └── odobravanje_mape_procesa.js  # Process map approval tests
│   ├── fixtures/                        # Test data & file uploads
│   │   ├── users.json
│   │   ├── profile.json
│   │   ├── ExcelDoc.xlsx
│   │   ├── PdFDoc.pdf
│   │   └── WordDoc.docx
│   └── support/
│       ├── commands.js                  # Custom Cypress commands
│       ├── dateUtils.js                 # Date utility functions
│       ├── e2e.js                       # Global hooks & imports
│       └── pageObjects/
│           ├── loginPage.js             # Login page interactions
│           ├── loginPageAsserts.js      # Login page assertions
│           ├── loginAPI.js              # API-based authentication
│           ├── appNavigation.js         # App navigation helpers
│           ├── navigationAssertion.js   # Navigation assertions
│           ├── godisnjiIzvestaj.js      # Annual report page object
│           ├── processList.js           # Process list page object
│           └── processMap.js            # Process map page object
├── cypress.config.js                    # Cypress configuration
├── package.json                         # Dependencies & npm scripts
├── Jenkinsfile                          # CI/CD pipeline definition
├── .env.example                         # Environment variables template
├── .eslintrc.json                       # ESLint configuration
├── .prettierrc                          # Prettier configuration
└── clean.js                             # Pre-run cleanup script
```

## Setup

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/Gzingo/EDS_FUK_Cypress.git
cd EDS_FUK_Cypress/EDS_FUK_UI
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `CYPRESS_BASE_URL` - Application URL
- Role credentials (Admin, User 1, User 2, Director)
- Invalid credentials for negative tests
- SQL injection test payloads

## Running Tests

```bash
npm run cy:run              # Headless (default browser)
npm run cy:run:chrome       # Headless Chrome
npm run cy:run:edge         # Headless Edge
npm run cy:run:firefox      # Headless Firefox
npm run cy:parallel         # Parallel execution (4 threads)
npm run cy:parallel:chrome  # Parallel Chrome
npm run cy:test:headless:3x # Run 3 times consecutively
npm run cy:test:cherrypick  # Run specific spec (login_test)
```

### Open Cypress UI

```bash
npx cypress open
```

## Test Coverage

| Test Suite | Description |
|------------|-------------|
| `login_test.js` | Login positive/negative/security tests |
| `godisnji_izvestaj.js` | Annual report creation & workflow |
| `odobravanje_liste_procesa.js` | Process list approval workflow |
| `odobravanje_mape_procesa.js` | Process map approval workflow |

## Key Patterns

### API-Based Login

Fast authentication by intercepting login API calls, bypassing the UI login flow:

```javascript
import LoginAPI from '../support/pageObjects/loginAPI';
const loginAPI = new LoginAPI();

loginAPI.loginAsAdmin();
```

### Page Object Model

UI interactions encapsulated in reusable page objects:

```javascript
import LoginPage from '../support/pageObjects/loginPage';
const loginPage = new LoginPage();

loginPage.enterUsername('admin');
loginPage.enterPassword('password');
loginPage.clickLogin();
```

## Reports

After test execution, HTML reports are generated via `cypress-mochawesome-reporter`. Open the report:

```bash
open cypress/reports/html/index.html
```
