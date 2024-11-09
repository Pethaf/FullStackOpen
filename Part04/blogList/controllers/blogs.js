const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFromRequest = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/blogs', async (req, res) => {
  const blogs = await Blog.find({})
  res.send(blogs)
})
blogsRouter.post('/blogs', async (req, res) => {
  console.log(`${req.body.title} ${req.body.url}`)
    if (!req.body.title || !req.body.url) {
    res.status(400).end()
  }
  else {
    const body = req.body
    const decodedToken = jwt.verify(getTokenFromRequest(req), process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blogToPost = new Blog({ ...body, user: user._id })
    const result = await blogToPost.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    res.status(201).json(result)
  }
})

blogsRouter.delete('/blogs/:id', async (req, res) => {
  const blogToDelete = await Blog.findById(req.params.id)
  if (!blogToDelete) {
    res.status(404)
  }
  else {
    const decodedToken = jwt.verify(getTokenFromRequest(req.body))
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    else {
      const blogToDelete = await Blog.findById(req.params.id)
      if (!blogToDelete) {
        return res.status(404).json({ eror: 'resource not found' })
      }
      if (blogToDelete.user._id !== decodedToken.id) {
        return res.status(401).end()
      }
      await Blog.findByIdAndDelete(req.params.id)
      res.status(204).end()
    }
  }
})

blogsRouter.get('/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    }
    else {
        res.status(404).end
    }
})

blogsRouter.put('/blogs/:id', async (req, res) => {
    const result = await Blog.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, upsert: false, includeResultMetadata: true })
    if (req.body.id !== result.value._doc._id) {
        res.status(404).json(`${{ error: 'No blog to update found' }}`).end()
    }
    else {
        res.status(204).json(result.value._doc)
    }
})
module.exports = blogsRouter
