const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { store } = require('../config/db');
const {
  sendApplicationNotification,
  sendStatusUpdateNotification,
} = require('../services/notificationService');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter, candidateName, candidateEmail, candidatePhone } =
      req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Determine resume path
    let resumePath = '';
    if (req.file) {
      resumePath = `/uploads/resumes/${req.file.filename}`;
    } else if (req.body.resume) {
      resumePath = req.body.resume;
    } else if (req.user && req.user.resume) {
      resumePath = req.user.resume;
    } else {
      resumePath = 'resume-default.pdf';
    }

    let targetJob;
    let employerUser;

    if (store.isUsingMongo) {
      targetJob = await Job.findById(jobId).populate('employer');
      if (!targetJob) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      // Check if already applied
      const existing = await Application.findOne({
        job: jobId,
        candidate: req.user._id,
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this position',
        });
      }

      const application = await Application.create({
        job: jobId,
        candidate: req.user._id,
        candidateName: candidateName || req.user.name,
        candidateEmail: candidateEmail || req.user.email,
        candidatePhone: candidatePhone || req.user.phone,
        resume: resumePath,
        coverLetter: coverLetter || '',
        status: 'Applied',
      });

      // Increment applicantsCount
      targetJob.applicantsCount = (targetJob.applicantsCount || 0) + 1;
      await targetJob.save();

      // Trigger email notifications
      sendApplicationNotification({
        candidateEmail: candidateEmail || req.user.email,
        candidateName: candidateName || req.user.name,
        employerEmail: targetJob.employer?.email,
        employerName: targetJob.employer?.name,
        jobTitle: targetJob.title,
        companyName: targetJob.company,
      }).catch(console.error);

      return res.status(201).json({ success: true, data: application });
    } else {
      // In-Memory store
      targetJob = store.jobs.find((j) => j._id.toString() === jobId.toString());
      if (!targetJob) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      const existing = store.applications.find(
        (a) =>
          a.job.toString() === jobId.toString() &&
          a.candidate.toString() === req.user._id.toString()
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this position',
        });
      }

      const newApplication = {
        _id: new mongoose.Types.ObjectId().toString(),
        job: jobId,
        candidate: req.user._id.toString(),
        candidateName: candidateName || req.user.name,
        candidateEmail: candidateEmail || req.user.email,
        candidatePhone: candidatePhone || req.user.phone,
        resume: resumePath,
        coverLetter: coverLetter || '',
        status: 'Applied',
        createdAt: new Date(),
      };

      store.applications.unshift(newApplication);

      targetJob.applicantsCount = (targetJob.applicantsCount || 0) + 1;

      employerUser = store.users.find(
        (u) => u._id.toString() === (targetJob.employer?.toString() || '')
      );

      sendApplicationNotification({
        candidateEmail: candidateEmail || req.user.email,
        candidateName: candidateName || req.user.name,
        employerEmail: employerUser?.email,
        employerName: employerUser?.name,
        jobTitle: targetJob.title,
        companyName: targetJob.company,
      }).catch(console.error);

      return res.status(201).json({ success: true, data: newApplication });
    }
  } catch (error) {
    console.error('applyJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in candidate's applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
const getCandidateApplications = async (req, res) => {
  try {
    const candidateId = req.user._id.toString();
    const { status } = req.query;

    if (store.isUsingMongo) {
      let query = { candidate: candidateId };
      if (status && status !== 'All') {
        query.status = status;
      }

      const applications = await Application.find(query)
        .populate('job')
        .sort({ createdAt: -1 });

      return res.json({ success: true, data: applications });
    } else {
      let apps = store.applications.filter(
        (a) => a.candidate.toString() === candidateId
      );

      if (status && status !== 'All') {
        apps = apps.filter(
          (a) => a.status.toLowerCase() === status.toLowerCase()
        );
      }

      // Populate job info
      const populated = apps.map((app) => {
        const job = store.jobs.find(
          (j) => j._id.toString() === app.job.toString()
        );
        return {
          ...app,
          job: job || null,
        };
      });

      return res.json({ success: true, data: populated });
    }
  } catch (error) {
    console.error('getCandidateApplications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employer's received applications & dashboard stats
// @route   GET /api/applications/employer/all
// @access  Private (Employer)
const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user._id.toString();

    if (store.isUsingMongo) {
      // Find all jobs by this employer
      const employerJobs = await Job.find({ employer: employerId });
      const jobIds = employerJobs.map((j) => j._id);

      const applications = await Application.find({ job: { $in: jobIds } })
        .populate('job')
        .populate('candidate', 'name email phone location profileImage')
        .sort({ createdAt: -1 });

      const stats = {
        activeJobs: employerJobs.length,
        totalApplications: applications.length,
        shortlisted: applications.filter(
          (a) => a.status === 'Interview' || a.status === 'Under Review'
        ).length,
        hired: applications.filter((a) => a.status === 'Offer').length,
      };

      return res.json({
        success: true,
        stats,
        data: applications,
      });
    } else {
      const employerJobs = store.jobs.filter(
        (j) => j.employer && j.employer.toString() === employerId
      );
      const jobIds = employerJobs.map((j) => j._id.toString());

      const applications = store.applications
        .filter((a) => jobIds.includes(a.job.toString()))
        .map((app) => {
          const job = store.jobs.find(
            (j) => j._id.toString() === app.job.toString()
          );
          const candidate = store.users.find(
            (u) => u._id.toString() === app.candidate.toString()
          );
          return {
            ...app,
            job: job || null,
            candidate: candidate
              ? {
                  name: candidate.name,
                  email: candidate.email,
                  phone: candidate.phone,
                  location: candidate.location,
                  profileImage: candidate.profileImage,
                }
              : null,
          };
        });

      const stats = {
        activeJobs: employerJobs.length,
        totalApplications: applications.length,
        shortlisted: applications.filter(
          (a) => a.status === 'Interview' || a.status === 'Under Review'
        ).length,
        hired: applications.filter((a) => a.status === 'Offer').length,
      };

      return res.json({
        success: true,
        stats,
        data: applications,
      });
    }
  } catch (error) {
    console.error('getEmployerApplications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Interview', 'Offer', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (store.isUsingMongo) {
      const application = await Application.findById(id).populate('job');
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = status;
      await application.save();

      // Send status notification email
      sendStatusUpdateNotification({
        candidateEmail: application.candidateEmail,
        candidateName: application.candidateName,
        jobTitle: application.job?.title || 'Position',
        companyName: application.job?.company || 'Company',
        status,
      }).catch(console.error);

      return res.json({ success: true, data: application });
    } else {
      const appIndex = store.applications.findIndex(
        (a) => a._id.toString() === id.toString()
      );
      if (appIndex === -1) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      store.applications[appIndex].status = status;
      const app = store.applications[appIndex];
      const job = store.jobs.find((j) => j._id.toString() === app.job.toString());

      sendStatusUpdateNotification({
        candidateEmail: app.candidateEmail,
        candidateName: app.candidateName,
        jobTitle: job?.title || 'Position',
        companyName: job?.company || 'Company',
        status,
      }).catch(console.error);

      return res.json({ success: true, data: app });
    }
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyJob,
  getCandidateApplications,
  getEmployerApplications,
  updateApplicationStatus,
};
