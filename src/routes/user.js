const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");


router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid email format"
        });
      }

      if (!password || password.length < 6) {
          return res.status(400).json({
            status: "error",
            message: "Password too short"
          });
      }

    if (!email || !username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already exists"
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        status: "error",
        message: "Username already exists"
      });
    }

    const salt = uid2(24);
    const token = uid2(32);
    const passwordHash = SHA256(password + salt).toString(encBase64);

    const newUser = new User({
      email,
      username,
      passwordHash,
      token,
      salt,
      favorites: {
        characters: [],
        comics: [],
      },
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      data: {
        _id: newUser._id,
        token: newUser.token,
        email: newUser.email,
        username: newUser.username,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    const newHash = SHA256(password + user.salt).toString(encBase64);
    if (newHash !== user.passwordHash) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        token: user.token,
        email: user.email,
        username: user.username,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router; 