const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/', isAuthenticated, async (req, res) => {
  try {
    const favorites = await Favorite.findOne({ user: req.user._id });
    if (!favorites) {
      return res.json({
        status: "success",
        data: { comics: [], characters: [] }
      });
    }
    res.json({
      status: "success",
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});


router.post('/comics/:comicId', isAuthenticated, async (req, res) => {
  try {
    const { comicId } = req.params;
    let favorites = await Favorite.findOne({ user: req.user._id });
    
    if (!favorites) {
      favorites = new Favorite({
        user: req.user._id,
        comics: [comicId],
        characters: []
      });
    } else if (!favorites.comics.includes(comicId)) {
      favorites.comics.push(comicId);
    }
    
    await favorites.save();
    res.json({
      status: "success",
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});


router.post('/characters/:characterId', isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    let favorites = await Favorite.findOne({ user: req.user._id });
    
    if (!favorites) {
      favorites = new Favorite({
        user: req.user._id,
        comics: [],
        characters: [characterId]
      });
    } else if (!favorites.characters.includes(characterId)) {
      favorites.characters.push(characterId);
    }
    
    await favorites.save();
    res.json({
      status: "success",
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});


router.delete('/comics/:comicId', isAuthenticated, async (req, res) => {
  try {
    const { comicId } = req.params;
    const favorites = await Favorite.findOne({ user: req.user._id });
    
    if (favorites) {
      favorites.comics = favorites.comics.filter(id => id !== comicId);
      await favorites.save();
    }
    
    res.json({
      status: "success",
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});


router.delete('/characters/:characterId', isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    const favorites = await Favorite.findOne({ user: req.user._id });
    
    if (favorites) {
      favorites.characters = favorites.characters.filter(id => id !== characterId);
      await favorites.save();
    }
    
    res.json({
      status: "success",
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router; 