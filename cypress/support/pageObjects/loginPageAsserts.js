import { onAPI } from './loginAPI';

export class loginPageAsserts {
  loginFormInputsDisplayed() {
    cy.get(`[formcontrolname="username"]`).should('be.visible');
    cy.get(`[formcontrolname="password"]`).should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  }

  successfulLogin() {
    const userName = Cypress.env('first_users_name');
    onAPI.interceptSuccessfulLogin();
    cy.url().should('contain', 'riziciDashboardComponent');
    cy.get('aside').should('contain', userName);
  }

  successfulTokenLogin() {
    const userName = Cypress.env('first_users_name');
    cy.get('aside').should('contain', userName);
  }

  successfulLpUser1Login() {
    const userName = Cypress.env('pl_user1_name');
    onAPI.interceptSuccessfulLogin();
    cy.get('aside').should('contain', userName);
  }

  successfulLpUser2Login() {
    const userName = Cypress.env('pl_user2_name');
    onAPI.interceptSuccessfulLogin();

    cy.get('aside').should('contain', userName);
  }

  successfulLpDirectorLogin() {
    const userName = Cypress.env('pl_director_name');
    onAPI.interceptSuccessfulLogin();

    cy.get('aside').should('contain', userName);
  }

  successfulAdminLogin() {
    const userName = Cypress.env('admin_name');
    onAPI.interceptSuccessfulLogin();

    cy.get('aside').should('contain', userName);
  }
  successfulRoleGILogin() {
    const userName = Cypress.env('admin_name');
    onAPI.interceptSuccessfulLogin();

    cy.get('aside').should('contain', userName);
  }

  unsuccessfulLogin() {
    cy.url().should('contain', 'login');
    cy.get('.loginwrapper').should('contain', 'FUK').and('contain', 'Prijava korisnika');
  }

  successfulLogout() {
    cy.url().should('contain', 'login');
  }

  logoutDialogIsDisplayed() {
    cy.get('[role="dialog"]').should('be.visible');
  }

  loginFormIsDisplayed() {
    cy.get('.loginwrapper').should('contain', 'FUK').and('contain', 'Prijava korisnika');
  }

  unsuccessfulLoginAlertIsDisplayed() {
    cy.get('.login-form-wrapper').within(() => {
      cy.get('[role="alert"]')
        .should('contain', 'Neuspešna prijava na sistem')
        .should('be.visible')
        .click();
    });
  }
}
export const assertLoginPage = new loginPageAsserts();
