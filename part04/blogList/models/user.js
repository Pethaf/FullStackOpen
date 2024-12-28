const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3 
  },
  name: String,
  passwordHash: String,
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Blog" }],
});

userSchema.set('toJSON', {
    transform: (document,returnedObject) => {
        returnedObject.id = document._id,
        delete returnedObject.__v, 
        delete returnedObject.passwordHash
        delete returnedObject._id
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
