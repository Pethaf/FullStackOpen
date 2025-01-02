const { listWithMultipleBlogs } = require("../assets/blogList");
const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
let postingUser;
before(async () => {
  await User.deleteMany();
  const newUser = {
    username: "Test",
    name: "MrX",
    password: "password",
  };
  postingUser = await api.post("/api/users").send(newUser).expect(201);
});
beforeEach(async () => {
  await Blog.deleteMany({});
  if (!postingUser?.body?.id) {
    throw new Error("postingUser is not defined or lacks an ID");
  }
  const blogObjects = listWithMultipleBlogs.map((blog) => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    userId: postingUser.body.id,
  }));

  const promiseArray = blogObjects.map((blog) =>
    api.post("/api/blogs").send(blog)
  );
  await Promise.all(promiseArray);
});

describe("When there are blogs in the database", () => {
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
});

describe("Posting blogs", () => {
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
      userId: postingUser.body.id,
    };
    const savedBlog = await api.post("/api/blogs").send(blog).expect(201);
    const response = await api.get("/api/blogs");
    assert.deepEqual(response.body.length, listWithMultipleBlogs.length + 1);
    assert.equal(blog["title"], savedBlog.body["title"]);
    assert.equal(blog["author"], savedBlog.body["author"]);
    assert.equal(blog["url"], savedBlog.body["url"]),
      assert.equal(blog["likes"], savedBlog.body["likes"]);
    assert.hasOwnProperty(savedBlog.body["id"]);
  });
  test("Blog post value likes defaults to 0", async () => {
    const blog = {
      author: "Mr.Y",
      title: "Test",
      url: "http://www.google.com",
      userId: postingUser.body.id,
    };
    const savedBlog = await api.post("/api/blogs").send(blog).expect(201);
    assert.deepEqual(savedBlog.body.likes, 0);
  });

  test("Blog post without title won't get posted", async () => {
    const newBlog = {
      name: "Test",
      url: "http://google.com",
      likes: 4,
      userId: postingUser.body.id,
    };
    const savedBlog = await api.post("/api/blogs").send(newBlog).expect(400);
    const blogs = await api.get("/api/blogs");
    assert.strictEqual(blogs.body.length, listWithMultipleBlogs.length);
  });

  test("Blog post without url won't get posted", async () => {
    const newBlog = {
      name: "Test",
      author: "Mr. Y",
      userId: postingUser.body.id,
    };
    const savedBlog = await api.post("/api/blogs").send(newBlog).expect(400);
    const blogs = await api.get("/api/blogs");
    assert.strictEqual(blogs.body.length, listWithMultipleBlogs.length);
  });
});

describe("Deleting blogs", () => {
  test("Deleting a blog post", async () => {
    const blogToDelete = {
      title: "DeleteMe",
      author: "DeleteMe",
      url: "DeleteMe",
      likes: 3,
      userId: postingUser.body.id,
    };
    const savedBlog = await api
      .post("/api/blogs")
      .send(blogToDelete)
      .expect(201);
    const blogsBeforeDeleting = await api.get("/api/blogs");
    await api.delete(`/api/blogs/${savedBlog.body.id}`).expect(200);
    const blogsAfterDeleting = await api.get("/api/blogs");
    assert.strictEqual(
      blogsBeforeDeleting.body.length - 1,
      blogsAfterDeleting.body.length
    );
    assert.ok(
      Array.isArray(blogsAfterDeleting.body),
      blogsAfterDeleting.body.forEach((item) => {
        assert.ok(item._id !== savedBlog.body.id);
      })
    );
    const user = await api.get(`/api/users/${postingUser.body.id}`);
    const userPosts = user.body.posts;
    assert.equal(
      userPosts.filter((post) => post.id === savedBlog.body.id).length,
      0
    );
  });
});

describe("Updating blog", () => {
  test("Updating blog works", async () => {
    const blogToUpdate = {
      author: "Mr.Y",
      title: "Change Me",
      url: "http://changeme.com",
      userId: postingUser.body.id,
    };
    const savedBlog = await api
      .post("/api/blogs")
      .send(blogToUpdate)
      .expect(201);

    const updatedBlog = {
      author: "Mr. Z",
      title: "Changed Me",
      url: "http://changedme.com",
      likes: 2,
      userId: postingUser.body.id,
    };
    await api
      .put(`/api/blogs/${savedBlog.body.id}`)
      .send(updatedBlog)
      .expect(200);
    const blogList = await api.get("/api/blogs");
    const changedBlogFromDB = blogList.body.find(
      (blog) => blog.id === savedBlog.body.id
    );
    assert.notEqual(changedBlogFromDB, null);
    assert.equal(updatedBlog["author"], changedBlogFromDB["author"]);
    assert.equal(updatedBlog["title"], changedBlogFromDB["title"]);
    assert.equal(updatedBlog["url"], changedBlogFromDB["url"]);
    assert.equal(updatedBlog["likes"], changedBlogFromDB["likes"]);
  });
});

after(async () => {
  await mongoose.connection.close();
});
