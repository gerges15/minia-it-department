import { jwtDecode } from 'jwt-decode';
import api from './axiosInstance';
import { openLoading, disableLoading } from '../store/useLoadingStore';

import { clearError, setError } from '../store/useErrorMessageStore';
import { userName, userPassword } from '../store/useUserStore';
import { Cookie } from '../utils/cookies';
import { setRole, resetRole } from '../store/useAuthStore';

let accessTokenCookie = '';
let refreshTokenCookie = '';
let fullIdCookie = '';

export const login = async () => {
  openLoading(); ///
  const theCredentials = {
    userName: userName(),
    password: userPassword(),
  };

  try {
    clearError();
    const API_KEY = import.meta.env.API_KEY;

    // fetch
    const res = await api.post('api/Authentications', theCredentials);
    const { token, refreshToken, refreshTokenExpireTime } = res.data;

    if (!token || !refreshToken) {
      setError('Invalid authentication response');
      throw new Error('Invalid authentication response');
    }

    accessTokenCookie = new Cookie(
      'accessToken',
      token,
      refreshTokenExpireTime
    );
    refreshTokenCookie = new Cookie(
      'refreshToken',
      refreshToken,
      refreshTokenExpireTime
    );

    // decode token and get role
    const decoded_token = jwtDecode(token);
    const { role, nameid: fullId } = decoded_token;

    fullIdCookie = new Cookie('fullId', fullId, refreshTokenExpireTime);

    // set role in zustand
    setRole(role);

    // set token in headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    window.location.href = '/';
  } catch (err) {
    const errorMessage = err.response?.data?.detail || 'Authentication failed';
    setError(errorMessage);
    console.error('Login error:', err);
    throw err;
  } finally {
    disableLoading();
  }
};

export const logout = async auth_store => {
  try {
    accessTokenCookie.remove();
    refreshTokenCookie.remove();
    fullIdCookie.remove();
    // Remove Authorization header
    delete api.defaults.headers.common['Authorization'];

    // Update auth state
    if (auth_store) {
      resetRole();
    }

    // await api.post('/logout');

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
