const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");

before(async () => {
    await User.deleteMany() 
    const testUser = {
        name: "Mr.X",
        username: "MrX",
        password: "reallylongandcomplicatedpassword"
    }
    await api.post("/api/users/").post(testUser).expect(201)
})

describe("Login", () => {
    test("User without password can't login", async() => {
        const loginUser = {
            username: "MrX",
            password: ""
        }
        const loggedInUser = await app.post("/api/login").expect(401)
    })
    test("User with without username can't login", async() => {
        const loginUser = {
            username: "",
            password: "reallylongandcomplicatedpassword"
        }
        const loggedInUser = await api.post("/api/login").expect(401)
    })
    test("User with valid username and password can login", async () => {
        const loginUser = {
            username: "MrX",
            password: "reallylongandcomplicatedpassword"
        }
        const logedinUser = await api.post("/api/login").expect(200)
        assert.ok(logedinUser.body.token.startsWith("ey"))

    })
})