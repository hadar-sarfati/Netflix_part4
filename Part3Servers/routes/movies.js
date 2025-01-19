const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const upload = require('../middleware/uploadVideos.js');

router.route('/')
  .get(moviesController.getMovies)
  .post(upload.single('path'), moviesController.createMovie);

router.route('/:id')
  .get(moviesController.getMovie)
  .put(upload.single('path'), moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

router.route('/search/:query')
  .get(moviesController.searchMovies);

module.exports = router;