// filepath: c:\Users\pc\OneDrive\Masaüstü\TaxCalculator\TaxCalculator-frontend\src\services\productService.js
import api from './api.js';

const getUserProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

const payTax = async (id) => {
    const response = await api.put(`/products/${id}/pay-tax`);
    return response.data;
};

const productService = {
    getUserProducts,
    updateProduct,
    createProduct,
    deleteProduct,
    payTax
};

export default productService;