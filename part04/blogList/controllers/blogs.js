const blogRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor, tokenExtractor } = require("../utils/middleware");
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", tokenExtractor, userExtractor, async (request, response) => {
  const user = await User.findById(request.userId);
  if (!user) {
    return response.status(404).json({ error: "User not found" });
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
blogRouter.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  if (request.userId !== blog.user.toString()) {
    response.status(403).json({ error: "Forbidden" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  response.send(updatedBlog);
});

blogRouter.delete("/:id", tokenExtractor, userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  if (request.userId === blog.user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(200).json({ message: "Blog deleted successfully" });
  } else {
    response.status(403).json({ error: "Forbidden" });
  }
});
module.exports = blogRouter;
