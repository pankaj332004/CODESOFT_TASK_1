import api from './api';

export const userService = {
  getSavedJobs: async () => {
    const res = await api.get('/users/saved-jobs');
    return res.data;
  },

  getJobAlerts: async () => {
    const res = await api.get('/users/job-alerts');
    return res.data;
  },

  createJobAlert: async (alertData) => {
    const res = await api.post('/users/job-alerts', alertData);
    return res.data;
  },

  deleteJobAlert: async (alertId) => {
    const res = await api.delete(`/users/job-alerts/${alertId}`);
    return res.data;
  },
};
