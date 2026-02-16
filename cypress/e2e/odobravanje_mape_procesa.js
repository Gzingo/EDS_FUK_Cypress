/// <reference types="cypress" />

const { navigateTo } = require('../support/pageObjects/appNavigation');
const { onAPI } = require('../support/pageObjects/loginAPI');
const { assertLoginPage } = require('../support/pageObjects/loginPageAsserts');
const { assertNavigation } = require('../support/pageObjects/navigationAssertion');
const { onProcessMap } = require('../support/pageObjects/processMap');

describe('odobravanje mape procesa', () => {
  before(() => {
    cy.goToLoginPage();
    onProcessMap.deleteAllFirstMatchingMap();
    cy.logout();
  });
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.goToLoginPage();
  });

  it('konacno odobravanje mape procesa', () => {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.addNewProcessMap();
    onProcessMap.searchListForNewMap();
    onProcessMap.sendNewMapToControl();
    cy.logout();
    // User1;
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnControlOnTaskList();
    onProcessMap.sendMapToApproval();
    onProcessMap.approvalMapTaskNotVisible();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnControlVisible();
    cy.logout();
    // User 2
    cy.plUser2Login();
    assertLoginPage.successfulLpUser2Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnControlOnTaskList();
    onProcessMap.sendMapToApproval();
    onProcessMap.approvalMapTaskNotVisible();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnApprovalVisible();
    cy.logout();
    // Director;
    cy.plDirectorLogin();
    assertLoginPage.successfulLpDirectorLogin();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnApprovalOnTaskList();
    onProcessMap.sendMapToApprovalDirector();
    onProcessMap.approvalMapTaskNotVisibleDirector();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    // Assertion
    onProcessMap.searchForApprovedProcess();
  });

  it('vracanje mape procesa iz kontrole na doradu', () => {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.addNewProcessMap();
    onProcessMap.searchListForNewMap();
    onProcessMap.sendNewMapToControl();
    cy.logout();
    // User1;
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnControlOnTaskList();
    onProcessMap.sendMapToApproval();
    onProcessMap.approvalMapTaskNotVisible();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnControlVisible();
    cy.closeAllPopups();
    cy.logout();
    // User 2
    cy.plUser2Login();
    assertLoginPage.successfulLpUser2Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnControlOnTaskList();
    onProcessMap.sendMapBackToRework();
    cy.closeAllPopups();
    cy.logout();
    // User1 assertion
    cy.plUser1Login();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.reworkTaskNotVisible();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnReworkVisible();
  });

  it('vracanje mape procesa sa odobravanja na doradu', () => {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.addNewProcessMap();
    onProcessMap.searchListForNewMap();
    onProcessMap.sendNewMapToControl();
    cy.logout();
    // User1;
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnControlOnTaskList();
    onProcessMap.sendMapToApproval();
    onProcessMap.approvalMapTaskNotVisible();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnControlVisible();
    cy.logout();
    // User 2
    cy.plUser2Login();
    assertLoginPage.successfulLpUser2Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnControlOnTaskList();
    onProcessMap.sendMapToApproval();
    onProcessMap.approvalMapTaskNotVisible();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnApprovalVisible();
    cy.logout();
    // Director
    cy.plDirectorLogin();
    assertLoginPage.successfulLpDirectorLogin();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessMap.searchForMapOnApprovalOnTaskList();
    onProcessMap.sendMapToReworkDirector();
    onProcessMap.reworkTaskNotVisibleDirector();
    cy.logout();
    // Admin assertion
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToProces();
    assertNavigation.successfulVisitProces();
    onProcessMap.onProcessMapOnReworkVisible();
  });
});
