import api from './api';

export const attendanceService = {
  getMyAttendance: async (params = {}) => {
    const response = await api.get('/attendance/my-attendance', { params });
    return response.data;
  },

  getAllAttendance: async (params = {}) => {
    const response = await api.get('/attendance/all', { params });
    return response.data;
  },

  getTodaySummary: async () => {
    const response = await api.get('/attendance/today-summary');
    return response.data;
  }
};
