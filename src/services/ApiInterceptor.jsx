// services/api.js
import axios from "axios";
import TokenManager from './TokenManager'; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
    baseURL: API_BASE_URL, // Replace with your API's base URL
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = TokenManager.getAccessToken();
      if (token && !TokenManager.isTokenExpired()) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  export default apiClient;