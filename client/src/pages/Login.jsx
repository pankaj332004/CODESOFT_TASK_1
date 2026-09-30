import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, UserCheck, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [role, setRole] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password, role });
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        if (res.data?.role === 'admin') {
          navigate('/admin');
        } else if (res.data?.role === 'employer') {
          navigate('/employer');
        } else {
          navigate('/candidate');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'candidate') {
      setEmail('john@example.com');
      setPassword('password123');
    } else if (demoRole === 'employer') {
      setEmail('jane@employer.com');
      setPassword('password123');
    } else if (demoRole === 'admin') {
      setEmail('admin@jobboard.com');
      setPassword('password123');
    }
  };


  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-6 bg-brandbg text-left">
      <div className="bg-white border border-brandborder rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-brandtext mb-1">Welcome Back</h2>
          <p className="text-xs text-brandmuted">Login to access your personalized portal</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex bg-slate-100 p-1 rounded-brand mb-6 gap-1">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-brand transition-all ${
              role === 'candidate'
                ? 'bg-primary text-white shadow-sm'
                : 'text-brandtext-light hover:text-brandtext'
            }`}
            onClick={() => setRole('candidate')}
          >
            <UserCheck size={14} />
            <span>Candidate</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-brand transition-all ${
              role === 'employer'
                ? 'bg-primary text-white shadow-sm'
                : 'text-brandtext-light hover:text-brandtext'
            }`}
            onClick={() => setRole('employer')}
          >
            <Briefcase size={14} />
            <span>Employer</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-brand transition-all ${
              role === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-brandtext-light hover:text-brandtext'
            }`}
            onClick={() => setRole('admin')}
          >
            <Shield size={14} />
            <span>Admin</span>
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
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-brandtext">Password</label>
              <a href="#forgot" className="text-[11px] text-primary font-semibold hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-brandmuted pointer-events-none" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Login Quick Autofill */}
        <div className="mt-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-brand text-center">
          <span className="text-[11px] font-bold text-brandmuted block mb-2 uppercase tracking-wider">
            Quick Demo Autofill
          </span>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => fillDemoAccount('candidate')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-brandborder rounded hover:bg-slate-50 transition-colors"
            >
              Candidate Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('employer')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-brandborder rounded hover:bg-slate-50 transition-colors"
            >
              Employer Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>


        <div className="flex items-center my-5 text-xs text-brandmuted font-semibold">
          <span className="flex-1 border-b border-brandborder"></span>
          <span className="px-3">OR</span>
          <span className="flex-1 border-b border-brandborder"></span>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => fillDemoAccount('candidate')}
            className="flex items-center justify-center gap-2.5 py-2 px-3 border border-brandborder rounded-brand text-xs font-semibold text-brandtext hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount('candidate')}
            className="flex items-center justify-center gap-2.5 py-2 px-3 border border-brandborder rounded-brand text-xs font-semibold text-brandtext hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>Continue with LinkedIn</span>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-brandmuted">
          <span>Don't have an account?</span>
          <Link to="/register" className="text-primary font-bold ml-1.5 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
