const mongoose = require('mongoose');
const moviesService = require('../services/movies');
const movie = require('../models/movies');
const user = require('../models/user');

const createMovie = async (req, res) => {
    // Get the user ID from the header and validate it

    // Get the movie name and categories from the request body
    const { name, categories, year, duration, cast, description } = req.body;

    // Ensure categories is parsed as an array
    let categoryNames;
    try {
        categoryNames = Array.isArray(categories) 
            ? categories 
            : JSON.parse(categories); // Convert from JSON string to array
    } catch (error) {
        console.error('Failed to parse categories:', error);
        return res.status(400).json({ error: 'Invalid categories format. Must be an array or a valid JSON string.' });
    }

    const file = req.file; // This is the uploaded file
    
    // Check if name and categories are indeed provided
    if (!name || !categories || !year || !duration || !cast || !description || !file) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Default image path
    const defaultVideoPath = '/VideoFiles/defaultVideo.mp4';
    
    // Get the profile image path from the uploaded file
    let videoPath = defaultVideoPath;
    if (req.file) {
        videoPath = `/VideoFiles/${req.file.filename}`;
    }

    // Validate there is no other movie with the same name
    const existingMovie = await moviesService.getMovieByName(name);
    if (existingMovie) {
        console.log("4");
        return res.status(400).json({ error: 'A movie with this name already exists' });
    }

    // If name is present and valid, proceed with movie creation
    const movie = await moviesService.createMovie(name, categoryNames, year, duration, cast, description, videoPath);

    // Set the Location header to point to the newly created user
    res.location(`/api/movies/${movie._id}`);
    // res.status(201).json(movieResponse);

    res.status(201).end();
};

const getMovies = async (req, res) => {
    // Get the user ID from the header and validate it
    // const userId = req.header('X-User-Id');
    // if (!userId) {
    //     return res.status(400).json({ error: 'User ID required in X-User-Id header' });
    // }
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ error: 'Invalid user ID format' });
    // }
    const userId = req.user.id;
    const result = await moviesService.getMovies(userId);

    // Format the JSON response with indentation
    const formattedResult = JSON.stringify(result, null, 2);
    res.status(200).send(formattedResult);
};

const getMovie = async (req, res) => {
    const userId = req.user.id;
    // Get the user ID from the header and validate it
    // const userId = req.header('X-User-Id');
    // if (!userId) {
    //     return res.status(400).json({ error: 'user ID required in X-User-Id header' });
    // }

    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ error: 'Invalid user ID format' });
    // }

    // Get the movie ID from the request parameters and validate it
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        // Get the movie by ID
        const movie = await moviesService.getMovieById(id);
        
        // If movie not found
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Return the movie data as a JSON object (no need to stringify)
        res.status(200).json(movie); 
    } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ error: 'Server error' });
    }
};


const updateMovie = async (req, res) => {
    // Get the user ID from the header and validate it
    // const userId = req.header('X-User-Id');
    // if (!userId) {
    //     return res.status(400).json({ error: 'User ID required in X-User-Id header' });
    // }

    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ error: 'Invalid user ID format' });
    // }

    // Extract the movie ID from the request parameters, and the new name and categories from the request body
    const { id } = req.params;
    // Get the movie name and categories from the request body
    const { name, categories, year, duration, cast, description } = req.body;

    console.log("changing movie: ", id, name);

    // Ensure categories is parsed as an array
    let categoryNames;
    try {
        categoryNames = Array.isArray(categories) 
            ? categories 
            : JSON.parse(categories); // Convert from JSON string to array
    } catch (error) {
        console.error('Failed to parse categories:', error);
        return res.status(400).json({ error: 'Invalid categories format. Must be an array or a valid JSON string.' });
    }

    const file = req.file; // This is the uploaded file

    if (!name || !categories || !year || !duration || !cast || !description || !file) {
      return res.status(400).json({ error: 'Name and categories array are required' });
    }

    // Validate there is no other movie with the same name
    const existingMovie = await moviesService.getMovieByName(name);
    if (existingMovie) {
        return res.status(400).json({ error: 'A movie with this name already exists' });
    }

    // Default image path
    const defaultVideoPath = '/VideoFiles/defaultVideo.mp4';
    
    // Get the profile image path from the uploaded file
    let videoPath = defaultVideoPath;
    if (req.file) {
        videoPath = `/VideoFiles/${req.file.filename}`;
    }
    
    const movie = await moviesService.updateMovie(id, name, categoryNames, year, duration, cast, description, videoPath);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Return successful update response
    res.status(204).send(); 
};

const deleteMovie = async (req, res) => {
    // Get the user ID from the header and validate it
    // const userId = req.header('X-User-Id');
    // if (!userId) {
    //     return res.status(400).json({ error: 'movie ID required in X-movie-Id header' });
    // }

    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ error: 'Invalid movie ID format' });
    // }

    const movie = await moviesService.deleteMovie(req.params.id);
    if (!movie) {
        return res.status(404).json({ errors: ['Movie not found'] });
    }
    res.status(204).send();
};

const searchMovies = async (req, res) => {
    try {
        const { query } = req.params;
        // Search for movies using the service
        const movies = await moviesService.searchMovies(query);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createMovie, getMovies, getMovie, updateMovie, deleteMovie, searchMovies };