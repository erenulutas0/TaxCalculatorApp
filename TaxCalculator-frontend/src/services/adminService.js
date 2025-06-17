import api from './api.js';

const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

const getAllUsersWithProducts = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

const deleteUserById = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

const getUserProductsById = async (userId) => {
    const response = await api.get(`/admin/users/${userId}/products`);
    return response.data;
};

const adminService = {
    getDashboardStats,
    getAllUsersWithProducts,
    deleteUserById,
    getUserProductsById
};

export default adminService;