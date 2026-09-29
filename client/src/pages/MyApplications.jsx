import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import ApplicationRow from '../components/ApplicationRow';
import { APPLICATION_STATUSES } from '../utils/constants';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getCandidateApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getFilteredApps = () => {
    if (activeTab === 'All') return applications;
    return applications.filter(
      (a) => a.status?.toLowerCase() === activeTab.toLowerCase()
    );
  };

  const filteredApps = getFilteredApps();

  const getStatusCount = (status) => {
    if (status === 'All') return applications.length;
    return applications.filter(
      (a) => a.status?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brandtext leading-tight">My Applications</h1>
          <p className="text-xs text-brandmuted mt-0.5">
            Keep track of all your job submissions and interview schedules
          </p>
        </div>

        <Link to="/jobs" className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 self-start sm:self-auto">
          Browse More Jobs
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 bg-white border border-brandborder p-1.5 rounded-xl overflow-x-auto shadow-sm">
        {APPLICATION_STATUSES.map((status) => {
          const count = getStatusCount(status);
          const isActive = activeTab === status;
          return (
            <button
              key={status}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-brand text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-brandtext-light hover:bg-slate-100 hover:text-primary'
              }`}
              onClick={() => setActiveTab(status)}
            >
              <span>{status}</span>
              <span className="text-[11px] opacity-85">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="bg-white border border-brandborder rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-7 h-7 border-2 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brandmuted">Loading your applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <Briefcase size={36} className="text-brandmuted" />
            <h4 className="font-bold text-sm text-brandtext">No applications in '{activeTab}'</h4>
            <p className="text-xs text-brandmuted">Explore open positions and start applying today.</p>
            <Link to="/jobs" className="mt-2 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-brand">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredApps.map((app) => (
              <ApplicationRow key={app._id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
