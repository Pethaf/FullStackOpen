const { User } = require("../models/user")
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
  if (posts.length === 0) return null;

  const authorBlogCounts = posts.reduce((counts, post) => {
    counts[post.author] = (counts[post.author] || 0) + 1;
    return counts;
  }, {});

  const topAuthor = Object.keys(authorBlogCounts).reduce((top, author) => {
    return authorBlogCounts[author] > authorBlogCounts[top] ? author : top;
  });

  return { author: topAuthor, blogs: authorBlogCounts[topAuthor] };
};

const mostLikes = (posts) => {
  if (posts.length === 0) return null;

  const authorLikeCounts = posts.reduce((counts, post) => {
    counts[post.author] = (counts[post.author] || 0) + post.likes;
    return counts;
  }, {});

  const topAuthor = Object.keys(authorLikeCounts).reduce((top, author) => {
    return authorLikeCounts[author] > authorLikeCounts[top] ? author : top;
  });

  return { author: topAuthor, likes: authorLikeCounts[topAuthor] };
};

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb
};
