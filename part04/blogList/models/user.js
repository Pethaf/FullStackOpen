const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User
