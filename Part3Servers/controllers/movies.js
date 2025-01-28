const mongoose = require('mongoose');
const moviesService = require('../services/movies');
const fs = require('fs');
const path = require('path');

const createMovie = async (req, res) => {
    const { name, categories, year, duration, cast, description } = req.body;

    let categoryNames;
    try {
        categoryNames = Array.isArray(categories) 
            ? categories 
            : JSON.parse(categories); // Convert from JSON string to array
    } catch (error) {
        console.error('Failed to parse categories:', error);
        return res.status(400).json({ error: 'Invalid categories format. Must be an array or a valid JSON string.' });
    }

    // Extract video and preview image from the uploaded files
    const videoFile = req.files['path'] ? req.files['path'][0] : null;
    const previewImageFile = req.files['previewImage'] ? req.files['previewImage'][0] : null;

    // Check if all required fields are present
    if (!name || !categories || !year || !duration || !cast || !description || !videoFile || !previewImageFile) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Set default paths for video and preview image
    const videoPath = videoFile ? `VideoFiles/${videoFile.filename}` : 'VideoFiles/defaultVideo.mp4';
    const previewImagePath = previewImageFile ? `PreviewImages/${previewImageFile.filename}` : 'PreviewImages/defaultImage.jpg';

    // Check if a movie with the same name already exists
    const existingMovie = await moviesService.getMovieByName(name);
    if (existingMovie) {
        return res.status(400).json({ error: 'A movie with this name already exists' });
    }

    // Create movie entry in the database
    const movie = await moviesService.createMovie(name, categoryNames, year, duration, cast, description, videoPath, previewImagePath);

    res.location(`/api/movies/${movie._id}`);
    res.status(201).end();
};


const getMovies = async (req, res) => {
    const userId = req.user.userId;

    const result = await moviesService.getMovies(userId);

    // Format the JSON response with indentation
    const formattedResult = JSON.stringify(result, null, 2);
    res.status(200).send(formattedResult);
};

const getMovie = async (req, res) => {
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
    // Extract the movie ID from the request parameters
    const { id } = req.params;
    // Get the movie name, categories, year, duration, cast and description from the request body
    const { name, categories, year, duration, cast, description } = req.body;

    // Ensure categories is parsed as an array
    let categoryNames;
    try {
        categoryNames = Array.isArray(categories) 
            ? categories 
            : JSON.parse(categories);
    } catch (error) {
        console.error('Failed to parse categories:', error);
        return res.status(400).json({ error: 'Invalid categories format. Must be an array or a valid JSON string.' });
    }

    // This is the uploaded file
    const file = req.file; 

    // Check if all the required fields are present
    if (!name || !categories || !year || !duration || !cast || !description || !file) {
      return res.status(400).json({ error: 'Name and categories array are required' });
    }

    // Validate there is no other movie with the same name
    const existingMovie = await moviesService.getMovieByName(name);
    if (existingMovie) {
        return res.status(400).json({ error: 'A movie with this name already exists' });
    }

    // Retrieve the movie details to get the video path
    const movieDetails = await moviesService.getMovieById(req.params.id);
    if (!movieDetails) {
        return res.status(404).json({ errors: ['Movie not found'] });
    }

    // Extract the old video path from the movie details
    let oldVideoPath = movieDetails.path;

    // Delete the video file from the server
    if (oldVideoPath && oldVideoPath !== 'VideoFiles/defaultVideo.mp4') {
        const fullPath = path.join(__dirname, '..', oldVideoPath);
        fs.unlink(fullPath, (err) => {
            if (err) {
                console.error('Error deleting video file:', err);
            } else {
                console.log('Video file deleted successfully');
            }
        });
    }

    // Default video path
    const defaultVideoPath = '/VideoFiles/defaultVideo.mp4';
    let videoPath = defaultVideoPath;

    // Get the video path from the uploaded file
    if (req.file) {
        videoPath = `/VideoFiles/${req.file.filename}`;
    }

    // Update the movie record in the database
    const movie = await moviesService.updateMovie(id, name, categoryNames, year, duration, cast, description, videoPath);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Return successful update response
    res.status(204).send(); 
};

const deleteMovie = async (req, res) => {
    try {
        // Retrieve the movie details to get the video path
        const movie = await moviesService.getMovieById(req.params.id);
        if (!movie) {
            return res.status(404).json({ errors: ['Movie not found'] });
        }

        // Extract the video path from the movie details
        const videoPath = movie.path;
        console.log("videoPath: ", videoPath);

        // Delete the movie record from the database
        const deletedMovie = await moviesService.deleteMovie(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ errors: ['Movie not found'] });
        }

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

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ errors: ['Internal server error'] });
    }
};

const searchMovies = async (req, res) => {
    try {
        const { query } = req.params;
        // Search for movies that are using the service
        const movies = await moviesService.searchMovies(query);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createMovie, getMovies, getMovie, updateMovie, deleteMovie, searchMovies };