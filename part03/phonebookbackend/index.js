const http=require("http");
const express = require("express");
const cors = require("cors");
const app = express();
var morgan = require('morgan')
app.use(morgan('combined'));
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('POST data:', req.body);
  }
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.static('dist'))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123457",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-53",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "12423423",
        "id": 4
      }
    ]
    const generateId = () => {
        const maxId = persons.length > 0
          ? Math.max(...persons.map(n => n.id))
          : 0
        return maxId + 1
      }

    app.get("/", (request,response) => {
        response.send("Backend API, please use specified urls")
    })
    app.get("/api/persons", (request,response) => {
        response.json(persons)
    })

    app.get("/api/persons/:id", (request, response) => {
        const id = request.params.id
        const personToDisplay = persons.find(aPerson => aPerson.id == id)
        if(personToDisplay){
            response.json(personToDisplay).status(200).end()
        }
        else {
            response.json(`Person with id ${id} not found`).status(404).end()
        }
    })
    app.delete("/api/persons/:id", (request, response) =>{
      const id = request.params.id
        const personToDelete = persons.find(aPerson => aPerson.id == id)
        if(personToDelete){
            persons = [...persons.filter(aPerson => aPerson.id != id)]
            response.status(200).json(personToDelete).end();
        }
        response.status(404).end()
    }
    )
    app.post("/api/persons",(request, response) => {
        const personToCreate = request.body;
        if(personToCreate.name && personToCreate.number){
            const newPerson = {
                ...personToCreate,
                id: `${generateId()}`
            }
            persons = [...persons, newPerson]
            response.json(newPerson).status(201).end()
        }
        else {
            response.json({"error":"Include name & number for new person"}).status(422).end()
        }
    })
const PORT = 3001;
app.listen(PORT);
console.log(`Phonebackend server running on port ${PORT}`)
