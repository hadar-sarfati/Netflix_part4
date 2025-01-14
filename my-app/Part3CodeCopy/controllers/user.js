const mongoose = require('mongoose');
const userService = require('../services/user');

// Create a new user
const createUser = async (req, res) => {
    const { username, email, password, firstName, lastName, profileImage, movies } = req.body;
    
    // Check if required fields are missing
    if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Default image path
    const defaultImage = '/profileImage/defaultProfile.png';
    
    // List of valid profile images
    const validProfileImages = ['profile1.png', 'profile2.png', 'profile3.png', 'profile4.png', 'defaultProfile.png'];

    // Check if the provided profile image is valid
    let finalProfileImage = profileImage || defaultImage;  // Default to the default image
  
    // If profile image is provided but not valid, return an error
    if (profileImage && !validProfileImages.includes(profileImage)) {
        return res.status(404).json({ error: 'This profile image is not in the database' });
    }

    try {
        // Create the user using the user service
        const user = await userService.createUser({
            username,
            email,
            password,
            firstName,
            lastName,
            profileImage: finalProfileImage,
            movies
        });

        // Set the Location header to point to the newly created user
        res.location(`/api/users/${user._id}`);

        // Return 201 Created status with no body
        res.status(201).end();
    } catch (error) {
        // If a duplicate username or email is found, return an error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        // Handle other errors
        res.status(500).json({ error: 'Error creating user' });
    }
};

// Get a user by their ID
const getUser = async (req, res) => {
    const { id } = req.params;

    // Validate the format of the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        // Retrieve the user from the database by ID
        const user = await userService.getUserById(id); 
        // If user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Prepare the user response object
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
            movies: user.movies,
            createdAt: user.createdAt
        };
        // Return the user data as a JSON response
        res.json(userResponse);
    } catch (error) {
        // Log error details and return a 500 response
        res.status(500).json({ error: 'Error retrieving user' });
    }
};

module.exports = { createUser, getUser };
