import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://flashsavvy-server.vercel.app/api'
  : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to include auth headers
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url);
  const userId = localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('isAdmin');
  
  if (userId) {
    config.headers['user-id'] = userId;
    config.headers['is-admin'] = isAdmin;
  }
  
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  create: (productData) => api.post('/products', productData),
};

export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
};

export default api; 