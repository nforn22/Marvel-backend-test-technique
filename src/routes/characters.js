const express = require('express');
const axios = require('axios');
const router = express.Router();

const MARVEL_API_KEY = process.env.MARVEL_API_KEY;
const MARVEL_API_BASE_URL = 'https://lereacteur-marvel-api.herokuapp.com';


router.get('/', async (req, res) => {
  try {
    const { limit, skip, name } = req.query;
    let url = `${MARVEL_API_BASE_URL}/characters?apiKey=${MARVEL_API_KEY}`;
    if (limit) url += `&limit=${limit}`;
    if (skip) url += `&skip=${skip}`;
    if (name) url += `&name=${name}`;
    const response = await axios.get(url);
    res.json({
      status: "success",
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.get('/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const url = `${MARVEL_API_BASE_URL}/character/${characterId}?apiKey=${MARVEL_API_KEY}`;
    const response = await axios.get(url);
    res.json({
      status: "success",
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router; 