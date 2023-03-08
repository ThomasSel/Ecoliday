const app = require("../../app");
const request = require("supertest");
require("jest-fetch-mock").enableMocks();

describe("/emissions", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("Response code is 400 if 'from' location not there", async () => {
    let response = await request(app).get("/emissions?to=Berlin&passengers=1");

    expect(response.status).toEqual(400);
  });

  test("Response code is 400 if 'to' location not there", async () => {
    let response = await request(app).get(
      "/emissions?from=Berlin&passengers=1"
    );

    expect(response.status).toEqual(400);
  });

  test("response code is 400 if the passengers query parameter is not numerical", async () => {
    let response = await request(app).get(
      "/emissions?distance=100&passengers=person"
    );

    expect(response.status).toEqual(400);
  });

  test("response code is 400 if no query parameters are given", async () => {
    let response = await request(app).get("/emissions");
    expect(response.status).toEqual(400);
  });

  test("response code is 400 if the passengers query parameter is less than 1", async () => {
    let response = await request(app).get(
      "/emissions?distance=100&passengers=0"
    );

    expect(response.status).toEqual(400);
  });

  test("response code is 400 if the passengers query parameter isn't an integer", async () => {
    let response = await request(app).get(
      "/emissions?distance=100&passengers=2.5"
    );

    expect(response.status).toEqual(400);
  });

  describe("if request is successful", () => {
    let response;
    beforeEach(async () => {
      mockGeoapifyResponses();
      mockMapsAPIResponses();
      mockEmissionsAPIResponses();

      response = await request(app).get(
        "/emissions?to=Berlin&from=London&passengers=4"
      );
    });

    test("response code is 200 when given to, from and passengers params", async () => {
      expect(response.status).toEqual(200);
    });

    test("calls fetch for plane co2e value", async () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            "passenger_flight-route_type_international-aircraft_type_na-distance_short_haul_lt_3700km-class_economy-rf_included"
          ),
        })
      );
    });

    test("calls fetch for train co2e value", async () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            "passenger_train-route_type_international_rail-fuel_source_na",
            "fuel_combustion",
            "2022"
          ),
        })
      );
    });

    test("calls fetch for Petrol car co2e value", async () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            "passenger_vehicle-vehicle_type_car-fuel_source_petrol-engine_size_na-vehicle_age_na-vehicle_weight_na",
            "fuel_combustion",
            "2022"
          ),
        })
      );
    });

    test("calls fetch for EV car co2e value", async () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            "passenger_vehicle-vehicle_type_car-fuel_source_bev-engine_size_na-vehicle_age_na-vehicle_weight_na",
            "electricity_generation",
            "2022"
          ),
        })
      );
    });

    test("fetch results are grouped into single response, with total emissions", async () => {
      expect(response.body.emissions.plane.total).toEqual(63.094792);
      expect(response.body.emissions.train.total).toEqual(20.094792);
      expect(response.body.emissions.petrolCar.total).toEqual(10.094792);
      expect(response.body.emissions.electricCar.total).toEqual(1.094792);
    });

    test("fetch results are grouped into single response, with per passenger emissions", async () => {
      expect(response.body.emissions.plane.perPassenger).toEqual(63.094792 / 4);
      expect(response.body.emissions.train.perPassenger).toEqual(20.094792 / 4);
      expect(response.body.emissions.petrolCar.perPassenger).toEqual(
        10.094792 / 4
      );
      expect(response.body.emissions.electricCar.perPassenger).toEqual(
        1.094792 / 4
      );
    });

    test("distance results are added to the response", () => {
      expect(response.body.emissions.plane.distance).toEqual(930.5084324079236);
      expect(response.body.emissions.petrolCar.distance).toEqual(1108.327);
      expect(response.body.emissions.electricCar.distance).toEqual(1108.327);
      expect(response.body.emissions.train.distance).toEqual(1156.978);
    });

    test("response includes formatted location", async () => {
      expect(response.body.to).toEqual("Berlin, Germany");
      expect(response.body.from).toEqual("London, UK");
    });
  });

  describe("when land routes haven't been found", () => {
    test("returns null petrolCar and electricCar emissions", async () => {
      mockGeoapifyResponses();
      fetch.mockResponseOnce(
        JSON.stringify({
          destination_addresses: ["Berlin, Germany"],
          origin_addresses: ["London, UK"],
          rows: [{ elements: [{ status: "ZERO_RESULTS" }] }],
        })
      );
      fetch.mockResponseOnce(
        JSON.stringify({
          destination_addresses: ["Berlin, Germany"],
          origin_addresses: ["London, UK"],
          rows: [
            { elements: [{ distance: { value: 1156978 }, status: "OK" }] },
          ],
        })
      );
      mockEmissionsAPIResponses();

      let response = await request(app).get(
        "/emissions?to=Berlin&from=London&passengers=4"
      );

      expect(response.body.emissions.petrolCar.distance).toBe(null);
      expect(response.body.emissions.petrolCar.total).toBe(null);
      expect(response.body.emissions.petrolCar.perPassenger).toBe(null);
      expect(response.body.emissions.electricCar.distance).toBe(null);
      expect(response.body.emissions.electricCar.total).toBe(null);
      expect(response.body.emissions.electricCar.perPassenger).toBe(null);
    });

    test("returns null train emissions", async () => {
      mockGeoapifyResponses();
      fetch.mockResponseOnce(
        JSON.stringify({
          destination_addresses: ["Berlin, Germany"],
          origin_addresses: ["London, UK"],
          rows: [
            { elements: [{ distance: { value: 1108327 }, status: "OK" }] },
          ],
        })
      );
      fetch.mockResponseOnce(
        JSON.stringify({
          destination_addresses: ["Berlin, Germany"],
          origin_addresses: ["London, UK"],
          rows: [{ elements: [{ status: "ZERO_RESULTS" }] }],
        })
      );
      mockEmissionsAPIResponses();

      let response = await request(app).get(
        "/emissions?to=Berlin&from=London&passengers=4"
      );

      expect(response.body.emissions.train.distance).toBe(null);
      expect(response.body.emissions.train.total).toBe(null);
      expect(response.body.emissions.train.perPassenger).toBe(null);
    });
  });
});

const mockGeoapifyResponses = () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      results: [{ lon: -0.11534, lat: 51.51413 }],
    })
  );

  fetch.mockResponseOnce(
    JSON.stringify({
      results: [{ lon: 13.40488, lat: 52.50176 }],
    })
  );
};

const mockMapsAPIResponses = () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      destination_addresses: ["Berlin, Germany"],
      origin_addresses: ["London, UK"],
      rows: [{ elements: [{ distance: { value: 1108327 }, status: "OK" }] }],
    })
  );

  fetch.mockResponseOnce(
    JSON.stringify({
      destination_addresses: ["Berlin, Germany"],
      origin_addresses: ["London, UK"],
      rows: [{ elements: [{ distance: { value: 1156978 }, status: "OK" }] }],
    })
  );
};

const mockEmissionsAPIResponses = () => {
  const emissions = [63.094792, 20.094792, 10.094792, 1.094792];

  emissions.forEach((emission) =>
    fetch.mockResponseOnce(
      JSON.stringify({
        co2e: emission,
      })
    )
  );
};
