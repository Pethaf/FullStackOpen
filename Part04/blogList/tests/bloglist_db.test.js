const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../tests/test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})
describe("Structure of saved blog posts", () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('Fetches blogs from database', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body.length).toBe(helper.initialBlogs.length)
  })

  test('Test that fetched blog posts have a property called id ', async () => {
    const result = await api.get('/api/blogs')
    result.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
  test('Test that fetched blog posts do not have a property called _id', async () => {
    const result = await api.get('/api/blogs')
    result.body.forEach(blog => {
      expect(blog._id).not.toBeDefined()
    })
  })
})

describe('Can create new blog', () => {
  test('Posting a blog to api works', async () => {
    const newBlog = {
      title: 'All coding and no play',
      author: 'Mr X',
      likes: 4,
      url:'http://unknown.com'
    }
    await api.post('/api/blogs').
      send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogs = await api.get('/api/blogs')
    expect(helper.initialBlogs.length).toBe(blogs.body.length-1)
    const createdBlog = blogs.body.find(
      blog => {return (blog.author === newBlog.author &&
                      blog.title === newBlog.title)})
    expect(createdBlog).toBeDefined()}
  )})
describe('Blog likes defaults to 0 if not otherwise specified', () => {
  test('Check that blog post with no specified like defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Interesting Stuff',
      author: 'Mr. Y',
      url: 'http://unknown.com'
    }
    await api.post('/api/blogs')
      .send(newBlog)
    const blogsInRemoteDB = await api.get('/api/blogs')
    console.log(blogsInRemoteDB)
    const createdBlogPost = blogsInRemoteDB.body.find(blog =>
    {return (blog.title === newBlog.title &&
          blog.author === newBlog.author &&
          blog.url === newBlog.url)})
    expect(createdBlogPost.likes).toBe(0)
  })})

afterAll(async () => {
  await mongoose.connection.close()
})