const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

/*let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
*/
app.get(`/`, (request, response) => {
    response.send(`<h1>Hello World</h1>`)
} )

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id != id)
  response.status(204).end()
})
app.get(`/api/notes`, (request, response) => {
    response.json(notes)
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put(`/api/notes/`,(request,response)=>{
    const note = request.body
    notes = notes.map(aNote => aNote.id==note.id ? {...note}:aNote )
    response.json(note).status(200).end()
  }
)

const PORT = 3001; 
app.listen(PORT);
console.log(`Server running on port ${PORT}`)