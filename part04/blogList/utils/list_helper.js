const dummy = (blogs) => {
    return 1
}

const totalLikes = (posts) => {
    return posts.reduce((total, item) => total+item.likes, 0)
}
const favoriteBlog = (posts) => {
    let  maxLikes = 0;
    let favoriteBlog = {}
    posts.forEach(post => {
        if(post.likes > maxLikes){
            maxLikes = post.likes
            favoriteBlog = post
        }
    })
    return favoriteBlog
}
module.exports = {
    dummy, totalLikes, favoriteBlog
}
