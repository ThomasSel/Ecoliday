const express = require("express");
const router = express.Router();

const TripsController = require("../controllers/trips");

router.post("/", TripsController.Create);
router.get("/", TripsController.FindByUser);
router.delete("/", TripsController.DeleteTrip);
module.exports = router;
