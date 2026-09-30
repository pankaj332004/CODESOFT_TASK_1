const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getRecommendedJobsForCandidate,
  getJobMatchScore,
  reportJob,
} = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getJobs);
router.get('/recommended', protect, authorize('candidate'), getRecommendedJobsForCandidate);
router.get('/employer/my-jobs', protect, authorize('employer'), getEmployerJobs);
router.get('/:id/match', protect, getJobMatchScore);
router.get('/:id', getJobById);

router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

// Job reporting
router.post('/:id/report', optionalProtect, reportJob);

module.exports = router;

