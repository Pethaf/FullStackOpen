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

test("Valid blog post can be posted", async () => {
  const blog = {
    title: "Test",
    author: "Mr.X",
    url: "http://google.com",
    likes: 2,
  };
  const savedBlog = await api.post("/api/blogs").send(blog).expect(201);

  const response = await api.get("/api/blogs");

  assert.deepEqual(response.body.length, listWithMultipleBlogs.length + 1);
  for (const prop of Object.keys(blog)) {
    assert.deepEqual(savedBlog.body[prop], blog[prop]);
  }
  assert.hasOwnProperty(savedBlog.body["id"]);
});
test("Blog post value likes defaults to 0", async () => {
  const blog = {
    author: "Mr.Y",
    title: "Test",
    url: "http://www.google.com",
  };
  const savedBlog = await api.post("/api/blogs").send(blog).expect(201);
  assert.deepEqual(savedBlog.body.likes, 0);
});

test("Blog post without title won't get posted", async () => {
  const newBlog = {
    name: "Test",
    url: "http://google.com",
    likes: 4,
  };
  const savedBlog = await api.post("/api/blogs").send(newBlog).expect(400);
  const blogs = await api.get("/api/blogs")
  assert.deepEqual(blogs.body.length, listWithMultipleBlogs.length)
});

test("Blog post without url won't get posted", async () => {
  const newBlog = {
    name: "Test",
    author: "Mr. Y",
  }
  const savedBlog = await api.post("/api/blogs").send(newBlog).expect(400);
  const blogs = await api.get("/api/blogs")
  assert.deepEqual(blogs.body.length, listWithMultipleBlogs.length)
})

after(async () => {
  await mongoose.connection.close();
});
