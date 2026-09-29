import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Calendar,
  Briefcase,
  Users,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { formatSalary, formatTimeAgo, formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleSaveJob } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        setJob(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const isSaved = user?.savedJobs?.some(
    (item) => (item._id || item).toString() === job?._id?.toString()
  );

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleSaveJob(job._id);
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-brandmuted">Loading position details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-brandborder p-8 rounded-xl max-w-md mx-auto">
          <h3 className="font-bold text-lg text-brandtext mb-2">Position Not Found</h3>
          <p className="text-xs text-brandmuted mb-4">{error || 'This job listing may have expired or been removed.'}</p>
          <Link to="/jobs" className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-brand">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-brandbg text-left">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-brandmuted hover:text-primary mb-5 transition-colors">
          <ArrowLeft size={15} />
          <span>Back to Jobs</span>
        </Link>

        {/* Job Header Hero Card */}
        <div className="bg-white border border-brandborder rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-xl border border-brandborder bg-slate-50 flex items-center justify-center font-extrabold text-2xl text-primary overflow-hidden shrink-0 p-1.5">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="max-w-full max-h-full object-contain" />
              ) : (
                <span>{job.company?.charAt(0) || 'C'}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brandtext leading-tight mb-1.5">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-brandmuted mb-3 flex-wrap">
                <span className="font-semibold text-brandtext-light">{job.company}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {job.location}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
                <span className="bg-primary-light text-primary px-3 py-1 rounded-full">{job.type}</span>
                <span className="bg-slate-100 text-brandmuted px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimeAgo(job.createdAt)}
                </span>
                <span className="bg-success-light text-success-dark px-3 py-1 rounded-full">
                  {formatSalary(job.salary)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-brand border text-xs font-semibold transition-colors ${
                isSaved ? 'bg-primary-light text-primary border-primary' : 'bg-white border-brandborder text-brandtext hover:bg-slate-50'
              }`}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <Link
              to={`/apply/${job._id}`}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-brand font-semibold text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-0.5"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Content & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description, Responsibilities, Requirements */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-brandborder rounded-xl p-6 sm:p-7 shadow-sm">
              <h3 className="font-bold text-base text-brandtext pb-3 mb-4 border-b border-slate-100">
                Job Description
              </h3>
              <p className="text-sm text-brandtext-light leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white border border-brandborder rounded-xl p-6 sm:p-7 shadow-sm">
                <h3 className="font-bold text-base text-brandtext pb-3 mb-4 border-b border-slate-100">
                  Responsibilities
                </h3>
                <ul className="flex flex-col gap-3">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brandtext-light leading-relaxed">
                      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white border border-brandborder rounded-xl p-6 sm:p-7 shadow-sm">
                <h3 className="font-bold text-base text-brandtext pb-3 mb-4 border-b border-slate-100">
                  Requirements
                </h3>
                <ul className="flex flex-col gap-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brandtext-light leading-relaxed">
                      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom CTA Card */}
            <div className="bg-gradient-to-r from-primary-light to-white border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-brandtext">Interested in this opportunity?</h4>
                <p className="text-xs text-brandmuted">Submit your resume and cover letter to apply today.</p>
              </div>
              <Link to={`/apply/${job._id}`} className="bg-success hover:bg-success-dark text-white px-5 py-2.5 rounded-brand font-semibold text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-0.5 shrink-0">
                Apply for this Position
              </Link>
            </div>
          </div>

          {/* Right Column: Company & Job Overview */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Company Card */}
            <div className="bg-white border border-brandborder rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-brand border border-brandborder bg-slate-50 flex items-center justify-center font-bold text-primary text-lg overflow-hidden shrink-0 p-1">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span>{job.company?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-base text-brandtext">{job.company}</h4>
                  <span className="text-xs text-brandmuted">{job.category} Industry</span>
                </div>
              </div>
              <p className="text-xs text-brandtext-light leading-relaxed mb-4">
                {job.employer?.bio ||
                  `${job.company} is a leading organization creating state-of-the-art products and empowering exceptional engineering teams.`}
              </p>
              <Link
                to={`/jobs?search=${encodeURIComponent(job.company)}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-primary border border-primary rounded-brand hover:bg-primary-light transition-colors"
              >
                <span>View Company Jobs</span>
                <ExternalLink size={13} />
              </Link>
            </div>

            {/* Overview Card */}
            <div className="bg-white border border-brandborder rounded-xl p-6 shadow-sm">
              <h4 className="font-bold text-base text-brandtext pb-3 mb-4 border-b border-slate-100">
                Job Overview
              </h4>
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="text-brandmuted block font-medium">Date Posted</span>
                    <strong className="text-brandtext font-bold">{formatDate(job.createdAt)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="text-brandmuted block font-medium">Job Type</span>
                    <strong className="text-brandtext font-bold">{job.type}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="text-brandmuted block font-medium">Location</span>
                    <strong className="text-brandtext font-bold">{job.location}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="text-brandmuted block font-medium">Salary</span>
                    <strong className="text-brandtext font-bold">{formatSalary(job.salary)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="text-brandmuted block font-medium">Experience</span>
                    <strong className="text-brandtext font-bold">{job.experience || '1-3 years'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
