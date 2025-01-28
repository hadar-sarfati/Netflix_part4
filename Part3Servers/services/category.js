const Category = require('../models/category');
const Movie = require('../models/movies');
const fs = require('fs');
const path = require('path');
const { deleteMovie } = require('./movies');

//create new catefory
const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

//get all catefories
const getCategories = async () => {
  return await Category.find({}).populate('movies');
};

//get category by id
const getCategoryById = async (id) => {
  return await Category.findById(id).populate('movies');
};


//get category by name
const getCategoryByName = async (name) => {
  return await Category.findOne({ name }).populate('movies');
};

//update category
const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).populate('movies');
};

//delete category
const deleteCategory = async (id) => {
  const category = await getCategoryById(id);
  if (!category) return null;

  // Iterate over movies in the category
  await Promise.all(category.movies.map(async (movieId) => {
    const movie = await Movie.findById(movieId);
    if (movie) {
      // If the movie has only this category, use the deleteMovie function
      if (movie.categories.length === 1 && movie.categories[0].equals(category._id)) {
        // Extract the video path from the movie details
        const videoPath = movie.path;
        // Delete the video file from the server
        if (videoPath && videoPath !== 'VideoFiles/defaultVideo.mp4') {
            const fullPath = path.join(__dirname, '..', videoPath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error deleting video file:', err);
                } else {
                    console.log('Video file deleted successfully');
                }
            });
        }
        await deleteMovie(movieId);  // Call the deleteMovie service function
      } else {
        // Otherwise, remove the category from the movie
        movie.categories.pull(category._id);
        await movie.save();
      }
    }
  }));

  // Delete the category itself
  await category.deleteOne();
  return category;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
  deleteCategory
};