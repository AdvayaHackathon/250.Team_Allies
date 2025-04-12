import axios from 'axios';

// Main backend (Node.js/Express) base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
// ML API base URL
const ML_BASE_URL = process.env.REACT_APP_ML_BASE_URL || 'http://127.0.0.1:5000';

// Axios for main backend
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios for ML server
const mlAxiosInstance = axios.create({
    baseURL: ML_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to backend requests only
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Backend response interceptor
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
);

// ML response interceptor
mlAxiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'ML API error');
    }
);

// API object
const api = {
    // Auth
    login: (credentials) => axiosInstance.post('/users/login', credentials),
    register: (userData) => axiosInstance.post('/users/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    },

    // Health assessment → ML API direct calls
    submitHealthData: (healthData) => mlAxiosInstance.post('/assess_risk', healthData),
    getRequiredFields: () => mlAxiosInstance.get('/get_required_fields'),

    // Backend-only APIs
    getUserHealthRecords: () => axiosInstance.get('/health/records'),
    // Add this to your api object
    saveHealthRecord: (healthData) => axiosInstance.post('/health/records', healthData),
};

export { api };