const { listWithOneBlog,listWithTwoBlogs, listWithMultipleBlogs } = require('../assets/blogList');
const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('when list has only two blogs, total likes equals sum of that', () => {
    const result = listHelper.totalLikes(listWithTwoBlogs)
    assert.strictEqual(result,12 )
  })
  test('when list has multiple blogs, equal sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 36)

  })
})
