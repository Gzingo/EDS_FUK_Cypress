/**
 * ************************************************
 * This example commands.js shows you how to
 * create various custom commands and overwrite existing commands.
 *
 * For more comprehensive examples of custom commands please read more here:
 * https://on.cypress.io/custom-commands
 * ***********************************************
 *
 * -- This is a parent command --
 * Cypress.Commands.add('login', (email, password) => { ... })
 *
 * -- This is a child command --
 * Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
 *
 * -- This is a dual command --
 * Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
 *
 * -- This will overwrite an existing command --
 * Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
 */

import { onAPI } from './pageObjects/loginAPI';

// Custom command for valid login
Cypress.Commands.add('validLogin', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  // cy.visit('/#/login');
  cy.env(['first_user', 'first_password']).then(({ first_user, first_password }) => {
    cy.get(`[formcontrolname="username"]`).type(first_user);
    cy.get(`[formcontrolname="password"]`).type(first_password);
    cy.get('button[type="submit"]').should('be.visible').click();
  });
});

Cypress.Commands.add('plAdminLogin', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  cy.intercept('GET', '/fuk/fuk/listaProcesa/search?*').as('search');
  cy.env(['admin_username', 'first_password']).then(({ admin_username, first_password }) => {
    cy.get(`[formcontrolname="username"]`).type(admin_username);
    cy.get(`[formcontrolname="password"]`).type(first_password);
    cy.get('button[type="submit"]').should('be.visible').click();
  });
});

Cypress.Commands.add('roleGILogin', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  cy.intercept('POST', '/fuk/da/api/command/GetTaskList').as('searchTasks');
  cy.env(['start_role_gi_username', 'first_password']).then(
    ({ start_role_gi_username, first_password }) => {
      cy.get(`[formcontrolname="username"]`).type(start_role_gi_username);
      cy.get(`[formcontrolname="password"]`).type(first_password);
      cy.get('button[type="submit"]').should('be.visible').click();
    }
  );
});

Cypress.Commands.add('plUser1Login', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  cy.intercept('POST', '/fuk/da/api/command/GetTaskList').as('searchTasks');
  cy.env(['pl_user1_username', 'first_password']).then(({ pl_user1_username, first_password }) => {
    cy.get(`[formcontrolname="username"]`).type(pl_user1_username);
    cy.get(`[formcontrolname="password"]`).type(first_password);
    cy.get('button[type="submit"]').should('be.visible').click();
  });
});

Cypress.Commands.add('plUser2Login', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  cy.intercept('POST', '/fuk/da/api/command/GetTaskList').as('searchTasks');
  cy.env(['pl_user2_username', 'first_password']).then(({ pl_user2_username, first_password }) => {
    cy.get(`[formcontrolname="username"]`).type(pl_user2_username);
    cy.get(`[formcontrolname="password"]`).type(first_password);
    cy.get('button[type="submit"]').should('be.visible').click();
  });
});

Cypress.Commands.add('plDirectorLogin', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  cy.intercept('POST', '/fuk/da/api/command/GetTaskList').as('searchTasks');
  cy.env(['pl_director_username', 'first_password']).then(
    ({ pl_director_username, first_password }) => {
      cy.get(`[formcontrolname="username"]`).type(pl_director_username);
      cy.get(`[formcontrolname="password"]`).type(first_password);
      cy.get('button[type="submit"]').should('be.visible').click();
    }
  );
});

Cypress.Commands.add('invalidLogin', () => {
  cy.intercept('POST', `**/fuk/auth`).as('authCall');
  cy.env(['invalid_user', 'invalid_password']).then(({ invalid_user, invalid_password }) => {
    cy.get(`[formcontrolname="username"]`).type(invalid_user);
    cy.get(`[formcontrolname="password"]`).type(invalid_password);
    cy.get('button[type="submit"]').should('be.visible').click();
  });
});

Cypress.Commands.add('loginSQLInjection', () => {
  cy.intercept('POST', `**/fuk/auth`).as('authCall');
  cy.env(['sql_inject_username', 'sql_inject_password']).then(
    ({ sql_inject_username, sql_inject_password }) => {
      cy.get(`[formcontrolname="username"]`).type(sql_inject_username);
      cy.get(`[formcontrolname="password"]`).type(sql_inject_password);
      cy.get('button[type="submit"]').should('be.visible').click();
    }
  );
});

// Custom command to perform Login via API and store token in LocalStorage
Cypress.Commands.add('loginByToken', () => {
  cy.env(['first_user', 'first_password']).then(({ first_user, first_password }) => {
    cy.request({
      method: 'POST',
      url: '/auth',
      body: {
        username: first_user,
        password: first_password,
      },
    }).then((response) => {
      const {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      } = response.body;
      const loginData = {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      };
      window.localStorage.setItem('loginData', JSON.stringify(loginData));
    });
  });
});

Cypress.Commands.add('roleGILoginByToken', () => {
  cy.visit('/' + '#/login');
  cy.env(['start_role_gi_username', 'first_password']).then(
    ({ start_role_gi_username, first_password }) => {
      cy.request({
        method: 'POST',
        url: '/auth',
        body: {
          username: start_role_gi_username,
          password: first_password,
        },
      }).then((response) => {
        const {
          email,
          firstName,
          lastName,
          ous,
          payload,
          roles,
          token,
          tokenHash,
          workAsFirstName,
          workAsLastName,
          workAsOus,
          workAsUsername,
        } = response.body;
        const loginData = {
          email,
          firstName,
          lastName,
          ous,
          payload,
          roles,
          token,
          tokenHash,
          workAsFirstName,
          workAsLastName,
          workAsOus,
          workAsUsername,
        };
        window.localStorage.setItem('loginData', JSON.stringify(loginData));
      });
    }
  );
});

Cypress.Commands.add('adminLoginByToken', () => {
  cy.visit('/' + '#/login');
  cy.env(['admin_username', 'first_password']).then(({ admin_username, first_password }) => {
    cy.request({
      method: 'POST',
      url: '/auth',
      body: {
        username: admin_username,
        password: first_password,
      },
    }).then((response) => {
      const {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      } = response.body;
      const loginData = {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      };
      window.localStorage.setItem('loginData', JSON.stringify(loginData));
    });
  });
});

Cypress.Commands.add('plUser1LoginByToken', () => {
  cy.visit('/' + '#/login');
  cy.env(['pl_user1_username', 'first_password']).then(({ pl_user1_username, first_password }) => {
    cy.request({
      method: 'POST',
      url: '/auth',
      body: {
        username: pl_user1_username,
        password: first_password,
      },
    }).then((response) => {
      const {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      } = response.body;
      const loginData = {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      };
      window.localStorage.setItem('loginData', JSON.stringify(loginData));
    });
  });
});

Cypress.Commands.add('plUser2LoginByToken', () => {
  cy.visit('/' + '#/login');
  cy.env(['pl_user2_username', 'first_password']).then(({ pl_user2_username, first_password }) => {
    cy.request({
      method: 'POST',
      url: '/auth',
      body: {
        username: pl_user2_username,
        password: first_password,
      },
    }).then((response) => {
      const {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      } = response.body;
      const loginData = {
        email,
        firstName,
        lastName,
        ous,
        payload,
        roles,
        token,
        tokenHash,
        workAsFirstName,
        workAsLastName,
        workAsOus,
        workAsUsername,
      };
      window.localStorage.setItem('loginData', JSON.stringify(loginData));
    });
  });
});

Cypress.Commands.add('plDirectorLoginByToken', () => {
  cy.visit('/' + '#/login');
  cy.env(['pl_director_username', 'first_password']).then(
    ({ pl_director_username, first_password }) => {
      cy.request({
        method: 'POST',
        url: '/auth',
        body: {
          username: pl_director_username,
          password: first_password,
        },
      }).then((response) => {
        const {
          email,
          firstName,
          lastName,
          ous,
          payload,
          roles,
          token,
          tokenHash,
          workAsFirstName,
          workAsLastName,
          workAsOus,
          workAsUsername,
        } = response.body;
        const loginData = {
          email,
          firstName,
          lastName,
          ous,
          payload,
          roles,
          token,
          tokenHash,
          workAsFirstName,
          workAsLastName,
          workAsOus,
          workAsUsername,
        };
        window.localStorage.setItem('loginData', JSON.stringify(loginData));
      });
    }
  );
});

Cypress.Commands.add('logout', () => {
  cy.intercept('POST', `**/fuk/auth/invalidate`).as('logOut');
  cy.get('[role="navigation"]').within(() => {
    cy.get('ul[class="nav navbar-nav ml-auto"]').find('li').eq(4).click();
  });
  cy.get('[role="dialog"]')
    .find('.modal-footer')
    .within(() => {
      cy.get('button[class="btn btn-primary"]').click();
    });
  onAPI.interceptLogout();
});

Cypress.Commands.add('goToLoginPage', () => {
  cy.intercept('POST', `**/api/account/login`).as('loginCall');
  cy.visit('/' + `#/login`);
});

Cypress.Commands.add('changeLanguageToSrCir', () => {
  cy.get('.main-header')
    .find('nav')
    .within(() => {
      cy.get('li')
        .eq(2)
        .click()
        .within(() => {
          cy.get('ul').find('li').eq(0).click({ force: true });
        });
    });
});

/**
 * A custom Cypress command to close all modal popups or overlay elements.
 *
 * This command iterates through common popup selectors and clicks them until
 * no popups remain. Supports case-insensitive text matching and custom selectors.
 *
 * Usage:
 * cy.closeAllPopups();
 * cy.closeAllPopups(['.custom-popup-close', '[data-test="dismiss"]']);
 *
 * @param {string[]} customSelectors - Optional array of additional selectors to check.
 */
Cypress.Commands.add('closeAllPopups', (customSelectors = []) => {
  const defaultSelectors = [
    '[aria-label="Close"]',
    '.modal-close-button',
    '.popup-close',
    '.overlay-dismiss',
  ];

  // Text-based selectors that need case-insensitive matching
  const textSelectors = ['Close', 'Cancel', 'x'];

  const allSelectors = [...defaultSelectors, ...customSelectors];

  const closePopup = () => {
    cy.get('body', { log: false }).then(($body) => {
      let popupFound = false;

      // 1️⃣ First handle standard selectors
      for (const selector of allSelectors) {
        const $el = $body.find(selector);
        if ($el.length > 0) {
          popupFound = true;
          cy.wrap($el.first(), { log: false })
            .click({ force: true, log: false })
            .should('not.exist')
            .then(() => {
              Cypress.log({
                name: 'closeAllPopups',
                displayName: 'closeAllPopups',
                message: `Closed a popup using selector: "${selector}"`,
                consoleProps: () => ({ 'Selector Found': selector }),
              });
            });
          break;
        }
      }

      // 2️⃣ Then handle text-based buttons (case-insensitive)
      if (!popupFound) {
        for (const text of textSelectors) {
          const $el = $body.find('button').filter((_, el) => {
            return el.innerText.trim().toLowerCase() === text.toLowerCase();
          });
          if ($el.length > 0) {
            popupFound = true;
            cy.wrap($el.first(), { log: false })
              .click({ force: true, log: false })
              .should('not.exist')
              .then(() => {
                Cypress.log({
                  name: 'closeAllPopups',
                  displayName: 'closeAllPopups',
                  message: `Closed a popup button with text: "${text}"`,
                  consoleProps: () => ({ 'Text Found': text }),
                });
              });
            break;
          }
        }
      }

      // 3️⃣ Recursively call until no popups remain
      if (popupFound) {
        closePopup();
      } else {
        Cypress.log({
          name: 'closeAllPopups',
          displayName: 'closeAllPopups',
          message: 'No more popups found to close.',
        });
      }
    });
  };

  closePopup();
});
