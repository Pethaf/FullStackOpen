const blogRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.send(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { title, author, url, likes, userId } = request.body;
  const user = await User.findById(userId);
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
  console.log("Penis",request.params.id)
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(204).end();
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(200).end()
})
module.exports = blogRouter;
