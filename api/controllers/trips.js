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
    Trip.find({ user_id: req.body.user_id }, async (err, trips) => {
      if (err) {
        throw err;
      }

      res.status(200).json({ trips });
    });
  },

  DeleteTrip: async (req, res) => {
    try {
      await Trip.findOneAndDelete({ _id: req.get("trip_id") });
      res.status(200).json({ message: "DELETED" });
    } catch (err) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = TripsController;
