import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(
    (config) => {
        // Get user directly from localStorage to avoid circular dependency
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                if (user && user.token) {
                    config.headers['Authorization'] = 'Bearer ' + user.token;
                }
            } catch (e) {
                console.error('Error parsing user from localStorage:', e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;