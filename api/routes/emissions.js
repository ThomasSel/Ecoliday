const express = require("express");
const router = express.Router();
const DistanceController = require("../controllers/distance");

const EmissionsController = require("../controllers/emissions");

router.get("/", DistanceController.Calculate, EmissionsController.GetEmissions);

module.exports = router;
