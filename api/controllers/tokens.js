const TokenGenerator = require("../models/token_generator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const TokensController = {
  Create: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "auth error" });
      return;
    }
    const match = await bcrypt
      .compare(password, user.password)
      .catch((error) => console.error(error));
    if (!match) {
      res.status(401).json({ message: "auth error" });
    } else {
      const token = await TokenGenerator.jsonwebtoken(user.id);
      res.status(201).json({ token: token, message: "OK" });
    }
  },
};

module.exports = TokensController;
