const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })
  const savedUser = await user.save()
  res.status(201).json(savedUser)

})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.send(users).end()
})
module.exports = usersRouter