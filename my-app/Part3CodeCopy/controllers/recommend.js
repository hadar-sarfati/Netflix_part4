const mongoose = require('mongoose');
const recommendService = require('../services/recommend');
const UserModel = require('../models/user');
const MovieModel = require('../models/movies');
const userService = require('../services/user');
const movieService = require('../services/movies')

exports.getRecommendations = async (req, res) => {
  // Getting the user id
  const userXID = req.header('X-User-Id');
  if (!userXID) {
    return res.status(400).json({ error: 'User ID required in X-User-Id header' });
  }
  
  // Validate User ID format
  if (!mongoose.Types.ObjectId.isValid(userXID)) {
    return res.status(400).json({ error: 'Invalid User ID format' });
  }

  // Getting the movie id
  const movieXID = req.params.id; // Get movie ID from the route parameter

  // Validate the movie ID format
  if (!movieXID || !mongoose.Types.ObjectId.isValid(movieXID)) {
    return res.status(400).json({ error: 'Invalid Movie ID format' });
  }

  // Extracting the INT version of userXID
  const user = await UserModel.findById(userXID).select('userId').lean();
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const userID = user.userId; 

  // Extracting the INT version of movieXID
  const movie = await MovieModel.findById(movieXID).select('movieId').lean();
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  const movieID = movie.movieId;

  try {
    const recommendations = await recommendService.getMovieRecommendations(userID, movieID);
      
    if (!recommendations) {
      return res.status(404).json({ message: 'No recommendations found' });
    }
  
    // Return the response to the client
    res.status(200).json({ recommendations });

    } catch (error) {
    // Handle errors and send back a response
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
};


exports.postRecSystem = async (req, res) => {
  try {
    // Getting the user id
    const userXID = req.header('X-User-Id');

    if (!userXID) {
      return res.status(400).json({ error: 'User ID required in X-User-Id header' });
    }
      
    if (!mongoose.Types.ObjectId.isValid(userXID)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Getting the movie id
    const movieXID = req.params.id; // Get movie ID from the route parameter

    // Validate the movie ID format
    if (!mongoose.Types.ObjectId.isValid(movieXID)) {
      return res.status(400).json({ error: 'Invalid Movie ID format' });
    }

    // Extracting the INT version of userXID
    const user = await UserModel.findById(userXID).select('userId').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userID = user.userId; 

    // Extracting the INT version of movieXID
    const movie = await MovieModel.findById(movieXID).select('movieId').lean();
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const movieID = movie.movieId;

    // Assigning the movie to the movies list of user in MongoDB (with X type ID)
    userService.addMovieToUser(userXID, movieXID)
    .then(response => {
    })
    .catch(error => {
    });

    // Assigning the user to the users list of movie in MongoDB (with X type ID)
    movieService.addUserToMovie(userXID, movieXID)
    .then(response => {
    })
    .catch(error => {
    })

    // CHECK IF THE USER HAS MOVIES ASSIGNED TO HIM
    const hasMovies = await userService.hasMoviesAssigned(userXID);
  
    if (hasMovies) {
      await recommendService.recSystemPatch(userID, movieID);
    } else {
      await recommendService.recSystemPost(userID, movieID);
    }
  
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: 'POST in recSystem failed' });
  }

};

