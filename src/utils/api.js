import axios from 'axios';

const getBaseURL = () => {
    // Always use relative path to leverage Vercel Rewrites and Vite Proxy
    return '/api';
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
