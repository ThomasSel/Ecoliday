const mongoose = require("mongoose");

require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });

  it("has an email address", () => {
    const user = new User({
      email: "test@email.com",
      password: "password",
    });
    expect(user.email).toEqual("test@email.com");
  });

  it("has a password", () => {
    const user = new User({
      email: "test@email.com",
      password: "password",
    });
    expect(user.password).toEqual("password");
  });

  it("can list all the users", (done) => {
    User.find((err, users) => {
      expect(err).toBeNull();
      expect(users).toEqual([]);
      done();
    });
  });

  it("can save a user", (done) => {
    const user = new User({
      email: "test@email.com",
      password: "password",
    });

    user.save((err, users) => {
      expect(err).toBeNull();

      User.find((err, users) => {
        expect(err).toBeNull();
        expect(users[0].email).toBe("test@email.com");
        expect(users[0].password).toBe("password");
        done();
      });
    });
  });
});