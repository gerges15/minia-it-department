import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;
const KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': KEY,
  },
});

export default api;
