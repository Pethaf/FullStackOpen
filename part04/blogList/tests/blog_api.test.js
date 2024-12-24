const { listWithMultipleBlogs } = require("../assets/blogList");
const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = listWithMultipleBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Correct number of blogs in db", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, listWithMultipleBlogs.length);
});

test("Returned blogposts have field named id not _id", async () => {
  const response = await api.get("/api/blogs").expect(200);
  assert.ok(
    Array.isArray(response.body),
    response.body.forEach((item) => {
      assert.ok(item.hasOwnProperty("id"), "Item is missing 'id' field");
      assert.ok(!item.hasOwnProperty("_id"));
    })
  );
});
