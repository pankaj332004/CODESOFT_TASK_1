import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.token) {
      localStorage.setItem('job_board_token', res.data.data.token);
      localStorage.setItem('job_board_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.data?.token) {
      localStorage.setItem('job_board_token', res.data.data.token);
      localStorage.setItem('job_board_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('job_board_token');
    localStorage.removeItem('job_board_user');
  },

  getCurrentUser: () => {
    const saved = localStorage.getItem('job_board_user');
    return saved ? JSON.parse(saved) : null;
  },
};
