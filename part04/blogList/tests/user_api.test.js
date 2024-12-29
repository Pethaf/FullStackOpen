const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
before(async () => {
  await User.deleteMany({});
});
describe("Getting empty user list", async () => {
  test("Asking for users", async () => {
    const users = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(users.body.length, 0);
  });
});
describe("Creating User", async () => {
  test("Adding a unique user to the database", async () => {
    const usersInDatabaseBeforeAdding = await api.get("/api/users");
    const newUser = {
      name: "Mr.Z",
      username: "MrZ",
      password: "reallylongcomplicatedpassword",
    };
    const createdUser = await api.post("/api/users").send(newUser).expect(201);
    const usersInDatabaseAfterAdding = await api.get("/api/users");
    assert.equal(
      usersInDatabaseAfterAdding.body.length,
      usersInDatabaseBeforeAdding.body.length + 1
    );
  });
  test("Adding a user that allready exists to database", async () => {
    const usersInDbBefore = await api.get("/api/users");
    const newUser = {
      name: "Mr.Z",
      username: "MrZ",
      password: "reallylongcomplicatedpassword",
    };
    const createdUser = await api.post("/api/users").send(newUser).expect(409);
    const usersInDbAfter = await api.get("/api/users");
    assert.deepStrictEqual(usersInDbAfter.body, usersInDbBefore.body);
  });
});
after(async () => {
  await mongoose.connection.close();
});
