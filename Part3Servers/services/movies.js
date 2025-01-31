const Movie = require('../models/movies');
const User = require('../models/user');
const Category = require('../models/category');
const { getNextSequence } = require('./counter');
const mongoose = require('mongoose');

// Local version of createCategory for internal use (preventing cycles)
const _createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

const createMovie = async (name, categoryNames, year, duration, cast, description, videoFile, previewImage) => {
  // Find the categories that the movie belongs to, by name
  const categories = await Promise.all(categoryNames.map(async (categoryName) => {
    let category = await Category.findOne({ name: categoryName });
    // If the category does not exist, create it
    if (!category) {
      category = await _createCategory({name: categoryName, promoted: true });
    }
    return category._id;
  }));

  console.log ('categories: ', categories);
  // Get the next movie ID atomically
  const movieId = await getNextSequence('movieId');
  
  // Create the movie with the new ID and save it
  const movie = new Movie({
    movieId: movieId,
    name: name,
    categories: categories,
    year: year,
    duration: duration,
    cast: cast,
    description: description,
    path: videoFile,
    previewImage: previewImage
  });
  await movie.save();

  // Add the movie to each category's movies array
  await Promise.all(categories.map(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.movies.push(movie._id);
    await category.save();
  }));

  return movie;
};

const getMovies = async (userId) => {
  // Find promoted categories
  const promotedCategories = await Category.find({ promoted: true });

  // find 20 movies from each category that the user didn't watch yet
  const promotedResult = await Promise.all(promotedCategories.map(async (category) => {
    const movies = await Movie.aggregate([
      { $match: { categories: category._id, users: { $ne: new mongoose.Types.ObjectId(userId) } } },
      { $sample: { size: 20 } }
    ]);
    // Return the category name and the movies in it in a readable format
    return {
      category: category.name,
      movies: movies.map(movie => {
        return {
          _id: movie._id,
          name: movie.name,
          cast: movie.cast,
          categories: movie.categories,
          duration: movie.duration,
          year: movie.year,
          description: movie.description,
          path: movie.path,
          previewImage: movie.previewImage
        };
      })
    };
  }));

  // Find 20 random movies that the user has watched
  const watchedMovies = await Movie.aggregate([
    { $match: { users: new mongoose.Types.ObjectId(userId) } },
    { $sample: { size: 20 } }
  ]);

  // Add the special category
  const specialCategory = {
    category: 'Watched Movies',
    movies: watchedMovies.map(movie => {
      return {
        _id: movie._id,
        name: movie.name,
        previewImage: movie.previewImage,
        path: movie.path
      };
    })
  };

  // Combine results
  return [...promotedResult, specialCategory];
};

const getMovieById = async (id) => {
  try {
    return await Movie.findById(id);
  } catch (error) {
    return null; 
  }  
};

const getMovieByName = async (name) => {
  try {
    return await Movie.findOne({ name });
  } catch (error) {
    return null;
  }
};

const updateMovie = async (id, name, categoryNames, year, duration, cast, description, path, previewImage) => {
  // Find the movie by ID
  const movie = await getMovieById(id);
  if (!movie) return null;

  // Remove the movie from the old categories
  await Promise.all(movie.categories.map(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (category) {
        category.movies.pull(movie._id);
        await category.save();
    }
  }));

  // Find or create categories
  const categories = await Promise.all(categoryNames.map(async (categoryName) => {
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await _createCategory({name: categoryName, promoted: true });
    }
    return category._id;
  }));

  // Update movie details
  movie.name = name;
  movie.categories = categories;
  movie.year = year;
  movie.duration = duration;
  movie.cast = cast;
  movie.description = description;
  movie.path = path;
  movie.previewImage = previewImage;
  await movie.save();

  // Add the movie to each category's movies array
  await Promise.all(categories.map(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.movies.push(movie._id);
    await category.save();
  }));

  return movie;
};

const deleteMovie = async (id) => {
  // Find the movie by ID
  const movie = await getMovieById(id);
  if (!movie) return null;

  // Remove the movie from each category's movies array
  await Promise.all(movie.categories.map(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (category) {
      category.movies.pull(movie._id);
      await category.save();
    }
  }));

  // Remove the movie from each user's movies array
  await Promise.all(movie.users.map(async (userId) => {
    const user = await User.findById(userId);
    if (user) {
      user.movies.pull(movie._id);
      await user.save();
    }
  }));

  // Updating the recommendation system
  const recommendService = require('../services/recommend');
  const movieIntId = movie.movieId;
  recommendService.recSystemDelete(movieIntId);

  // Delete the movie
  await movie.deleteOne();
  return movie;
};


const getMovieByIntId = async (intId) => {
  try {
    // Find the movie with the given movieId
    const movie = await Movie.findOne({ movieId: intId });

    if (!movie) {
      throw new Error('Movie not found');
    }

    return movie;
  } catch (error) {
    throw new Error('Error retrieving movie: ' + error.message);
  }
};

const convertMovieIdsToMongoIds = async (intIds) => {
  const moviesJson = [];

  // Loop through the array, converting strings to integers if necessary
  for (const intId of intIds) {
    // Convert the string to an integer if necessary (you can use parseInt for this)
    const movieIntId = parseInt(intId, 10); 

    // Use getMovieByIntId to get the movie by its movieId (int version)
    const movie = await getMovieByIntId(movieIntId);

    if (movie) {
    // Push the movie details (as a JSON object) into the array
    moviesJson.push(movie);
    } else {
    console.log(`Movie with intId ${movieIntId} not found.`);
    }
  }
  
  return moviesJson;
};

const addUserToMovie = async (userId, movieId) => {
  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new Error('Movie not found');
    }

    // Find the user by userId
    const user = await User.findById(userId);
  
    if (!user) {
      throw new Error('User not found');
    }
    // Add the user to the movie's users array if it's not already added
    if (!movie.users.includes(userId)) {
        movie.users.push(userId);
        await movie.save();
        return { success: true, message: 'User added to the movie successfully!' };
    } else {
        return { success: false, message: 'User already added to this movie' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const searchMovies = async (query) => {
  try {
      // First, find categories that match the query
      const matchingCategories = await Category.find({
          name: { $regex: query, $options: 'i' }
      });

      const categoryIds = matchingCategories.map(cat => cat._id);

      // Search for movies where either:
      // 1. The movie name contains the query
      // 2. The movie belongs to a category whose name contains the query
      const movies = await Movie.find({
          $or: [
              { name: { $regex: query, $options: 'i' } },  // Case-insensitive name search
              { categories: { $in: categoryIds } }         // Search in matching categories
          ]
      }).populate({
          path: 'categories',
          select: 'name'  // Only select the name field from categories
      });

      // Return full movie objects
      return movies;
  } catch (error) {
      throw new Error('Error searching movies: ' + error.message);
  }
};

module.exports = { 
  createMovie, 
  getMovies, 
  getMovieById, 
  getMovieByName, 
  updateMovie, 
  deleteMovie, 
  getMovieByIntId, 
  convertMovieIdsToMongoIds,
  addUserToMovie,
  searchMovies
};