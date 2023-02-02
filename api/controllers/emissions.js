const EmissionsController = {
  GetEmissions: async (req, res) => {
    if (!CheckQuery(req, res)) {
      return;
    }

    const URL = "https://beta3.api.climatiq.io/estimate";

    const emissions = await Promise.all([
      GetPlaneEmissions(req),
      GetTrainEmissions(req),
      GetPetrolCarEmissions(req),
      GetElectricCarEmissions(req),
    ]);

    res.status(200).json({
      message: "OK",
      emissions: {
        plane: formatEmissions(emissions[0], req.query.passengers),
        train: formatEmissions(emissions[1], req.query.passengers),
        petrolCar: formatEmissions(emissions[2], req.query.passengers),
        electricCar: formatEmissions(emissions[3], req.query.passengers),
      },
    });
  },
};

const formatEmissions = (emissions, passengers) => {
  return {
    total: emissions,
    perPassenger: emissions / passengers,
  };
};

const CheckQuery = (req, res) => {
  if (req.query.passengers === undefined || req.query.distance === undefined) {
    res.status(400).send();
    return false;
  } else if (isNaN(req.query.passengers) || isNaN(req.query.distance)) {
    res.status(400).send();
    return false;
  } else if (req.query.distance < 0 || req.query.passengers < 1) {
    res.status(400).send();
    return false;
  } else if (!Number.isInteger(parseFloat(req.query.passengers))) {
    res.status(400).send();
    return false;
  }
  return true;
};

const GetElectricCarEmissions = (req) => {
  return fetchEmissions(
    { distance: parseInt(req.query.distance) },
    "passenger_vehicle-vehicle_type_car-fuel_source_bev-engine_size_na-vehicle_age_na-vehicle_weight_na",
    "electricity_generation"
  );
};

const GetPetrolCarEmissions = (req) => {
  return fetchEmissions(
    { distance: parseInt(req.query.distance) },
    "passenger_vehicle-vehicle_type_car-fuel_source_petrol-engine_size_na-vehicle_age_na-vehicle_weight_na",
    "fuel_combustion"
  );
};

const GetTrainEmissions = (req) => {
  return fetchEmissions(
    {
      distance: parseInt(req.query.distance),
      passengers: parseInt(req.query.passengers),
    },
    "passenger_train-route_type_international_rail-fuel_source_na",
    "fuel_combustion"
  );
};

const GetPlaneEmissions = (req) => {
  return fetchEmissions(
    {
      distance: parseInt(req.query.distance),
      passengers: parseInt(req.query.passengers),
    },
    "passenger_flight-route_type_international-aircraft_type_na-distance_short_haul_lt_3700km-class_na-rf_included",
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
        year: "2022",
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
