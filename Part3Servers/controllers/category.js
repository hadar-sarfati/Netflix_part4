const mongoose = require('mongoose');
const categoryService = require('../services/category');
const User = require('../models/user');

// Create a new category
const createCategory = async (req, res) => {

  const { name, promoted, movies } = req.body;

  // Ensure category name is provided
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  let movieIds = [];
  if (movies && Array.isArray(movies)) {
    // Validate and transform `movies` into an array of ObjectIds
    movieIds = movies.filter(m => mongoose.Types.ObjectId.isValid(m));
  }

  try {
    // Check if a category with the same name already exists
    const existingCategory = await categoryService.getCategoryByName(name);
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    // Create the new category
    const category = await categoryService.createCategory({
      name,
      promoted,
      movies: movieIds,
    });

    // Set the location header and return success
    res.location(`/api/categories/${category._id}`);
    res.status(201).end();
  } catch (error) {
    // Handle any errors
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Error creating category' });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving categories' });
  }
};

// Get a specific category by ID
const getCategory = async (req, res) => {

  const { id } = req.params;

  // Check if the category ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    // Retrieve the category by ID
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Format the response for the category
    const categoryResponse = {
      _id: category._id,
      name: category.name,
      promoted: category.promoted,
      movies: category.movies
    };

    res.json(categoryResponse);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving category' });
  }
};

// Update an existing category
const updateCategory = async (req, res) => {

  const { id } = req.params;
  const { name, promoted } = req.body;
  console.log('update in controller');
  console.log('updating name to: ', name);
  console.log('updating promoted to: ', promoted);

  // Check if the category ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    // Update the category
    const category = await categoryService.updateCategory(id, {
      name,
      promoted
    });

    // If category doesn't exist, return 404
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  // Check if the category ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    // Delete the category
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
