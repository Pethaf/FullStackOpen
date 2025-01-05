const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const { JWT_EXPIRY_TIME } = require("../utils/config");
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  if (!username || !password) {
    return response
      .status(400)
      .json({ error: "Username and password are required" });
  }
  const user = await User.findOne({ username });
  const passwordCorrect =
    user == null ? false : await bcrypt.compare(password, user.passwordHash);
  if (passwordCorrect) {
    const userForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: JWT_EXPIRY_TIME,
    });
    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } else {
    response.status(401).json({ error: "Invalid username or password" });
  }
});
module.exports = loginRouter;
