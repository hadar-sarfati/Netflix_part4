const mongoose = require('mongoose');
const userService = require('../services/user');

// Create a new user
const createUser = async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Default image path
    const defaultImagePath = '/ProfileImages/defaultImage.jpeg';
    
    // Get the profile image path from the uploaded file
    let profileImagePath = defaultImagePath;
    if (req.file) {
        profileImagePath = `/ProfileImages/${req.file.filename}`;
    }

    try {
        const user = await userService.createUser({
            username,
            email,
            password,
            firstName,
            lastName,
            profileImage: profileImagePath,
            movies: []
        });

        res.location(`/api/users/${user._id}`);
        res.status(201).end();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
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
            createdAt: user.createdAt,
            admin: user.admin
        };
        // Return the user data as a JSON response
        res.json(userResponse);
    } catch (error) {
        // Log error details and return a 500 response
        res.status(500).json({ error: 'Error retrieving user' });
    }
};

module.exports = { createUser, getUser };
