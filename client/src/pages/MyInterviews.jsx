import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ExternalLink, MapPin, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const MyInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await applicationService.getMyInterviews();
        setInterviews(res.data || []);
      } catch (err) {
        console.error('Failed to load interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const isEmployer = user?.role === 'employer';

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight flex items-center gap-2">
            <Calendar className="text-primary fill-primary-light" size={24} />
            <span>Scheduled Interviews</span>
          </h1>
          <p className="text-xs text-brandmuted mt-0.5">
            {isEmployer
              ? 'Interviews you have scheduled with candidates across your listings.'
              : 'Upcoming interview rounds and calendar dates scheduled with hiring teams.'}
          </p>
        </div>

        <Link
          to={isEmployer ? '/employer' : '/jobs'}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto"
        >
          <span>{isEmployer ? 'Go to Employer Dashboard' : 'Explore More Jobs'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-brandborder rounded-xl p-12 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs text-brandmuted font-medium">Loading scheduled interviews...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white border border-brandborder rounded-xl p-12 text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
            <Calendar size={28} />
          </div>
          <h3 className="font-bold text-base text-brandtext">No scheduled interviews</h3>
          <p className="text-xs text-brandmuted max-w-sm">
            {isEmployer
              ? 'You have not scheduled any candidate interviews yet. Open your Employer Dashboard to schedule an interview with an applicant.'
              : 'As employers review your applications and advance you to interview rounds, your scheduled dates and video links will appear here.'}
          </p>
          <Link
            to={isEmployer ? '/employer' : '/candidate/applications'}
            className="mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-brand hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
          >
            <span>{isEmployer ? 'Review Applicants' : 'View My Applications'}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interviews.map((app) => {
            const iv = app.interview || {};
            const job = app.job || {};

            return (
              <div
                key={app._id}
                className="bg-white border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-brand border border-brandborder bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 font-bold text-primary p-1">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.company} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span>{job.company?.charAt(0) || 'C'}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-brandtext leading-snug">{job.title || 'Position'}</h4>
                        <span className="text-xs text-brandmuted font-medium">{job.company}</span>
                      </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
                      Confirmed Round
                    </span>
                  </div>

                  {isEmployer && (
                    <div className="text-xs text-brandtext-light bg-slate-50 border border-slate-100 p-2.5 rounded-brand mb-3">
                      Candidate: <strong className="text-brandtext">{app.candidateName}</strong> ({app.candidateEmail})
                    </div>
                  )}

                  {/* Interview Date & Details Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-brandmuted font-medium">
                        <Calendar size={13} className="text-primary" />
                        <span>Date:</span>
                      </span>
                      <strong className="text-brandtext font-bold">{iv.date || 'TBD'}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-brandmuted font-medium">
                        <Clock size={13} className="text-primary" />
                        <span>Time:</span>
                      </span>
                      <strong className="text-brandtext font-bold">{iv.time || '10:00 AM'}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-brandmuted font-medium">
                        <Video size={13} className="text-primary" />
                        <span>Type:</span>
                      </span>
                      <strong className="text-brandtext font-bold">{iv.type || 'Video Call'}</strong>
                    </div>
                  </div>

                  {iv.notes && (
                    <p className="text-xs text-brandtext-light italic mt-3 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-brand">
                      "{iv.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  {iv.meetingLink ? (
                    <a
                      href={iv.meetingLink.startsWith('http') ? iv.meetingLink : `https://${iv.meetingLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-brand font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
                    >
                      <Video size={14} />
                      <span>Join Interview Meeting</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-brandmuted">Link will be shared shortly</span>
                  )}

                  <Link
                    to={`/jobs/${job._id || ''}`}
                    className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInterviews;
