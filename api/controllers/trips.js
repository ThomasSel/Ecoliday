const Trip = require("../models/trips");

const TripsController = {
  Create: (req, res) => {
    const { to, from, user_id, passengers, emissions } = req.body;

    const trip = new Trip({ to, from, user_id, passengers, emissions });

    trip.save(async (err) => {
      if (err) {
        throw err;
      }
      res.status(201).json({ message: "OK" });
    });
  },

  FindByUser: (req, res) => {
    Trip.find({ user_id: req.get("user_id") }, async (err, trips) => {
      if (err) {
        throw err;
      }

      res.status(200).json({ trips });
    });
  },
};

module.exports = TripsController;