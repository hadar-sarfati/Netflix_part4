const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokens');

router
  .route('/')
  .post(tokenController.createToken);

module.exports = router;