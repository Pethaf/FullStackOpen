const blogRouter = require("express").Router()
const { response } = require("express")
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.send(blogs)
  })
  
blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  })
  
blogRouter.delete('/:id', async (request, response) => {
  console.log(request.params.id)
  if(!request.params.id){
    response.status(404).end()
  }
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  response.send(deletedBlog)
})
module.exports = blogRouter