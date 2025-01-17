const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
},
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: '' // URL to default profile image or empty string
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  movies: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie' 
  }]
});

module.exports = mongoose.model('User', UserSchema);