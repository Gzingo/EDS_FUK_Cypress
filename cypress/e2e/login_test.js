/// <reference types="cypress" />

const { onAPI } = require('../support/pageObjects/loginAPI');
const { onLoginPage, loginPage } = require('../support/pageObjects/loginPage');
const { assertLoginPage, loginPageAsserts } = require('../support/pageObjects/loginPageAsserts');

describe('login page test', () => {
  beforeEach(() => {
    cy.goToLoginPage();
  });

  // Successful login
  it('successful login', () => {
    cy.validLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulLogin();
  });

  // Successful login with Enter key
  it('successfully logs in with Enter key', () => {
    onLoginPage.loginWithEnterKey();
    assertLoginPage.successfulLogin();
  });

  // Unsuccessful login with empty input fields
  it('unsuccessful login with no input', () => {
    onLoginPage.leaveLoginInputsEmpty();
    onLoginPage.clickLoginButton();
    assertLoginPage.unsuccessfulLogin();
  });

  // Unsuccessful login with email input only
  it('unsuccessful login with only email input', () => {
    onLoginPage.enterOnlyEmailInput();
    onLoginPage.clickLoginButton();
    assertLoginPage.unsuccessfulLogin();
  });

  // Unsuccessful login with password input only
  it('unsuccessful login with only password input', () => {
    onLoginPage.enterOnlyPasswordInput();
    onLoginPage.clickLoginButton();
    assertLoginPage.unsuccessfulLogin();
  });

  // Unsuccessful login with invalid credentials
  it('unsuccessful login with invalid credentials', () => {
    cy.invalidLogin();
    onAPI.interceptUnsuccessfulLogin();
    assertLoginPage.unsuccessfulLoginAlertIsDisplayed();
  });

  // Should not allow SQL Injection
  it('unsuccessful SQL Injection attack', () => {
    cy.loginSQLInjection();
    onAPI.interceptUnsuccessfulLogin();
    assertLoginPage.unsuccessfulLoginAlertIsDisplayed();
    assertLoginPage.unsuccessfulLogin();
  });

  // Should store token securely
  it('successfully stores the token', () => {
    cy.validLogin();
    assertLoginPage.successfulLogin();
    onLoginPage.getTokenFromLocalStorage();
  });

  // Should clear session on logout
  it('successful clearing the session on logout', () => {
    cy.validLogin();
    assertLoginPage.successfulLogin();
    onLoginPage.clickLogOutButton();
    assertLoginPage.logoutDialogIsDisplayed();
    onLoginPage.confirmLogout();
    assertLoginPage.successfulLogout();
  });

  // Successful API login with token
  it('successful login with token', () => {
    cy.loginByToken().then(() => {
      onLoginPage.visitDashboard();
      assertLoginPage.successfulTokenLogin();
    });
  });
});
