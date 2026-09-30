const express = require('express');
const router = express.Router();
const {
  applyJob,
  getCandidateApplications,
  getEmployerApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

router.post(
  '/',
  protect,
  authorize('candidate'),
  uploadResume.single('resume'),
  applyJob
);

router.get(
  '/my-applications',
  protect,
  authorize('candidate'),
  getCandidateApplications
);

router.get(
  '/employer/all',
  protect,
  authorize('employer'),
  getEmployerApplications
);

// Alias route matching architecture diagram: GET /api/applications/employer/applications
router.get(
  '/employer/applications',
  protect,
  authorize('employer'),
  getEmployerApplications
);

router.patch(
  '/:id/status',
  protect,
  authorize('employer'),
  updateApplicationStatus
);

module.exports = router;
