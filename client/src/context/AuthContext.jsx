import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = authService.getCurrentUser();
      const token = localStorage.getItem('job_board_token');

      if (token && savedUser) {
        setUser(savedUser);
        try {
          const res = await authService.getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('job_board_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or server restarted');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.data) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data) {
      setUser(res.data);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/users/profile', data);
    if (res.data?.data) {
      const updated = { ...user, ...res.data.data };
      setUser(updated);
      localStorage.setItem('job_board_user', JSON.stringify(updated));
    }
    return res.data;
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.profileImage) {
      const updated = { ...user, profileImage: res.data.profileImage };
      setUser(updated);
      localStorage.setItem('job_board_user', JSON.stringify(updated));
    }
    return res.data;
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.post('/users/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.resume) {
      const updated = { ...user, resume: res.data.resume };
      setUser(updated);
      localStorage.setItem('job_board_user', JSON.stringify(updated));
    }
    return res.data;
  };

  const toggleSaveJob = async (jobId) => {
    if (!user) return false;
    try {
      const res = await api.post(`/users/save-job/${jobId}`);
      if (res.data?.savedJobs) {
        const updated = { ...user, savedJobs: res.data.savedJobs };
        setUser(updated);
        localStorage.setItem('job_board_user', JSON.stringify(updated));
      }
      return res.data?.saved;
    } catch (err) {
      console.error('toggleSaveJob error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        uploadResume,
        toggleSaveJob,
        isAuthenticated: !!user,
        isEmployer: user?.role === 'employer',
        isCandidate: user?.role === 'candidate',
        isAdmin: user?.role === 'admin',
      }}

    >
      {children}
    </AuthContext.Provider>
  );
};
