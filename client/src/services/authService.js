import api from './api';

export const authService = {
  getSetupStatus: async () => {
    const response = await api.get('/auth/setup-status');
    return response.data;
  },

  setupAdmin: async (adminData) => {
    const response = await api.post('/auth/setup-admin', adminData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
