const User = require('../models/User');
const Job = require('../models/Job');
const { store } = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (store.isUsingMongo) {
      const user = await User.findById(userId).populate('savedJobs');
      return res.json({ success: true, data: user });
    } else {
      const user = store.users.find((u) => u._id.toString() === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const populatedSavedJobs = (user.savedJobs || [])
        .map((jobId) =>
          store.jobs.find((j) => j._id.toString() === jobId.toString())
        )
        .filter(Boolean);

      const { password, ...userSafe } = user;
      return res.json({
        success: true,
        data: {
          ...userSafe,
          savedJobs: populatedSavedJobs,
        },
      });
    }
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { name, phone, location, bio, companyName, companyWebsite, resume, profileImage } =
      req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;
    if (companyName !== undefined) updateFields.companyName = companyName;
    if (companyWebsite !== undefined) updateFields.companyWebsite = companyWebsite;
    if (resume !== undefined) updateFields.resume = resume;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    if (store.isUsingMongo) {
      const user = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators: true,
      }).select('-password');

      return res.json({ success: true, data: user });
    } else {
      const userIndex = store.users.findIndex(
        (u) => u._id.toString() === userId
      );
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      store.users[userIndex] = {
        ...store.users[userIndex],
        ...updateFields,
        updatedAt: new Date(),
      };

      const { password, ...userSafe } = store.users[userIndex];
      return res.json({ success: true, data: userSafe });
    }
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle save/bookmark job
// @route   POST /api/users/save-job/:jobId
// @access  Private
const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { jobId } = req.params;

    if (store.isUsingMongo) {
      const user = await User.findById(userId);
      const isSaved = user.savedJobs.some((id) => id.toString() === jobId);

      if (isSaved) {
        user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
      } else {
        user.savedJobs.push(jobId);
      }

      await user.save();
      return res.json({
        success: true,
        saved: !isSaved,
        savedJobs: user.savedJobs,
      });
    } else {
      const user = store.users.find((u) => u._id.toString() === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!user.savedJobs) user.savedJobs = [];
      const index = user.savedJobs.findIndex((id) => id.toString() === jobId);

      let saved = false;
      if (index > -1) {
        user.savedJobs.splice(index, 1);
      } else {
        user.savedJobs.push(jobId);
        saved = true;
      }

      return res.json({
        success: true,
        saved,
        savedJobs: user.savedJobs,
      });
    }
  } catch (error) {
    console.error('toggleSaveJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  toggleSaveJob,
};
