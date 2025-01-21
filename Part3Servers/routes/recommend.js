const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommend');
const authMiddleware = require('../middleware/authMiddleware');

router
  .route('/:id/recommend')
  .get(authMiddleware, recommendController.getRecommendations)
  .post(authMiddleware, recommendController.postRecSystem);

module.exports = router;