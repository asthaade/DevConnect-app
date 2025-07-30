const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// Helper: Return cookie options depending on environment
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 8 * 3600000), // 8 hours
});

// POST /signup
authRouter.post('/signup', async (req, res) => {
  try {
    // Validate data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    // Save to DB
    const savedUser = await user.save();

    // Generate token
    const token = await savedUser.getJWT();

    // Set token cookie
    res.cookie("token", token, getCookieOptions());

    // Respond with user data
    res.json({ message: "Added User successfully!", data: savedUser });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// POST /login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, getCookieOptions());

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// POST /logout
authRouter.post('/logout', async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(Date.now())
  });
  res.send("User logged out successfully!");
});

module.exports = authRouter;
