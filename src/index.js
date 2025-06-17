const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*', // ou spécifier les origines autorisées => pour le moment, 'all origin' par défaut
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const comicsRoutes = require('./routes/comics');
const charactersRoutes = require('./routes/characters');
const userRoutes = require('./routes/user');
const favoritesRoutes = require('./routes/favorites');

app.use('/comics', comicsRoutes);
app.use('/characters', charactersRoutes);
app.use('/user', userRoutes);
app.use('/favorites', favoritesRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Marvel API" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
