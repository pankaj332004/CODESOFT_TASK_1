import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/employer/post-job"
          element={
            <ProtectedRoute role="employer">
              <PostJob />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Candidate Dashboard Pages with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute role="candidate">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/candidate/applications" element={<MyApplications />} />
      </Route>

      {/* Profile Settings (Accessible by both Candidate and Employer) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/candidate/profile" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Employer Dashboard Pages with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute role="employer">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employer" element={<EmployerDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
