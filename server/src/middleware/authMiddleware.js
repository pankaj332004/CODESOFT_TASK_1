const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'job_board_jwt_secret_key_987654321'
    );

    // If connected to mongo
    if (User.findById) {
      try {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {
        // Fallback check
      }
    }

    // Fallback store access if memory/fallback is used
    if (global.__IN_MEMORY_STORE__ && global.__IN_MEMORY_STORE__.users) {
      const user = global.__IN_MEMORY_STORE__.users.find(
        (u) => u._id.toString() === decoded.id.toString()
      );
      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        return next();
      }
    }

    return res.status(401).json({
      success: false,
      message: 'User no longer exists or invalid token',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed: ' + error.message,
    });
  }
};

module.exports = { protect };
