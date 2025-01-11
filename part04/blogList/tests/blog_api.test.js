const { listWithMultipleBlogs } = require("../assets/blogList");
const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const config = require('../utils/config')
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let postingUser;
const newUser = {
  username: "Test",
  name: "MrX",
  password: "password",
};

before(async () => {
  await User.deleteMany();
  await Blog.deleteMany();
  postingUser = await api.post("/api/users").send(newUser).expect(201);
});
const loginUser = async (username, password) => {
  return await api.post("/api/login").send({
    username,
    password,
  });
};
const postBlog = async (blog) => {
  const response = await loginUser(newUser.username, newUser.password);
  return await api
    .post("/api/blogs/")
    .send(blog)
    .set("Authorization", `Bearer ${response.body.token}`);
};
beforeEach(async () => {
  await sleep(1000) 
  await Blog.deleteMany({});
  if (!postingUser?.body?.id) {
    throw new Error("postingUser is not defined or lacks an ID");
    
  }
  const blogObjects = listWithMultipleBlogs.map((blog) => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
  }));

  const promiseArray = blogObjects.map((blog) => postBlog(blog));
  await Promise.all(promiseArray);
});

describe("When there are blogs in the database", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/).timeout(10000);;
  });

  test("Correct number of blogs in db", async () => {
    await sleep(1000)
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, listWithMultipleBlogs.length);
  });
});

/*describe("Posting blogs", () => {
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
  test("Valid blog can't be posted if user doesn't have a valid JWT", async () => {
    const blog = {
      title: "Other Blog",
      author: "Mr.X",
      url: "http://google.com",
      likes: 2
    }
    const savedBlog = await api.post("/api/blogs").send(blog).expect(401)
  })
  test("Valid blog post can be posted if user is logged in and has a valid JWT", async () => {
    const blog = {
      title: "Test",
      author: "Mr.X",
      url: "http://google.com",
      likes: 2,
    };
    const savedBlog = await postBlog(blog);
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
    };
    const savedBlogResponse = await postBlog(blog)
    assert.strictEqual(savedBlogResponse.status, 201);
    assert.strictEqual(savedBlogResponse.body.likes, 0);
  });

  test("Valid blog post requires title", async () => {
    const newBlog = {
      title: "Test",
      url: "http://google.com",
      likes: 4,
    };
    const savedBlogResponse = await postBlog(newBlog);
    assert.strictEqual(savedBlogResponse.status,400)
    const blogs = await api.get("/api/blogs");
    assert.strictEqual(blogs.body.length, listWithMultipleBlogs.length);
  });

  test("Valid blog post requires url", async () => {
    const newBlog = {
      name: "Test",
      author: "Mr. Y",
    };
    const savedBlogResponse = await postBlog(newBlog);
    assert.strictEqual(savedBlogResponse.status, 400)
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
    };
    const savedBlog = await postBlog(blogToDelete)
    assert.equal(savedBlog.status, 201)
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
    };
    const savedBlog = await postBlog(blogToUpdate)
    assert.strictEqual(savedBlog.status, 201)
    const updatedBlog = {
      author: "Mr. Z",
      title: "Changed Me",
      url: "http://changedme.com",
      likes: 2,
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
});*/

after(async () => {
  await mongoose.connection.close();
});
