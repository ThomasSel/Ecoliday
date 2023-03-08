const express = require("express");
const app = express();
const cors = require("cors");
const JWT = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const emissionsRouter = require("./routes/emissions");
const usersRouter = require("./routes/users");
const tokensRouter = require("./routes/tokens");
const tripsRouter = require("./routes/trips");

// token middleware
const tokenChecker = (req, res, next) => {
  let token;
  const authHeader = req.get("Authorization");

  if (authHeader) {
    token = authHeader.slice(7);
  }

  JWT.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      console.log(error);
      res.status(401).json({ message: "auth error" });
    } else {
      req.body.user_id = payload.user_id;
      next();
    }
  });
};

//route setup
app.use("/emissions", emissionsRouter);
app.use("/users", usersRouter);
app.use("/tokens", tokensRouter);
app.use("/trips", tokenChecker, tripsRouter);

module.exports = app;
