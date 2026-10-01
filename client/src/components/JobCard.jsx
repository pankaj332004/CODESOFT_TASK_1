import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Clock, Sparkles } from 'lucide-react';
import { formatSalary, formatTimeAgo } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import CompanyLogo from './CompanyLogo';

const JobCard = ({ job, layout = 'grid' }) => {
  const { user, toggleSaveJob } = useAuth();
  const navigate = useNavigate();

  if (!job) return null;

  const isSaved = user?.savedJobs?.some(
    (id) => (id._id || id).toString() === job._id?.toString()
  );

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleSaveJob(job._id);
  };

  return (
    <div className="bg-white border border-brandborder rounded-xl p-5 flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5 text-left relative overflow-hidden">
      {/* AI Match Badge Banner */}
      {job.aiMatch && (
        <div className="mb-3 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-3 py-1 rounded-lg">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <Sparkles size={14} className="text-emerald-600 fill-emerald-500 animate-pulse" />
            <span>{job.aiMatch.score}% Match</span>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-100/70 px-1.5 py-0.2 rounded">
              {job.aiMatch.matchLevel}
            </span>
          </div>
          {job.aiMatch.matchingSkills?.length > 0 && (
            <span className="text-[10px] text-emerald-700 font-medium truncate max-w-[130px] hidden sm:inline">
              {job.aiMatch.matchingSkills.slice(0, 2).join(' • ')}
            </span>
          )}
        </div>
      )}

      <div className="flex items-start gap-3.5 mb-3.5">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-brand border border-brandborder bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
          <CompanyLogo company={job.company} logo={job.companyLogo} />
        </div>

        {/* Title and Company */}
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job._id}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-base text-brandtext leading-snug truncate">
              {job.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-brandmuted mt-0.5">
            <span className="font-semibold text-brandtext-light truncate">{job.company}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin size={12} className="shrink-0 text-brandmuted" />
              {job.location}
            </span>
          </div>
        </div>

        {/* Bookmark button */}
        <button
          className={`p-1.5 rounded-full hover:bg-primary-light transition-colors ${
            isSaved ? 'text-primary' : 'text-brandmuted'
          }`}
          onClick={handleBookmark}
          title={isSaved ? 'Remove from saved' : 'Save this job'}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3 text-xs font-semibold">
        <span className="bg-primary-light text-primary px-2.5 py-0.5 rounded-full">
          {job.type}
        </span>
        {job.category && (
          <span className="bg-slate-100 text-brandtext-light px-2.5 py-0.5 rounded-full">
            {job.category}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] text-brandmuted ml-auto font-normal">
          <Clock size={12} />
          {formatTimeAgo(job.createdAt)}
        </span>
      </div>

      {/* Description Snippet */}
      {job.description && (
        <p className="text-xs sm:text-sm text-brandtext-light leading-relaxed mb-4 flex-1 line-clamp-2">
          {job.description}
        </p>
      )}

      {/* Footer / Salary / Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div>
          <span className="text-sm font-bold text-brandtext">{formatSalary(job.salary)}</span>
          <span className="text-xs text-brandmuted">/{job.salary?.period || 'yr'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="px-3 py-1.5 text-xs font-semibold text-primary border border-primary rounded-brand hover:bg-primary-light transition-colors"
          >
            Details
          </Link>
          <Link
            to={`/apply/${job._id}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-brand shadow-sm transition-all hover:-translate-y-0.5"
          >
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
