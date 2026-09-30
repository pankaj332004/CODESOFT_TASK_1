import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Briefcase, Search, ArrowRight } from 'lucide-react';
import { userService } from '../services/userService';
import JobCard from '../components/JobCard';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await userService.getSavedJobs();
      setSavedJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight flex items-center gap-2">
            <Bookmark className="text-primary fill-primary" size={24} />
            <span>Saved Jobs</span>
          </h1>
          <p className="text-xs text-brandmuted mt-0.5">
            Opportunities you bookmarked for later review and application.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto"
        >
          <Search size={14} />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-brandborder rounded-xl p-12 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs text-brandmuted font-medium">Loading your saved opportunities...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white border border-brandborder rounded-xl p-12 text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-brandmuted mb-1">
            <Bookmark size={28} />
          </div>
          <h3 className="font-bold text-base text-brandtext">No saved jobs yet</h3>
          <p className="text-xs text-brandmuted max-w-sm">
            Click the bookmark icon on any job listing to save it here for quick access.
          </p>
          <Link
            to="/jobs"
            className="mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-brand hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
          >
            <span>Browse Job Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map((job) => (
            <JobCard key={job._id} job={job} layout="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
