import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
    // Safety net: Fix common typo where .com is missing from onrender URL
    if (url.includes('onrender') && !url.endsWith('.com')) {
        url = url.replace(/onrender\/?$/, 'onrender.com');
    }
    return url.endsWith('/') ? `${url}api` : `${url}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
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
