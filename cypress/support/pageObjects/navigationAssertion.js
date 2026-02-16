// Asserts that the correct page header is visible after navigation.
export class navigationAssertion {
  assertPageHeader(expectedText) {
    cy.get('.content-header').should('contain', expectedText).and('be.visible');
  }

  successfulVisitZadaci() {
    this.assertPageHeader('Задаци');
  }

  successfulVisitRizici() {
    this.assertPageHeader('Ризици');
  }

  successfulVisitNepravilnosti() {
    this.assertPageHeader('Неправилности');
  }

  successfulVisitListaProcesa() {
    this.assertPageHeader('Листа процеса');
  }

  successfulVisitProces() {
    this.assertPageHeader('Процеси');
  }

  successfulVisitProcedureUputstva() {
    this.assertPageHeader('Процедуре и упутства');
  }

  successfulVisitOstalaDokumentacija() {
    this.assertPageHeader('Остала документација');
  }

  successfulVisitRegistarRizika() {
    this.assertPageHeader('Регистар ризика');
  }

  successfulVisitGodisnjiIzvestaj() {
    this.assertPageHeader('Годишњи извештај');
  }

  successfulVisitSamoocenjivanje() {
    this.assertPageHeader('Самооцењивање');
  }
}
export const assertNavigation = new navigationAssertion();
