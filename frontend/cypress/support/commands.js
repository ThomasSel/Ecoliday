// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
Cypress.Commands.add("signup", (email, password) => {
  cy.visit("/signup");
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="signup-submit"]').click();
});

// Cypress.Commands.add("login", (email, password) => {
//   cy.request({
//     method: 'POST',
//     url: "http://localhost:8080/tokens",
//     body: {
//         email: email,
//         password: password,
//     }
//   // })
//   // .then((response) => {
//   //   return response.json();
//   })
//   .then((data) => {
//     window.localStorage.setItem("token", data.token)
//   })
// }

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
