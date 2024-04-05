/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const TRES_SEGUNDOS = 3000
    beforeEach(function() {
        cy.visit('./src/index.html')
})

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste, Apenas um teste'
        cy.get('#firstName').type('Felipe')
        cy.get('#lastName').type('Teste')
        cy.get('#email').type('felipe@teste.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock() // congela relógio navegador

        cy.get('#firstName').type('Felipe')
        cy.get('#lastName').type('Teste')
        cy.get('#email').type('felipeteste.com')
        cy.get('#open-text-area').type('Texto de teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        
        cy.tick(TRES_SEGUNDOS) //acelera o relógio

        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName').type('Felipe').should('have.value', 'Felipe')
        cy.get('#firstName').clear().should('have.value', '')

        cy.get('#lastName').type('Teste').should('have.value', 'Teste')
        cy.get('#lastName').clear().should('have.value', '')

        cy.get('#email').type('felipe@teste.com').should('have.value', 'felipe@teste.com')
        cy.get('#email').clear().should('have.value', '')

        cy.get('#phone').type('551111111111').should('have.value', '551111111111')
        cy.get('#phone').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.clock()
       
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(TRES_SEGUNDOS)
        cy.get('.error').should('not.be.visible')

    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })    
// testanto com uso da biblioteca lodash onde repete 5 vezes o teste 
    Cypress._.times(5, function () {
    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })
})

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')    
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(function($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })
 
    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]').check()
            .last()
            .uncheck()
            .should('not.be.checked')
    })  

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()

        cy.get('#phone-checkbox').check()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.error').should('be.visible')

        cy.tick(TRES_SEGUNDOS)
        cy.get('.error').should('not.be.visible')
    })
     
    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture("example.json", { encoding: null }).as('exampleFile')
        cy.get('input[type="file"]')
            .selectFile('@exampleFile')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.get('#title').should('contain', 'CAC TAT - Política de privacidade')
    })

    it('testa a página da política de privacidade de forma independente', function() {
        cy.visit('/src/privacy.html')
        cy.get('#title').should('contain', 'CAC TAT - Política de privacidade')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function() {
        const textoGrande = Cypress._.repeat('Texto grande ', 20)
        
        cy.get('#open-text-area')
            .invoke('val', textoGrande) //ctrl V
            .should('have.value', textoGrande)
    })

    it('faz uma requisição HTTP', function() {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response)  {
            expect(response.status).to.equal(200)
            expect(response.statusText).to.eq('OK')
            expect(response.body).contains('CAC TAT')
        })
    })

    it.only('desafio encontre o gato', function() {
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
    })
})

