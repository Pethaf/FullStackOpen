const blogRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.send(blogs);
});

blogRouter.post("/", async (request, response) => {
  const token = getTokenFrom(request);
  console.log("token:", token);
  if (!token) {
    return response.status(401).json({ error: "no token" });
  }
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  console.log("Decoded token:", decodedToken);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  if(!user){
    response.status(404).end()
  }
  const { title, author, url, likes } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  });
  const savedBlog = await blog.save();
  user.posts = user.posts.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});
blogRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  response.send(updatedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  console.log(request.params.id);
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(204).end();
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(200).end();
});
module.exports = blogRouter;
