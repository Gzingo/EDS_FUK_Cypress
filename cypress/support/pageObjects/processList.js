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

export class processList {
  addNewProcessList() {
    cy.get('form').within(() => {
      cy.get(`button.btn-primary.ng-star-inserted`).click();
      cy.get('[role="dialog"]').should('be.visible' && 'contain', ' Листа процеса ');
      cy.get('.modal-body').within(() => {
        cy.get('organizaciona-jedinica-lookup:visible').within(() => {
          cy.get('input').clear({ force: true }).type('Direkcija za testiranje', {
            delay: 50,
            force: true,
          });
          cy.get('button')
            .contains('Direkcija za testiranje')
            .should('be.visible')
            .click({ force: true });
        });
        cy.get('[formcontrolname="rukovodilacId"]').within(() => {
          cy.get('select').should('be.visible').select('905');
        });
      });
      cy.get('[role="tabpanel"]')
        .find('.row')
        .eq(1)
        .within(() => {
          cy.get('[id="datum"]').clear().type('22.04.2035');
          cy.get('div').eq(3).find('input').clear().type('QA Test Version');
        });
      cy.get('.modal-footer').find('button').contains('Сачувај и затвори').click();
      // Record the time of New Process creation
      const timeRecorded = recordCurrentTimestamp();
      cy.log(timeRecorded);
    });
  }

  searchNewProcessList() {
    navigateTo.wait1sec();
    cy.get('.content')
      .find('form')
      .within(() => {
        cy.get('[id="organizacionaJedinicaId"]')
          .clear({ force: true })
          .type('Direkcija za testiranje');
        cy.get('button').contains('Direkcija za testiranje').should('be.visible').click();
        cy.get('[formcontrolname="status"]').select('NOVA');
        cy.get('button[type="submit"]').contains('Претрага').click();
      });
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Direkcija za testiranje';
        const validStatus = 'Нова';
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).should('contain', validText);
            cy.wrap($unit).should('contain', validStatus);
          });
      });
  }

  searchProcessListOnApproval() {
    navigateTo.wait1sec();
    cy.get('.content')
      .find('form')
      .within(() => {
        cy.get('[id="organizacionaJedinicaId"]').type('Direkcija za testiranje');
        cy.get('button').contains('Direkcija za testiranje').should('be.visible').click();
        cy.get('[formcontrolname="status"]').select('На одобравању ');
        cy.get('button[type="submit"]').contains('Претрага').click();
      });
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Direkcija za testiranje';
        const validStatus = 'На одобравању';
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).find('td').eq(0).should('have.text', validText);
            cy.wrap($unit).find('td').eq(2).should('have.text', validStatus);
          });
      });
  }

  searchForProcessOnControl() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="status"]').select('NA_KONTROLI');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptSuccessfulSearch();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validStatus = 'На контроли';
        const validVersion = 'QA Test Version';
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).should('contain', validStatus);
          });
        cy.wrap($tbody).find('tr').first().should('contain', validVersion);
      });
  }

  searchForProcessOnApproval() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="status"]').select('NA_ODOBRAVANJU');
      cy.get('[formcontrolname="datumDo"]').clear().type('22.04.2035');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptSuccessfulSearch();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'На одобравању';
        const validVersion = 'QA Test Version';
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).should('contain', validText); // .find('td:not(:last-child)').eq(2)
          });
        cy.wrap($tbody).find('tr').first().should('contain', validVersion); // .find('td:not(:last-child)').eq(1)
      });
    onAPI.interceptSearchProcessList();
  }

  searchForApprovedProcess() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="status"]').select('Актуелна');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptSuccessfulSearch();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Актуелна';
        const validVersion = 'QA Test Version';
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).find('td:not(:last-child)').eq(2).should('have.text', validText);
          });
        cy.wrap($tbody)
          .find('tr')
          .first()
          .find('td:not(:last-child)')
          .eq(1)
          .should('have.text', validVersion);
      });
  }

  assertProcessListOnApproved() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="status"]').select('Актуелна');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptSuccessfulSearch();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validUnit = 'Direkcija za testiranje';
        const validVersion = 'QA Test Version';
        const validStatus = 'Актуелна';
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            cy.get('td:not(:last-child)').eq(0).should('have.text', validUnit);
            cy.get('td:not(:last-child)').eq(1).should('have.text', validVersion);
            cy.get('td:not(:last-child)').eq(2).should('have.text', validStatus);
          });
      });
  }

  sendNewProcessListToControl() {
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr')
          .first()
          .within(() => {
            cy.get('dt-action-edit').find('[type="button"]').click();
          });
      });
    cy.get('.modal-footer')
      .should('be.visible')
      .within(() => {
        // Click Save button
        cy.get('button').contains('Сачувај').click();
      });
    cy.get('.clearfix').should('be.visible' && 'contain', 'Подаци су успешно сачувани');
    cy.get('.modal-footer')
      .should('be.visible')
      .within(() => {
        // Open Send to control form
        cy.get('button').contains('Пошаљи на контролу ').click();
      });
    // Set users within Send to control form
    cy.get('[role="dialog"]')
      .eq(1)
      .should('be.visible' && 'contain', 'Пошаљи на контролу')
      .within(() => {
        cy.get('.modal-body')
          .find('[formcontrolname="users"]')
          .within(() => {
            cy.get('button').eq(1).click();
          });
      });
    cy.get('users-component')
      .should('be.visible')
      .find('[class="panel panel-default"]')
      .within(() => {
        // Check first user
        cy.get('.table tbody')
          .find('tr')
          .eq(0)
          .within(() => {
            cy.get('input[type="checkbox"]').check();
          });
        // Check second user
        cy.get('.table tbody')
          .find('tr')
          .eq(1)
          .within(() => {
            cy.get('input[type="checkbox"]').check();
          });
      });
    // Click confirm button
    cy.get('.modal-footer').find('button').contains(' Потврда ').click();
    // Add comment and date to Send to control form
    cy.get('.modal-body').find('[id="komentar"]').type('QA Test');
    // Add date to Send to control form
    cy.get('.modal-body').find('[id="rok"]').type('01.01.2035');
    // Click send to control button
    cy.get('.modal-footer').find('button').contains(' Пошаљи на контролу ').click();
    // Wait for API
    onAPI.interceptSendToControl();
  }

  searchForTaskOnControlOnTaskList() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="Title"]').clear({ force: true }).type('Kontrola liste');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'QA Test';
        const savedTimestamp = getRecordedTimestamp();
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            cy.get('td:not(:last-child)').eq(4).should('contain', validText);
            assertTimestampInList('td', savedTimestamp);
            cy.get('button').click();
          });
        onAPI.interceptSearchProcessList();
        navigateTo.wait1sec();
      });
  }

  searchForTaskOnApprovalOnTaskList() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="Title"]').clear({ force: true }).type('Odobravanje liste');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Direkcija za testiranje';
        const savedTimestamp = getRecordedTimestamp();
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).find('td:not(:last-child)').eq(2).should('have.text', validText);
          });
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            assertTimestampInList('td', savedTimestamp);
            cy.get('button').click();
          });
        onAPI.interceptSearchProcessList();
        navigateTo.wait1sec();
      });
  }

  sendProcessToApproval() {
    cy.get('[role="dialog"]')
      .should('be.visible' && 'contain', 'Листа процеса - Direkcija za testiranje')
      .within(() => {
        cy.get('.modal-footer').find('button').contains('Пошаљи на одобравање').click();
      });
    cy.get('.modal-dialog')
      .find('.modal-footer')
      .eq(1)
      .within(() => {
        cy.get('button[class="btn btn-primary"]').should('contain', 'Дa').click();
      });
    navigateTo.wait1sec();
    cy.closeAllPopups();
  }

  sendProcessToApprovalDirector() {
    cy.get('[role="dialog"]')
      .should('be.visible' && 'contain', 'Листа процеса - Direkcija za testiranje')
      .within(() => {
        cy.get('.modal-footer').find('button').contains('Одобри ').click();
      });
    cy.get('.modal-dialog')
      .find('.modal-footer')
      .eq(1)
      .within(() => {
        cy.get('button[class="btn btn-primary"]').should('contain', 'Дa').click();
      });
    navigateTo.wait1sec();
  }

  sendProcessBackToRework() {
    navigateTo.wait1sec();
    cy.get('[role="dialog"]')
      .should('be.visible' && 'contain', 'Листа процеса - Direkcija za testiranje')
      .within(() => {
        cy.get('.modal-footer').find('button').contains('Врати на дораду').click();
      });
    // Enter the comment
    cy.get('.modal-dialog')
      .find('.modal-body')
      .eq(1)
      .within(() => {
        cy.get('textarea[id="komentar"]').type('Rework', { force: true });
      });
    // Send to rework
    cy.get('.modal-dialog')
      .find('.modal-footer')
      .eq(1)
      .within(() => {
        cy.get('button[class="btn btn-primary"]').should('contain', 'Врати на дораду').click();
      });
  }

  sendProcessToReworkDirector() {
    navigateTo.wait1sec();
    cy.get('[role="dialog"]')
      .should('be.visible' && 'contain', 'Листа процеса - Direkcija za testiranje')
      .within(() => {
        cy.get('.modal-footer').find('button').contains('Одбиј').click();
      });
    // Enter the comment
    cy.get('.modal-dialog')
      .find('.modal-body')
      .eq(1)
      .within(() => {
        cy.get('textarea[id="komentar"]').type('Director Rework', { force: true });
      });
    // Send to rework
    cy.get('.modal-dialog')
      .find('.modal-footer')
      .eq(1)
      .within(() => {
        cy.get('button[class="btn btn-primary"]').should('contain', 'Врати на дораду').click();
      });
    onAPI.interceptCompleteTask();
  }

  reworkTaskNotVisible() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="Title"]').clear().type('Kontrola liste');
      cy.get('button[type="submit"]').contains('Претрага').click({ force: true });
    });
    onAPI.interceptGetTaskList();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'QA Test';
        const savedTimestamp = getRecordedTimestamp();
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(($comment) => {
            cy.wrap($comment).find('td:not(:last-child)').eq(4).should('have.text', validText);
          });
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  approvalTaskNotVisible() {
    navigateTo.wait1sec();
    cy.get('.search-form').within(() => {
      cy.get('[formcontrolname="Title"]').clear({ force: true }).type('Kontrola liste');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'QA Test';
        const savedTimestamp = getRecordedTimestamp();
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(($comment) => {
            cy.wrap($comment).contains('td:not(:last-child)', validText).should('exist');
          });
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  approvalTaskNotVisibleDirector() {
    navigateTo.wait1sec();
    cy.get('.search-form').within(() => {
      cy.get('[formcontrolname="Title"]').clear({ force: true }).type('Odobravanje liste');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Odobravanje liste poslovnih procesa';
        const savedTimestamp = getRecordedTimestamp();
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(($comment) => {
            cy.wrap($comment).find('td:not(:last-child)').eq(0).should('have.text', validText);
          });
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  reworkTaskNotVisibleDirector() {
    navigateTo.wait1sec();
    cy.get('.content')
      .find('form')
      .within(() => {
        cy.get('[formcontrolname="Title"]')
          .clear({ force: true })
          .type('Odobravanje liste', { delay: 20 });
        cy.get('button[type="submit"]').contains('Претрага').click();
      });
    onAPI.interceptGetTaskList();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Odobravanje liste poslovnih procesa';
        const savedTimestamp = getRecordedTimestamp();
        cy.wrap($tbody)
          .find('tr')
          .each(($unit) => {
            cy.wrap($unit).find('td:not(:last-child)').eq(0).should('have.text', validText);
          });
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  onProcessListTaskVisible() {
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Direkcija za testiranje';
        const validStatus = 'Нова';
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            cy.get('td').eq(0).should('have.text', validText);
            cy.get('td').eq(2).should('have.text', validStatus);
            cy.get('td:last-child').within(() => {
              cy.get('dt-action-details').find('button').click();
            });
          });
      });
    cy.get('fuk-istorija-promena-form')
      .find('form')
      .within(() => {
        cy.get('ul[role="tablist"]')
          .find('li')
          .eq(2)
          .within(() => {
            cy.get('a').contains('Историја активности').click();
          });
      });
    cy.get('fuk-lista-procesa-istorija-promena')
      .find('table')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
          });
      });
  }

  searchForApprovedProcessList() {
    const validDate = '22.04.2035';
    const validComment = 'QA Test Activities';
    const validStatus = 'Нова';
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="datumDo"]').clear().type(validDate);
      cy.get('[formcontrolname="status"]').select('NOVA', { force: true });
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptSuccessfulSearch();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const $rows = $tbody.find('tr');
        if ($rows.length === 0) {
          throw new Error('Nema rezultata pretrage — lista je prazna');
        }
        // Status validation in each row
        cy.wrap($rows).each(($row) => {
          cy.wrap($row)
            .find('td:not(:last-child)')
            .eq(3)
            .invoke('text')
            .then((text) => {
              const cleaned = text.replace(/\u00a0/g, ' ').trim();
              expect(cleaned).to.eq(validStatus);
            });
        });
        // Checking that there is a queue with the expected date and comment
        let matchFound = false;
        $rows.each((_, row) => {
          const $cells = Cypress.$(row).find('td:not(:last-child)');
          const dateText = $cells.eq(1).text().trim();
          const commentText = $cells.eq(4).text().trim();
          if (dateText === validDate && commentText === validComment) {
            matchFound = true;
          }
        });
        expect(matchFound, `Da li postoji red sa "${validDate}" i "${validComment}"`).to.be.true;
        // Additional first-line validation
        cy.wrap($rows.first()).within(() => {
          cy.get('td:not(:last-child)').eq(1).should('have.text', validDate);
          cy.get('td:not(:last-child)').eq(2).should('have.text', validComment);
        });
      });
  }

  adminAssertProcessTaskVisible() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('organizaciona-jedinica-lookup:visible').within(() => {
        cy.get('input').clear({ force: true }).type('Direkcija', {
          delay: 50,
          force: true,
        });
        cy.get('button')
          .contains('Direkcija za testiranje')
          .should('be.visible')
          .click({ force: true });
      });
      cy.get('button[type="submit"]').contains('Претрага').click();
      navigateTo.wait1sec();
    });
    cy.get('table')
      .find('tbody')
      .then(($tbody) => {
        const rowCount = $tbody.find('tr').length;
        if (rowCount === 0) {
          throw new Error('Lista je prazna');
        }
        const validText = 'Direkcija za testiranje';
        const validStatus = 'Нова';
        cy.wrap($tbody)
          .find('tr')
          .first()
          .within(() => {
            cy.get('td').eq(0).should('have.text', validText);
            cy.get('td').eq(2).should('have.text', validStatus);
            cy.get('td:last-child').within(() => {
              cy.get('dt-action-details').find('button').click();
            });
          });
      });
    cy.get('fuk-istorija-promena-form')
      .find('form')
      .within(() => {
        cy.get('ul[role="tablist"]')
          .find('li')
          .eq(2)
          .within(() => {
            cy.get('a').contains('Историја активности').click();
          });
      });
    cy.get('fuk-lista-procesa-istorija-promena')
      .find('table')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
          });
      });
  }

  deleteAllFirstMatchingProcess() {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToListaProcesa();
    cy.get('form').within(() => {
      cy.get('[id="organizacionaJedinicaId"]')
        .clear({ force: true })
        .type('Direkcija za testiranje', {
          delay: 50,
          force: true,
        });
      cy.get('[role="listbox"]')
        .find('button')
        .contains('/ОРГАНИЗАЦИЈА/Скупштина друштва/Sistem za testiranje/Direkcija za testiranje')
        .click();
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    navigateTo.wait1sec();
    cy.get('table').should('be.visible');
    function deleteOne() {
      cy.document().then((doc) => {
        const rows = doc.querySelectorAll('tbody tr');
        const matchingRow = Array.from(rows).find((row) =>
          row.innerText.includes('QA Test Version')
        );
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
            .click();
          cy.wait(500);
          deleteOne(); // continue recursion
        } else {
          cy.log('No more matching rows to delete');
        }
      });
    }
    deleteOne();
  }
}
export const onProcessList = new processList();
