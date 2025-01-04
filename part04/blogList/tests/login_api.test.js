const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
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
        const loginUser = {
            username: "MrX",
            password: ""
        }
        const loggedInUser = await api.post("/api/login").send(loginUser).expect(400)
    })
    test("User with without username can't login", async() => {
        const loginUser = {
            username: "",
            password: "reallylongandcomplicatedpassword"
        }
        const loggedInUser = await api.post("/api/login").send(loginUser).expect(400)
    })
    test("User with invalid password can't login", async () => {
        const loginUser = {
            username:"MrX",
            password:"wrongpassword"
        }
        const loggedInUser = await api.post("/api/login").send(loginUser).expect(401)

    })
    test("User with invalid username can't login", async () => {
        const loginUser = {
            username: "MrZ",
            password:"reallylongandcomplicatedpassword"
        }
        const loggedInUser = await api.post("/api/login").send(loginUser).expect(401)
    })
    test("User with valid username and password can login", async () => {
        const loginUser = {
            username: "MrX",
            password: "reallylongandcomplicatedpassword"
        }
        const logedinUser = await api.post  ("/api/login").send(loginUser).expect(200)
        assert.ok(logedinUser.body.token.startsWith("ey"), "Token should start with 'ey'");
    })
})

after(async () => {
  await mongoose.connection.close();
});