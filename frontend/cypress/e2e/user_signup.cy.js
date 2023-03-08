describe("Signing up", () => {
  it("with valid credentials, redirects to '/'", () => {
    cy.visit("/signup");
    cy.get('[data-cy="email"]').type("someone@example.com");
    cy.get('[data-cy="password"]').type("password");
    cy.get('[data-cy="signup-submit"]').click();

    cy.url().should("include", "/");
  });

  it("with missing password, stays on '/signup'", () => {
    cy.visit("/signup");
    cy.get('[data-cy="email"]').type("someone@example.com");
    cy.get('[data-cy="signup-submit"]').click();

    cy.url().should("include", "/signup");
  });

  it("with missing email, stays on '/signup'", () => {
    cy.visit("/signup");
    cy.get('[data-cy="password"]').type("password");
    cy.get('[data-cy="signup-submit"]').click();

    cy.url().should("include", "/signup");
  });
});
