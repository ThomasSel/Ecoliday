const User = require("../models/user");
const bcrypt = require("bcryptjs");

const UsersController = {
  Create: async (req, res) => {
    let encryptedPassword;
    try {
      encryptedPassword = await bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(req.body.password, salt));
    } catch (err) {
      return res.status(400).json({ message: "Bad request" });
    }

    const user = new User({
      email: req.body.email,
      password: encryptedPassword,
    });
    user.save((err) => {
      if (err) {
        res.status(400).json({ message: "Bad request" });
      } else {
        res.status(201).json({ message: "OK" });
      }
    });
  },
};

module.exports = UsersController;
