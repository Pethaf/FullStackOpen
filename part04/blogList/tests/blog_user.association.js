const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const Blog = require("../models/blog");
before(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
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
    const blogFromDb = await api.get(`/api/blogs/${savedBlog.id}`)
    assert.notEqual(blogFromDb.body.user,null )

  })
})

after(async () => {
  await mongoose.connection.close();
});