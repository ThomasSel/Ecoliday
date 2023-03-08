import SignUpForm from "./signUpForm";
const navigate = () => {};

describe("Signing up", () => {
  it("calls the /users endpoint", () => {
    cy.mount(<SignUpForm navigate={navigate} />);

    cy.intercept("POST", "/users", { message: "OK" }).as("signUpRequest");

    cy.get('[data-cy="email"]').type("someone@example.com");
    cy.get('[data-cy="password"]').type("password");
    cy.get('[data-cy="signup-submit"]').click();
    cy.wait("@signUpRequest").then((interception) => {
      expect(interception.response.body.message).to.eq("OK");
    });
  });
});
