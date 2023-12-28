const mongoose = require('mongoose')
if(process.argv.length < 3){
  console.log('give password as argument')
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.cah2bcd.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content:'Mongoose made things easy',
  date: new Date(),
  important: true
})


note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})



