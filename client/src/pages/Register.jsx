import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role,
      });

      navigate(res.data?.role === 'employer' ? '/employer' : '/candidate');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-6 bg-brandbg text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl w-full items-center">
        {/* Left Column: Perks */}
        <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
          <div className="bg-primary-light text-primary-dark text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full w-fit mb-4">
            Career Accelerator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brandtext leading-tight mb-4">
            {role === 'candidate'
              ? 'Find Your Dream Career with Verified Employers'
              : 'Hire the Top 1% Global Tech Talent Faster'}
          </h2>
          <p className="text-sm sm:text-base text-brandtext-light leading-relaxed mb-6 max-w-md">
            {role === 'candidate'
              ? 'Join over 3,000+ candidates who found high-impact software engineering, design, and product management jobs.'
              : 'Direct access to qualified developers and designers. Manage applicant pipelines with zero friction.'}
          </p>

          <div className="flex flex-col gap-3.5 text-left w-full max-w-md">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-brandtext font-semibold">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <span>Transparent salary ranges on 100% of jobs</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-brandtext font-semibold">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <span>Direct application notifications to your inbox</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-brandtext font-semibold">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <span>1-click resume uploads and application tracking</span>
            </div>
          </div>
        </div>

        {/* Right Column: Register Card */}
        <div className="bg-white border border-brandborder rounded-2xl p-8 sm:p-10 shadow-card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-brandtext mb-1">Create an Account</h2>
            <p className="text-xs text-brandmuted">Join as a Candidate or Employer</p>
          </div>

          {/* Role Toggle Switch */}
          <div className="flex bg-slate-100 p-1 rounded-brand mb-6 gap-1">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-brand transition-all ${
                role === 'candidate'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-brandtext-light hover:text-brandtext'
              }`}
              onClick={() => setRole('candidate')}
            >
              <User size={15} />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-brand transition-all ${
                role === 'employer'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-brandtext-light hover:text-brandtext'
              }`}
              onClick={() => setRole('employer')}
            >
              <Briefcase size={15} />
              <span>Employer</span>
            </button>
          </div>

          {error && (
            <div className="bg-danger-light border border-red-200 text-danger p-3 rounded-brand text-xs flex items-center gap-2 mb-4">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Full Name</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-brandmuted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-brandmuted pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Password</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-brandmuted pointer-events-none" />
                <input
                  type="password"
                  placeholder="Create a password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-brandmuted pointer-events-none" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-success hover:bg-success-dark text-white font-semibold text-xs py-2.5 rounded-brand shadow-sm shadow-success/30 transition-all hover:-translate-y-0.5 mt-2"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-brandmuted">
            <span>Already have an account?</span>
            <Link to="/login" className="text-primary font-bold ml-1.5 hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
