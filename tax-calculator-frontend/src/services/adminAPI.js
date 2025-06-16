import api from './api';

export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getAllUsers: () => api.get('/api/admin/users'),
  getUserProducts: (userId) => api.get(`/api/admin/users/${userId}/products`),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
};