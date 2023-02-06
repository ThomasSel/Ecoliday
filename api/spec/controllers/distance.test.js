const DistanceController = require("../../controllers/distance");
require("jest-fetch-mock").enableMocks();

const MAPS_API_URL =
  "https://maps.googleapis.com/maps/api/distancematrix/json?";

describe("DistanceController", () => {
  let req, res;
  beforeEach(() => {
    fetch.resetMocks();
    mockGeoapifyResponses();
    mockMapsAPIResponses();

    req = {
      query: {
        to: "Berlin",
        from: "London",
        passengers: "2",
      },
    };
    res = { locals: { distance: {} } };
  });

  describe("plane distance", () => {
    it("sends a request when given a 'from' location", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.geoapify.com/v1/geocode/search?text=London&format=json"
        )
      );
    });

    it("sends a request when given a 'to' location", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.geoapify.com/v1/geocode/search?text=Berlin&format=json"
        )
      );
    });

    it("add distance to req.query", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(req.query.distance).toEqual(930.5084324079236);
    });
  });

  it("check next has been called after distance calculated", async () => {
    const next = jest.fn(() => {});

    await DistanceController.Calculate(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("responds with 400 if from is empty", async () => {
    const send = jest.fn((object) => {});
    const res = {
      status: jest.fn((status) => {
        return { send: send };
      }),
    };
    const next = jest.fn(() => {});

    req.query.from = undefined;
    await DistanceController.Calculate(req, res, next);
    expect(res.status).toHaveBeenLastCalledWith(400);

    req.query.from = "";
    await DistanceController.Calculate(req, res, next);
    expect(res.status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenCalledTimes(2);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds with 400 if to is empty", async () => {
    const send = jest.fn((object) => {});
    const res = {
      status: jest.fn((status) => {
        return { send: send };
      }),
    };
    const next = jest.fn(() => {});

    req.query.to = undefined;
    await DistanceController.Calculate(req, res, next);
    expect(res.status).toHaveBeenLastCalledWith(400);

    req.query.to = "";
    await DistanceController.Calculate(req, res, next);
    expect(res.status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenCalledTimes(2);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds with 404 if results is empty", async () => {
    fetch.resetMocks();
    fetch.mockResponse(
      JSON.stringify({
        results: [],
      })
    );

    const json = jest.fn((object) => {});
    const res = {
      status: jest.fn((status) => {
        return { json: json };
      }),
    };
    const next = jest.fn(() => {});

    await DistanceController.Calculate(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      message: "Request returned no queries",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("adds formatted 'from' result to res.locals", async () => {
    await DistanceController.Calculate(req, res, () => {});

    expect(res.locals.from).toEqual("London, ENG, United Kingdom");
  });

  it("adds formatted 'to' result to res.locals", async () => {
    await DistanceController.Calculate(req, res, () => {});

    expect(res.locals.to).toEqual("Berlin, Germany");
  });

  describe("Maps API", () => {
    it("sends request for driving distance", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          MAPS_API_URL + "origins=London&destinations=Berlin&mode=driving&key="
        )
      );
    });

    it("sends request for rail distance", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          MAPS_API_URL +
            "origins=London&destinations=Berlin&mode=transit&transit_mode=rail&key="
        )
      );
    });

    it("add driving distance to res.locals", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(res.locals.distance.petrolCar).toEqual(1108.327);
      expect(res.locals.distance.electricCar).toEqual(1108.327);
    });

    it("add train distance to res.locals", async () => {
      await DistanceController.Calculate(req, res, () => {});

      expect(res.locals.distance.train).toEqual(1156.978);
    });
  });
});

const mockGeoapifyResponses = () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      results: [
        {
          lon: -0.11534,
          lat: 51.51413,
          formatted: "London, ENG, United Kingdom",
        },
      ],
    })
  );

  fetch.mockResponseOnce(
    JSON.stringify({
      results: [{ lon: 13.40488, lat: 52.50176, formatted: "Berlin, Germany" }],
    })
  );
};

const mockMapsAPIResponses = () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      rows: [{ elements: [{ distance: { value: 1108327 } }] }],
    })
  );

  fetch.mockResponseOnce(
    JSON.stringify({
      rows: [{ elements: [{ distance: { value: 1156978 } }] }],
    })
  );
};
