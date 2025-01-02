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

after(async () => {s
  await mongoose.connection.close();
});