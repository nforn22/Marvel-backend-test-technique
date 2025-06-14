const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");


router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // vérif des champs requis
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // vérif si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // vérif si le username existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // génération du salt et du hash
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
      _id: newUser._id,
      token: newUser.token,
      email: newUser.email,
      username: newUser.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // vérif des champs requis
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // vérif du mdp
    const newHash = SHA256(password + user.salt).toString(encBase64);
    if (newHash !== user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      token: user.token,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 