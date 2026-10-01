import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CalendarCheck,
  Award,
  Bookmark,
  ArrowRight,
  Briefcase,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import ApplicationRow from '../components/ApplicationRow';
import ErrorBoundary from '../components/ErrorBoundary';
import JobCard from '../components/JobCard';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, recRes] = await Promise.all([
          applicationService.getCandidateApplications(),
          jobService.getRecommendedJobs().catch(() => ({ data: [] })),
        ]);
        setApplications(appRes.data || []);
        setRecommendedJobs(recRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
        setLoadingRecs(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await applicationService.withdrawApplication(applicationId);
      setApplications((prev) => prev.filter((a) => a._id !== applicationId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    }
  };

  const interviewsCount = applications.filter((a) => a.status === 'Interview').length;
  const offersCount = applications.filter((a) => a.status === 'Offer' || a.status === 'Hired').length;
  const savedCount = user?.savedJobs?.length || 0;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight">Candidate Dashboard</h1>
          <p className="text-xs text-brandmuted mt-0.5">
            Welcome back, {user?.name}! Track your applications and AI-matched recommendations.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto"
        >
          <Search size={14} />
          <span>Find New Jobs</span>
        </Link>
      </div>

      {/* Top 4 Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <FileText size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{applications.length}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Applications</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarCheck size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{interviewsCount}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Interviews</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{offersCount}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Offers</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Bookmark size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{savedCount}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Saved Jobs</span>
          </div>
        </div>
      </div>

      {/* AI Matching & Recommended Jobs Section */}
      <div className="bg-gradient-to-br from-slate-900 to-[#102a45] rounded-2xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-brand bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">AI-Recommended Jobs For You</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  AI Match Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Personalized matching engine analyzes your skills, experience, and resume keywords.
              </p>
            </div>
          </div>

          <Link
            to="/candidate/profile"
            className="text-xs font-semibold text-sky-300 hover:text-sky-200 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>Update Profile Skills</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loadingRecs ? (
          <div className="py-10 text-center flex flex-col items-center gap-2 text-slate-300">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Analyzing jobs & calculating match scores...</span>
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="py-8 text-center text-slate-300 text-xs">
            No job matches found yet. Add more details to your profile to boost matching precision.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.slice(0, 3).map((job) => (
              <JobCard key={job._id} job={job} layout="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white border border-brandborder rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-brandborder">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-brandtext">Recent Applications</h3>
            <span className="text-xs text-brandmuted">Live updates on positions you've applied for</span>
          </div>
          <Link to="/candidate/applications" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-7 h-7 border-2 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brandmuted">Loading recent activity...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <Briefcase size={36} className="text-brandmuted" />
            <h4 className="font-bold text-sm text-brandtext">No applications yet</h4>
            <p className="text-xs text-brandmuted">Ready to take the next step in your career?</p>
            <Link to="/jobs" className="mt-2 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-brand">
              Browse Open Positions
            </Link>
          </div>
        ) : (
          <ErrorBoundary title="Unable to display recent applications">
            <div className="flex flex-col">
              {applications.slice(0, 5).map((app) => (
                <ApplicationRow
                  key={app._id}
                  application={app}
                  onWithdraw={handleWithdraw}
                />
              ))}
            </div>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
