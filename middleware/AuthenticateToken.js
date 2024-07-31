const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthenticateToken = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied! No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the decoded token in req.user
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = AuthenticateToken;
