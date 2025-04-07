const jwt = require('jsonwebtoken');
const User = require("../Models/User");

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware

    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = ensureAuthenticated;
