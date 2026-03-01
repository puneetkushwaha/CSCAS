import axios from 'axios';

const getBaseURL = () => {
    // Use absolute path in production to directly hit Render and bypass Vercel's 10s serverless timeout function
    if (import.meta.env.MODE === 'production') {
        return 'https://csca.onrender.com/api';
    }
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(), // Keeping getBaseURL() as API_URL is not defined in the original context
    timeout: 600000, // 10 minutes
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
