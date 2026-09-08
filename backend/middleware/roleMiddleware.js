const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is populated by your existing authMiddleware
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Access denied. You do not have the required permissions." 
            });
        }
        next();
    };
};

module.exports = authorizeRoles;