import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, User, LogOut, ChevronDown, PlusCircle, Building, Bookmark, Bell, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, isEmployer, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-brandborder sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-brandtext tracking-tight">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-brand flex items-center justify-center shadow-md shadow-primary/20">
            <Briefcase size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xl">Job Board</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/"
            className={`text-[14.5px] font-medium py-1.5 transition-colors duration-150 ${
              isActive('/') ? 'text-primary font-semibold border-b-2 border-primary' : 'text-brandtext-light hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className={`text-[14.5px] font-medium py-1.5 transition-colors duration-150 ${
              isActive('/jobs') ? 'text-primary font-semibold border-b-2 border-primary' : 'text-brandtext-light hover:text-primary'
            }`}
          >
            Browse Jobs
          </Link>
          <Link
            to="/companies"
            className={`text-[14.5px] font-medium py-1.5 transition-colors duration-150 ${
              isActive('/companies') ? 'text-primary font-semibold border-b-2 border-primary' : 'text-brandtext-light hover:text-primary'
            }`}
          >
            Companies
          </Link>
          <a href="/#categories" className="text-[14.5px] font-medium py-1.5 text-brandtext-light hover:text-primary transition-colors duration-150">
            Categories
          </a>
          <Link
            to="/contact"
            className={`text-[14.5px] font-medium py-1.5 transition-colors duration-150 ${
              isActive('/contact') ? 'text-primary font-semibold border-b-2 border-primary' : 'text-brandtext-light hover:text-primary'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && <NotificationBell />}

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full text-xs font-bold border border-purple-200 transition-colors"
            >
              <Shield size={13} />
              <span>Admin Panel</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative">

              <button
                className="flex items-center gap-2 bg-slate-50 border border-brandborder pl-1.5 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-xs overflow-hidden">
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
                <span className="text-sm font-semibold text-brandtext max-w-[120px] truncate hidden sm:inline-block">
                  {user?.name}
                </span>
                <ChevronDown size={14} className="text-brandmuted" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-brandborder rounded-xl shadow-xl py-2 z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 flex flex-col gap-0.5">
                    <strong className="text-sm text-brandtext truncate">{user?.name}</strong>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-primary">{user?.role}</span>
                  </div>
                  <hr className="my-1.5 border-brandborder" />
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 font-bold bg-purple-50/70 hover:bg-purple-100 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Shield size={16} />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}
                  <Link
                    to={isEmployer ? '/employer' : '/candidate'}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandtext-light hover:bg-primary-light hover:text-primary transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Dashboard</span>
                  </Link>

                  {!isEmployer && (
                    <>
                      <Link
                        to="/candidate/applications"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandtext-light hover:bg-primary-light hover:text-primary transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Briefcase size={16} />
                        <span>My Applications</span>
                      </Link>
                      <Link
                        to="/candidate/saved-jobs"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandtext-light hover:bg-primary-light hover:text-primary transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Bookmark size={16} />
                        <span>Saved Jobs</span>
                      </Link>
                      <Link
                        to="/candidate/alerts"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandtext-light hover:bg-primary-light hover:text-primary transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Bell size={16} />
                        <span>Job Alerts</span>
                      </Link>
                    </>
                  )}
                  <Link
                    to={isEmployer ? '/employer/interviews' : '/candidate/interviews'}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandtext-light hover:bg-primary-light hover:text-primary transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Calendar size={16} />
                    <span>Interviews</span>
                  </Link>
                  <Link
                    to="/candidate/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandtext-light hover:bg-primary-light hover:text-primary transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </Link>
                  <hr className="my-1.5 border-brandborder" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-danger-light w-full text-left transition-colors font-medium"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-brandtext hover:text-primary px-3 py-1.5 transition-colors">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-brand hover:bg-primary-light transition-colors">
                Register
              </Link>
            </div>
          )}

          {/* Post a Job button (Green accent as in mockup) */}
          <Link
            to={
              isEmployer
                ? '/employer/post-job'
                : isAuthenticated
                ? '/employer/post-job'
                : '/login?redirect=/employer/post-job'
            }
            className="hidden sm:inline-flex items-center gap-2 bg-success hover:bg-success-dark text-white px-4 py-2 text-sm font-semibold rounded-brand shadow-sm shadow-success/20 transition-all hover:-translate-y-0.5"
          >
            <PlusCircle size={16} />
            <span>Post A Job</span>
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            className="md:hidden text-brandtext p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col p-4 bg-white border-t border-brandborder gap-2.5">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium py-1.5 text-brandtext hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium py-1.5 text-brandtext hover:text-primary"
          >
            Browse Jobs
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium py-1.5 text-brandtext hover:text-primary"
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={isEmployer ? '/employer' : '/candidate'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-1.5 text-brandtext hover:text-primary"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-medium py-1.5 text-left text-danger"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-brandborder">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-center py-2 bg-slate-100 rounded-brand text-brandtext"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-center py-2 border border-primary text-primary rounded-brand"
              >
                Register
              </Link>
            </div>
          )}
          <Link
            to="/employer/post-job"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 bg-success text-white py-2.5 rounded-brand font-semibold text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            <span>Post A Job</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
