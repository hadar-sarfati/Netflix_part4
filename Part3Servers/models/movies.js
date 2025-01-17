const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }], 
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
});

module.exports = mongoose.model('Movie', MovieSchema);