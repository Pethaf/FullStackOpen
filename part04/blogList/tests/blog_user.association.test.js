const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const Blog = require("../models/blog");
let postingUser
before(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const newUser = {
    username: "MrX",
    name: "Mr.X",
    password: "password"
  }
  postingUser = await api.post("/api/users/").send(newUser).expect(201)
});
describe("User posts blog", () => {
  test("Making a blog post without a bearer token", async () => {
    const newBlogPost = {
      title: "Random Post",
      url: "https://www.google.com",
      likes: 3,
      author: "Mr.Z"
    }
    const savedBlog = await api.post("/api/blogs").send(newBlogPost).expect(401)
  })
  test("Making a blog post with a bearer token", async () => {
    const secondNewBlogPost = {
      title: "Second random post",
      url: "https://www.duckduckgo.com",
      likes: 2,
      author: `${postingUser.username}`,
    }
    const response = await api.post("/api/login").send({username: postingUser.body.username, password: postingUser.body.password})
    const savedBlog = await api.post("/api/blogs/").set("Authorization", `Bearer ${response.body.token}`).send(secondNewBlogPost).expect(201)
    assert.strictEqual(savedBlog.body.user, postingUser.body.id)
  })
})

after(async () => {
  await mongoose.connection.close();
});