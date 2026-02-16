import { godisnjiIzvestaj } from './godisnjiIzvestaj';

export class loginAPI {
  interceptSuccessfulLogin() {
    cy.intercept('POST', `**/api/account/login`).as('loginCall');
  }

  waitSuccessfulLogin() {
    cy.wait('@loginCall').its('response.statusCode').should('eq', 200);
  }

  interceptSuccessfulSearch() {
    cy.intercept('GET', '/fuk/fuk/listaProcesa/search?*').as('search');
    cy.wait('@search').its('response.statusCode').should('eq', 200);
  }

  interceptSuccessfulMapSearch() {
    cy.intercept('GET', '**/fuk/fuk/proces/search**').as('searchMap');
    cy.wait('@searchMap').its('response.statusCode').should('eq', 200);
  }

  waitForSearchResults() {
    // Wait for API call and verify status code after clicking the search button
    cy.intercept('GET', '**/fuk/fuk/proces/search**').as('searchResult');
    cy.get('button[type="submit"]').contains('Претрага').click();
    cy.wait('@searchResult').its('response.statusCode').should('eq', 200);
  }

  interceptSearchProcessList() {
    cy.intercept('GET', '/fuk/role/search?organizationalUnitIdsIn=*').as('searchProcessList');
    cy.wait('@searchProcessList').its('response.statusCode').should('eq', 200);
  }

  interceptSendToControl() {
    cy.intercept('POST', '/fuk/fuk/listaProcesa/posaljiNaKontrolu').as('sendOnControl');
    cy.wait('@sendOnControl').its('response.statusCode').should('eq', 201);
  }

  interceptSendMapToControl() {
    cy.intercept('POST', '/fuk/fuk/proces/posaljiNaKontrolu').as('sendOnControl');
    cy.wait('@sendOnControl').its('response.statusCode').should('eq', 201);
  }

  interceptGetTaskList() {
    cy.intercept('POST', '/fuk/da/api/command/GetTaskList').as('searchTasks');
    cy.wait('@searchTasks').its('response.statusCode').should('eq', 200);
  }

  interceptProcessListOnApproval() {
    cy.intercept('POST', '/fuk/fuk/listaProcesa/setStatus/14823/NA_ODOBRAVANJU**').as('onApproval');
    cy.wait('@onApproval').its('response.statusCode').should('eq', 200);
  }

  interceptGetTaskListMape() {
    cy.intercept('POST', '/fuk/da/api/command/GetTaskList').as('searchTasks');
    cy.wait('@searchTasks').its('response.statusCode').should('eq', 200);
  }

  interceptDeleteProcess() {
    cy.intercept('DELETE', '/fuk/fuk/listaProcesa/*').as('deleteProcess');
    cy.wait('@deleteProcess').its('response.statusCode').should('eq', 204);
  }

  interceptSuccessProcessPopup() {
    cy.intercept('GET', '/fuk/fuk/listaProcesa/**').as('listaProcesaPopUp');
    cy.wait('@listaProcesaPopUp').its('response.statusCode').should('eq', 200);
  }

  interceptUnsuccessfulLogin() {
    cy.intercept('POST', `**/fuk/auth`).as('authCall');
    cy.wait('@authCall').its('response.statusCode').should('eq', 400);
  }

  interceptLogout() {
    // cy.intercept('POST', `**/fuk/auth/invalidate`).as('logOut');
    cy.wait('@logOut').its('response.statusCode').should('eq', 200);
  }

  interceptCompleteTask() {
    cy.intercept('POST', `/fuk/da/api/command/CompleteTask`).as('completeTask');
    cy.wait('@completeTask').its('response.statusCode').should('eq', 200);
  }

  interceptAddGI() {
    cy.intercept('GET', `/fuk/fuk/godisnjiIzvestaj/**`).as('godisnjiIzvestaj');
    // cy.intercept('GET', `/fuk/property/search`).as('propertySearch');
    cy.wait('@godisnjiIzvestaj').its('response.statusCode').should('eq', 200);
    // cy.wait('@propertySearch').its('response.statusCode').should('eq', 200);
  }

  interceptGISearch() {
    cy.intercept('GET', `/fuk/fuk/godisnjiIzvestaj/search/**`).as('searchGI');
    cy.wait('@searchGI').its('response.statusCode').should('eq', 200);
  }

  interceptGIUpdate() {
    cy.intercept('PUT', `/fuk/fuk/zahtevZaGodisnjiIzvestaj/updateWithFile/**`).as('updateGIzahtev');
    cy.wait('@updateGIzahtev').its('response.statusCode').should('eq', 200);
  }
}
export const onAPI = new loginAPI();
