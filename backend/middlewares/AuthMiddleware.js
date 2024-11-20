const User = require("../models/Users/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// verify token if it's ok it sends back the user
module.exports.userVerification = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Getting token from headers
  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      console.error('Token verification error:', err); // Add this line for logging
      return res.status(401).json({ status: false, message: "Token verification failed" });
    } else {
      try {
        const user = await User.findById(data.sub);
        if (user) {
          return res.json({ status: true, user: user });
        } else {
          return res.status(404).json({ status: false, message: "User not found" });
        }
      } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
      }
    }
  });
};

module.exports.verifySupervisor = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    if (user.role !== 'patrol_supervisor' && user.role !== 'admin') {
      return res.status(403).send({ message: 'Access forbidden: Only supervisors and admins can access this data.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};
