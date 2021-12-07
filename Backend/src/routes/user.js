const express = require("express");
const { TokenExpiredError } = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

// Create User
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send("Email account hasn been taken");
  }
});

// User login
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredential(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(500).send("Email not register, signup now");
  }
});

// User Logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
