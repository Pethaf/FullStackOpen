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
  test("Making a blog post without a userid", async () => {
    const newBlogPost = {
      title: "Random Post",
      url: "https://www.google.com",
      likes: 3,
      author: "Mr.Z"
    }
    const savedBlog = await api.post("/api/blogs").send(newBlogPost).expect(201)
    assert.notEqual(savedBlog.body.user,null )
  })
  test("Making a blog post with a userid", async () => {
    const secondNewBlogPost = {
      title: "Second random post",
      url: "Https://www.duckduckgo.com",
      likes: "2",
      author: `${postingUser.username}`,
      user: `${postingUser.body.id}`
    }
    const savedBlog = await api.post("/api/blogs/").send(secondNewBlogPost).expect(201)
    assert.strictEqual(savedBlog.body.user, postingUser.body.id)
  })
})

after(async () => {
  await mongoose.connection.close();
});