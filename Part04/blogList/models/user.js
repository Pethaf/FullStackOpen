const mongoose = require('mongoose')
require('mongoose-unique-validator')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJson', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const user =mongoose.model('User', userSchema)

module.exports = user