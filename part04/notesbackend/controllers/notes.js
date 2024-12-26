const notesRouter = require("express").Router();
const { response } = require("express");
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate('user',{username: 1, name: 1});
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(body.userId);
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });
  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response, next) => {
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

notesRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };
  const Updatednote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
  });
  if (Updatednote) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

module.exports = notesRouter;
