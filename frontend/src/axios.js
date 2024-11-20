import axios from "axios";
import globalConfig from './services/config'; // Ensure the correct import path

const instance = axios.create({
  baseURL: globalConfig.BACKEND_URL
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
