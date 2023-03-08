import TravelForm from "./TravelForm";

describe("TravelForm", () => {
  let setEmissionsMock;
  let setRenderEmissionsMock;
  let setToDisplayMock;
  let setFromDisplayMock;
  let setPassengersMock;
  let passengersMock;
  let setLoading;

  beforeEach(() => {
    setEmissionsMock = cy.stub();
    setRenderEmissionsMock = cy.stub();
    setToDisplayMock = cy.stub();
    setFromDisplayMock = cy.stub();
    setPassengersMock = cy.stub();
    passengersMock = 2;
    setLoading = cy.stub()

    cy.mount(
      <TravelForm
        setEmissions={setEmissionsMock}
        setRenderEmissions={setRenderEmissionsMock}
        setToDisplay={setToDisplayMock}
        setFromDisplay={setFromDisplayMock}
        setPassengers={setPassengersMock}
        passengers={passengersMock}
        setLoading={setLoading}
      />
    );
  });

  it("has distance and no of people inputs and a submit buttom", () => {
    cy.get('[data-cy="from"]');
    cy.get('[data-cy="to"]');

    cy.get('[data-cy="passengers"]');

    cy.get('[data-cy="travelFormSubmit"]')
      .invoke("attr", "type")
      .should("eq", "submit");
  });

  it("request is sent when form is submitted with valid input values", () => {
    cy.intercept("GET", "/emissions?from=London&to=Berlin&passengers=2").as(
      "emissionRequest"
    );

    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@emissionRequest");
  });

  it("set functions are called when form is submitted with valid input values", () => {
    cy.intercept("GET", "/emissions?from=London&to=Berlin&passengers=2").as(
      "emissionRequest"
    );

    cy.get('[data-cy="from"]').type("London");
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="passengers"]').type("2");
    cy.get('[data-cy="travelFormSubmit"]').click();

    cy.wait("@emissionRequest").then(() => {
      setTimeout(() => {
        expect(setEmissionsMock).to.be.called;
        expect(setRenderEmissionsMock).to.be.called;
        expect(setToDisplayMock).to.be.called;
        expect(setFromDisplayMock).to.be.called;
        expect(setPassengersMock).to.be.called;
      }, 1000);
    });
  });

  it("populates random location in to to field when get a suggestion button is pressed", () => {
    cy.get('[data-cy="to"]').type("Berlin");
    cy.get('[data-cy="randomPlace"]').click();
    cy.get('[data-cy="to"]').should("not.contain.text", "Berlin");
    cy.get('[data-cy="to"]').invoke("val").should("not.be.empty");
  });
});
