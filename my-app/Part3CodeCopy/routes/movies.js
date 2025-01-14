const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');

router.route('/')
  .get(moviesController.getMovies)
  .post(moviesController.createMovie);

router.route('/:id')
  .get(moviesController.getMovie)
  .put(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

router.route('/search/:query')
  .get(moviesController.searchMovies);

module.exports = router;