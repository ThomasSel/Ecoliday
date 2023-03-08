const GEOAPIFY_URL = "https://api.geoapify.com/v1/geocode/search?";
const MAPS_API_URL =
  "https://maps.googleapis.com/maps/api/distancematrix/json?";

const DistanceController = {
  Calculate: async (req, res, next) => {
    if (!req.query.from || !req.query.to) {
      res.status(400).send();
      return;
    }

    const [locationData, drivingData, railData] = await Promise.all([
      sendGeoapifyRequest(req),
      sendDrivingDistanceRequest(req),
      sendRailDistanceRequest(req),
    ]);

    const error = checkError(locationData);
    if (error) return res.status(404).json({ message: error });

    updateRes(res, locationData, drivingData, railData);

    next();
  },
};

const sendGeoapifyRequest = (req) => {
  return Promise.all(
    [req.query.from, req.query.to].map((location) => {
      return fetch(
        GEOAPIFY_URL +
          `text=${location}&format=json&apiKey=${process.env.GEOAPIFY_KEY}`
      )
        .then((response) => response.json())
        .catch((err) => console.error(err));
    })
  );
};

const sendDrivingDistanceRequest = (req) => {
  const searchParams = new URLSearchParams();
  searchParams.append("origins", req.query.from);
  searchParams.append("destinations", req.query.to);
  searchParams.append("mode", "driving");
  searchParams.append("key", process.env.GOOGLE_MAPS_KEY);

  return fetch(MAPS_API_URL + searchParams.toString())
    .then((response) => response.json())
    .then((data) => {
      return {
        to: data.destination_addresses[0],
        from: data.origin_addresses[0],
        data: data.rows[0].elements[0],
      };
    })
    .catch((err) => console.error(err));
};

const sendRailDistanceRequest = (req) => {
  const searchParams = new URLSearchParams();
  searchParams.append("origins", req.query.from);
  searchParams.append("destinations", req.query.to);
  searchParams.append("mode", "transit");
  searchParams.append("transit_mode", "rail");
  searchParams.append("key", process.env.GOOGLE_MAPS_KEY);

  return fetch(MAPS_API_URL + searchParams.toString())
    .then((response) => response.json())
    .then((data) => {
      return {
        to: data.destination_addresses[0],
        from: data.origin_addresses[0],
        data: data.rows[0].elements[0],
      };
    })
    .catch((err) => console.error(err));
};

const updateRes = (res, locationData, drivingData, railData) => {
  res.locals.from = drivingData.from;
  res.locals.to = drivingData.to;

  res.locals.distance = {};

  res.locals.distance.petrolCar =
    drivingData.data.status === "OK"
      ? drivingData.data.distance.value / 1000
      : null;

  res.locals.distance.electricCar =
    drivingData.data.status === "OK"
      ? drivingData.data.distance.value / 1000
      : null;

  res.locals.distance.train =
    railData.data.status === "OK" ? railData.data.distance.value / 1000 : null;

  res.locals.distance.plane = getDistance(
    locationData[0].results[0].lat,
    locationData[0].results[0].lon,
    locationData[1].results[0].lat,
    locationData[1].results[0].lon
  );
};

const checkError = (locationData) => {
  let errorMessage = "";
  locationData.forEach((data) => {
    if (data.results.length === 0) {
      errorMessage = "Request returned no queries";
      return;
    }
  });
  return errorMessage;
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = DistanceController;
