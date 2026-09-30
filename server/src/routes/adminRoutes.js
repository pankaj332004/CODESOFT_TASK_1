const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getJobs,
  toggleJobFeatured,
  deleteJob,
  getReports,
  updateReportStatus,
  deleteReport,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// Analytics & Charts
router.get('/analytics', getAnalytics);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Job Moderation
router.get('/jobs', getJobs);
router.patch('/jobs/:id/featured', toggleJobFeatured);
router.delete('/jobs/:id', deleteJob);

// Job Reports & Moderation
router.get('/reports', getReports);
router.patch('/reports/:id/status', updateReportStatus);
router.delete('/reports/:id', deleteReport);

module.exports = router;
