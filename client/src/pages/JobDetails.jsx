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
  Sparkles,
  Flag,
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { formatSalary, formatTimeAgo, formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import ReportJobModal from '../components/ReportJobModal';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleSaveJob } = useAuth();
  const [job, setJob] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [appliedInfo, setAppliedInfo] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);


  useEffect(() => {
    const fetchJobAndMatch = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        setJob(res.data);

        // If candidate is logged in, fetch AI Match Score & Application status
        if (user && user.role === 'candidate') {
          jobService
            .getJobMatchScore(id)
            .then((mRes) => setMatchScore(mRes.data))
            .catch(() => {});

          applicationService
            .checkApplication(id)
            .then((appRes) => setAppliedInfo(appRes))
            .catch(() => {});
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndMatch();
  }, [id, user]);

  const handleWithdraw = async () => {
    if (!appliedInfo?.application?._id) return;
    if (!window.confirm('Are you sure you want to withdraw your application for this position?')) return;
    setWithdrawing(true);
    try {
      await applicationService.withdrawApplication(appliedInfo.application._id);
      setAppliedInfo({ applied: false, application: null });
      setJob((prev) => (prev ? { ...prev, applicantsCount: Math.max(0, (prev.applicantsCount || 1) - 1) } : prev));
      alert('Application successfully withdrawn.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
    }
  };

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
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-brand border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-semibold transition-colors"
              title="Report this job listing"
            >
              <Flag size={14} />
              <span className="hidden sm:inline">Report</span>
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-brand border text-xs font-semibold transition-colors ${
                isSaved ? 'bg-primary-light text-primary border-primary' : 'bg-white border-brandborder text-brandtext hover:bg-slate-50'
              }`}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            {appliedInfo?.applied ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-brand bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Applied ({appliedInfo.application?.status || 'Active'})</span>
                </div>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="px-3 py-2 rounded-brand border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50"
                  title="Withdraw this application"
                >
                  {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                </button>
              </div>
            ) : user?.role === 'employer' ? (
              <span className="text-xs text-brandmuted font-semibold bg-slate-100 px-3 py-2 rounded-brand border border-slate-200">
                Employer View
              </span>
            ) : (
              <Link
                to={`/apply/${job._id}`}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-brand font-semibold text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-0.5"
              >
                Apply Now
              </Link>
            )}
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
            {appliedInfo?.applied ? (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <h4 className="font-bold text-base text-emerald-950">You have already submitted an application</h4>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Current Status: <strong className="font-bold text-emerald-900">{appliedInfo.application?.status}</strong> • Submitted on {formatDate(appliedInfo.application?.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    to="/candidate/applications"
                    className="bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 px-4 py-2 rounded-brand font-semibold text-xs shadow-sm transition-all"
                  >
                    View My Applications
                  </Link>
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-brand font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {withdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-primary-light to-white border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-brandtext">Interested in this opportunity?</h4>
                  <p className="text-xs text-brandmuted">Submit your resume and cover letter to apply today.</p>
                </div>
                <Link to={`/apply/${job._id}`} className="bg-success hover:bg-success-dark text-white px-5 py-2.5 rounded-brand font-semibold text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-0.5 shrink-0">
                  Apply for this Position
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: AI Match Score, Company & Job Overview */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* AI Resume & Profile Match Score Card */}
            {matchScore && (
              <div className="bg-gradient-to-br from-slate-900 via-[#102d4b] to-[#0a1e33] text-white border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>AI Match Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {matchScore.match_level || 'Matched'}
                    </span>
                    <span className="text-2xl font-black text-emerald-300">{matchScore.score}%</span>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full bg-slate-700/60 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${matchScore.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-200 leading-relaxed mb-4">
                  {matchScore.reason}
                </p>

                {/* Detailed Factor Breakdown */}
                {matchScore.breakdown && (
                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-white/5 rounded-xl border border-white/5 text-[11px]">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Skills Fit</span>
                        <strong className="text-emerald-400">{matchScore.breakdown.skills_score}%</strong>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full"
                          style={{ width: `${matchScore.breakdown.skills_score}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Role Alignment</span>
                        <strong className="text-teal-400">{matchScore.breakdown.title_score}%</strong>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-teal-400 h-1.5 rounded-full"
                          style={{ width: `${matchScore.breakdown.title_score}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Experience</span>
                        <strong className="text-blue-400">{matchScore.breakdown.experience_score}%</strong>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-400 h-1.5 rounded-full"
                          style={{ width: `${matchScore.breakdown.experience_score}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Location / Type</span>
                        <strong className="text-indigo-400">{matchScore.breakdown.location_score}%</strong>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-400 h-1.5 rounded-full"
                          style={{ width: `${matchScore.breakdown.location_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Matching Skills */}
                {(matchScore.matching_skills || matchScore.matchingSkills)?.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Matched Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(matchScore.matching_skills || matchScore.matchingSkills).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {matchScore.missing_skills?.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Recommended to Highlight:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchScore.missing_skills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {matchScore.recommendations?.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      AI Tip:
                    </span>
                    {matchScore.recommendations.map((rec, i) => (
                      <p key={i} className="text-[11px] text-teal-200/90 leading-tight">
                        • {rec}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}


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

              {/* Report Listing Button in Overview */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-600 transition-colors py-1.5 rounded-brand hover:bg-red-50/50"
                >
                  <Flag size={13} />
                  <span>Report this job listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportJobModal
        job={job}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default JobDetails;

