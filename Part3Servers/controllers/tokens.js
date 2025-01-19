const jwt = require('jsonwebtoken');
const userService = require('../services/user');

// Function to create a JWT token for user authentication
const createToken = async (req, res) => {
    const { username, password } = req.body; // Destructure username and password from the request body
    if (!username || !password) { // Check if both username and password are provided
        return res.status(400).json({ error: 'Missing username or password' }); // Respond with error if any field is missing
    }

    try {
        // Attempt to find the user by their username in the database
        const user = await userService.getUserByUsername(username);
        
        // If the user doesn't exist, return an error response
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' }); // Unauthorized if user is not found
        }

        // Check if the provided password matches the stored password (Note: for real applications, use bcrypt for password hashing)
        if (user.password === password) {
            // If the password matches, generate a JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // Sign the token with the user's ID and a secret key
            return res.status(200).json({ token: token }); // Respond with the token
        } else {
            res.status(401).json({ error: 'Invalid credentials' }); // Unauthorized if password doesn't match
        }
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error during authentication' }); // Respond with a server error if something goes wrong
    }
};

module.exports = { createToken }; // Export the function for use in other parts of the app
