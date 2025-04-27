import { jwtDecode } from 'jwt-decode';
import api from './apiClint';
import Cookies from 'js-cookie';
import { openLoading, disableLoading } from '../src/store/useLoadingStore';

import { clearError, setError } from '../src/store/useErrorMessageStore';
import { userName, userPassword } from '../src/store/useUserStore';
import { Cookie } from '../src/utils/cookies';
import { setRole, resetRole } from '../src/store/useAuthStore';

let accessTokenCookie = '';
let refreshTokenCookie = '';
let fullIdCookie = '';

export const login = async () => {
  openLoading();
  const theCredentials = {
    userName: userName(),
    password: userPassword(),
  };

  try {
    clearError();
    const API_KEY = import.meta.env.API_KEY;

    // fetch
    const data = await api.post('/api/Authentications', theCredentials);
    const { token, refreshToken, refreshTokenExpireTime } = data;

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
  } catch (err) {
    const errorMessage = err.response?.data?.detail || 'Authentication failed';
    setError(errorMessage);
    console.error('Login error:', err);
    throw err;
  } finally {
    disableLoading();
  }
};

export const logout = async () => {
  try {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('fullId');

    resetRole();

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
