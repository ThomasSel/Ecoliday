import UserTrips from "./userTrips";
const navigate = () => {};

describe("UserTrips", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "fakeToken");
  });

  let trip = {
    to: "Berlin, Germany",
    from: "London, ENG, United Kingdom",
    user_id: "63e0ddcb06e90257776466a2",
    passengers: "2",
    emissions: {
      plane: { total: 31.547396, perPassenger: 15.773698 },
      petrolCar: { total: 30.547396, perPassenger: 14.773698 },
      electricCar: { total: 29.547396, perPassenger: 13.773698 },
      train: { total: 28.547396, perPassenger: 12.773698 },
    },
  };

  let tripTwo = {
    to: "Manchester, ENG, United Kingdom",
    from: "Berlin, Germany",
    user_id: "63e0ddcb06e90257776466a2",
    passengers: "2",
    emissions: {
      plane: { total: 31.547396, perPassenger: 15.773698 },
      petrolCar: { total: 30.547396, perPassenger: 14.773698 },
      electricCar: { total: 29.547396, perPassenger: 13.773698 },
      train: { total: 28.547396, perPassenger: 12.773698 },
    },
  };

  it("sends POST request on user save submition", () => {
    cy.intercept("GET", "/trips", {
      trips: [trip, tripTwo],
    }).as("getTrips");

    cy.mount(<UserTrips navigate={navigate} />);

    cy.wait("@getTrips").then((interception) => {
      expect(interception.request.headers.authorization).to.eq(
        "Bearer fakeToken"
      );
    });
  });

  it("lists trips for the user on the page", () => {
    cy.intercept("GET", "/trips", {
      trips: [trip, tripTwo],
    }).as("getTrips");

    cy.mount(<UserTrips navigate={navigate} />);

    cy.wait("@getTrips").then(() => {
      cy.get('[data-cy="trips"]')
        .should(
          "contain.text",
          "From:Berlin, GermanyTo:Manchester, ENG, United KingdomPassengers:2"
        )
        .and(
          "contain.text",
          "From:London, ENG, United KingdomTo:Berlin, GermanyPassengers:2"
        )
        .and("contain.text", "31.5")
        .and("contain.text", "30.5")
        .and("contain.text", "29.5")
        .and("contain.text", "28.5");
    });
  });

  it("lists trips with N/A if a route is not available", () => {
    let tripThree = {
      to: "New York",
      from: "London, ENG, United Kingdom",
      user_id: "63e0ddcb06e90257776466a2",
      passengers: "2",
      emissions: {
        plane: { total: 31.547396, perPassenger: 15.773698 },
        petrolCar: { total: null, perPassenger: null },
        electricCar: { total: null, perPassenger: null },
        train: { total: null, perPassenger: null },
      },
    };

    cy.intercept("GET", "/trips", {
      trips: [tripThree],
    }).as("getTrips");

    cy.mount(<UserTrips navigate={navigate} />);

    cy.wait("@getTrips").then(() => {
      cy.get('[data-cy="trips"]')
        .should(
          "contain.text",
          "From:London, ENG, United KingdomTo:New YorkPassengers:2"
        )
        .and("contain.text", "31.5")
        .and("contain.text", "N/A");
    });
  });
});
