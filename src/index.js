const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const comicsRoutes = require('./routes/comics');
app.use('/comics', comicsRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Marvel API" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
