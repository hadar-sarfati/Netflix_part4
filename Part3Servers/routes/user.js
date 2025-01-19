const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .post(upload.single('profileImage'), userController.createUser);

router
  .route('/:id')
  .get(userController.getUser);

module.exports = router;