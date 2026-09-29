const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleSaveJob,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/save-job/:jobId', protect, toggleSaveJob);

module.exports = router;
