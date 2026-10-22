import axios from 'axios';

const api = axios.create({
  baseURL: 'https://premium-todo.onrender.com/api', // Localhost se Render URL par shift kiya
});

export default api;