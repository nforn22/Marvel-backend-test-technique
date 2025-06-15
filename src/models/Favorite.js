const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comics: [{
    type: String,
    required: true
  }],
  characters: [{
    type: String,
    required: true
  }]
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite; 