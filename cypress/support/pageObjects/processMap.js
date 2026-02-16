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

export class processMap {
  addNewProcessMap() {
    cy.get('form').within(() => {
      cy.get(`button.btn-primary.ng-star-inserted`).contains('Додавање процеса ').click();
      cy.get('[role="dialog"]').should('be.visible' && 'contain', 'Процеси');
      cy.get('.modal-body').within(() => {
        cy.get('organizaciona-jedinica-lookup:visible').within(() => {
          cy.get('input').type('Direkcija za testiranje', {
            delay: 50,
            force: true,
          });
          cy.get('button').contains('Direkcija za testiranje').should('be.visible').click();
        });
        cy.get('[formcontrolname="nosilacPpOdgovornoLiceId"]')
          .find('select')
          .should('be.visible')
          .select('904', { force: true });
        cy.get('[formcontrolname="naziv"]').type('QA Test Map');
        cy.get('[formcontrolname="aktivnostiListe"]').type('QA Test Activities');
      });
      cy.get('.tab-container').within(() => {
        cy.get('[role="tabpanel"]')
          .find('button')
          .contains('Сачувај и затвори')
          .scrollIntoView()
          .should('be.visible')
          .click();
      });
    });
    // Record the time of Map creation
    const timeRecorded = recordCurrentTimestamp();
  }

  searchListForNewMap() {
    const validStatus = 'Нов';
    const validText = 'QA Test Map';
    const savedTimestamp = getRecordedTimestamp();
    cy.get('.search-form').within(() => {
      cy.get('[formcontrolname="naziv"]').clear({ force: true }).type('QA Test Map');
      cy.get('[formcontrolname="status"]').select('NOV', { force: true });
    });
    // click search button within API interception/wait call
    onAPI.waitForSearchResults();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').each(($unit) => {
          // const validStatus = 'Нов';
          cy.wrap($unit).should('contain', validStatus);
        });
        // const validText = 'QA Test Map';
        cy.get('tr').first().find('td').eq(1).should('have.text', validText);
        cy.get('tr')
          .first()
          .within(() => {
            cy.get('dt-action-edit').find('[type="button"]').click({ force: true });
          });
      });
    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        cy.get('.modal-header').should('contain', 'QA Test Map');
        cy.get('.modal-body')
          .find('[role="tablist"]')
          .should('be.visible')
          .within(() => {
            cy.get('li:contains("Историја активности")').should('be.visible').click();
          });
        cy.get('table')
          .should('be.visible')
          .find('tbody')
          .then(($tbody) => {
            const rowCount = $tbody.find('tr').length;
            if (rowCount === 0) {
              throw new Error('Lista je prazna');
            }
            // const savedTimestamp = getRecordedTimestamp();
            cy.wrap($tbody)
              .find('tr')
              .first()
              .within(() => {
                cy.get('td:not(:last-child)').eq(2).should('contain', validStatus);
                assertTimestampInSecondCellOfFirstRow(savedTimestamp);
              });
          });
      });
  }

  sendNewMapToControl() {
    cy.get('.modal-header').should('be.visible' && 'contain', 'QA Test Map');
    cy.get('.modal-body').within(() => {
      cy.get('button').contains('Пошаљи на контролу').click({ force: true });
    });
    // Set users within Send to control form
    cy.get('[role="dialog"]')
      .eq(1)
      .should('be.visible' && 'contain', 'Пошаљи на контролу')
      .within(() => {
        cy.get('.modal-body')
          .find('[formcontrolname="users"]')
          .within(() => {
            cy.get('button').eq(1).click({ force: true });
          });
      });
    cy.get('users-component')
      .should('exist')
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
    // Assert user list
    cy.get('[formcontrolname="users"]')
      .find('div')
      .eq(1)
      .should('not.be.empty' && 'contain', 'Direkcija Testiranje Edti')
      .and('contain', 'Direkcija Testiranje Edit 2');
    // Add comment and date to Send to control form
    cy.get('.modal-body').find('[id="komentar"]').type('QA Map Test');
    // Add date to Send to control form
    cy.get('.modal-body').find('[id="rok"]').type('01.01.2035');
    // Click send to control button
    cy.get('.modal-footer').find('button').contains(' Пошаљи на контролу ').click();
    // Wait for API
    onAPI.interceptSendMapToControl();
  }

  searchForMapOnControlOnTaskList() {
    const validText = 'Kontrola mape poslovnog procesa';
    const savedTimestamp = getRecordedTimestamp();
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="Title"]').clear({ force: true }).type(validText, { delay: 20 });
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskListMape();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr:first').should('contain', validText);
        cy.get('tr:first').within(() => {
          assertTimestampInList('td', savedTimestamp);
        });
        // Open the selected task
        cy.get('tr:first').find('button').click();
        onAPI.interceptSearchProcessList();
        navigateTo.wait1sec();
      });
  }

  searchForMapOnApprovalOnTaskList() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="Title"]')
        .clear({ force: true })
        .type('Odobravanje mape poslovnog procesa');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').first(($unit) => {
          const validText = 'Direkcija za testiranje';
          cy.wrap($unit).should('contain', validText); // .find('td:not(:last-child)').eq(2)
        });
        const savedTimestamp = getRecordedTimestamp();
        cy.get('tr')
          .first()
          .within(() => {
            assertTimestampInList('td', savedTimestamp);
          });

        // Open the selected task
        cy.get('tr:first').find('button').click();
        onAPI.interceptSearchProcessList();
        navigateTo.wait1sec();
      });
  }

  sendMapToApproval() {
    cy.get('[role="dialog"]')
      .should('be.visible')
      .find('.modal-body')
      .within(() => {
        cy.get('[role="tabpanel"]').find('button').contains('Пошаљи на одобравање').click();
      });
    cy.get('.modal-dialog')
      .find('.modal-footer')
      .eq(1)
      .within(() => {
        cy.get('button[class="btn btn-primary"]').should('contain', 'Дa').click();
      });
    onAPI.interceptCompleteTask();
  }

  sendMapToApprovalDirector() {
    cy.get('[role="dialog"]')
      .should('be.visible' && 'contain', 'QA Test Map')
      .within(() => {
        cy.get('.modal-footer').find('button').contains('Одобри').click({ force: true });
      });
    onAPI.interceptCompleteTask();
  }

  sendMapToReworkDirector() {
    navigateTo.wait1sec();
    cy.get('[role="dialog"]')
      .should('be.visible' && 'contain', 'QA Test Map')
      .within(() => {
        cy.get('.modal-body').find('button').contains('Одбиј').click();
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
    // cy.go('back', { force: true });
  }

  reworkTaskNotVisibleDirector() {
    navigateTo.wait1sec();
    cy.get('.content')
      .find('form')
      .within(() => {
        cy.get('[formcontrolname="Title"]')
          .clear({ force: true })
          .type('Odobravanje mape poslovnog procesa');
        cy.get('button[type="submit"]').contains('Претрага').click();
      });
    onAPI.interceptGetTaskList();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').first(($unit) => {
          const validText = 'Odobravanje mape poslovnog procesa';
          cy.wrap($unit).should('contain', validText); // .find('td:not(:last-child)').eq(0)
        });
        onAPI.interceptSearchProcessList;
        navigateTo.wait1sec();
        const savedTimestamp = getRecordedTimestamp();
        cy.get('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  reworkTaskNotVisible() {
    navigateTo.wait1sec();
    cy.get('.content')
      .find('form')
      .within(() => {
        cy.get('[formcontrolname="Title"]')
          .clear({ force: true })
          .type('Kontrola mape poslovnog procesa');
        cy.get('button[type="submit"]').contains('Претрага').click();
      });
    onAPI.interceptGetTaskList();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').first(($unit) => {
          const validText = 'Kontrola mape poslovnog procesa';
          cy.wrap($unit).should('contain', validText); // .find('td:not(:last-child)').eq(0)
        });
        const savedTimestamp = getRecordedTimestamp();
        cy.get('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  approvalMapTaskNotVisible() {
    navigateTo.wait1sec();
    cy.get('.search-form').within(() => {
      cy.get('[formcontrolname="Title"]')
        .clear({ force: true })
        .type('Kontrola mape poslovnog procesa');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    onAPI.interceptGetTaskList();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr')
          .first()
          .within(($comment) => {
            const validName = 'Kontrola mape poslovnog procesa';
            const validComment = 'QA Map Test';
            cy.wrap($comment).should('contain', validName);
            cy.wrap($comment).should('contain', validComment);
          });
        const savedTimestamp = getRecordedTimestamp();
        cy.get('tr')
          .first()
          .within(() => {
            assertTimestampNotInList('td', savedTimestamp);
          });
      });
  }

  searchForApprovedProcess() {
    const validName = 'QA Test Map';
    const validActivities = 'QA Test Activities';
    const validStatus = 'Актуелни';
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[formcontrolname="naziv"]').clear().type(validName, { delay: 20 });
      cy.get('[formcontrolname="status"]').select('AKTUELNI', { force: true });
      onAPI.waitForSearchResults();
    });
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
        // Checking that there is a queue with the expected name and activities
        let matchFound = false;
        $rows.each((_, row) => {
          const $cells = Cypress.$(row).find('td:not(:last-child)');
          const nameText = $cells.eq(1).text().trim();
          const activitiesText = $cells.eq(2).text().trim();
          if (nameText === validName && activitiesText === validActivities) {
            matchFound = true;
          }
        });
        expect(matchFound, `Da li postoji red sa "${validName}" i "${validActivities}"`).to.be.true;
        // Additional first-line validation
        cy.wrap($rows.first()).within(() => {
          cy.get('td:not(:last-child)').eq(1).should('have.text', validName);
          cy.get('td:not(:last-child)').eq(2).should('have.text', validActivities);
        });
      });
  }

  approvalMapTaskNotVisibleDirector() {
    navigateTo.wait1sec();
    // cy.get('.search-form').within(() => {
    //   cy.get('[formcontrolname="Title"]').clear({force: true}).type('Odobravanje mape poslovnih procesa ');
    //   cy.get('button[type="submit"]').contains('Претрага').click();
    // });
    onAPI.interceptGetTaskList();
    cy.get('.content')
      .find('.box-body')
      .within(() => {
        cy.get('.woDataTable')
          .find('tbody')
          .within(() => {
            cy.get('tr')
              .first()
              .within(($comment) => {
                const validText = 'Odobravanje mape poslovnog procesa';
                cy.wrap($comment).should('contain', validText); // .find('td:not(:last-child)').eq(0)
              });
            const savedTimestamp = getRecordedTimestamp();
            cy.get('tr')
              .first()
              .within(() => {
                assertTimestampNotInList('td', savedTimestamp);
              });
          });
      });
  }

  assertMapListOnApproved() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[id="organizacionaJedinicaId"]')
        .clear({ force: true })
        .type('Direkcija za testiranje');
      cy.get('button').contains('Direkcija za testiranje').should('be.visible').click();
      cy.get('[formcontrolname="status"]').select('AKTUELNA', { force: true });
      onAPI.waitForSearchResults();
    });
    // onAPI.interceptSuccessfulMapSearch();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').first(() => {
          const validUnit = 'Direkcija za testiranje';
          const validVersion = 'QA Test Version';
          const validStatus = 'Актуелни';
          cy.get('td:not(:last-child)').eq(0).should('have.text', validUnit);
          cy.get('td:not(:last-child)').eq(1).should('have.text', validVersion);
          cy.get('td:not(:last-child)').eq(2).should('have.text', validStatus);
        });
        cy.get('tr')
          .eq(1)
          .within(() => {
            const validUnit = 'Direkcija za testiranje';
            const validStatus = ['Архивирана', 'Нова', 'На контроли', 'На одобравању', 'Одобрена'];
            cy.get('td:not(:last-child)').eq(0).should('have.text', validUnit);
            cy.get('td:not(:last-child)')
              .eq(2)
              .invoke('text')
              .then((statusText) => {
                const trimmedStatus = statusText.trim();
                expect(validStatus).to.include(trimmedStatus);
              });
          });
      });
  }

  onProcessMapOnControlVisible() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[id="naziv"]').clear({ force: true }).type('QA Test Map');
      cy.get('[formcontrolname="status"]').select('NA_KONTROLI');
    });
    // click search button within API interception/wait call
    onAPI.waitForSearchResults();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').each(($unit) => {
          const validText = 'QA Test Map';
          cy.wrap($unit).find('td').eq(1).should('contain', validText);
        });
        cy.get('tr')
          .first()
          .find('td:last-child')
          .within(() => {
            cy.get('dt-action-details').find('button').click();
          });
      });
    cy.get('fuk-istorija-promena-form')
      .find('form')
      .within(() => {
        cy.get('ul[role="tablist"]')
          .find('li')
          .eq(2)
          .within(() => {
            cy.get('a').contains('Историја активности').click({ force: true });
          });
      });
    cy.get('fuk-status-procesa-istorija-promena')
      .find('table')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
            const validTexts = ['На контроли', 'На одобравању'];
            cy.get('td')
              .eq(2)
              .invoke('text')
              .then((text) => {
                const matchFound = validTexts.some((valid) => text.includes(valid));
                expect(matchFound).to.be.true;
              });
          });
      });
    cy.get('fuk-status-procesa-istorija-promena')
      .find('table')
      .should('be.visible')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
            const validTexts = ['На контроли', 'На одобравању'];
            cy.get('td')
              .eq(2)
              .invoke('text')
              .then((text) => {
                const cleanedText = text.trim();
                const matchFound = validTexts.some((valid) => cleanedText.includes(valid));
                expect(
                  matchFound,
                  `Expected text "${cleanedText}" to contain one of the values: ${validTexts.join(
                    ', '
                  )}`
                ).to.be.true;
              });
          });
      });
    cy.closeAllPopups();
  }

  onProcessMapOnApprovalVisible() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[id="naziv"]').clear({ force: true }).type('QA Test Map');
      cy.get('[formcontrolname="status"]').select('NA_ODOBRAVANJU');
    });
    // click search button within API interception/wait call
    onAPI.waitForSearchResults();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').each(($unit) => {
          const validText = 'QA Test Map';
          cy.wrap($unit).find('td:not(:last-child)').eq(1).should('contain', validText);
        });
        cy.get('tr')
          .first()
          .find('td:last-child')
          .within(() => {
            cy.get('dt-action-details').find('button').click({ force: true });
          });
      });
    cy.get('fuk-istorija-promena-form')
      .find('form')
      .within(() => {
        cy.get('ul[role="tablist"]')
          .find('li')
          .eq(2)
          .within(() => {
            cy.get('a').contains('Историја активности').click({ force: true });
          });
      });
    cy.get('fuk-status-procesa-istorija-promena')
      .find('table')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
            const validTexts = ['На контроли', 'На одобравању'];
            cy.get('td')
              .eq(2)
              .invoke('text')
              .then((text) => {
                const matchFound = validTexts.some((valid) => text.includes(valid));
                expect(matchFound).to.be.true;
              });
          });
      });
    cy.get('fuk-status-procesa-istorija-promena')
      .find('table')
      .should('be.visible')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
            const validTexts = ['На контроли', 'На одобравању'];
            cy.get('td')
              .eq(2)
              .invoke('text')
              .then((text) => {
                const cleanedText = text.trim();
                const matchFound = validTexts.some((valid) => cleanedText.includes(valid));
                expect(
                  matchFound,
                  `Expected text "${cleanedText}" to contain one of the values: ${validTexts.join(
                    ', '
                  )}`
                ).to.be.true;
              });
          });
      });
    cy.closeAllPopups();
  }

  deleteAllFirstMatchingMap() {
    cy.plAdminLogin();
    onAPI.interceptSuccessfulLogin();
    assertLoginPage.successfulAdminLogin();
    navigateTo.getToProces();
    cy.get('form').within(() => {
      cy.get('[id="naziv"]').clear({ force: true }).type('QA Test Map');
      // cy.get('[formcontrolname="status"]').select('NA_KONTROLI');
      cy.get('button[type="submit"]').contains('Претрага').click();
    });
    navigateTo.wait1sec();
    cy.get('table').should('be.visible');
    function deleteOne() {
      cy.document().then((doc) => {
        const rows = doc.querySelectorAll('tbody tr');
        const matchingRow = Array.from(rows).find((row) => row.innerText.includes('QA Test Map'));
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

  sendMapBackToRework() {
    navigateTo.wait1sec();
    cy.get('[role="dialog"]')
      .should('be.visible')
      .find('.modal-body')
      .within(() => {
        cy.get('[role="tabpanel"]')
          .find('button')
          .contains('Врати на дораду')
          .click({ force: true });
      });
    // Enter the comment
    cy.get('.modal-dialog')
      .find('.modal-body')
      .eq(1)
      .within(() => {
        cy.get('textarea[id="komentar"]').type('Rework', { force: true, delay: 20 });
      });
    // Send to rework
    cy.get('.modal-dialog')
      .find('.modal-footer')
      .eq(1)
      .within(() => {
        cy.get('button[class="btn btn-primary"]')
          .should('contain', 'Врати на дораду')
          .click({ force: true });
      });
    // cy.go('back', {force: true});
  }

  onProcessMapOnReworkVisible() {
    navigateTo.wait1sec();
    cy.get('form').within(() => {
      cy.get('[id="naziv"]').clear({ force: true }).type('QA Test Map');
      cy.get('[formcontrolname="status"]').select('NOV');
    });
    // click search button within API interception/wait call
    onAPI.waitForSearchResults();
    navigateTo.wait1sec();
    cy.get('table')
      .find('tbody')
      .within(() => {
        cy.get('tr').first(($unit) => {
          const validText = 'QA Test Map';
          cy.wrap($unit).should('contain', validText); // .find('td').eq(1)
        });
        cy.get('tr')
          .first()
          .find('td:last-child')
          .within(() => {
            cy.get('dt-action-details').find('button').click();
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
    cy.get('fuk-status-procesa-istorija-promena')
      .find('table')
      .within(() => {
        cy.get('tr')
          .eq(1)
          .within(() => {
            const savedTimestamp = getRecordedTimestamp();
            assertTimestampInSecondCellOfFirstRow(savedTimestamp);
            const validText = 'Нов';
            cy.get('td').eq(2).should('contain', validText);
            cy.get('td')
              .eq(2)
              .should('not.be.empty')
              .invoke('text')
              .then((text) => {
                expect(
                  text.includes(validText),
                  `Expected cell to include "${validText}", but got "${text}"`
                ).to.be.true;
              });
          });
      });
  }
}
export const onProcessMap = new processMap();
