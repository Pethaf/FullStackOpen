const { test, after, beforeEach  } = require("node:test");
const {initialNotes } = require("../assets/notes")
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const assert = require("assert");
const Note = require("../models/note");
test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
    await Note.deleteMany({})
    let noteObject = new Note(initialNotes[0])
    await noteObject.save()
    noteObject = new Note(initialNotes[1])
    await noteObject.save()
  })
  
test("there are two notes", async () => {
  const response = await api.get("/api/notes");
  assert.strictEqual(response.body.length, 2);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((e) => e.content);
  assert.strictEqual(contents.includes("HTML is easy"), true);
});
