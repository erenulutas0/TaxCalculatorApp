import api from './api.js';

const adminService = {
    // Admin dashboard istatistikleri - DÜZELTME
    async getDashboardStats() {
        try {
            const response = await api.get('/admin/stats'); // ✅ Doğru endpoint
            return response.data;
        } catch (error) {
            console.error('Dashboard stats hatası:', error);
            throw error;
        }
    },

    // Admin istatistikleri (alternatif endpoint)
    async getAdminStats() {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            console.error('Admin stats hatası:', error);
            throw error;
        }
    },

    // Tüm kullanıcıları ürünleriyle beraber getir
    async getAllUsersWithProducts() {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Kullanıcılar getirilemedi:', error);
            throw error;
        }
    },

    // Belirli kullanıcının ürünlerini getir
    async getUserProductsById(userId) {
        try {
            const response = await api.get(`/admin/users/${userId}/products`);
            return response.data;
        } catch (error) {
            console.error('Kullanıcı ürünleri getirilemedi:', error);
            throw error;
        }
    },

    // Kullanıcı sil
    async deleteUserById(userId) {
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            console.log('Kullanıcı silme başarılı:', response.data);
            return response.data;
        } catch (error) {
            console.error('Kullanıcı silinemedi:', error);
            throw error;
        }
    },

    // Tüm ürünleri getir
    async getAllProducts() {
        try {
            const response = await api.get('/admin/products');
            return response.data;
        } catch (error) {
            console.error('Ürünler getirilemedi:', error);
            throw error;
        }
    }
};

export default adminService;