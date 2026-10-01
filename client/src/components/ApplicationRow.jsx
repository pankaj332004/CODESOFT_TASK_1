import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Video } from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '../utils/helpers';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import CompanyLogo from './CompanyLogo';

const ApplicationRow = ({
  application,
  isEmployer = false,
  onStatusChange,
  onWithdraw,
}) => {
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  if (!application) return null;

  const job = (application.job && typeof application.job === 'object') ? application.job : {};

  const getResumeUrl = (resume) => {
    if (!resume || typeof resume !== 'string') return null;
    if (resume.startsWith('http') || resume.startsWith('/uploads')) {
      return resume;
    }
    return `/uploads/resumes/${resume}`;
  };

  const resumeUrl = getResumeUrl(application.resume);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border-b border-brandborder last:border-none gap-4 hover:bg-slate-50/70 transition-colors text-left">
        {/* Job / Candidate Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-brand border border-brandborder bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 font-bold text-primary text-sm p-1.5">
            <CompanyLogo company={job.company} logo={job.companyLogo} />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h4 className="font-bold text-sm text-brandtext truncate">{job.title || 'Position'}</h4>
            <span className="text-xs text-brandmuted truncate">
              {job.company || 'Company'} • {job.location || 'Remote'}
            </span>
            {isEmployer && application.candidateName && (
              <div className="text-xs text-brandtext-light mt-0.5 truncate">
                Candidate: <strong className="text-brandtext">{application.candidateName}</strong> ({application.candidateEmail})
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-brandmuted sm:w-28 shrink-0">
          <span>{formatDate(application.createdAt)}</span>
        </div>

        {/* Status Pill or Dropdown */}
        <div className="shrink-0">
          {isEmployer ? (
            <select
              className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer outline-none border ${getStatusBadgeClass(application.status)}`}
              value={application.status || 'Applied'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Interview') {
                  setShowInterviewModal(true);
                } else {
                  onStatusChange?.(application._id, val);
                }
              }}
            >
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          ) : (
            <span className={`inline-flex items-center px-3 py-0.5 text-xs font-bold rounded-full ${getStatusBadgeClass(application.status)}`}>
              {application.status || 'Applied'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isEmployer && (
            <button
              onClick={() => setShowInterviewModal(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-brand transition-colors inline-flex items-center gap-1"
              title="Schedule interview date & time"
            >
              <Calendar size={13} />
              <span>Interview</span>
            </button>
          )}

          <Link
            to={job._id ? `/jobs/${job._id}` : '/jobs'}
            className="px-3 py-1.5 text-xs font-semibold text-brandtext bg-white border border-brandborder rounded-brand hover:bg-slate-50 transition-colors"
          >
            View Job
          </Link>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-primary border border-primary rounded-brand hover:bg-primary-light transition-colors"
            >
              Resume
            </a>
          )}

          {!isEmployer && typeof onWithdraw === 'function' && application.status !== 'Rejected' && application.status !== 'Hired' && (
            <button
              onClick={() => onWithdraw(application._id)}
              className="px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-brand transition-colors"
              title="Withdraw this application"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isEmployer && (
        <ScheduleInterviewModal
          application={application}
          isOpen={showInterviewModal}
          onClose={() => setShowInterviewModal(false)}
          onSuccess={() => onStatusChange?.(application._id, 'Interview')}
        />
      )}
    </>
  );
};

export default ApplicationRow;
