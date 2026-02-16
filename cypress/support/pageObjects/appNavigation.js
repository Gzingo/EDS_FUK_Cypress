export class appNavigation {
  // Helper function for sidebar navigation
  navigateSidebar(menuText, index = null) {
    cy.get('aside')
      .find('ul.sidebar-menu')
      .within(() => {
        if (index !== null) {
          cy.get('li').eq(index).contains(menuText).should('be.visible').click({ force: true });
        } else {
          cy.contains('li', menuText).should('be.visible').click({ force: true });
        }
      });
  }

  getToZadaci() {
    this.navigateSidebar('Задаци', 1);
  }

  wait1sec() {
    cy.wait(1000);
  }

  getToDashboardRizici() {
    this.navigateSidebar('Ризици', 3);
  }

  getToDashboardNepravilnosti() {
    this.navigateSidebar('Неправилности', 4);
  }

  getToListaProcesa() {
    this.navigateSidebar('Листа процеса', 5);
  }

  getToProces() {
    this.navigateSidebar('Процес', 6);
  }

  getToProcedureUputstva() {
    this.navigateSidebar('Процедуре и упутства', 7);
  }

  getToOstalaDokumentacija() {
    this.navigateSidebar('Остала документација', 8);
  }

  getToRegistarRizika() {
    this.navigateSidebar('Регистар ризика', 9);
  }

  getToGodisnjiIzvestaj() {
    cy.get('aside ul.sidebar-menu')
      .contains('li', 'Пословни поступци')
      .should('be.visible')
      .click();
    cy.get('aside ul.sidebar-menu').contains('li', 'Годишњи извештај').should('be.visible').click();
  }

  getToSamoocenjivanje() {
    cy.get('aside ul.sidebar-menu')
      .contains('li', 'Пословни поступци')
      .should('be.visible')
      .click();
    cy.get('aside ul.sidebar-menu').contains('li', 'Самооцењивање').should('be.visible').click();
  }
}
export const navigateTo = new appNavigation();
