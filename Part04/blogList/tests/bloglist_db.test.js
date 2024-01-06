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
describe('Missing content in blog post', () => {
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
    expect(createdBlogPost.likes).toBe(0)})

    test('Blog post with missing title returns error 400', async () => {
    const badBlogPost = {
      author: 'Mr Y',
      likes: 0,
      url: 'http://www.unknown.com'
    }
    await api.post('/api/blogs').send(badBlogPost).expect(400)
  })
  test('Blog post with missing url returns error 400', async () => {
    const badBlogPost = {
      author: 'Mr Y',
      likes: 0,
      title: 'Testing for fun and profit'
    }
    await api.post('/api/blogs').send(badBlogPost).expect(400)
  })
})

describe('delete a blog', () => {
  let deleteId
  const blogToDelete = {
    author: 'Mr.Z',
    title: 'DeleteMe',
    url: 'http://www.unknown.com',
  }

  test('deleting a blog decreases count of blogs in database by one', async () => {
    const tmp = await api.post('/api/blogs').send(blogToDelete)
    deleteId= tmp._body.id
    await api.delete(`/api/blogs/${deleteId}`).expect(204)
    const blogsInDb = await api.get('/api/blogs')
    expect(blogsInDb.body).toHaveLength(helper.initialBlogs.length)
  })
  test('deleting a blog that has already been deleted returns a 404', async () => {
    await api.delete(`/api/blogs/${deleteId}`).expect(404)
  })
})

describe('Fetching a specific blog post', () => {
  test('fetching a blog that does not exist should give 404', async () => {
    const bogusPost = {
      author: 'Mr. W',
      title: 'Soon to be deleted',
      url: 'http://www.www.com'
    }
    const postedBlog = await api.post('/api/blogs').send(bogusPost)
    await api.delete(`/api/blogs/${postedBlog._body.id}`)
    await api.get(`/api/blogs/${postedBlog._body.id}`).expect(404)
  })
  test('Fetching blog by id should give blog post with 1 entry and same id', async () => {
    const blogToPost = {
      author:'Mr. Z',
      title: 'Tests are a good idea',
      url: 'http://someurl.com'
    }
    const postedBlog = await api.post('/api/blogs').send(blogToPost)
    console.log(`PostedBlog ${postedBlog.body.id}`)
    const fetchedBlog = await api.get(`/api/blogs/${postedBlog.body.id}`)
    console.log(`FetchedBlog: ${Object.keys(fetchedBlog)}`)
    expect(fetchedBlog.body).toHaveLength(1)
    expect(fetchedBlog.body[0].id).toBe(postedBlog.body.id)
  })
})
describe('Updating blog', () => {
  const blogToPost = {
    author:'Mr. Z',
    title: 'Tests are a good idea',
    url: 'http://someurl.com'
  }
  test('Updating a blog post that does not exist should be error', async () => {
    const recieved = await api.post('/api/blogs').send(blogToPost)
    await api.delete(`/api/blogs/${recieved.body.id}`)
    await api.put(`/api/blogs/${recieved.body.id}`).send({ ...blogToPost,likes:2 }).expect(404)
  })
  test('Updating author', async () => {
    const recieved = await api.post('/api/blog').send(blogToPost)
    await api.put(`/api/blog/${recieved.body.id}`).send({ author:'Mr Y' })
    const updated = await api.get(`/api/blog/${recieved.body.id}`)
    expect(updated.body.author).toEqual('Mr Y')
  })
  test('Updating title', async () => {
    const recieved = await api.post('/api/blog').send(blogToPost)
    await api.put(`/api/blog/${recieved.body.id}`).send({ title: 'Updated Title' })
    const updated = await api.get(`/api/blog/${recieved.body.id}`)
    expect(updated.body.title).toEqual('Updated Title')
  })
  test('Updating url', async () => {
    const recieved = await api.post('/api/blog').send(blogToPost)
    await api.put(`/api/blog/${recieved.body.id}`).send({ url: 'Updated Url' })
    const updated = await api.get(`/api/blog/${recieved.body.id}`)
    expect(updated.body.url).toEqual('Updated Url')
  })
  test('Updating likes', async () => {
    const recieved = await api.post('/api/blog').send(blogToPost)
    await api.put(`/api/blog/${recieved.body.id}`).send({ likes: 55 })
    const updated = await api.get(`/api/blog/${recieved.body.id}`)
    expect(updated.body.likes).toEqual(55)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})