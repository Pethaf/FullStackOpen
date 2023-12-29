const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0
  blogs.forEach(blog => likes+=blog.likes)
  return likes
}
const favoriteBlog = (listOfBlogs) => {
  const { favoriteBlog } =
  listOfBlogs.reduce((acc,curr) => curr.likes > acc.likes?
    { favoriteBlog:curr,likes:curr.likes } : { ...acc } , { favoriteBlog:{},likes:0 })
  return { title: favoriteBlog.title, author: favoriteBlog.author, likes:favoriteBlog.likes }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}

