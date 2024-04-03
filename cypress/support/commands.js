Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Teste')
    cy.get('#email').type('felipe@teste.com')
    cy.get('#open-text-area').type('Texto de teste')
    cy.contains('button', 'Enviar').click()
})
