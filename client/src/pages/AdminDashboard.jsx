import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  AlertTriangle,
  TrendingUp,
  Shield,
  Search,
  Filter,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  PieChart as PieIcon,
  BarChart2,
  Sliders,
  Mail,
  UserCheck,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../hooks/useAuth';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';
import FunnelChart from '../components/charts/FunnelChart';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | users | jobs | reports
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Tab states
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');

  const [reports, setReports] = useState([]);
  const [reportStatusFilter, setReportStatusFilter] = useState('All');

  const [actionMessage, setActionMessage] = useState('');

  const flashMessage = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnalytics();
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers({
        search: userSearch,
        role: userRoleFilter,
      });
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await adminService.getJobs({ search: jobSearch });
      if (res.success) setJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const loadReports = async () => {
    try {
      const res = await adminService.getReports({ status: reportStatusFilter });
      if (res.success) setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'jobs') loadJobs();
    if (activeTab === 'reports') loadReports();
  }, [activeTab, userRoleFilter, reportStatusFilter]);

  // Handlers
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      flashMessage(`User role updated to ${newRole}`);
      loadUsers();
      loadAnalytics();
    } catch (err) {
      flashMessage(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      flashMessage('User deleted successfully');
      loadUsers();
      loadAnalytics();
    } catch (err) {
      flashMessage(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleFeatured = async (jobId) => {
    try {
      await adminService.toggleJobFeatured(jobId);
      flashMessage('Job featured status updated');
      loadJobs();
    } catch (err) {
      flashMessage('Failed to update featured status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job listing and all its applications?')) return;
    try {
      await adminService.deleteJob(jobId);
      flashMessage('Job listing deleted successfully');
      loadJobs();
      loadAnalytics();
    } catch (err) {
      flashMessage('Failed to delete job');
    }
  };

  const handleReportStatus = async (reportId, status) => {
    try {
      await adminService.updateReportStatus(reportId, status);
      flashMessage(`Report marked as ${status}`);
      loadReports();
      loadAnalytics();
    } catch (err) {
      flashMessage('Failed to update report status');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await adminService.deleteReport(reportId);
      flashMessage('Report deleted');
      loadReports();
      loadAnalytics();
    } catch (err) {
      flashMessage('Failed to delete report');
    }
  };

  const overview = analytics?.overview || {};

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-left">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Shield className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                Admin Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Platform Analytics & Moderation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live system monitoring, interactive metrics, user permissions, and listing moderation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadAnalytics();
                if (activeTab === 'users') loadUsers();
                if (activeTab === 'jobs') loadJobs();
                if (activeTab === 'reports') loadReports();
                flashMessage('Refreshed latest data');
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-semibold shadow-xs hover:border-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>System Live</span>
            </div>
          </div>
        </div>

        {/* Global Action Notification Banner */}
        {actionMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-600 hover:text-emerald-900 font-bold">
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
          {[
            { id: 'analytics', label: 'Analytics & Charts', icon: BarChart2 },
            { id: 'users', label: 'User Directory', icon: Users, badge: overview.totalUsers },
            { id: 'jobs', label: 'Job Moderation', icon: Briefcase, badge: overview.totalJobs },
            {
              id: 'reports',
              label: 'Job Reports',
              icon: AlertTriangle,
              badge: overview.pendingReports,
              badgeAlert: overview.pendingReports > 0,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      tab.badgeAlert
                        ? 'bg-red-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS & CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Users */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-black text-slate-900">{overview.totalUsers || 0}</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +100% active
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span className="text-blue-600 font-semibold">{overview.candidatesCount || 0} Candidates</span>
                  <span>•</span>
                  <span className="text-purple-600 font-semibold">{overview.employersCount || 0} Employers</span>
                </div>
              </div>

              {/* Active Jobs */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Listings</span>
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-black text-slate-900">{overview.totalJobs || 0}</span>
                  <span className="text-xs font-semibold text-slate-500">Live positions</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span className="text-indigo-600 font-semibold">Across multiple tech categories</span>
                </div>
              </div>

              {/* Applications Submitted */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</span>
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-black text-slate-900">{overview.totalApplications || 0}</span>
                  <span className="text-xs font-semibold text-purple-600 font-mono">
                    {overview.hireRate || 0}% Hire Rate
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">Candidate resumes processed</span>
                </div>
              </div>

              {/* Moderation Reports */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Moderation</span>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-black text-slate-900">{overview.pendingReports || 0}</span>
                  <span className="text-xs font-semibold text-amber-600">Pending review</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                  <span className="text-emerald-600 font-medium">Community safety active</span>
                </div>
              </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Monthly Volume Trends (Bar Chart) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Application & Job Volume Trends</h3>
                    <p className="text-xs text-slate-400">Monthly breakdown over the last 6 months</p>
                  </div>
                  <BarChart2 className="w-5 h-5 text-slate-400" />
                </div>
                <BarChart data={analytics?.applicationTrends || []} height={250} />
              </div>

              {/* Category Distribution (Donut Chart) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Jobs by Category</h3>
                    <p className="text-xs text-slate-400">Percentage distribution across domains</p>
                  </div>
                  <PieIcon className="w-5 h-5 text-slate-400" />
                </div>
                <DonutChart data={analytics?.categoryDistribution || []} centerLabel="Jobs" />
              </div>
            </div>

            {/* Secondary Row: Application Pipeline Funnel & Job Types */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Application Status Pipeline Funnel */}
              <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1">Candidate Hiring Funnel</h3>
                <p className="text-xs text-slate-400 mb-6">Stage-by-stage candidate progression and retention</p>
                <FunnelChart data={analytics?.statusFunnel || []} />
              </div>

              {/* Job Types Distribution & Recent Activity */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1">Job Work Types</h3>
                  <p className="text-xs text-slate-400 mb-4">Contract, Full Time, and Part Time distribution</p>
                  <DonutChart data={analytics?.jobTypeDistribution || []} centerLabel="Types" />
                </div>

                {/* Activity Feed */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Live Platform Activity</h3>
                  <div className="divide-y divide-slate-100">
                    {(analytics?.recentActivity || []).length === 0 ? (
                      <p className="text-xs text-slate-400 py-4">No recent activity logged yet.</p>
                    ) : (
                      analytics.recentActivity.map((act, i) => (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                act.type === 'report'
                                  ? 'bg-red-500'
                                  : act.type === 'application'
                                  ? 'bg-blue-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span className="font-medium text-slate-800">{act.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(act.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                  placeholder="Search user by name, email..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="All">All Roles</option>
                  <option value="candidate">Candidates</option>
                  <option value="employer">Employers</option>
                  <option value="admin">Admins</option>
                </select>
                <button
                  onClick={loadUsers}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">
                        No users match the criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                              {u.profileImage ? (
                                <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{u.name?.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <strong className="font-bold text-slate-900 block">{u.name}</strong>
                              {u.companyName && (
                                <span className="text-[10px] text-slate-400">{u.companyName}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className={`px-2 py-1 text-[11px] font-bold rounded-lg border focus:outline-none ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                : u.role === 'employer'
                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            <option value="candidate">Candidate</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{u.location || '—'}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={user?._id === u._id}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            title={user?._id === u._id ? 'Cannot delete self' : 'Delete user'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JOB MODERATION */}
        {activeTab === 'jobs' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadJobs()}
                  placeholder="Search jobs by title or company..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={loadJobs}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
              >
                Search
              </button>
            </div>

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Applicants</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">
                        No jobs found.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <a
                            href={`/jobs/${job._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5"
                          >
                            <span>{job.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                          <span className="text-[11px] text-slate-400">{job.type} • {job.location}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{job.company}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                            {job.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{job.applicantsCount || 0}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleFeatured(job._id)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                              job.featured
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${job.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                            <span>{job.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete job listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: JOB REPORTS MODERATION */}
        {activeTab === 'reports' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-in fade-in duration-200">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 mr-2">Status:</span>
              {['All', 'Pending', 'Reviewed', 'Dismissed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setReportStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    reportStatusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-900">Moderation Queue Clean</h4>
                <p className="text-xs text-slate-500 mt-1">There are no reports matching this filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="p-4 sm:p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          {report.reason}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            report.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : report.status === 'Reviewed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {report.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs">
                        <span className="font-semibold text-slate-700">Reported Job: </span>
                        {report.job ? (
                          <a
                            href={`/jobs/${report.job._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            {report.job.title} at {report.job.company}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Job Listing already removed</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{report.details}"
                      </p>

                      <div className="text-[11px] text-slate-400">
                        Reporter: {report.reporter?.name || report.reporterEmail || 'Anonymous'}
                      </div>
                    </div>

                    {/* Report Moderation Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {report.status !== 'Reviewed' && (
                        <button
                          onClick={() => handleReportStatus(report._id, 'Reviewed')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {report.status !== 'Dismissed' && (
                        <button
                          onClick={() => handleReportStatus(report._id, 'Dismissed')}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                      {report.job && (
                        <button
                          onClick={() => handleDeleteJob(report.job._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Delete reported job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Job</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete report entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
