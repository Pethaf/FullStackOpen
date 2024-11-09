const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  let likes = 0
  blogs.forEach(blog => likes+=blog.likes)
  return likes
}
const favoriteBlog = (listOfBlogs) => {
  if(listOfBlogs.length === 0){
    return []
  }
  const { favoriteBlog } =
    listOfBlogs.reduce((acc,curr) => curr.likes > acc.likes?
      { favoriteBlog:curr,likes:curr.likes } : { ...acc } , { favoriteBlog:{},likes:0 })
  return { title: favoriteBlog.title, author: favoriteBlog.author, likes:favoriteBlog.likes }
}

const mostBlogs = (listOfBlogs) => {
  if(listOfBlogs.length === 0){
    return []
  }
  else {
    let blogCountByAuthor = {}
    listOfBlogs.forEach(blog => {
      if(blogCountByAuthor[blog.author]){
        blogCountByAuthor[blog.author]+=1
      }
      else {
        blogCountByAuthor[blog.author] = 1
      }
    })
    return Object.entries(blogCountByAuthor).reduce((acc,curr) =>
    { if(curr[1] > acc.blogs)
    {return { 'author' : curr[0], 'blogs':curr[1] } }
    else
    { return { ...acc }}
    }, { 'author':'', 'blogs': 0 })
  }
}
const mostLikes = (listOfBlogs) => {
  if(listOfBlogs.length === 0){
    return {}
  }
  else {
    let likesByAuthor = {}
    listOfBlogs.forEach(blog => {
      if(likesByAuthor[blog.author]){
        likesByAuthor[blog.author] +=blog.likes
      }
      else {
        likesByAuthor[blog.author] = blog.likes
      }
    })
    return Object.entries(likesByAuthor).reduce((acc,curr) => {
      if(curr[1] > acc.likes){
        return { 'author': curr[0], 'likes':curr[1] }}
      else {return { ...acc } }},
    { 'author' : '', likes:0 })
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}