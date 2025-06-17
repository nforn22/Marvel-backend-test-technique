const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
    (req.headers.authorization && req.headers.authorization.replace("Bearer ", "")) || req.query.token;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }
  
  const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = isAuthenticated;