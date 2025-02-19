const config = require("./utils/config");
const express = require("express");
const supertest = require('supertest')
require('express-async-errors')
const app = express();
const api = supertest(app)
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const loginRouter = require('./controllers/login')
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const usersRouter = require('./controllers/users')
mongoose.set("strictQuery", false);
console.log(config.MONGODB_URI)
logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  })
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app

