describe("User emission search", () => {
  beforeEach(() => {
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
  });

  it("user sucessfully completes a search and renders plane results on the page", () => {
    cy.visit("/");
    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="total-emissions-plane"]').should(
        "contain.text",
        "31.5"
      );
      cy.get('[data-cy="person-emissions-plane"]').should(
        "contain.text",
        "15.8"
      );
    });
  });

  it("user sucessfully completes a search and renders plane and petrol car results on the page", () => {
    cy.visit("/");
    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="total-emissions-plane"]').should(
        "contain.text",
        "31.5"
      );
      cy.get('[data-cy="person-emissions-plane"]').should(
        "contain.text",
        "15.8"
      );
      cy.get('[data-cy="total-emissions-petrol car"]').should(
        "contain.text",
        "30.5"
      );
      cy.get('[data-cy="person-emissions-petrol car"]').should(
        "contain.text",
        "14.8"
      );
    });
  });

  it("user sucessfully completes a search and renders plane, petrol car and electric car results on the page", () => {
    cy.visit("/");
    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="total-emissions-plane"]').should(
        "contain.text",
        "31.5"
      );
      cy.get('[data-cy="person-emissions-plane"]').should(
        "contain.text",
        "15.8"
      );
      cy.get('[data-cy="total-emissions-petrol car"]').should(
        "contain.text",
        "30.5"
      );
      cy.get('[data-cy="person-emissions-petrol car"]').should(
        "contain.text",
        "14.8"
      );
      cy.get('[data-cy="total-emissions-electric car"]').should(
        "contain.text",
        "29.5"
      );
      cy.get('[data-cy="person-emissions-electric car"]').should(
        "contain.text",
        "13.8"
      );
    });
  });

  it("user sucessfully completes a search and renders plane, petrol car, electric car and train results on the page", () => {
    cy.visit("/");
    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="total-emissions-plane"]').should(
        "contain.text",
        "31.5"
      );
      cy.get('[data-cy="person-emissions-plane"]').should(
        "contain.text",
        "15.8"
      );
      cy.get('[data-cy="total-emissions-petrol car"]').should(
        "contain.text",
        "30.5"
      );
      cy.get('[data-cy="person-emissions-petrol car"]').should(
        "contain.text",
        "14.8"
      );
      cy.get('[data-cy="total-emissions-electric car"]').should(
        "contain.text",
        "29.5"
      );
      cy.get('[data-cy="person-emissions-electric car"]').should(
        "contain.text",
        "13.8"
      );
      cy.get('[data-cy="total-emissions-train"]').should(
        "contain.text",
        "28.5"
      );
      cy.get('[data-cy="person-emissions-train"]').should(
        "contain.text",
        "12.8"
      );
    });
  });

  it("user sucessfully completes a search and renders plane, petrol car, electric car and train results on the page", () => {
    cy.visit("/");
    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@getEmissions").then(() => {
      cy.get('[data-cy="emissions-dropdown-plane"]').should(
        "contain.text",
        "Eating 13 burgers"
      );

      cy.get('[data-cy="emissions-dropdown-petrol car"]').should(
        "contain.text",
        "Eating 13 burgers"
      );

      cy.get('[data-cy="emissions-dropdown-electric car"]').should(
        "contain.text",
        "Eating 12 burgers"
      );

      cy.get('[data-cy="emissions-dropdown-train"]').should(
        "contain.text",
        "Eating 12 burgers"
      );
    });
  });

  it("user can click suggestion button and it populates the to field with random UK location", () => {
    cy.visit("/");
    cy.get('[data-cy="to"]').type("New York");
    cy.get('[data-cy="randomPlace"]').click();
    cy.get('[data-cy="to"]').should("not.contain.text", "Berlin");
    cy.get('[data-cy="to"]').invoke("val").should("not.be.empty");
  });

  describe("from London to New York", () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        "/emissions?from=London&to=New%20York&passengers=2",
        (req) => {
          req.reply({
            statusCode: 200,
            body: {
              message: "OK",
              emissions: {
                plane: { total: 31.547396, perPassenger: 15.773698 },
                petrolCar: { total: null, perPassenger: null },
                electricCar: { total: null, perPassenger: null },
                train: { total: null, perPassenger: null },
              },
              from: "London, UK",
              to: "New York, NY, USA",
            },
          });
        }
      ).as("getEmissions");

      cy.visit("/");
      cy.get('[data-cy="from"]').type("London");
      cy.get('[data-cy="to"]').type("New York");
      cy.get('[data-cy="passengers"]').type("2");
      cy.get('[data-cy="travelFormSubmit"]').click();
    });

    it("shows plane results", () => {
      cy.wait("@getEmissions").then(() => {
        cy.get('[data-cy="emissions-dropdown-plane"]').should(
          "contain.text",
          "31.5"
        );

        cy.get('[data-cy="emissions-dropdown-plane"]').should(
          "contain.text",
          "Equivalent to"
        );
      });
    });

    it("doesn't show petrol car results", () => {
      cy.wait("@getEmissions").then(() => {
        cy.get('[data-cy="emissions-dropdown-petrol car"]').should(
          "contain.text",
          "N/A"
        );

        cy.get('[data-cy="emissions-dropdown-petrol car"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });
    });

    it("doesn't show electric car results", () => {
      cy.wait("@getEmissions").then(() => {
        cy.get('[data-cy="emissions-dropdown-electric car"]').should(
          "contain.text",
          "N/A"
        );

        cy.get('[data-cy="emissions-dropdown-electric car"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });
    });

    it("doesn't show train results", () => {
      cy.wait("@getEmissions").then(() => {
        cy.get('[data-cy="emissions-dropdown-train"]').should(
          "contain.text",
          "N/A"
        );

        cy.get('[data-cy="emissions-dropdown-train"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });
    });
  });
});
