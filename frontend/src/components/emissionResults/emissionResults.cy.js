import EmissionResults from "./emissionResults";

describe("EmissionResults", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "fakeToken");
    cy.mount(
      <EmissionResults
        emissions={{
          plane: { total: 302.0, perPassenger: 150.0 },
          petrolCar: { total: 174.3, perPassenger: 87.2 },
          electricCar: { total: 50.3, perPassenger: 25.2 },
          train: { total: 8.9, perPassenger: 4.5 },
        }}
        renderEmissions={true}
        fromDisplay={"London, ENG, United Kingdom"}
        toDisplay={"Berlin, Germany"}
        passengers={"2"}
        saveToggle={false}
        saveText={"SAVE"}
      />
    );
  });

  it("Renders component with total emission result", () => {
    cy.get('[data-cy="total-emissions-plane"]').should(
      "contain.text",
      "302.0"
    );
  });

  it("It doesn't render component when renderEmissions is false", () => {
    cy.mount(<EmissionResults renderEmissions={false} />);

    // cy.get('[data-cy="total-emissions-plane"]').should("contain.text", "123");
    cy.get('[data-cy="total-emissions-plane"]').should("not.exist");
  });

  it("Renders component with total emission plane, petrol car, electric car and train", () => {
    cy.get('[data-cy="total-emissions-plane"]').should(
      "contain.text",
      "302.0"
    );
    cy.get('[data-cy="person-emissions-plane"]').should(
      "contain.text",
      "150.0"
    );

    cy.get('[data-cy="total-emissions-petrol car"]').should(
      "contain.text",
      "174.3"
    );
    cy.get('[data-cy="person-emissions-petrol car"]').should(
      "contain.text",
      "87.2"
    );

    cy.get('[data-cy="total-emissions-electric car"]').should(
      "contain.text",
      "50.3"
    );
    cy.get('[data-cy="person-emissions-electric car"]').should(
      "contain.text",
      "25.2"
    );

    cy.get('[data-cy="total-emissions-train"]').should(
      "contain.text",
      "8.9"
    );
    cy.get('[data-cy="person-emissions-train"]').should(
      "contain.text",
      "4.5"
    );
  });

  describe("Save trip button", () => {
    it("renders save button on form when search true", () => {
      cy.get('[data-cy="saveButton"]')
        .invoke("attr", "type")
        .should("eq", "submit");

      cy.get('[data-cy="saveButton"]')
        .invoke("attr", "value")
        .should("eq", "SAVE");
    });

    it("sets the SAVE button to SAVED if it has been clicked", () => {
      cy.mount(
        <EmissionResults
          emissions={{
            plane: { total: 302.0, perPassenger: 150.0 },
            petrolCar: { total: 174.3, perPassenger: 87.2 },
            electricCar: { total: 50.3, perPassenger: 25.2 },
            train: { total: 8.9, perPassenger: 4.5 },
          }}
          renderEmissions={true}
          fromDisplay={"London, ENG, United Kingdom"}
          toDisplay={"Berlin, Germany"}
          passengers={"2"}
          saveToggle={true}
          saveText={"SAVED"}
        />
      );

      cy.get('[data-cy="saveButton"]')
        .invoke("attr", "value")
        .should("eq", "SAVED");
    });

    it("can create a POST request to '/trips'", (done) => {
      cy.intercept("POST", "/trips", { message: "OK" }).as("saveTrip");

      cy.get('[data-cy="saveButton"]').click();

      cy.wait("@saveTrip").then((interception) => {
        expect(interception.response.body.message).to.eq("OK");
      });
      done();
    });
  });

  describe("with null results", () => {
    it("Renders 'N/A' if plane results are null", () => {
      cy.mount(
        <EmissionResults
          emissions={{
            plane: { total: null, perPassenger: null },
            petrolCar: { total: 30.547396, perPassenger: 14.773698 },
            electricCar: { total: 29.547396, perPassenger: 13.773698 },
            train: { total: 28.547396, perPassenger: 12.773698 },
          }}
          renderEmissions={true}
        />
      );

      cy.get('[data-cy="total-emissions-plane"]').should(
        "contain.text",
        "N/A"
      );
    });

    it("Renders 'N/A' if petrolCar results are null", () => {
      cy.mount(
        <EmissionResults
          emissions={{
            plane: { total: 31.547396, perPassenger: 15.773698 },
            petrolCar: { total: null, perPassenger: null },
            electricCar: { total: 29.547396, perPassenger: 13.773698 },
            train: { total: 28.547396, perPassenger: 12.773698 },
          }}
          renderEmissions={true}
        />
      );

      cy.get('[data-cy="total-emissions-petrol car"]').should(
        "contain.text",
        "N/A"
      );
    });

    it("Renders 'N/A' if electricCar results are null", () => {
      cy.mount(
        <EmissionResults
          emissions={{
            plane: { total: 31.547396, perPassenger: 15.773698 },
            petrolCar: { total: 30.547396, perPassenger: 14.773698 },
            electricCar: { total: null, perPassenger: null },
            train: { total: 28.547396, perPassenger: 12.773698 },
          }}
          renderEmissions={true}
        />
      );

      cy.get('[data-cy="total-emissions-electric car"]').should(
        "contain.text",
        "N/A"
      );
    });

    it("Renders 'N/A' if train results are null", () => {
      cy.mount(
        <EmissionResults
          emissions={{
            plane: { total: 31.547396, perPassenger: 15.773698 },
            petrolCar: { total: 30.547396, perPassenger: 14.773698 },
            electricCar: { total: 29.547396, perPassenger: 13.773698 },
            train: { total: null, perPassenger: null },
          }}
          renderEmissions={true}
        />
      );

      cy.get('[data-cy="total-emissions-train"]').should(
        "contain.text",
        "N/A"
      );
    });
  });

  describe("Emission Context", () => {
    it("doesnt render the emissions context drop-down results", () => {
      cy.mount(<EmissionResults renderEmissions={false} />);
      cy.get('[data-cy="emissions-dropdown-plane"]').should("not.exist");
      cy.get('[data-cy="emissions-dropdown-petrol car"]').should("not.exist");
      cy.get('[data-cy="emissions-dropdown-electric car"]').should("not.exist");
      cy.get('[data-cy="emissions-dropdown-train"]').should("not.exist");
    });

    it("renders the emissions context for all methods of transport in a drop-down", () => {
      cy.get('[data-cy="emissions-dropdown-plane"]').should(
        "contain.text",
        "Eating 121 burgers"
      );
      cy.get('[data-cy="emissions-dropdown-petrol car"]').should(
        "contain.text",
        "Eating 70 burgers"
      );
      cy.get('[data-cy="emissions-dropdown-electric car"]').should(
        "contain.text",
        "Eating 21 burgers"
      );
      cy.get('[data-cy="emissions-dropdown-train"]').should(
        "contain.text",
        "Eating 4 burgers"
      );
    });

    describe("with null results", () => {
      it("Doesn't render plane emissions context if results are null", () => {
        cy.mount(
          <EmissionResults
            emissions={{
              plane: { total: null, perPassenger: null },
              petrolCar: { total: 30.547396, perPassenger: 14.773698 },
              electricCar: { total: 29.547396, perPassenger: 13.773698 },
              train: { total: 28.547396, perPassenger: 12.773698 },
            }}
            renderEmissions={true}
          />
        );

        cy.get('[data-cy="emissions-dropdown-plane"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });

      it("Doesn't render petrolCar emissions context if results are null", () => {
        cy.mount(
          <EmissionResults
            emissions={{
              plane: { total: 31.547396, perPassenger: 15.773698 },
              petrolCar: { total: null, perPassenger: null },
              electricCar: { total: 29.547396, perPassenger: 13.773698 },
              train: { total: 28.547396, perPassenger: 12.773698 },
            }}
            renderEmissions={true}
          />
        );

        cy.get('[data-cy="emissions-dropdown-petrol car"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });

      it("Doesn't render electricCar emissions context if results are null", () => {
        cy.mount(
          <EmissionResults
            emissions={{
              plane: { total: 31.547396, perPassenger: 15.773698 },
              petrolCar: { total: 30.547396, perPassenger: 14.773698 },
              electricCar: { total: null, perPassenger: null },
              train: { total: 28.547396, perPassenger: 12.773698 },
            }}
            renderEmissions={true}
          />
        );

        cy.get('[data-cy="emissions-dropdown-electric car"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });

      it("Doesn't render train emissions context if results are null", () => {
        cy.mount(
          <EmissionResults
            emissions={{
              plane: { total: 31.547396, perPassenger: 15.773698 },
              petrolCar: { total: 30.547396, perPassenger: 14.773698 },
              electricCar: { total: 29.547396, perPassenger: 13.773698 },
              train: { total: null, perPassenger: null },
            }}
            renderEmissions={true}
          />
        );

        cy.get('[data-cy="emissions-dropdown-train"]').should(
          "not.contain.text",
          "Equivalent to"
        );
      });
    });
  });
});
