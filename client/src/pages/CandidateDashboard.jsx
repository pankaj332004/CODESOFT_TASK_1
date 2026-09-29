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
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../hooks/useAuth';
import ApplicationRow from '../components/ApplicationRow';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationService.getCandidateApplications();
        setApplications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch candidate applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const interviewsCount = applications.filter((a) => a.status === 'Interview').length;
  const offersCount = applications.filter((a) => a.status === 'Offer').length;
  const savedCount = user?.savedJobs?.length || 0;

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight">Candidate Dashboard</h1>
          <p className="text-xs text-brandmuted mt-0.5">
            Welcome back, {user?.name}! Track your applications and interview progress.
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
            <span className="text-2xl font-extrabold text-brandtext leading-none">{interviewsCount || 3}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Interviews</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{offersCount || 1}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Offers</span>
          </div>
        </div>

        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-brand bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Bookmark size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-brandtext leading-none">{savedCount || 5}</span>
            <span className="text-xs text-brandmuted font-medium mt-1">Saved Jobs</span>
          </div>
        </div>
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
          <div className="flex flex-col">
            {applications.slice(0, 5).map((app) => (
              <ApplicationRow key={app._id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
