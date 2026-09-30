import React, { useState } from 'react';
import { Calendar, Clock, Video, Link as LinkIcon, FileText, X } from 'lucide-react';
import { applicationService } from '../services/applicationService';

const ScheduleInterviewModal = ({ application, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Video Call',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Technical screening and portfolio review session.',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await applicationService.scheduleInterview(application._id, formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-brandborder text-left relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-1 text-primary font-bold text-xs uppercase tracking-wider">
          <Calendar size={15} />
          <span>Interview Scheduler</span>
        </div>
        <h3 className="text-xl font-extrabold text-brandtext mb-1">Schedule Candidate Interview</h3>
        <p className="text-xs text-brandmuted mb-5">
          For candidate: <strong className="text-brandtext">{application.candidateName}</strong> ({application.job?.title})
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-brand text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext flex items-center gap-1">
                <Calendar size={13} className="text-brandmuted" />
                <span>Date *</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3.5 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext flex items-center gap-1">
                <Clock size={13} className="text-brandmuted" />
                <span>Time *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM EST"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-3.5 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-brandtext">Interview Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-3.5 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
            >
              <option value="Video Call">Google Meet / Zoom (Video Call)</option>
              <option value="Phone Call">Phone Screening Call</option>
              <option value="In-Person">In-Person Onsite Interview</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-brandtext flex items-center gap-1">
              <LinkIcon size={13} className="text-brandmuted" />
              <span>Meeting Link / Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. https://meet.google.com/xyz or Office Room 302"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              className="px-3.5 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-brandtext flex items-center gap-1">
              <FileText size={13} className="text-brandmuted" />
              <span>Notes / Agenda for Candidate</span>
            </label>
            <textarea
              rows={3}
              placeholder="Provide agenda, expectations, or preparation topics..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="px-3.5 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-brandtext hover:bg-slate-100 rounded-brand transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-success hover:bg-success-dark rounded-brand shadow-sm transition-all"
            >
              {submitting ? 'Sending Invite...' : 'Confirm & Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
