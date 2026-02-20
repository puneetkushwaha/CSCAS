import axios from 'axios';

const getBaseURL = () => {
    // Always use relative path to leverage Vercel Rewrites and Vite Proxy
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(), // Keeping getBaseURL() as API_URL is not defined in the original context
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
