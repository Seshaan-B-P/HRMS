import api from './api';

export const leaveService = {
  applyLeave: async (data) => {
    const response = await api.post('/leaves/apply', data);
    return response.data;
  },

  getMyLeaves: async () => {
    const response = await api.get('/leaves/my-leaves');
    return response.data;
  },

  getAllLeaves: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/leaves/all', { params });
    return response.data;
  },

  updateLeaveStatus: async (id, status, reviewNote = '') => {
    const response = await api.put(`/leaves/${id}/status`, { status, reviewNote });
    return response.data;
  },

  cancelLeave: async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  }
};
