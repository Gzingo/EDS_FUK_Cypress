/// <reference types="cypress" />

const { navigateTo } = require('../support/pageObjects/appNavigation');
const { onGI } = require('../support/pageObjects/godisnjiIzvestaj');
const { onAPI } = require('../support/pageObjects/loginAPI');
const { onLoginPage } = require('../support/pageObjects/loginPage');
const { assertLoginPage } = require('../support/pageObjects/loginPageAsserts');
const { assertNavigation } = require('../support/pageObjects/navigationAssertion');

describe('godisnji izvestaj', () => {
  before(() => {
    cy.goToLoginPage();
    onGI.deleteFirstMatchingIzvestaj();
    cy.logout();
  });
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.goToLoginPage();
  });

  it('upucivanje zahteva za godisnji izvestaj', () => {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToGodisnjiIzvestaj();
    onGI.successfulGIPageVisit();
    onGI.addNewReport();
    onGI.addDocumentToTheForm();
    onGI.sendReportRequest();
    cy.logout();
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onGI.reportRequestVisibleDT1();
  });
});
