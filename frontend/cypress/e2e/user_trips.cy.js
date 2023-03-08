describe("Trips button", () => {
  before(() => {
    cy.signup("newuser200@email.com", "12345678");
  });
  it("redirects to the user trips page when logged in", () => {
    cy.session(["newuser200@email.com", "12345678"], () => {
      cy.request({
        method: "POST",
        url: "/tokens",
        body: { email: "newuser200@email.com", password: "12345678" },
      }).then(({ body }) => {
        window.localStorage.setItem("token", body.token);
      });
    });
    cy.visit("/");
    cy.get('[data-cy="navbar-trips"]').click();

    cy.url().should("include", "/trips");
  });

  it("when user not logged in the trips button not visible", () => {
    cy.visit("/");
    cy.get('[data-cy="navbar-trips"]').should("not.exist");
  });

  it("when user not logged in the save button is not visible", () => {
    cy.intercept(
      "GET",
      "/emissions?from=London&to=Berlin&passengers=2",
      (req) => {
        req.reply({
          statusCode: 200,
          body: {
            message: "OK",
            emissions: {
              plane: { total: 31.547396, perPassenger: 15.773698 },
              petrolCar: { total: 30.547396, perPassenger: 14.773698 },
              electricCar: { total: 29.547396, perPassenger: 13.773698 },
              train: { total: 28.547396, perPassenger: 12.773698 },
            },
            from: "London, ENG, United Kingdom",
            to: "Berlin, Germany",
          },
        });
      }
    ).as("getEmissions");

    cy.visit("/");
    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="saveButton"]').should("not.exist");
    });
  });

  describe("when token is available", () => {
    before(() => {
      cy.signup("newuser201@email.com", "12345678");
    });

    beforeEach(() => {
      cy.session(["newuser201@email.com", "12345678"], () => {
        cy.request({
          method: "POST",
          url: "/tokens",
          body: { email: "newuser200@email.com", password: "12345678" },
        }).then(({ body }) => {
          window.localStorage.setItem("token", body.token);
        });
      });

      cy.intercept(
        "GET",
        "/emissions?from=London&to=Berlin&passengers=2",
        (req) => {
          req.reply({
            statusCode: 200,
            body: {
              message: "OK",
              emissions: {
                plane: { total: 31.547396, perPassenger: 15.773698 },
                petrolCar: { total: 30.547396, perPassenger: 14.773698 },
                electricCar: { total: 29.547396, perPassenger: 13.773698 },
                train: { total: 28.547396, perPassenger: 12.773698 },
              },
              from: "London, ENG, United Kingdom",
              to: "Berlin, Germany",
            },
          });
        }
      ).as("getEmissions");

      cy.visit("/");
      cy.get('[data-cy="from"]').type("London");
      cy.get('[data-cy="to"]').type("Berlin");
      cy.get('[data-cy="passengers"]').type("2");
      cy.get('[data-cy="travelFormSubmit"]').click();
    });

    it("the save button is visible", () => {
      cy.wait("@getEmissions").then(() => {
        cy.get('[data-cy="saveButton"]').should("exist");
      });
    });

    it("a user can save a trip it is visible on trips pages", () => {
      cy.wait("@getEmissions").then(() => {
        cy.get('[data-cy="saveButton"]').click();
        cy.visit("/trips");
        cy.get('[data-cy="trips"]').should(
          "contain.text",
          "From:London, ENG, United KingdomTo:Berlin, GermanyPassengers:2"
        );
      });
    });
  });
});
