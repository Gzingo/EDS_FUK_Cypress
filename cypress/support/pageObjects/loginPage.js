import { assertLoginPage } from './loginPageAsserts';

export class loginPage {
  adminTokenLogin() {
    cy.adminLoginByToken().then(() => {
      onLoginPage.visitDashboard();
      assertLoginPage.successfulAdminLogin();
    });
  }

  roleGITokenLogin() {
    cy.roleGILoginByToken().then(() => {
      onLoginPage.visitDashboard();
      assertLoginPage.successfulRoleGILogin();
    });
  }

  user1TokenLogin() {
    cy.plUser1LoginByToken().then(() => {
      onLoginPage.visitDashboard();
      assertLoginPage.successfulLpUser1Login();
    });
  }

  user2TokenLogin() {
    cy.plUser2LoginByToken().then(() => {
      onLoginPage.visitDashboard();
      assertLoginPage.successfulLpUser2Login();
    });
  }

  plDirectorTokenLogin() {
    cy.plDirectorLoginByToken().then(() => {
      onLoginPage.visitDashboard();
      assertLoginPage.successfulLpDirectorLogin();
    });
  }

  // Custom command for login with Enter key
  loginWithEnterKey() {
    cy.intercept('POST', `**/api/account/login`).as('loginCall');
    cy.env(['first_user', 'first_password']).then(({ first_user, first_password }) => {
      cy.get(`[formcontrolname="username"]`).type(first_user);
      cy.get(`[formcontrolname="password"]`).type(`${first_password}{enter}`);
    });
  }

  enterLoginCredentials() {
    cy.env(['first_user', 'first_password']).then(({ first_user, first_password }) => {
      cy.get(`[formcontrolname="username"]`).type(first_user);
      cy.get(`[formcontrolname="password"]`).type(first_password);
    });
  }

  clickLoginButton() {
    cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Uloguj se').click();
  }

  visitDashboard() {
    cy.visit('/' + `#/fuk/riziciDashboardComponent`);
  }

  leaveLoginInputsEmpty() {
    cy.get(`[formcontrolname="username"]`).click();
    cy.get(`[formcontrolname="password"]`).click();
  }

  enterOnlyEmailInput() {
    cy.env('first_user').then((first_user) => {
      cy.get(`[formcontrolname="username"]`).type(first_user);
    });
  }

  enterOnlyPasswordInput() {
    cy.env('first_password').then((first_password) => {
      cy.get(`[formcontrolname="password"]`).type(first_password);
    });
  }

  getTokenFromLocalStorage() {
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });
  }

  clickLogOutButton() {
    cy.get('.main-header')
      .find('ul')
      .within(($list) => {
        cy.get('li').eq(4).should('be.visible').click();
      });
  }

  confirmLogout() {
    cy.get('[role="dialog"]')
      .find('.modal-content')
      .within(($button) => {
        cy.get('.modal-footer')
          .find('button[class="btn btn-primary"]')
          .should('be.visible')
          .click();
      });
  }
}
export const onLoginPage = new loginPage();
