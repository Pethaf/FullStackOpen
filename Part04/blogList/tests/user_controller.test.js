const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../tests/test_helper')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
describe('When there is one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type',/application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length+1)
  })
  test('username should be unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
    const usersAtStart = await helper.usersInDb()
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  test('One user in user database', async () => {
    const users = await api.get('/api/users').expect('Content-Type', /application\/json/)
    expect(users.body).toHaveLength(1)
  })
})