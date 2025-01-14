const User = require('../models/user');
const MovieModel = require('../models/movies');
const { getNextSequence } = require('./counter');

const createUser = async (userData) => {
    // Get the next user ID atomically
    const userId = await getNextSequence('userId');
    
    // Create the user with the new ID
    const user = new User({
        ...userData,
        userId: userId
    });
    
    return await user.save();
};

const getUserById = async (id) => {
    return await User.findById(id).populate('movies');
};

const getUserByUsername = async (username) => {
    return await User.findOne({ username });
};

const addMovieToUser = async (userId, movieId) => {
  try {
    // Find the user by userId
    const user = await User.findById(userId);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    // Check if the movie exists
    const movie = await MovieModel.findById(movieId);
  
    if (!movie) {
      throw new Error('Movie not found');
    }
  
    // Add the movie to the user's movies array if it's not already added
    if (!user.movies.includes(movieId)) {
      user.movies.push(movieId);
      await user.save();
      return { success: true, message: 'Movie added successfully!' };
    } else {
      return { success: false, message: 'Movie already added to this user' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Checks if the user has movies assigned to him
const hasMoviesAssigned = async (userId) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Return true if the user has movies assigned, false otherwise
    return user.movies.length > 0;
  } catch (error) {
    return false; // Return false if there's any error (e.g., user not found)
  }
};


module.exports = { createUser, getUserById, getUserByUsername, addMovieToUser, hasMoviesAssigned };