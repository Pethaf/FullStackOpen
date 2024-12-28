const userRouter = require("express").Router();
const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt")
userRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});
userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username || !password) {
    return response
      .status(400)
      .json({ error: "Username and password are required" });
  } else if (password.length < 3) {
    return response
      .status(400)
      .json({ error: "password needs to be at least 3 characters long" });
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
    response
      .status(500)
      .json({ error: "Internal Server Error: " + error.message });
  }
});

module.exports = userRouter;
