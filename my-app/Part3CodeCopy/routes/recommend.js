const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommend');

// Define the recommendation route

// Gets the recommendations for the user and the movie
router.get('/:id/recommend', recommendController.getRecommendations);

// Post adds a movie to a user, to the RecSystem of ex2 
router.post('/:id/recommend', recommendController.postRecSystem);

module.exports = router;