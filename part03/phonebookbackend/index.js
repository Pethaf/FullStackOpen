require("dotenv").config();
const Person = require("./models/person");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
var morgan = require("morgan");
const person = require("./models/person");
app.use(morgan("combined"));
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("POST data:", req.body);
  }
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.get("/", (request, response) => {
  response.send("Backend API, please use specified urls");
});
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person).status(200).end();
    } else {
      response.json(`Person with id ${id} not found`).status(404).end();
    }
  });
});
app.delete("/api/persons/:id", (request, response) => {
  
});
app.post("/api/persons", (request, response) => {
  const personToCreate = request.body;
  if (personToCreate.name && personToCreate.number) {
    const newPerson = new Person({
      name: personToCreate.name,
      number: personToCreate.number
    })
    newPerson.save().then(
      response.json(newPerson)
    )
  } else {
    response
      .json({ error: "Include name & number for new person" })
      .status(422)
      .end();
  }
});

app.put("/api/persons/:id", (request, response) => {
  const newNumber = request.body.number;
  const id = Number(request.params.id);
  if (!newNumber) {
    return response.status(422).json({ error: "Please include a new number" });
  }
  const personExists = persons.some((person) => person.id === id);
  if (!personExists) {
    return response.status(404).json({ error: "Person not found" });
  }
  const newPersons = persons.map((person) => {
    if (person.id === id) {
      return { ...person, number: newNumber };
    } else {
      return person;
    }
  });
  persons = [...newPersons];
  const updatedPerson = persons.find((person) => person.id === id);
  response.status(200).json(updatedPerson);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(`Phonebackend server running on port ${PORT}`);
