const userRouter = require("express").Router();
const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('posts', {title: 1, author: 1, url: 1 })
  response.json(users);
});
userRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id)
  if(!user){
    response.status(404).json({error: "User id not found"})
  }
    response.send(user)
})
userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  console.log(username, name, password);
 if (password.length < 3) {
    return response
      .status(422)
      .json({ error: "password must be at least 3 characters long" });
  } else if (username.length < 3) {
    return response
      .status(422)
      .json({ error: "username must be at least 3 characters longs" });
  }
  const saltRounds = 10;
  try {
    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log("Creating new user...");
    const user = new User({
      username,
      name,
      passwordHash,
    });
    console.log("Saving user to database...");
    const savedUser = await user.save();

    console.log("User saved:", savedUser);
    response.status(201).json(savedUser);
  } catch (error) {
    console.error("Error during user creation:", error);
    if (
      error.name === "MongoServerError" &&
      error.message.includes("E11000 duplicate key error")
    ) {
      response.status(409).json({
        error: "error: 'expected `username` to be unique",
      });
    } else {
      response
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  }
});

module.exports = userRouter;
