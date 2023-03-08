const mongoose = require("mongoose");

require("../mongodb_helper");
const Trip = require("../../models/trips");

describe("Trips Model", () => {
  let trip;
  beforeEach((done) => {
    mongoose.connection.collections.trips.drop(() => {
      done();
    });

    trip = new Trip({
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
    });
  });

  it("has all required fields", () => {
    expect(trip.to).toEqual("Berlin, Germany");
    expect(trip.from).toEqual("London, ENG, United Kingdom");
    expect(trip.user_id).toEqual("63e0ddcb06e90257776466a2");
    expect(trip.passengers).toEqual("2");
    expect(trip.emissions).toEqual({
      plane: { total: 31.547396, perPassenger: 15.773698 },
      petrolCar: { total: 30.547396, perPassenger: 14.773698 },
      electricCar: { total: 29.547396, perPassenger: 13.773698 },
      train: { total: 28.547396, perPassenger: 12.773698 },
    });
  });

  it("can save a trip to the database", (done) => {
    trip.save((err) => {
      expect(err).toBeNull();

      Trip.find((err, trips) => {
        expect(err).toBeNull();
        expect(trips[0].to).toEqual("Berlin, Germany");
        expect(trips[0].createdAt).not.toEqual(undefined);
        done();
      });
    });
  });
});
