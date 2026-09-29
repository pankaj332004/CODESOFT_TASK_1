import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  TrendingUp,
  PlusCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import ApplicationRow from '../components/ApplicationRow';
import { formatDate, formatSalary } from '../utils/helpers';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hired: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [appRes, jobsRes] = await Promise.all([
        applicationService.getEmployerApplications(),
        jobService.getEmployerJobs(),
      ]);

      setApplications(appRes.data || []);
      setMyJobs(jobsRes.data || []);
      if (appRes.stats) {
        setStats(appRes.stats);
      }
    } catch (err) {
      console.error('Failed to load employer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert('Failed to update application status: ' + err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?'))
      return;
    try {
      await jobService.deleteJob(jobId);
      setMyJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight">Employer Dashboard</h1>
          <p className="text-xs text-brandmuted mt-0.5">
            Manage your company job openings and review candidate applications
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-success hover:bg-success-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle size={15} />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{myJobs.length || stats.activeJobs || 6}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Active Jobs</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{applications.length || stats.totalApplications || 42}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Total Applications</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{stats.shortlisted || 18}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Shortlisted</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{stats.hired || 5}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Hired Candidates</span>
          </div>
        </div>
      </div>

      {/* Applications Overview Visual Chart Card */}
      <div className="bg-white border border-brandborder rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-brandborder">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-brandtext">Applications Overview</h3>
            <span className="text-xs text-brandmuted">Candidate pipeline activity over the last 6 months</span>
          </div>
          <span className="text-xs bg-slate-100 text-brandmuted px-2.5 py-0.5 rounded-full font-semibold">
            Monthly Trends
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-end justify-between h-44 gap-3 sm:gap-6 border-b border-brandborder pb-2">
            {[
              { month: 'Jan', val: 35 },
              { month: 'Feb', val: 55 },
              { month: 'Mar', val: 78 },
              { month: 'Apr', val: 95 },
              { month: 'May', val: 70 },
              { month: 'Jun', val: 120 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <div
                  className="w-full max-w-[44px] bg-gradient-to-t from-primary to-blue-400 rounded-t-md relative transition-all duration-300 hover:scale-y-105 group"
                  style={{ height: `${(bar.val / 120) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary group-hover:block">
                    {bar.val}
                  </span>
                </div>
                <span className="text-xs font-semibold text-brandmuted">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Received Applications Table */}
      <div className="bg-white border border-brandborder rounded-xl overflow-hidden shadow-sm" id="applications">
        <div className="p-4 sm:p-5 border-b border-brandborder">
          <h3 className="font-bold text-sm sm:text-base text-brandtext">Received Applications</h3>
          <span className="text-xs text-brandmuted">Review resumes and adjust status (triggers candidate notification email)</span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-7 h-7 border-2 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brandmuted">Loading candidate submissions...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <Users size={36} className="text-brandmuted" />
            <h4 className="font-bold text-sm text-brandtext">No applications received yet</h4>
            <p className="text-xs text-brandmuted">Share your posted jobs to attract qualified candidates.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {applications.map((app) => (
              <ApplicationRow
                key={app._id}
                application={app}
                isEmployer={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Manage Jobs Section */}
      <div className="bg-white border border-brandborder rounded-xl overflow-hidden shadow-sm" id="manage-jobs">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-brandborder">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-brandtext">Your Job Postings</h3>
            <span className="text-xs text-brandmuted">Manage and view active positions listed by your organization</span>
          </div>
          <Link to="/employer/post-job" className="flex items-center gap-1.5 px-3 py-1.5 border border-primary text-primary hover:bg-primary-light rounded-brand text-xs font-semibold transition-colors">
            <PlusCircle size={14} />
            <span>Add New</span>
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <Briefcase size={36} className="text-brandmuted" />
            <h4 className="font-bold text-sm text-brandtext">No jobs posted yet</h4>
            <p className="text-xs text-brandmuted">Create your first job listing to begin recruiting.</p>
            <Link to="/employer/post-job" className="mt-2 px-3.5 py-1.5 bg-success text-white text-xs font-semibold rounded-brand">
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {myJobs.map((j) => (
              <div key={j._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-brandborder last:border-none gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-brandtext">{j.title}</h4>
                  <p className="text-xs text-brandmuted mt-0.5">
                    {j.location} • {j.type} • {formatSalary(j.salary)} • Posted {formatDate(j.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="bg-primary-light text-primary font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {j.applicantsCount || 0} Applicants
                  </span>
                  <Link to={`/jobs/${j._id}`} className="px-3 py-1.5 bg-white border border-brandborder hover:bg-slate-50 rounded-brand text-xs font-semibold text-brandtext flex items-center gap-1">
                    <Eye size={13} />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(j._id)}
                    className="p-1.5 text-danger border border-red-200 rounded-brand hover:bg-danger-light transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
