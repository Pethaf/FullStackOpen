const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

const logger = (...params) => {
  info(...params)
}

module.exports = {
  info, error,logger
}

