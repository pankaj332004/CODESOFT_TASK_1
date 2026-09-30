import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  FileCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../hooks/useAuth';
import { formatSalary } from '../utils/helpers';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/apply/${id}`);
      return;
    }

    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(id);
        setJob(res.data);
      } catch (err) {
        setError('Position not found');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
        setError('Please upload a valid PDF, DOC, or DOCX document.');
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.email) {
      setError('Please provide your name and email address.');
      return;
    }

    if (!resumeFile && !user?.resume) {
      setError('Please upload your resume to submit this application.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('jobId', id);
      payload.append('candidateName', formData.fullName);
      payload.append('candidateEmail', formData.email);
      payload.append('candidatePhone', formData.phone);
      payload.append('coverLetter', formData.coverLetter);

      if (resumeFile) {
        payload.append('resume', resumeFile);
      } else if (user?.resume) {
        payload.append('resume', user.resume);
      }

      await applicationService.applyJob(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        navigate('/candidate/applications');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-brandmuted">Loading application form...</p>
      </div>
    );
  }

  return (
    <div className="py-8 bg-brandbg text-left">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-brandmuted hover:text-primary mb-5 transition-colors">
          <ArrowLeft size={15} />
          <span>Back to Job Details</span>
        </Link>

        {/* Success Modal / Banner */}
        {success ? (
          <div className="bg-white border border-brandborder rounded-2xl p-10 text-center shadow-md max-w-lg mx-auto flex flex-col items-center">
            <div className="mb-4">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h2 className="text-2xl font-extrabold text-brandtext mb-2">Application Submitted!</h2>
            <p className="text-xs sm:text-sm text-brandmuted leading-relaxed mb-4">
              Your application for <strong className="text-brandtext">{job?.title}</strong> at <strong className="text-brandtext">{job?.company}</strong> has been transmitted. We've sent a confirmation email to <strong className="text-brandtext">{formData.email}</strong>.
            </p>
            <p className="text-xs text-primary font-semibold mb-6 flex items-center gap-1.5 animate-pulse">
              <span>Redirecting to your Dashboard in 3 seconds...</span>
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link to="/candidate/applications" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-brand font-semibold text-xs transition-colors">
                View My Applications
              </Link>
              <Link to="/jobs" className="bg-white border border-brandborder text-brandtext hover:bg-slate-50 px-5 py-2.5 rounded-brand font-semibold text-xs transition-colors">
                Browse More Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Job Summary Banner */}
            <div className="bg-white border border-brandborder rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-brand border border-brandborder bg-slate-50 flex items-center justify-center font-bold text-primary text-xl overflow-hidden shrink-0 p-1">
                  {job?.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span>{job?.company?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-brandtext leading-snug">{job?.title}</h2>
                  <p className="text-xs text-brandmuted flex items-center gap-1.5 mt-0.5">
                    {job?.company} • <MapPin size={12} /> {job?.location} • {job?.type}
                  </p>
                </div>
              </div>
              <div>
                <span className="inline-block bg-success-light text-success-dark font-bold text-xs px-3 py-1 rounded-full">
                  {formatSalary(job?.salary)}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-danger-light border border-red-200 text-danger p-3 rounded-brand text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-brandborder rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-base text-brandtext pb-3 mb-6 border-b border-brandborder">
                Apply for this Job
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left: Candidate Information */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="px-3.5 py-2 text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="px-3.5 py-2 text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      rows={5}
                      placeholder="Write a brief cover letter introducing yourself and why you're a good fit..."
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Right: Resume Upload Box */}
                <div className="md:col-span-5 flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-brandtext">Upload Resume *</label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-primary rounded-xl p-6 bg-slate-50 hover:bg-primary-light/50 transition-all text-center cursor-pointer">
                    <input
                      type="file"
                      id="resume-file-input"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="resume-file-input" className="flex flex-col items-center gap-2.5 cursor-pointer">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                        <UploadCloud size={24} />
                      </div>
                      <span className="text-xs text-brandtext-light leading-snug">
                        Drag & drop your resume here <br />
                        or <span className="text-primary font-bold underline">click to upload</span>
                      </span>
                      <span className="text-[11px] text-brandmuted">PDF, DOC, DOCX (Max 10MB)</span>
                    </label>
                  </div>

                  {resumeFile ? (
                    <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-brand border border-brandborder text-xs">
                      <FileCheck size={16} className="text-primary shrink-0" />
                      <span className="font-semibold text-brandtext truncate flex-1">{resumeFile.name}</span>
                      <span className="text-[11px] text-brandmuted">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ) : user?.resume ? (
                    <div className="flex items-center gap-2 bg-primary-light p-2.5 rounded-brand border border-primary/30 text-xs text-primary-dark">
                      <FileCheck size={16} className="text-primary shrink-0" />
                      <span className="font-semibold truncate">Using Profile Resume: {user.resume}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-brandborder">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-success hover:bg-success-dark text-white font-semibold text-sm py-3 rounded-brand shadow-sm shadow-success/30 transition-all hover:-translate-y-0.5"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;
