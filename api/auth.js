import { jwtDecode } from 'jwt-decode';
import api from './apiClint';
import Cookies from 'js-cookie';
import { openLoading, disableLoading } from '../src/store/useLoadingStore';
import { Token } from '../src/utils/token';
import { clearError, setError } from '../src/store/useErrorMessageStore';
import { userName, userPassword } from '../src/store/useUserStore';
import { setRole, resetRole } from '../src/store/useAuthStore';

export const login = async () => {
  try {
    openLoading();
    clearError();

    const data = await fetchTokens();
    const tk = await Token.Create();

    const { role, nameid: id } = tk.decodeAccessToken;
    if (isValidTokens(data)) {
      setAccessToken(data);
      setRefreshToken(data);
      setUserIdToken(id, data);
      setRole(role);
    } else {
      const message = 'Invalid authentication response';
      setError(message);
      throw new Error(message);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.detail || 'Authentication failed';
    setError(errorMessage);
    console.error('Login error:', err);
    throw err;
  } finally {
    disableLoading();
  }
};

const fetchTokens = async () => {
  const theCredentials = {
    userName: userName(),
    password: userPassword(),
  };
  return await api.post('/api/Authentications', theCredentials);
};

const isValidTokens = function (data) {
  return data.accessToken || data.refreshToken || data.refreshTokenExpireTime;
};

const setAccessToken = function (data) {
  Cookies.set('accessToken', data.token, data.refreshTokenExpireTime);
};
const setRefreshToken = function (data) {
  Cookies.set('refreshToken', data.refreshToken, data.refreshTokenExpireTime);
};
const setUserIdToken = function (id, data) {
  Cookies.set('id', id, data.refreshTokenExpireTime);
};

const decodeAccessToken = function (token) {
  return jwtDecode(token);
};

export const logout = async () => {
  try {
    removeAllTokens();
    resetRole();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const removeAllTokens = function () {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('id');
};
