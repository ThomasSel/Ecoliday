import LoginForm from "./loginForm";

const navigate = () => {};

describe("Logging in", () => {
  it("calls the /tokens endpoint", () => {
    cy.mount(<LoginForm navigate={navigate} />);

    cy.intercept("POST", "/tokens", { token: "fakeToken" }).as("loginRequest");
    cy.get('[data-cy="login-email"]').type("someone@example.com");
    cy.get('[data-cy="login-password"]').type("password");
    cy.get('[data-cy="login-submit"]').click();
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.body.token).to.eq("fakeToken");
    });
  });
});
