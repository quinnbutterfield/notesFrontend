

describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Quinn Butterfield',
      username: 'quinn',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000/')
  })
  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains('Note App, Quinn Butterfield, 2020')
  })
  it('loginform can be opened', function () {
    cy.contains('log in').click()
    cy.get('#username').type('quinn')
    cy.get('#password').type('password')
    cy.get('#login-button').click()

    cy.contains('Quinn Butterfield logged-in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'quinn', password: 'password' })
    })
    it('a new note can be created', function () {
      cy.contains('new note').click()
      cy.get('#newNote').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })
    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it.only('it can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click()
          .should('contain', 'make unimportant')
      })

    })

  })

  it('login fails with wrong password', function () {
    cy.contains('log in').click()
    cy.get('#username').type('quinn')
      .get('#password').type('wrong')
      .get('#login-button').click()

    cy.get('.error')
      .should('have.css', 'border-style', 'solid')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('contain', 'Wrong credentials')

    cy.get('html').should('not.contain', 'Quinn Butterfield logged in')
  })

})