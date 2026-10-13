import api from './api';

export const invoiceService = {
  getInvoices: async (params = {}) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  recordPayment: async (id, data) => {
    const response = await api.post(`/invoices/${id}/record-payment`, data);
    return response.data;
  },

  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  getFinanceStats: async () => {
    const response = await api.get('/invoices/stats/overview');
    return response.data;
  },

  downloadPDF: async (id, invoiceNumber) => {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${invoiceNumber || id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
