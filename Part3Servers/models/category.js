const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  promoted: {
    type: Boolean,
    default: false
  },
  movies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'  
    }]
});


module.exports = mongoose.model('Category', CategorySchema);