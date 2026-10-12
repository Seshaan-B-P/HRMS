import api from './api';

export const userService = {
  // Primary User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  changeUserPassword: async (id, passwordData) => {
    const response = await api.patch(`/users/${id}/password`, passwordData);
    return response.data;
  },

  changeAdminPassword: async (passwordData) => {
    const response = await api.patch('/users/admin/password', passwordData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Legacy role-filtered methods
  getHRUsers: async () => {
    const response = await api.get('/users/hr');
    return response.data;
  },

  createHRUser: async (userData) => {
    const response = await api.post('/users/hr', userData);
    return response.data;
  },

  deleteHRUser: async (id) => {
    const response = await api.delete(`/users/hr/${id}`);
    return response.data;
  }
};
