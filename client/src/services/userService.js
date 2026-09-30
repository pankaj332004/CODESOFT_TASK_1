import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  uploadResume: (formData) =>
    api.post('/users/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  toggleSaveJob: (jobId) => api.post(`/users/save-job/${jobId}`),
  updatePassword: (passwordData) => api.put('/users/password', passwordData),
};

export default userService;
