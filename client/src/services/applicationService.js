import api from './api';

export const applicationService = {
  applyJob: async (formData) => {
    // Check if formData is an instance of FormData
    const isFormData = formData instanceof FormData;
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};

    const res = await api.post('/applications', formData, config);
    return res.data;
  },

  getCandidateApplications: async (status = '') => {
    const params = status && status !== 'All' ? { status } : {};
    const res = await api.get('/applications/my-applications', { params });
    return res.data;
  },

  getEmployerApplications: async () => {
    const res = await api.get('/applications/employer/all');
    return res.data;
  },

  updateStatus: async (applicationId, status) => {
    const res = await api.patch(`/applications/${applicationId}/status`, {
      status,
    });
    return res.data;
  },

  scheduleInterview: async (applicationId, interviewData) => {
    const res = await api.post(
      `/applications/${applicationId}/schedule-interview`,
      interviewData
    );
    return res.data;
  },

  getMyInterviews: async () => {
    const res = await api.get('/applications/my-interviews');
    return res.data;
  },
};
