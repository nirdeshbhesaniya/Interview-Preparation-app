import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://interview-preparation-app.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
