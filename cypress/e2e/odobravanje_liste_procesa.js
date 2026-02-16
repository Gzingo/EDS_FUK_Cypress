/// <reference types="cypress" />

const { navigateTo } = require('../support/pageObjects/appNavigation');
const { onAPI } = require('../support/pageObjects/loginAPI');
const { assertLoginPage } = require('../support/pageObjects/loginPageAsserts');
const { assertNavigation } = require('../support/pageObjects/navigationAssertion');
const { onProcessList } = require('../support/pageObjects/processList');

describe('odobravanje liste procesa', () => {
  before(() => {
    cy.goToLoginPage();
    onProcessList.deleteAllFirstMatchingProcess();
    cy.logout();
  });
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.goToLoginPage();
  });

  it('konacno odobravanje liste procesa', () => {
    onAPI.interceptSuccessfulLogin();
    cy.plAdminLogin();
    onAPI.waitSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.addNewProcessList();
    onProcessList.searchNewProcessList();
    onProcessList.sendNewProcessListToControl();
    onProcessList.searchForProcessOnControl();
    cy.closeAllPopups();
    cy.logout();
    // User1
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessList.searchForTaskOnControlOnTaskList();
    onProcessList.sendProcessToApproval();
    onProcessList.approvalTaskNotVisible();
    navigateTo.getToListaProcesa();
    onProcessList.searchForProcessOnControl();
    cy.closeAllPopups();
    cy.logout();
    // User 2
    cy.plUser2Login();
    assertLoginPage.successfulLpUser2Login();
    navigateTo.getToZadaci();
    onProcessList.searchForTaskOnControlOnTaskList();
    onProcessList.sendProcessToApproval();
    onProcessList.approvalTaskNotVisible();
    navigateTo.getToListaProcesa();
    onProcessList.searchForProcessOnApproval();
    cy.closeAllPopups();
    cy.logout();
    // Director
    cy.plDirectorLogin();
    assertLoginPage.successfulLpDirectorLogin();
    navigateTo.getToZadaci();
    cy.closeAllPopups();
    onProcessList.searchForTaskOnApprovalOnTaskList();
    onProcessList.sendProcessToApprovalDirector();
    onProcessList.approvalTaskNotVisibleDirector();
    navigateTo.getToListaProcesa();
    onProcessList.searchForApprovedProcess();
    cy.logout();
    // Assertion
    cy.plUser1Login();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.assertProcessListOnApproved();
  });

  it('vracanje liste procesa sa kontrole na doradu', () => {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.addNewProcessList();
    onProcessList.searchNewProcessList();
    onProcessList.sendNewProcessListToControl();
    onProcessList.searchForProcessOnControl();
    cy.closeAllPopups();
    cy.logout();
    // User1
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessList.searchForTaskOnControlOnTaskList();
    onProcessList.sendProcessToApproval();
    cy.closeAllPopups();
    cy.logout();
    // User 2
    cy.plUser2Login();
    assertLoginPage.successfulLpUser2Login();
    navigateTo.getToZadaci();
    onProcessList.searchForTaskOnControlOnTaskList();
    onProcessList.sendProcessBackToRework();
    cy.closeAllPopups();
    onProcessList.reworkTaskNotVisible();
    cy.logout();
    // Assertion
    cy.plUser1Login();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessList.reworkTaskNotVisible();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.onProcessListTaskVisible();
    cy.closeAllPopups();
  });

  it('vracanje liste procesa sa odobravanja na doradu', () => {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.addNewProcessList();
    onProcessList.searchNewProcessList();
    onProcessList.sendNewProcessListToControl();
    onProcessList.searchForProcessOnControl();
    cy.logout();
    // User1
    cy.plUser1Login();
    assertLoginPage.successfulLpUser1Login();
    navigateTo.getToZadaci();
    assertNavigation.successfulVisitZadaci();
    onProcessList.searchForTaskOnControlOnTaskList();
    onProcessList.sendProcessToApproval();
    cy.logout();
    // User 2
    cy.plUser2Login();
    assertLoginPage.successfulLpUser2Login();
    navigateTo.getToZadaci();
    onProcessList.searchForTaskOnControlOnTaskList();
    onProcessList.sendProcessToApproval();
    onProcessList.reworkTaskNotVisible();
    navigateTo.getToListaProcesa();
    onProcessList.searchForProcessOnApproval();
    cy.logout();
    // Director
    cy.plDirectorLogin();
    assertLoginPage.successfulLpDirectorLogin();
    navigateTo.getToZadaci();
    onProcessList.searchForTaskOnApprovalOnTaskList();
    onProcessList.sendProcessToReworkDirector();
    onProcessList.reworkTaskNotVisibleDirector();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.searchForApprovedProcessList();
    cy.closeAllPopups();
    cy.logout();
    // Admin assertion
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToListaProcesa();
    assertNavigation.successfulVisitListaProcesa();
    onProcessList.adminAssertProcessTaskVisible();
    cy.closeAllPopups();
  });
});
