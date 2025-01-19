const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const authMiddleware = require('../middleware/authMiddleware');


router.route('/')
  .get(authMiddleware, moviesController.getMovies)  
  .post(authMiddleware, moviesController.createMovie);  

router.route('/:id')
  .get(authMiddleware, moviesController.getMovie)  
  .put(authMiddleware, moviesController.updateMovie)  
  .delete(authMiddleware, moviesController.deleteMovie);  

router.route('/search/:query')
  .get(authMiddleware, moviesController.searchMovies);  

module.exports = router;
