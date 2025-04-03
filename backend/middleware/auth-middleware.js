const jwt = require('jsonwebtoken');
require("dotenv").config(); // ✅ Ensure .env is loaded

function verifyToken(req, res, next) {
    const tokenHeader = req.header('Authorization');
    const token = tokenHeader && tokenHeader.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).send({ error: "Access denied" });
    }
    
    try {
        const decoded = jwt.verify(token, "seceret"); // Ensure "seceret" is the correct key
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ error: "Invalid token" });
    }
}

function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ error: "Forbidden" });
    }
}

module.exports = { verifyToken, isAdmin };
