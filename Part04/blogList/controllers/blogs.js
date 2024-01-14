const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
blogsRouter.get('/', (req,res) => {
  res.send('Test').end()
})
blogsRouter.get('/blogs',async (req,res) => {
  const blogs = await Blog.find({})
  const listOfBlogs = blogs.map(blog => blog)
  res.send(listOfBlogs)
})

blogsRouter.post('/blogs', async (req,res) => {
  if(!req.body.title || !req.body.url || !req.body.userId){
    res.status(400).end()
  }
  else {
    const body = req.body
    const theUser = await User.findById(body.userId)
    const blogToPost = new Blog({ ...body, user: theUser.id })
    const result = await blogToPost.save()
    theUser.blogs = theUser.blogs.concat(result._id)
    await theUser.save()
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

