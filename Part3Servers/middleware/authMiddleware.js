const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Check if the error is due to token expiration
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            } else {
                console.log('Invalid token:', err.message);
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
        };
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;