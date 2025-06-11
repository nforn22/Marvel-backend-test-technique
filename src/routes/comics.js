const express = require('express');
const axios = require('axios');
const router = express.Router();

const MARVEL_API_KEY = process.env.MARVEL_API_KEY;
const MARVEL_API_BASE_URL = 'https://lereacteur-marvel-api.herokuapp.com';

// obtenir la liste des comics
router.get('/', async (req, res) => {
  try {
    const { limit, skip, title } = req.query;
    let url = `${MARVEL_API_BASE_URL}/comics?apiKey=${MARVEL_API_KEY}`;
    if (limit) url += `&limit=${limit}`;
    if (skip) url += `&skip=${skip}`;
    if (title) url += `&title=${title}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// obtenir les comics d'un perso spécifique (id)
router.get('/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const url = `${MARVEL_API_BASE_URL}/comics/${characterId}?apiKey=${MARVEL_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
