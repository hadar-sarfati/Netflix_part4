const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/authMiddleware');

router
  .route('/')
  .get(authMiddleware, categoryController.getCategories)
  .post(authMiddleware, categoryController.createCategory);

router
  .route('/:id')
  .get(authMiddleware, categoryController.getCategory)
  .patch(authMiddleware, categoryController.updateCategory)
  .delete(authMiddleware, categoryController.deleteCategory);

module.exports = router;