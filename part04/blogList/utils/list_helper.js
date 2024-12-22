const dummy = (blogs) => {
  return 1;
};

const totalLikes = (posts) => {
  return posts.reduce((total, item) => total + item.likes, 0);
};
const favoriteBlog = (posts) => {
  let maxLikes = 0;
  let favoriteBlog = {};
  posts.forEach((post) => {
    if (post.likes > maxLikes) {
      maxLikes = post.likes;
      favoriteBlog = post;
    }
  });
  return favoriteBlog;
};

const mostBlogs = (posts) => {
  let blogsAndAuthors = {};
  posts.forEach((post) => {
    if (Object.hasOwn(blogsAndAuthors, post.author)) {
      blogsAndAuthors[post.author] += 1;
    } else {
      blogsAndAuthors[post.author] = 1;
    }
  });

  let maxBlogs = 0;
  let topAuthor = null;

  for (const [author, blogs] of Object.entries(blogsAndAuthors)) {
    if (blogs > maxBlogs) {
      maxBlogs = blogs;
      topAuthor = author;
    }
  }
  return { author: topAuthor, blogs: maxBlogs };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
