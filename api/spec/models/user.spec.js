const mongoose = require("mongoose");

require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany();
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

  it("cannot have the same email as someone else", async () => {
    const user1 = new User({
      email: "test@email.com",
      password: "password1",
    });
    await user1.save();

    const user2 = new User({
      email: "test@email.com",
      password: "password2",
    });
    user2
      .save()
      .then(() => fail("No error raised when saving the file"))
      .catch((error) => {});

    const users = await User.find();
    expect(users.length).toEqual(1);
  });
});
