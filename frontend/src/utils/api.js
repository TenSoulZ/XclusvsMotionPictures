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
    timeout: 30000, // 30 seconds timeout to handle cold starts
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
            console.error('Unauthorized access - session expired or invalid token.');
            localStorage.removeItem('token');
            
            // Avoid redirect loops if already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        } else if (error.response && error.response.status === 500) {
            console.error('Server error - potentially caused by invalid session state.');
            // If we are getting 500s and have a token, it might be a corrupted session/token
            // causing the backend to crash. Safe to clear and redirect to login to reset state.
            if (localStorage.getItem('token')) {
                localStorage.removeItem('token');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
