const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const JobReport = require('../models/JobReport');
const { store } = require('../config/db');

// @desc    Get system-wide analytics & chart data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    let users = [];
    let jobs = [];
    let applications = [];
    let reports = [];

    if (store.isUsingMongo) {
      users = await User.find({}).lean();
      jobs = await Job.find({}).lean();
      applications = await Application.find({}).lean();
      reports = await JobReport.find({}).lean();
    } else {
      users = store.users || [];
      jobs = store.jobs || [];
      applications = store.applications || [];
      reports = store.jobReports || [];
    }

    // 1. Overview KPIs
    const totalUsers = users.length;
    const candidatesCount = users.filter((u) => u.role === 'candidate').length;
    const employersCount = users.filter((u) => u.role === 'employer').length;
    const adminsCount = users.filter((u) => u.role === 'admin').length;

    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    const pendingReports = reports.filter((r) => r.status === 'Pending').length;

    const hiredCount = applications.filter(
      (a) => a.status === 'Hired' || a.status === 'Offer'
    ).length;
    const hireRate = totalApplications > 0
      ? Math.round((hiredCount / totalApplications) * 100)
      : 0;

    // 2. Application Trends (Monthly aggregation for last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthlyMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap[key] = { month: key, applications: 0, jobs: 0 };
    }

    applications.forEach((app) => {
      const d = new Date(app.createdAt || Date.now());
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[key]) {
        monthlyMap[key].applications += 1;
      }
    });

    jobs.forEach((j) => {
      const d = new Date(j.createdAt || Date.now());
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[key]) {
        monthlyMap[key].jobs += 1;
      }
    });

    const applicationTrends = Object.values(monthlyMap);

    // 3. Category Distribution
    const categoryCounts = {};
    jobs.forEach((j) => {
      const cat = j.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // 4. Job Type Breakdown
    const typeCounts = {};
    jobs.forEach((j) => {
      const t = j.type || 'Full Time';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    const jobTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0,
    }));

    // 5. Application Funnel by Status
    const statusMap = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Hired: 0,
      Rejected: 0,
    };

    applications.forEach((a) => {
      if (statusMap[a.status] !== undefined) {
        statusMap[a.status] += 1;
      } else {
        statusMap.Applied += 1;
      }
    });

    const statusFunnel = [
      { status: 'Applied', count: statusMap.Applied, color: '#3b82f6' },
      { status: 'Under Review', count: statusMap['Under Review'], color: '#8b5cf6' },
      { status: 'Shortlisted', count: statusMap.Shortlisted, color: '#06b6d4' },
      { status: 'Interview', count: statusMap.Interview, color: '#f59e0b' },
      { status: 'Hired / Offer', count: statusMap.Hired, color: '#10b981' },
      { status: 'Rejected', count: statusMap.Rejected, color: '#ef4444' },
    ];

    // 6. Recent activity stream
    const recentActivity = [
      ...applications.slice(0, 5).map((a) => ({
        type: 'application',
        title: `New application by ${a.candidateName || 'Candidate'}`,
        timestamp: a.createdAt,
        id: a._id,
      })),
      ...reports.slice(0, 4).map((r) => ({
        type: 'report',
        title: `Job report: ${r.reason}`,
        timestamp: r.createdAt,
        id: r._id,
      })),
      ...jobs.slice(0, 3).map((j) => ({
        type: 'job',
        title: `Listing created: ${j.title} at ${j.company}`,
        timestamp: j.createdAt,
        id: j._id,
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

    return res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          candidatesCount,
          employersCount,
          adminsCount,
          totalJobs,
          totalApplications,
          pendingReports,
          hiredCount,
          hireRate,
        },
        applicationTrends,
        categoryDistribution,
        jobTypeDistribution,
        statusFunnel,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('getAnalytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    if (store.isUsingMongo) {
      let query = {};
      if (role && role !== 'All') {
        query.role = role;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
        ];
      }

      const users = await User.find(query).select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    } else {
      let users = store.users || [];
      if (role && role !== 'All') {
        users = users.filter((u) => u.role === role);
      }
      if (search) {
        const s = search.toLowerCase();
        users = users.filter(
          (u) =>
            u.name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            (u.companyName && u.companyName.toLowerCase().includes(s))
        );
      }

      const sanitized = users.map(({ password, ...rest }) => rest);
      return res.json({ success: true, count: sanitized.length, data: sanitized });
    }
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['candidate', 'employer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (store.isUsingMongo) {
      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    } else {
      const user = (store.users || []).find((u) => u._id.toString() === id.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.role = role;
      const { password, ...sanitized } = user;
      return res.json({ success: true, data: sanitized });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    if (store.isUsingMongo) {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, message: 'User deleted successfully' });
    } else {
      const index = (store.users || []).findIndex((u) => u._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      store.users.splice(index, 1);
      return res.json({ success: true, message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs for moderation (admin)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getJobs = async (req, res) => {
  try {
    const { search, category } = req.query;

    if (store.isUsingMongo) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
        ];
      }

      const jobs = await Job.find(query).populate('employer', 'name email companyName').sort({ createdAt: -1 });
      return res.json({ success: true, count: jobs.length, data: jobs });
    } else {
      let jobs = store.jobs || [];
      if (category && category !== 'All') {
        jobs = jobs.filter((j) => j.category === category);
      }
      if (search) {
        const s = search.toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(s) ||
            j.company.toLowerCase().includes(s)
        );
      }
      return res.json({ success: true, count: jobs.length, data: jobs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle job featured status
// @route   PATCH /api/admin/jobs/:id/featured
// @access  Private (Admin)
const toggleJobFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      job.featured = !job.featured;
      await job.save();
      return res.json({ success: true, data: job });
    } else {
      const job = (store.jobs || []).find((j) => j._id.toString() === id.toString());
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      job.featured = !job.featured;
      return res.json({ success: true, data: job });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job (admin)
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      const job = await Job.findByIdAndDelete(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      await Application.deleteMany({ job: id });
      await JobReport.deleteMany({ job: id });
      return res.json({ success: true, message: 'Job listing and associated applications removed' });
    } else {
      const index = (store.jobs || []).findIndex((j) => j._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      store.jobs.splice(index, 1);
      if (store.applications) {
        store.applications = store.applications.filter((a) => a.job.toString() !== id.toString());
      }
      if (store.jobReports) {
        store.jobReports = store.jobReports.filter((r) => r.job.toString() !== id.toString());
      }
      return res.json({ success: true, message: 'Job listing and associated applications removed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all job reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res) => {
  try {
    const { status } = req.query;

    if (store.isUsingMongo) {
      let query = {};
      if (status && status !== 'All') {
        query.status = status;
      }

      const reports = await JobReport.find(query)
        .populate('job', 'title company location salary type')
        .populate('reporter', 'name email')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: reports.length, data: reports });
    } else {
      let reports = store.jobReports || [];
      if (status && status !== 'All') {
        reports = reports.filter((r) => r.status === status);
      }

      const populated = reports.map((r) => {
        const job = (store.jobs || []).find((j) => j._id.toString() === r.job.toString());
        const reporter = (store.users || []).find((u) => u._id.toString() === (r.reporter?.toString() || ''));
        return {
          ...r,
          job: job ? { _id: job._id, title: job.title, company: job.company, location: job.location, salary: job.salary, type: job.type } : null,
          reporter: reporter ? { _id: reporter._id, name: reporter.name, email: reporter.email } : null,
        };
      });

      return res.json({ success: true, count: populated.length, data: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report status
// @route   PATCH /api/admin/reports/:id/status
// @access  Private (Admin)
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Reviewed', 'Dismissed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (store.isUsingMongo) {
      const report = await JobReport.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      return res.json({ success: true, data: report });
    } else {
      const report = (store.jobReports || []).find((r) => r._id.toString() === id.toString());
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      report.status = status;
      return res.json({ success: true, data: report });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/admin/reports/:id
// @access  Private (Admin)
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isUsingMongo) {
      await JobReport.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Report deleted' });
    } else {
      if (store.jobReports) {
        store.jobReports = store.jobReports.filter((r) => r._id.toString() !== id.toString());
      }
      return res.json({ success: true, message: 'Report deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
