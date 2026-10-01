const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { store } = require('../config/db');

// @desc    Get all jobs with filters & pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      category,
      experience,
      featured,
      sort = 'latest',
    } = req.query;

    if (store.isUsingMongo) {
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      if (type) {
        const types = Array.isArray(type) ? type : type.split(',');
        query.type = { $in: types };
      }

      if (category) {
        const categories = Array.isArray(category) ? category : category.split(',');
        query.category = { $in: categories };
      }

      if (experience) {
        const experiences = Array.isArray(experience)
          ? experience
          : experience.split(',');
        query.experience = { $in: experiences };
      }

      if (featured === 'true') {
        query.featured = true;
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'salary-high') {
        sortOption = { 'salary.max': -1 };
      } else if (sort === 'salary-low') {
        sortOption = { 'salary.min': 1 };
      }

      const jobs = await Job.find(query).sort(sortOption);
      return res.json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    } else {
      // In-Memory fallback filtering
      let jobs = [...store.jobs];

      if (search) {
        const term = search.toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(term) ||
            j.company.toLowerCase().includes(term) ||
            j.description.toLowerCase().includes(term)
        );
      }

      if (location) {
        const loc = location.toLowerCase();
        jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
      }

      if (type) {
        const types = Array.isArray(type)
          ? type.map((t) => t.toLowerCase())
          : type.split(',').map((t) => t.toLowerCase());
        jobs = jobs.filter((j) => types.includes(j.type.toLowerCase()));
      }

      if (category) {
        const categories = Array.isArray(category)
          ? category.map((c) => c.toLowerCase())
          : category.split(',').map((c) => c.toLowerCase());
        jobs = jobs.filter((j) => categories.includes(j.category.toLowerCase()));
      }

      if (experience) {
        const exps = Array.isArray(experience)
          ? experience.map((e) => e.toLowerCase())
          : experience.split(',').map((e) => e.toLowerCase());
        jobs = jobs.filter((j) => exps.includes(j.experience.toLowerCase()));
      }

      if (featured === 'true') {
        jobs = jobs.filter((j) => j.featured === true);
      }

      if (sort === 'salary-high') {
        jobs.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
      } else if (sort === 'salary-low') {
        jobs.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
      } else {
        jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    }
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      const job = await Job.findById(id).populate('employer', 'name email companyName companyWebsite');
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      // Increment view count
      job.views = (job.views || 0) + 1;
      await job.save();

      return res.json({ success: true, data: job });
    } else {
      const job = store.jobs.find((j) => j._id.toString() === id.toString());
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      job.views = (job.views || 0) + 1;
      const employer = store.users.find(
        (u) => u._id.toString() === job.employer?.toString()
      );

      const jobWithEmployer = {
        ...job,
        employer: employer
          ? {
              _id: employer._id,
              name: employer.name,
              email: employer.email,
              companyName: employer.companyName,
              companyWebsite: employer.companyWebsite,
            }
          : null,
      };

      return res.json({ success: true, data: jobWithEmployer });
    }
  } catch (error) {
    console.error('getJobById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      location,
      category,
      type,
      salary,
      experience,
      description,
      responsibilities,
      requirements,
      featured,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, company, location, and description',
      });
    }

    const jobData = {
      title,
      company,
      companyLogo:
        companyLogo ||
        'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
      location,
      category: category || 'Development',
      type: type || 'Full Time',
      salary: salary || { min: 0, max: 0, currency: '$', period: 'yr' },
      experience: experience || '1-3 years',
      description,
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : (responsibilities || '').split('\n').filter(Boolean),
      requirements: Array.isArray(requirements)
        ? requirements
        : (requirements || '').split('\n').filter(Boolean),
      employer: req.user._id,
      featured: Boolean(featured),
      views: 0,
      applicantsCount: 0,
      createdAt: new Date(),
    };

    if (store.isUsingMongo) {
      const job = await Job.create(jobData);
      notifyJobAlertSubscribers(job).catch(console.error);
      return res.status(201).json({ success: true, data: job });
    } else {
      const newJob = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...jobData,
      };
      store.jobs.unshift(newJob);
      notifyJobAlertSubscribers(newJob).catch(console.error);
      return res.status(201).json({ success: true, data: newJob });
    }
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const notifyJobAlertSubscribers = async (job) => {
  try {
    const User = require('../models/User');
    const { sendEmail } = require('../services/emailService');
    const { sendRealtimeNotification } = require('../socket');

    let candidateUsers = [];
    let employerUser = null;

    if (store.isUsingMongo) {
      candidateUsers = await User.find({ 'jobAlerts.0': { $exists: true } }).lean();
      if (job.employer) {
        employerUser = await User.findById(job.employer).lean();
      }
    } else {
      candidateUsers = (store.users || []).filter(
        (u) => u.jobAlerts && u.jobAlerts.length > 0
      );
      if (job.employer) {
        employerUser = (store.users || []).find(
          (u) => u._id.toString() === job.employer.toString()
        );
      }
    }

    const companyBio =
      employerUser?.bio ||
      `${job.company} is an innovative organization actively expanding their team and hiring qualified candidates on the Job Board.`;
    const companyWebsite = employerUser?.companyWebsite || '';
    const companyLocation = job.location || employerUser?.location || 'Remote';

    // Format salary display
    const salaryMin = job.salary?.min ? `$${Math.round(job.salary.min / 1000)}k` : '';
    const salaryMax = job.salary?.max ? `$${Math.round(job.salary.max / 1000)}k` : '';
    let salaryText = 'Competitive';
    if (salaryMin && salaryMax) salaryText = `${salaryMin} - ${salaryMax} / yr`;
    else if (salaryMin) salaryText = `From ${salaryMin} / yr`;
    else if (salaryMax) salaryText = `Up to ${salaryMax} / yr`;

    for (const user of candidateUsers) {
      const match = (user.jobAlerts || []).find((alert) => {
        const queryTerm = (alert.keyword || alert.title || '').trim().toLowerCase();
        const titleMatch =
          queryTerm &&
          (job.title.toLowerCase().includes(queryTerm) ||
            (job.description && job.description.toLowerCase().includes(queryTerm)) ||
            (job.category && job.category.toLowerCase().includes(queryTerm)));

        const catMatch =
          alert.category &&
          alert.category !== 'All' &&
          job.category &&
          job.category.toLowerCase() === alert.category.toLowerCase();

        const locMatch =
          alert.location &&
          alert.location !== 'Anywhere' &&
          job.location &&
          job.location.toLowerCase().includes(alert.location.toLowerCase());

        return titleMatch || catMatch || locMatch;
      });

      if (match) {
        sendRealtimeNotification({
          recipientId: user._id,
          title: '🔔 Job Alert Match',
          message: `New job matching your alert: "${job.title}" at ${job.company}`,
          type: 'alert',
          link: `/jobs/${job._id}`,
        }).catch(console.error);

        sendEmail({
          to: user.email,
          subject: `🔔 Job Alert: ${job.title} at ${job.company}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b;">
              <!-- Header Banner -->
              <div style="background: linear-gradient(135deg, #0e2947 0%, #1288e8 100%); padding: 28px 24px; text-align: left; color: #ffffff;">
                <span style="background: rgba(255, 255, 255, 0.18); color: #e0f2fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px;">
                  🔔 New Job Alert Match
                </span>
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                  ${job.title}
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #bae6fd;">
                  Matching Criteria: <strong>${match.keyword || match.category || 'All Roles'}</strong>
                </p>
              </div>

              <!-- Main Content -->
              <div style="padding: 24px;">
                <p style="font-size: 14px; margin-top: 0; color: #334155;">
                  Hello <strong>${user.name}</strong>,
                </p>
                <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 20px;">
                  A new opening has just been posted that closely matches your job preferences. Here are the position and company details:
                </p>

                <!-- Company Details Card -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                  <div style="margin-bottom: 12px;">
                    <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #1288e8; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                      Company Overview
                    </span>
                    <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a;">
                      🏢 ${job.company}
                    </h2>
                    <span style="font-size: 12px; color: #64748b; display: block; margin-top: 2px;">
                      📍 Headquarters / Location: <strong>${companyLocation}</strong>
                    </span>
                  </div>

                  <p style="margin: 0 0 12px 0; font-size: 12px; color: #475569; line-height: 1.6;">
                    ${companyBio}
                  </p>

                  ${
                    companyWebsite
                      ? `
                    <div style="margin-bottom: 12px;">
                      <a href="${companyWebsite}" target="_blank" style="font-size: 12px; color: #1288e8; font-weight: 600; text-decoration: none;">
                        🌐 Official Company Website &rarr;
                      </a>
                    </div>
                  `
                      : ''
                  }

                  <!-- Key Position Specs -->
                  <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 12px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; font-size: 12px; color: #64748b;">💼 <strong>Type:</strong></td>
                        <td style="padding: 4px 0; font-size: 12px; color: #0f172a; font-weight: 600;">${job.type || 'Full Time'}</td>
                        <td style="padding: 4px 0; font-size: 12px; color: #64748b;">💰 <strong>Salary:</strong></td>
                        <td style="padding: 4px 0; font-size: 12px; color: #059669; font-weight: 700;">${salaryText}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 12px; color: #64748b;">🎯 <strong>Category:</strong></td>
                        <td style="padding: 4px 0; font-size: 12px; color: #0f172a; font-weight: 600;">${job.category || 'Development'}</td>
                        <td style="padding: 4px 0; font-size: 12px; color: #64748b;">⏳ <strong>Experience:</strong></td>
                        <td style="padding: 4px 0; font-size: 12px; color: #0f172a; font-weight: 600;">${job.experience || '1-3 years'}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                <!-- Call to Action Buttons -->
                <div style="text-align: center; margin: 26px 0 16px 0;">
                  <a href="http://localhost:5173/jobs/${job._id}" style="background-color: #1288e8; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-block;">
                    View Full Job & Apply Now &rarr;
                  </a>
                  <div style="margin-top: 10px;">
                    <a href="http://localhost:5173/companies/${encodeURIComponent(job.company)}" style="font-size: 12px; color: #64748b; text-decoration: underline;">
                      Explore all openings at ${job.company}
                    </a>
                  </div>
                </div>

                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0 14px 0;" />
                <p style="margin: 0; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
                  You received this notification because you subscribed to Job Alerts on the Job Board Platform with <strong>${user.email}</strong>.
                  <br/>
                  Manage your preferences anytime at <a href="http://localhost:5173/candidate/alerts" style="color: #1288e8;">Job Alert Settings</a>.
                </p>
              </div>
            </div>
          `,
        }).catch(console.error);
      }
    }
  } catch (err) {
    console.error('notifyJobAlertSubscribers error:', err.message);
  }
};


// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      let job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this job',
        });
      }

      job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.json({ success: true, data: job });
    } else {
      const jobIndex = store.jobs.findIndex(
        (j) => j._id.toString() === id.toString()
      );
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      if (store.jobs[jobIndex].employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this job',
        });
      }

      store.jobs[jobIndex] = {
        ...store.jobs[jobIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      return res.json({ success: true, data: store.jobs[jobIndex] });
    }
  } catch (error) {
    console.error('updateJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this job',
        });
      }

      await job.deleteOne();
      return res.json({ success: true, message: 'Job removed successfully' });
    } else {
      const jobIndex = store.jobs.findIndex(
        (j) => j._id.toString() === id.toString()
      );
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      if (store.jobs[jobIndex].employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this job',
        });
      }

      store.jobs.splice(jobIndex, 1);
      return res.json({ success: true, message: 'Job removed successfully' });
    }
  } catch (error) {
    console.error('deleteJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer)
const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user._id.toString();

    if (store.isUsingMongo) {
      const jobs = await Job.find({ employer: employerId }).sort({ createdAt: -1 });
      return res.json({ success: true, data: jobs });
    } else {
      const jobs = store.jobs.filter(
        (j) => j.employer && j.employer.toString() === employerId
      );
      return res.json({ success: true, data: jobs });
    }
  } catch (error) {
    console.error('getEmployerJobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI recommended jobs for logged-in candidate
// @route   GET /api/jobs/recommended
// @access  Private (Candidate)
const getRecommendedJobsForCandidate = async (req, res) => {
  try {
    const candidate = req.user;
    let allJobs = [];

    if (store.isUsingMongo) {
      allJobs = await Job.find({}).lean();
    } else {
      allJobs = store.jobs;
    }

    const { getRecommendedJobs } = require('../services/aiMatchingService');
    const recommended = await getRecommendedJobs(candidate, allJobs);

    return res.json({
      success: true,
      count: recommended.length,
      data: recommended,
    });
  } catch (error) {
    console.error('getRecommendedJobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI match score for a specific job against candidate
// @route   GET /api/jobs/:id/match
// @access  Private
const getJobMatchScore = async (req, res) => {
  try {
    const { id } = req.params;
    let job;

    if (store.isUsingMongo) {
      job = await Job.findById(id).lean();
    } else {
      job = store.jobs.find((j) => j._id.toString() === id.toString());
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { calculateJobMatch } = require('../services/aiMatchingService');
    const match = await calculateJobMatch(req.user, job);

    return res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error('getJobMatchScore error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Report a job listing
// @route   POST /api/jobs/:id/report
// @access  Public
const reportJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, details, reporterEmail } = req.body;

    if (!reason || !details) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reason and details for reporting this job',
      });
    }

    const JobReport = require('../models/JobReport');

    const reportData = {
      job: id,
      reporter: req.user?._id || null,
      reporterEmail: reporterEmail || req.user?.email || 'Anonymous Visitor',
      reason,
      details,
      status: 'Pending',
      createdAt: new Date(),
    };

    if (store.isUsingMongo) {
      await JobReport.create(reportData);
    } else {
      if (!store.jobReports) store.jobReports = [];
      store.jobReports.push({ _id: 'report-' + Date.now(), ...reportData });
    }

    return res.status(201).json({
      success: true,
      message: 'Job report received. Our moderation team will review this listing shortly.',
    });
  } catch (error) {
    console.error('reportJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getRecommendedJobsForCandidate,
  getJobMatchScore,
  reportJob,
};
