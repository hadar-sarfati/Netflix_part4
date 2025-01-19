const jwt = require('jsonwebtoken');
const userService = require('../services/user');

const createToken = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    try {
        // Find the user by username
        const user = await userService.getUserByUsername(username);
        
        // If user doesn't exist, return an error
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password matches (Note: in real applications, use bcrypt)
        if (user.password === password) {
            // Create JWT token
            const token = jwt.sign({ username: username }, process.env.JWT_SECRET);


            // Return the token
            return res.status(200).json({ token: token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error during authentication' });
    }
};

module.exports = { createToken };