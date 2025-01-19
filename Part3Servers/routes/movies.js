const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadVideos.js');

router.route('/')
  .get(authMiddleware, moviesController.getMovies)  
  .post(authMiddleware, upload.single('path'), moviesController.createMovie);

router.route('/:id')
  .get(authMiddleware, moviesController.getMovie)  
  .put(authMiddleware, upload.single('path'), moviesController.updateMovie)
  .delete(authMiddleware, moviesController.deleteMovie);  
  
router.route('/search/:query')
  .get(authMiddleware, moviesController.searchMovies);  

module.exports = router;
