const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { store } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'job_board_jwt_secret_key_987654321',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (candidate or employer)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (store.isUsingMongo) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'candidate',
        phone: phone || '',
        location: location || '',
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          resume: user.resume,
          profileImage: user.profileImage,
          token: generateToken(user._id),
        },
      });
    } else {
      // In-Memory fallback
      const userExists = store.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'candidate',
        phone: phone || '',
        location: location || '',
        bio: '',
        resume: '',
        profileImage: '',
        savedJobs: [],
        createdAt: new Date(),
      };

      store.users.push(newUser);

      const { password: _, ...userSafe } = newUser;
      return res.status(201).json({
        success: true,
        data: {
          ...userSafe,
          token: generateToken(newUser._id),
        },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    let user;

    if (store.isUsingMongo) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = store.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Account found, but it is registered as '${user.role}', not '${role}'`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    res.json({
      success: true,
      data: {
        ...userObj,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
