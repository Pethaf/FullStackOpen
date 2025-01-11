const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const Blog = require("../models/blog");
let postingUser;
const newUser = {
  username: "MrX",
  name: "Mr.X",
  password: "password",
};
before(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  postingUser = await api.post("/api/users/").send(newUser).expect(201);
});
describe("User posts blog", () => {
  test("Making a blog post without a bearer token", async () => {
    const newBlogPost = {
      title: "Random Post",
      url: "https://www.google.com",
      likes: 3,
      author: "Mr.Z",
    };
    const savedBlog = await api
      .post("/api/blogs")
      .send(newBlogPost)
      .expect(401);
  });
  test("Making a blog post with a bearer token", async () => {
    const secondNewBlogPost = {
      title: "Second random post",
      url: "https://www.duckduckgo.com",
      likes: 2,
      author: "MrX",
    };
    const response = await api
      .post("/api/login")
      .send({ username: newUser.username, password: newUser.password });
    assert.ok(response.body.token);
    assert.strictEqual(response.status, 200);
    const savedBlog = await api
      .post("/api/blogs/")
      .send(secondNewBlogPost)
      .set("Authorization", `Bearer ${response.body.token}`)
      .expect(201);
    assert.strictEqual(savedBlog.body.user, postingUser.body.id);
  });
});

after(async () => {
  await mongoose.connection.close();
});
