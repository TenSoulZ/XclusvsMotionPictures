import axios from 'axios';

/**
 * Axios instance with base configuration.
 * All API requests should use this instance.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor to automatically add the Authorization header.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for centralized error handling.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common error codes (401 Unauthorized, etc.)
        if (error.response && error.response.status === 401) {
            // Optional: Logout user or redirect to login
            console.error('Unauthorized access - potential session expiry.');
        }
        return Promise.reject(error);
    }
);

export default api;
