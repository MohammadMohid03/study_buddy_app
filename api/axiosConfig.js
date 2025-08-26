import axios from 'axios';
import { getToken } from '../utils/secureStore'; // 1. Import getToken

const API_BASE_URL = 'http://192.168.100.64:5001/api'; // Use your IP

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add the request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken(); // Get the token from SecureStore
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;