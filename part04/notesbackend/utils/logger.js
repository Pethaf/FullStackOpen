const info = (...parameters) => {
    console.log(...params)
}

const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error 
}