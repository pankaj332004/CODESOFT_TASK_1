import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  Building,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DashboardSidebar = () => {
  const { user, logout, isEmployer } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-brand text-sm font-semibold transition-all ${
      isActive
        ? 'bg-primary text-white shadow-sm shadow-primary/30'
        : 'text-brandtext-light hover:bg-slate-50 hover:text-primary'
    }`;

  return (
    <aside className="bg-white border border-brandborder rounded-xl p-5 w-full md:w-64 shrink-0 flex flex-col shadow-sm text-left">
      {/* User profile summary */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-brandborder mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-blue-200 text-primary font-extrabold text-xl flex items-center justify-center mb-2.5 overflow-hidden border-2 border-white shadow-sm">
          {user?.profileImage && !imgError ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{user?.name?.charAt(0) || 'U'}</span>
          )}
        </div>
        <h4 className="font-bold text-base text-brandtext mb-0.5">{user?.name || 'User'}</h4>
        <span className="text-[11px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {isEmployer ? 'Employer' : 'Candidate'}
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-1">
        {isEmployer ? (
          <>
            <NavLink to="/employer" end className={linkClass}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/employer/post-job" className={linkClass}>
              <PlusCircle size={18} />
              <span>Post a Job</span>
            </NavLink>

            <NavLink to="/employer#manage-jobs" className={linkClass}>
              <Briefcase size={18} />
              <span>Manage Jobs</span>
            </NavLink>

            <NavLink to="/employer#applications" className={linkClass}>
              <FileText size={18} />
              <span>Applications</span>
            </NavLink>

            <NavLink to="/candidate/profile" className={linkClass}>
              <Building size={18} />
              <span>Company Profile</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/candidate" end className={linkClass}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/candidate/profile" className={linkClass}>
              <User size={18} />
              <span>My Profile</span>
            </NavLink>

            <NavLink to="/candidate/applications" className={linkClass}>
              <Briefcase size={18} />
              <span>My Applications</span>
            </NavLink>

            <NavLink to="/jobs" className="flex items-center gap-3 px-3.5 py-2.5 rounded-brand text-sm font-semibold text-brandtext-light hover:bg-slate-50 hover:text-primary transition-all">
              <Bookmark size={18} />
              <span>Browse Jobs</span>
            </NavLink>

            <NavLink to="/candidate/profile" className="flex items-center gap-3 px-3.5 py-2.5 rounded-brand text-sm font-semibold text-brandtext-light hover:bg-slate-50 hover:text-primary transition-all">
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </>
        )}

        <hr className="my-2 border-brandborder" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-brand text-sm font-semibold text-danger hover:bg-danger-light transition-all w-full text-left"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
