const Job = require('../models/Job');
const User = require('../models/User');
const { store } = require('../config/db');

// @desc    Get directory of hiring companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  try {
    let jobs = [];
    let employers = [];

    if (store.isUsingMongo) {
      jobs = await Job.find({}).lean();
      employers = await User.find({ role: 'employer' }).lean();
    } else {
      jobs = store.jobs;
      employers = store.users.filter((u) => u.role === 'employer');
    }

    // Aggregate by company name
    const companyMap = new Map();

    jobs.forEach((job) => {
      const companyName = job.company || 'Unknown Company';
      if (!companyMap.has(companyName)) {
        const emp = employers.find(
          (e) => (e.companyName && e.companyName.toLowerCase() === companyName.toLowerCase()) ||
                 (e._id && job.employer && e._id.toString() === job.employer.toString())
        );

        companyMap.set(companyName, {
          name: companyName,
          logo: job.companyLogo || '',
          location: job.location || 'Remote',
          category: job.category || 'Tech',
          bio: emp?.bio || `${companyName} is actively hiring top-tier candidates on the Job Board.`,
          website: emp?.companyWebsite || 'https://example.com',
          activeJobsCount: 0,
          jobs: [],
        });
      }

      const comp = companyMap.get(companyName);
      comp.activeJobsCount += 1;
      comp.jobs.push(job);
    });

    const companies = Array.from(companyMap.values()).sort(
      (a, b) => b.activeJobsCount - a.activeJobsCount
    );

    return res.json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    console.error('getCompanies error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific company profile and open listings
// @route   GET /api/companies/:name
// @access  Public
const getCompanyByName = async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name).toLowerCase();

    let allJobs = [];
    let employers = [];

    if (store.isUsingMongo) {
      allJobs = await Job.find({}).lean();
      employers = await User.find({ role: 'employer' }).lean();
    } else {
      allJobs = store.jobs;
      employers = store.users.filter((u) => u.role === 'employer');
    }

    const companyJobs = allJobs.filter(
      (j) => j.company && j.company.toLowerCase() === decodedName
    );

    if (companyJobs.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const firstJob = companyJobs[0];
    const emp = employers.find(
      (e) => (e.companyName && e.companyName.toLowerCase() === decodedName) ||
             (e._id && firstJob.employer && e._id.toString() === firstJob.employer.toString())
    );

    const companyProfile = {
      name: firstJob.company,
      logo: firstJob.companyLogo || '',
      location: firstJob.location || 'Remote',
      category: firstJob.category || 'Technology',
      bio: emp?.bio || `${firstJob.company} is a leading global innovator delivering high impact solutions.`,
      website: emp?.companyWebsite || 'https://company.com',
      activeJobsCount: companyJobs.length,
      jobs: companyJobs,
    };

    return res.json({
      success: true,
      data: companyProfile,
    });
  } catch (error) {
    console.error('getCompanyByName error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyByName,
};
