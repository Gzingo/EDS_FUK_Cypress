import { navigateTo } from './appNavigation';
import { onAPI } from './loginAPI';
import {
  saveCurrentTimestamp,
  assertTimestampInList,
  assertTimestampNotInList,
  recordCurrentTimestamp,
  getRecordedTimestamp,
  assertTimestampInSecondCellOfFirstRow,
} from '../dateUtils';
import { assertLoginPage } from './loginPageAsserts';
import { onLoginPage } from './loginPage';

export class godisnjiIzvestaj {
  successfulGIPageVisit() {
    cy.url().should('contain', 'godisnjiIzvestaj');
  }

  addNewReport() {
    cy.get('form').within(() => {
      cy.get('button[type="button"]').contains('Додавање').click();
    });
    cy.get('[role="tabpanel"]')
      .should('be.visible')
      .within(() => {
        cy.get('[formcontrolname="naziv"]').type('QA Теst godišnji izveštaj', {
          delay: 50,
          force: true,
        });
        cy.get('[formcontrolname="godina"]').type('1982', { delay: 10, force: true });
        cy.get('[formcontrolname="rok"]').within(() => {
          cy.get('input[type="text"]').type('31.12.2025', { delay: 20, force: true });
        });
      });
    cy.get('button').contains('Сачувај').should('be.visible').click();
    onAPI.interceptAddGI();
    // Record the time of New Process creation
    const timeRecorded = recordCurrentTimestamp();
    cy.get('dmtable').should('be.visible');
    cy.get('fuk-zahtev-za-godisnji-izvestaj').should('be.visible');
  }

  addDocumentToTheForm() {
    cy.get('dmtable')
      .find('form')
      .within(() => {
        cy.get('button[title="Нови документ"]').click();
      });
    cy.get('[role="dialog"]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Нови документ')
      .find('.modal-body')
      .within(() => {
        cy.get('[class="fileUploadBtn"]').click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/WordDoc.docx', {
          delay: 10,
          force: true,
        });
      });
    cy.get('[role="dialog"]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Нови документ')
      .find('.modal-footer')
      .within(() => {
        cy.get('button[type="submit"]').should('contain.text', 'ОК').click();
      });
    cy.get('[role="dialog"]')
      .first()
      .should('be.visible')
      .and('contain', 'Годишњи извештај  - У изради')
      .find('table tbody tr')
      .should('be.visible')
      .and('contain', 'WordDoc.docx');
  }

  sendReportRequest({ orgCelina = 'Direkcija za testiranje' } = {}) {
    cy.get('fuk-zahtev-za-godisnji-izvestaj').find('button').contains('Креирај').click();
    cy.get('[role="dialog"]')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Захтев за годишњи извештај')
      .find('.modal-body')
      .within(() => {
        cy.get('#organizacionaCelinaId').type(orgCelina, {
          delay: 20,
          force: true,
        });
        cy.get('button[role="option"]').contains(orgCelina).click({ force: true });
        cy.get('#organizacionaCelinaId')
          .invoke('val')
          .then((value) => {
            cy.log('Selected option is:', value);
            expect(value).to.equal(
              '/ОРГАНИЗАЦИЈА/Скупштина друштва/Sistem za testiranje/Direkcija za testiranje'
            );
          });
        cy.get('#korisnik').type('Direkcija', { delay: 20 });
        cy.get('button[role="option"]')
          .contains('Direkcija Testiranje Edti')
          .should('exist')
          .click({ force: true });
        cy.get('#textPoruke').type('QA Test Report', { delay: 20 });
      });
    cy.get('.modal-footer').find('button').contains('Креирај').click();
    cy.get('fuk-zahtev-za-godisnji-izvestaj').within(() => {
      cy.get('table tbody')
        .find('tr')
        .first()
        .within(() => {
          cy.get('td').eq(0).should('contain.text', 'Direkcija za testiranje');
          cy.get('td').eq(1).should('contain.text', 'Direkcija Testiranje Edti');
          cy.get('td').eq(4).should('contain.text', 'Креиран');
          cy.get('td').last().find('button[type="button"]').eq(1).click();
        });
    });
    navigateTo.wait1sec();
    // onAPI.interceptGetTaskList();
    cy.get('[role="dialog"]')
      .eq(1) // find the right slot!!
      .should('be.visible')
      .and('contain', 'Захтев за годишњи извештај')
      .find('.modal-footer')
      .within(() => {
        cy.get('button').contains('Упути').should('be.visible').click();
      });
    cy.get('[role="dialog"]')
      .eq(2)
      .should('be.visible')
      .and('contain', ' Да ли сте сигурни да желите да упутите захтев за годишњи извештај? ')
      .within(() => {
        cy.get('[type="button"]').contains('Дa').click({ force: true });
      });
    onAPI.interceptGIUpdate();
    cy.get('fuk-godisnji-izvestaj-dialog')
      .find('[role="dialog"]')
      .within(() => {
        cy.get('.modal-header')
          .should('be.visible')
          .and('contain', 'Годишњи извештај')
          .find('button[class="close"]')
          .click();
      });
  }

  reportRequestVisibleDT1() {
    navigateTo.wait1sec();
    cy.get('.search-form').within(() => {
      cy.get('[formcontrolname="Title"]').clear().type('Popunjavanje i prilaganje', { delay: 20 });
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr')
          .first()
          .within(($comment) => {
            const validComment = 'QA Test Report';
            cy.wrap($comment).should('contain', validComment);
          });
        const savedTimestamp = getRecordedTimestamp();
        cy.get('tr')
          .first()
          .within(() => {
            assertTimestampInList('td', savedTimestamp);
          });
      });
  }

  deleteFirstMatchingIzvestaj() {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulRoleGILogin();
    navigateTo.getToGodisnjiIzvestaj();
    onGI.successfulGIPageVisit();
    cy.get('form').within(() => {
      cy.get('#naziv').type('QA Теst godišnji izveštaj', { delay: 30, force: true });
      cy.get('#godina').type('1982', { delay: 30, force: true });
      cy.get('#rokDo').click({ force: true }).type('31.12.2025', { delay: 30 });
      cy.get('button[type="submit"]').contains('Претрага').click();
    });

    navigateTo.wait1sec();
    cy.get('table').should('be.visible');
    function deleteOne(maxTries = 10, tries = 0) {
      if (tries >= maxTries) return;
      cy.document().then((doc) => {
        const rows = doc.querySelectorAll('tbody tr');
        const matchingRow = Array.from(rows).find((row) => row.innerText.includes('1982'));
        if (matchingRow) {
          cy.wrap(matchingRow)
            .find('dt-action-delete button')
            .should('be.visible')
            .click({ force: true });
          cy.get('[role="dialog"]')
            .should('exist')
            .find('[type="button"]')
            .eq(1)
            .should('contain', 'Дa')
            .click({ force: true });
          cy.wait(500);
          deleteOne(maxTries, tries + 1);
        } else {
          cy.log('No more matching rows to delete');
        }
      });
    }
    deleteOne();
  }
}
export const onGI = new godisnjiIzvestaj();
