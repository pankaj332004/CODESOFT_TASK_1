const bcrypt = require('bcryptjs');
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

// @desc    Upload avatar / profile image
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const userId = req.user._id.toString();
    const avatarUrl = req.file.path || req.file.secure_url;

    if (store.isUsingMongo) {
      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: avatarUrl },
        { new: true }
      ).select('-password');
      return res.json({ success: true, profileImage: avatarUrl, data: user });
    } else {
      const userIndex = store.users.findIndex((u) => u._id.toString() === userId);
      if (userIndex !== -1) {
        store.users[userIndex].profileImage = avatarUrl;
      }
      return res.json({
        success: true,
        profileImage: avatarUrl,
        data: store.users[userIndex] || { profileImage: avatarUrl },
      });
    }
  } catch (error) {
    console.error('uploadAvatar error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload default resume in user profile
// @route   POST /api/users/resume
// @access  Private
const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a resume file (PDF, DOC, DOCX)' });
    }

    const userId = req.user._id.toString();
    const resumeUrl = req.file.path || req.file.secure_url;
    const originalName = req.file.originalname;

    if (store.isUsingMongo) {
      const user = await User.findByIdAndUpdate(
        userId,
        { resume: resumeUrl },
        { new: true }
      ).select('-password');
      return res.json({ success: true, resume: resumeUrl, originalName, data: user });
    } else {
      const userIndex = store.users.findIndex((u) => u._id.toString() === userId);
      if (userIndex !== -1) {
        store.users[userIndex].resume = resumeUrl;
      }
      return res.json({
        success: true,
        resume: resumeUrl,
        originalName,
        data: store.users[userIndex] || { resume: resumeUrl },
      });
    }
  } catch (error) {
    console.error('uploadResumeFile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match',
      });
    }

    let user;
    if (store.isUsingMongo) {
      user = await User.findById(userId);
    } else {
      user = store.users.find((u) => u._id.toString() === userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (store.isUsingMongo) {
      user.password = hashedPassword;
      await user.save();
    } else {
      user.password = hashedPassword;
    }

    return res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('updatePassword error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  toggleSaveJob,
  uploadAvatar,
  uploadResumeFile,
  updatePassword,
};


