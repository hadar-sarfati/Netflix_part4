const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No auth header or invalid format'); // לוג לדיבאג
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Received token:', token); // לוג לדיבאג

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-super-secret-key-123456789');
        console.log('Decoded token:', decoded); // לוג לדיבאג

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error); // לוג לדיבאג
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;