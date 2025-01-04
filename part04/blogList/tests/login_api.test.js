const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const login = async (username, password, expectedStatus) => {
    const response = await api
      .post("/api/login")
      .send({ username, password })
      .expect(expectedStatus);
    return response;
  };

before(async () => {
    await User.deleteMany() 
    const testUser = {
        name: "Mr.X",
        username: "MrX",
        password: "reallylongandcomplicatedpassword"
    }
    await api.post("/api/users/").send(testUser).expect(201)
})

describe("Login", () => {
    test("User without password can't login", async() => {
         const response = await login("MrX", "", 400);
         assert.strictEqual(response.body.error, "Username and password are required");
    })
    test("User with without username can't login", async() => {
        const response = await login("","reallylongandcomplicatedpassword",400);
        assert.strictEqual(response.body.error, "Username and password are required");
    })
    test("User with invalid password can't login", async () => {
        const response = await login("MrX","wrongpassword",401)
        assert.strictEqual(response.body.error, "Invalid username or password");

    })
    test("User with invalid username can't login", async () => {
        const response = await login("MrZ","reallylongandcomplicatedpassword",401)
        assert.strictEqual(response.body.error, "Invalid username or password")
    })
    test("User with valid username and password can login", async () => {
        const logedinUser = await login("MrX","reallylongandcomplicatedpassword",200)
        assert.ok(logedinUser.body.token.startsWith("ey"), "Token should start with 'ey'");
    })
})

after(async () => {
  await mongoose.connection.close();
});