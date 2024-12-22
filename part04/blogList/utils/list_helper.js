const dummy = (blogs) => {
    return 1
}

const totalLikes = (posts) => {
    return posts.reduce((total, item) => total+item.likes, 0)

}
module.exports = {
    dummy, totalLikes
}
