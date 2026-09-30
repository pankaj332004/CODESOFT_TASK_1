import api from './api';

export const adminService = {
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  updateUserRole: async (id, role) => {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  getJobs: async (params = {}) => {
    const res = await api.get('/admin/jobs', { params });
    return res.data;
  },

  toggleJobFeatured: async (id) => {
    const res = await api.patch(`/admin/jobs/${id}/featured`);
    return res.data;
  },

  deleteJob: async (id) => {
    const res = await api.delete(`/admin/jobs/${id}`);
    return res.data;
  },

  getReports: async (params = {}) => {
    const res = await api.get('/admin/reports', { params });
    return res.data;
  },

  updateReportStatus: async (id, status) => {
    const res = await api.patch(`/admin/reports/${id}/status`, { status });
    return res.data;
  },

  deleteReport: async (id) => {
    const res = await api.delete(`/admin/reports/${id}`);
    return res.data;
  },
};
