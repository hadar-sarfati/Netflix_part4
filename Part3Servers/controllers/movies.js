const mongoose = require('mongoose');
const moviesService = require('../services/movies');
const fs = require('fs');
const path = require('path');

const createMovie = async (req, res) => {
    const { name, categories, year, duration, cast, description } = req.body;

    // Extract video and preview image from the uploaded files
    const videoFile = req.files['path'] ? req.files['path'][0] : null;
    const previewImageFile = req.files['previewImage'] ? req.files['previewImage'][0] : null;

    // Check if all required fields are present
    if (!name || !categories || !year || !duration || !cast || !description || !videoFile || !previewImageFile) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let categoryNames;
    try {
        categoryNames = Array.isArray(categories) 
            ? categories 
            : JSON.parse(categories); // Convert from JSON string to array
    } catch (error) {
        console.error('Failed to parse categories:', error);
        return res.status(400).json({ error: 'Invalid categories format. Must be an array or a valid JSON string.' });
    }

    let castArray;
    try {
        castArray = Array.isArray(cast) 
            ? cast 
            : JSON.parse(cast); // Convert from JSON string to array
    } catch (error) {
        console.error('Failed to parse cast:', error);
        return res.status(400).json({ error: 'Invalid cast format. Must be an array or a valid JSON string.' });
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
    const movie = await moviesService.createMovie(name, categoryNames, year, duration, castArray, description, videoPath, previewImagePath);

    res.location(`/api/movies/${movie._id}`);

    const movieResponse = {
        _id: movie._id,
        movieId: movie.movieId,
    };

    res.status(201).json(movieResponse);
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
    
    // This is the uploaded file
    const videoFile = req.files['path'] ? req.files['path'][0] : null;
    const previewImageFile = req.files['previewImage'] ? req.files['previewImage'][0] : null;

    // Check if all the required fields are present
    if (!name || !categories || !year || !duration || !cast || !description || !videoFile || !previewImageFile) {
      return res.status(400).json({ error: 'Name and categories array are required' });
    }

    // Parse the categories and cast from the request body
    let categoryNames;
    try {
        categoryNames = Array.isArray(categories) 
            ? categories 
            : JSON.parse(categories); // Convert from JSON string to array
    } catch (error) {
        return res.status(400).json({ error: 'Invalid categories format. Must be an array or a valid JSON string.' });
    }

    let castArray;
    try {
        castArray = Array.isArray(cast) 
            ? cast 
            : JSON.parse(cast); // Convert from JSON string to array
    } catch (error) {
        return res.status(400).json({ error: 'Invalid cast format. Must be an array or a valid JSON string.' });
    }
    console.log('Update movie request received 4');

    // Validate there is no other movie with the same name
    const existingMovie = await moviesService.getMovieByName(name);
    if (existingMovie) {
        return res.status(400).json({ error: 'A movie with this name already exists' });
    }

    // Retrieve the movie details to get the video path
    const movieDetails = await moviesService.getMovieById(id);
    if (!movieDetails) {
        return res.status(404).json({ errors: ['Movie not found'] });
    }

    // Extract the old video path from the movie details
    let oldVideoPath = movieDetails.path;
    let oldPreviewImagePath = movieDetails.previewImage;

    // Delete the video file from the server
    if (oldVideoPath && oldVideoPath !== 'VideoFiles/defaultVideo.mp4') {
        const fullVideoPath = path.join(__dirname, '..', oldVideoPath);
        fs.unlink(fullVideoPath, (err) => {
            if (err) {
                console.error('Error deleting video file:', err);
            } else {
                console.log('Video file deleted successfully');
            }
        });
    }

    // Delete the video file from the server
    if (oldPreviewImagePath && oldPreviewImagePath !== 'VideoFiles/defaultVideo.mp4') {
        const fullImagePath = path.join(__dirname, '..', oldPreviewImagePath);
        fs.unlink(fullImagePath, (err) => {
            if (err) {
                console.error('Error deleting video file:', err);
            } else {
                console.log('Video file deleted successfully');
            }
        });
    }

    // Set default paths for video and preview image
    const videoPath = videoFile ? `VideoFiles/${videoFile.filename}` : 'VideoFiles/defaultVideo.mp4';
    const previewImagePath = previewImageFile ? `PreviewImages/${previewImageFile.filename}` : 'PreviewImages/defaultImage.jpg';

    // Update the movie record in the database
    const movie = await moviesService.updateMovie(id, name, categoryNames, year, duration, castArray, description, videoPath, previewImagePath);
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
        const previewImagePath = movie.previewImage;

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
        if (previewImagePath && previewImagePath !== 'VideoFiles/defaultVideo.mp4') {
            const fullImagePath = path.join(__dirname, '..', previewImagePath);
            fs.unlink(fullImagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Preview image deleted successfully');
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

        // Transform the response to extract only category names
        const transformedMovies = movies.map(movie => ({
            ...movie.toObject(),
            categories: movie.categories.map(category => category.name)
        }));
        res.json(transformedMovies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createMovie, getMovies, getMovie, updateMovie, deleteMovie, searchMovies };