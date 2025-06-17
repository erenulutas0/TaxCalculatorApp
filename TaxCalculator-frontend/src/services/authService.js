import api from './api.js';

const register = (username, email, password, role) => {
    return api.post('/auth/register', {
        username,
        email,
        password,
        role: role
    });
};

const login = async (username, password) => {
    const response = await api.post('/auth/login', {
        username,
        password
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default authService;