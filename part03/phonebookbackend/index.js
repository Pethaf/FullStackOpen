require("dotenv").config();
const Person = require("./models/person");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(morgan("combined"));
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: `unknown endpoint: ${request.method} ${request.originalUrl}`,
  });
};
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(cors());
app.use(express.static("dist"));
app.get("/", (request, response) => {
  response.send("Backend API, please use specified urls");
});
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response
          .status(404)
          .json({ error: `Person with id ${request.params.id} not found` });
      }
    })
    .catch((error) => {
      next(error);
    });
});
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).end();
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const personToCreate = request.body;
  if (!personToCreate.name?.trim() || !personToCreate.number?.trim()) {
    return response.status(422).json({
      error: "Name and number cannot be empty or whitespace",
    });
  }
  const newPerson = new Person({
    name: personToCreate.name.trim(),
    number: personToCreate.number.trim(),
  });
  newPerson
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  if (!number) {
    return response.status(422).json({ error: "Please include a new number" });
  }
  Person.findByIdAndUpdate(request.params.id, { number }, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
