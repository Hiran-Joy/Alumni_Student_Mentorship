const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if the header has authorization and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token using secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user id from token to the request object
            req.user = decoded.userId;

            next(); // Move to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

module.exports = protect;