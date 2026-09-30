import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-base text-slate-500 font-medium">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (role && user?.role !== role) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'employer') return <Navigate to="/employer" replace />;
    return <Navigate to="/candidate" replace />;
  }


  return children;
};

export default ProtectedRoute;
