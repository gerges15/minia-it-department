import axios from 'axios';
const API_URL = 'http://graduationprojecthost.runasp.net';
const API_KEY = 'hiL56ugahSWEoYuaQT3Bg_1R-Ggz7rrxlfRxch509tQ';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

async function login(username, password) {
  try {
    const response = await api.post('/Authentications', { username, password });
    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token, refreshToken, expireToken } = await response.data;
    console.log(response.data);
    return response.data; // 👈 this is your JWT token
  } catch (e) {
    console.log('not auth:', e);
  }
}

export const aToken = await login('admin-admin-wHGa8', '123');
