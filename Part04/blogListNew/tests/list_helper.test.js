let blogArrayModule = require('../assets/blogs.js')
let blogs = blogArrayModule.blogs
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blog = require('../models/blog')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result,1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result,5)
  }),
  test('gets correct number of total likes from long list of blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
  test('gets number of total likes right from list of two blog', () => {
    const result = listHelper.totalLikes(blogs.slice(0,2))
    assert.strictEqual(result, 12)
  })
})

describe('most likes', () => {
  test('finds blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('find the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('find the the author who has the most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})