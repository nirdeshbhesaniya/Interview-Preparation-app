import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://interview-preparation-app.onrender.com/api',
  // baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
