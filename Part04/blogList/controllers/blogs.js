const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFromRequest = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}
blogsRouter.get('/', (req,res) => {
  res.send('Test').end()
})
blogsRouter.get('/blogs',async (req,res) => {
  const blogs = await Blog.find({})
  const listOfBlogs = blogs.map(blog => blog)
  res.send(listOfBlogs)
})

blogsRouter.post('/blogs', async (req,res) => {
  if(!req.body.title || !req.body.url){
    res.status(400).end()
  }
  else {
    const body = req.body
    const decodedToken = jwt.verify(getTokenFromRequest(req), process.env.SECRET)
    if(!decodedToken.id){
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
  const idToDelete = req.params.id
  const blogToDelete = await Blog.findByIdAndDelete(idToDelete)
  if(blogToDelete){
    res.status(204).end()
  }
  else {
    res.status(404).end()
  }
} )

blogsRouter.get('/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  const tmp = []
  tmp.push(blog)
  if(blog){
    res.send(tmp)
  }
  else {
    res.status(404).end()
  }

})

blogsRouter.put('/blogs/:id', async (req, res) => {
  console.log(`ReqBody: ${Object.keys(req.body)}}`)
  const result = await Blog.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, upsert:false, includeResultMetadata: true })
  //console.log(`Id equal? ${req.body.id === result.value._doc._id}`)
  //console.log(`Testing: ${Object.keys(req.body)}`)
  //console.log(`Result: ${Object.keys(result.value._doc)}`)
  if(req.body.id !== result.value._doc._id){
    res.status(404).json(`${{ error: 'No blog to update found' }}`).end()
  }
  else{
    res.status(204).json(result.value._doc)
  }
})
module.exports = blogsRouter

