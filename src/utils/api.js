import axios from 'axios';

const getBaseURL = () => {
    // Check if VITE_BASE_URL is set. If not, use relative path to leverage Vite/Vercel proxies.
    // This avoids CORS issues by keeping requests on the same origin.
    const baseURL = import.meta.env.VITE_BASE_URL || '';
    // If baseURL is empty, this returns '/api'. If set, ensures no trailing slash before appending /api
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
