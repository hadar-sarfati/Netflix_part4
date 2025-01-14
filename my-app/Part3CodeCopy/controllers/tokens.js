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
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password matches (Note: in real applications, hash and compare securely)
        if (user.password === password) {
            // Set Location header with user's specific endpoint
            res.set('Location', `/api/users/${user._id}`);
            // Return the user ID if the password matches
            res.json({ userId: user._id });
        } else {
            // If the password doesn't match, return an error
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error checking user credentials' });
    }
};

module.exports = { createToken };