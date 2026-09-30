import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, Search, MapPin, Briefcase } from 'lucide-react';
import { userService } from '../services/userService';
import { JOB_CATEGORIES } from '../utils/constants';

const JobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    keyword: '',
    category: 'All',
    location: '',
    frequency: 'Weekly',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await userService.getJobAlerts();
      setAlerts(res.data || []);
    } catch (err) {
      console.error('Failed to load job alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await userService.createJobAlert(formData);
      setAlerts(res.data || []);
      setShowModal(false);
      setFormData({ keyword: '', category: 'All', location: '', frequency: 'Weekly' });
    } catch (err) {
      alert('Failed to create job alert');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Delete this job alert?')) return;
    try {
      const res = await userService.deleteJobAlert(alertId);
      setAlerts(res.data || []);
    } catch (err) {
      alert('Failed to delete alert');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight flex items-center gap-2">
            <Bell className="text-primary fill-primary-light" size={24} />
            <span>Job Alerts</span>
          </h1>
          <p className="text-xs text-brandmuted mt-0.5">
            Receive automated notifications when new jobs matching your criteria are posted.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-success hover:bg-success-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Create New Alert</span>
        </button>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="bg-white border border-brandborder rounded-xl p-12 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs text-brandmuted font-medium">Loading your job alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white border border-brandborder rounded-xl p-12 text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-brandmuted mb-1">
            <Bell size={28} />
          </div>
          <h3 className="font-bold text-base text-brandtext">No active job alerts</h3>
          <p className="text-xs text-brandmuted max-w-sm">
            Set up an alert with your target job title and keywords, and we'll alert you the moment relevant openings appear.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-brand hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Create Your First Alert</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((al) => (
            <div
              key={al._id}
              className="bg-white border border-brandborder rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brandtext">
                      {al.keyword || 'All Roles'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-brandmuted flex-wrap mt-0.5">
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {al.category || 'All Categories'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {al.location || 'Anywhere'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAlert(al._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-brandmuted">
                  Frequency: <strong className="text-brandtext">{al.frequency}</strong>
                </span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-success" />
                  <span>Email notifications on</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brandborder text-left animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-extrabold text-brandtext mb-1">Create New Job Alert</h3>
            <p className="text-xs text-brandmuted mb-5">
              Specify the criteria for the jobs you want to be notified about.
            </p>

            <form onSubmit={handleCreateAlert} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Keyword / Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer, React, Designer"
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className="px-3 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-3 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
                >
                  <option value="All">All Categories</option>
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Preferred Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote, New York, San Francisco"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-3 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Notification Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="px-3 py-2 text-xs border border-brandborder rounded-brand outline-none focus:border-primary"
                >
                  <option value="Daily">Daily Digest</option>
                  <option value="Weekly">Weekly Summary</option>
                  <option value="Instant">Instant Notification</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-brandtext hover:bg-slate-100 rounded-brand transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-brand shadow-sm transition-all"
                >
                  {submitting ? 'Saving...' : 'Save Job Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAlerts;
