import api from './api';

export const companyService = {
  getCompanies: async () => {
    const res = await api.get('/companies');
    return res.data;
  },

  getCompanyByName: async (name) => {
    const res = await api.get(`/companies/${encodeURIComponent(name)}`);
    return res.data;
  },
};
