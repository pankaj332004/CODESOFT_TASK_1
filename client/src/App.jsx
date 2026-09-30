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

// Phase 2 Pages
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import SavedJobs from './pages/SavedJobs';
import JobAlerts from './pages/JobAlerts';
import MyInterviews from './pages/MyInterviews';

// Phase 4 Pages
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:name" element={<CompanyDetails />} />
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
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
        <Route path="/candidate/saved-jobs" element={<SavedJobs />} />
        <Route path="/candidate/alerts" element={<JobAlerts />} />
        <Route path="/candidate/interviews" element={<MyInterviews />} />
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
        <Route path="/employer/interviews" element={<MyInterviews />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

