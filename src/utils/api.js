import axios from 'axios';

const getBaseURL = () => {
    // Check if VITE_BASE_URL is set, otherwise default to localhost
    const baseURL = import.meta.env.VITE_BASE_URL || 'https://csca.onrender.com';
    // Ensure the baseURL doesn't end with a slash before appending /api
    return `${baseURL.replace(/\/$/, '')}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 60000,
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
