const EmissionsController = {
  GetEmissions: async (req, res) => {
    if (!CheckQuery(req, res)) {
      return;
    }

    const emissions = {};
    [
      emissions.plane,
      emissions.train,
      emissions.petrolCar,
      emissions.electricCar,
    ] = await Promise.all([
      GetPlaneEmissions(req, res),
      GetTrainEmissions(req, res),
      GetPetrolCarEmissions(req, res),
      GetElectricCarEmissions(req, res),
    ]);

    res.status(200).json({
      message: "OK",
      emissions: formatEmissions(
        res.locals.distance,
        emissions,
        req.query.passengers
      ),
      to: res.locals.to,
      from: res.locals.from,
    });
  },
};

const formatEmissions = (distance, emissions, passengers) => {
  result = {};
  Object.keys(emissions).forEach((key) => {
    result[key] = {
      distance: distance[key],
      total: emissions[key],
      perPassenger:
        emissions[key] === null ? null : emissions[key] / passengers,
    };
  });
  return result;
};

const CheckQuery = (req, res) => {
  if (req.query.passengers === undefined) {
    res.status(400).send();
    return false;
  } else if (isNaN(req.query.passengers)) {
    res.status(400).send();
    return false;
  } else if (req.query.passengers < 1) {
    res.status(400).send();
    return false;
  } else if (!Number.isInteger(parseFloat(req.query.passengers))) {
    res.status(400).send();
    return false;
  }
  return true;
};

const GetElectricCarEmissions = (req, res) => {
  if (res.locals.distance.electricCar === null) {
    return null;
  }
  return fetchEmissions(
    { distance: parseInt(res.locals.distance.electricCar) },
    "passenger_vehicle-vehicle_type_car-fuel_source_bev-engine_size_na-vehicle_age_na-vehicle_weight_na",
    "electricity_generation"
  );
};

const GetPetrolCarEmissions = (req, res) => {
  if (res.locals.distance.petrolCar === null) {
    return null;
  }
  return fetchEmissions(
    { distance: parseInt(res.locals.distance.petrolCar) },
    "passenger_vehicle-vehicle_type_car-fuel_source_petrol-engine_size_na-vehicle_age_na-vehicle_weight_na",
    "fuel_combustion"
  );
};

const GetTrainEmissions = (req, res) => {
  if (res.locals.distance.train === null) {
    return null;
  }
  return fetchEmissions(
    {
      distance: parseInt(res.locals.distance.train),
      passengers: parseInt(req.query.passengers),
    },
    "passenger_train-route_type_international_rail-fuel_source_na",
    "fuel_combustion"
  );
};

const GetPlaneEmissions = (req, res) => {
  if (res.locals.distance.plane === null) {
    return null;
  }
  return fetchEmissions(
    {
      distance: parseInt(res.locals.distance.plane),
      passengers: parseInt(req.query.passengers),
    },
    "passenger_flight-route_type_international-aircraft_type_na-distance_short_haul_lt_3700km-class_economy-rf_included",
    "fuel_combustion"
  );
};

const fetchEmissions = (parameters, activity_id, lca_activity) => {
  const URL = "https://beta3.api.climatiq.io/estimate";

  return fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLIMATIQ_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      emission_factor: {
        activity_id: activity_id,
        source: "BEIS",
        region: "GB",
        year: "2021",
        lca_activity: lca_activity,
      },
      parameters: {
        ...parameters,
        distance_unit: "km",
      },
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      return responseData.co2e;
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = EmissionsController;
