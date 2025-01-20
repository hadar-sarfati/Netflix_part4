const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommend');
const authMiddleware = require('../middleware/authMiddleware');

// Define the recommendation route

// Gets the recommendations for the user and the movie
router.get('/:id/recommend', authMiddleware, recommendController.getRecommendations);

// Post adds a movie to a user, to the RecSystem of ex2 
router.post('/:id/recommend', authMiddleware, recommendController.postRecSystem);

module.exports = router;