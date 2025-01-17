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
  year: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  cast: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
});

module.exports = mongoose.model('Movie', MovieSchema);