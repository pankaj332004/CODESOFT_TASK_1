const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleSaveJob,
  uploadAvatar: uploadAvatarController,
  uploadResumeFile,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar, uploadResume } = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/save-job/:jobId', protect, toggleSaveJob);
router.post('/avatar', protect, uploadAvatar.single('avatar'), uploadAvatarController);
router.post('/resume', protect, uploadResume.single('resume'), uploadResumeFile);

module.exports = router;

