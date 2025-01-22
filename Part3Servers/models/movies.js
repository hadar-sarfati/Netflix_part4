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
    required: false
  }], 
  year: {
    type: Number,
    required: false
  },
  duration: {
    type: String,
    required: false
  },
  cast: [{
    type: String,
    required: false
  }],
  description: {
    type: String,
    required: false
  },
  path: {
    type: String,
    required: false,
    default: ''
  },
  previewImage: {
    type: String,
    required: false,
    default: ''
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
});

module.exports = mongoose.model('Movie', MovieSchema);