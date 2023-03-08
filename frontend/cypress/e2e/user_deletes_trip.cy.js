describe("Trips button", () => {
  before(() => {
    cy.signup("newuser200@email.com", "12345678");
  });

  it("when user sves a trip it is visible on trips pages", () => {
    cy.session(["newuser200@email.com", "12345678"], () => {
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
      "/emissions?from=Madrid&to=Belfast&passengers=2",
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
            from: "Madrid, Spain",
            to: "Belfast, UK",
          },
        });
      }
    ).as("getEmissions");

    cy.visit("/");
    cy.get('[data-cy="from"]').type("Madrid");
    cy.get('[data-cy="to"]').type("Belfast");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="saveButton"]').click();
      cy.visit("/trips");
      cy.get('[data-cy="deleteButton"]').first().click();

      cy.get('[data-cy="trips"]').not(
        "contain.text",
        "From:Madrid, SpainTo:Belfast, UKPassengers:2"
      );
    });
  });
});
