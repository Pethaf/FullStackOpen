const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: "Username and password are required" });
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
    response.status(500).json({ error: "Internal Server Error: " + error.message });
  }
});

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})
module.exports = usersRouter;
