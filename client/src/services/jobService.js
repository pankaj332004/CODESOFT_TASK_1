import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  createJob: async (jobData) => {
    const res = await api.post('/jobs', jobData);
    return res.data;
  },

  updateJob: async (id, jobData) => {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data;
  },

  deleteJob: async (id) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },

  getEmployerJobs: async () => {
    const res = await api.get('/jobs/employer/my-jobs');
    return res.data;
  },

  getRecommendedJobs: async () => {
    const res = await api.get('/jobs/recommended');
    return res.data;
  },

  getJobMatchScore: async (id) => {
    const res = await api.get(`/jobs/${id}/match`);
    return res.data;
  },

  reportJob: async (id, reportData) => {
    const res = await api.post(`/jobs/${id}/report`, reportData);
    return res.data;
  },
};

