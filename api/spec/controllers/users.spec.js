const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("post when email and password are provided", () => {
    it("gives response code 201", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "test@email.com", password: "password" });
      expect(response.statusCode).toBe(201);
    });

    it("can create a user", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "test@email.com", password: "password" });
      let users = await User.find();
      let newUser = users[users.length - 1];
      expect(newUser.email).toEqual("test@email.com");
    });

    it("encrypts the password", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "test@email.com", password: "password" });
      let users = await User.find();
      let newUser = users[users.length - 1];
      bcrypt
        .compare("password", newUser.password)
        .then((res) => expect(res).toBe(true));
    });
  });

  describe("post when password NOT provided", () => {
    it("gives response code 400", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "test@email.com" });
      expect(response.statusCode).toBe(400);
    });

    it("does not NOT create a user", async () => {
      await request(app).post("/users").send({ email: "test@email.com" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("post when email NOT provided", () => {
    it("gives response code 400", async () => {
      let response = await request(app)
        .post("/users")
        .send({ password: "password" });
      expect(response.statusCode).toBe(400);
    });

    it("does not NOT create a user", async () => {
      await request(app).post("/users").send({ password: "password" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("post when email is invalid", () => {
    it("gives response code 400", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "testemail.com", password: "password" });
      expect(response.statusCode).toBe(400);
    });

    it("does not NOT create a user", async () => {
      await request(app)
        .post("/users")
        .send({ email: "testemail.com", password: "password" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("email has already been used", () => {
    beforeEach(async () => {
      await User.create({ email: "test@email.com", password: "password1" });
    });
    it("gives response code 400", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "test@email.com", password: "password2" });
      expect(response.statusCode).toBe(400);
    });

    it("does not NOT create a user", async () => {
      await request(app)
        .post("/users")
        .send({ email: "test@email.com", password: "password2" });
      let users = await User.find();
      expect(users.length).toEqual(1);
    });
  });
});
