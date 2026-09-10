const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ 
                error: "Access denied. You do not have the required permissions." 
            });
        }
        next();
    };
};

module.exports = authorizeRoles;