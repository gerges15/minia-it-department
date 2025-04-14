import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from './axiosInstance';
import { setErrorMsg, clearErrorMsg } from '../state/errorMsgSlice';
import { openLoading, disableLoading } from '../state/loadingSlice';
export const login = async (credentials, dispatch, auth_store) => {
  dispatch(openLoading());

  try {
    const API_KEY = import.meta.env.VITE_API_KEY;
    dispatch(clearErrorMsg());

    // fetch
    const res = await api.post('/Authentications', credentials);
    const { token, refreshToken, refreshTokenExpireTime } = res.data;

    if (!token || !refreshToken) {
      dispatch(setErrorMsg('Invalid authentication response'));
      throw new Error('Invalid authentication response');
    }

    // set cookies
    const cookieOptions = {
      secure: true,
      sameSite: 'strict',
      expires: new Date(refreshTokenExpireTime),
    };

    Cookies.set('access_token', token, cookieOptions);
    Cookies.set('refresh_token', refreshToken, cookieOptions);

    // decode token and get role
    const decoded_token = jwtDecode(token);
    const { role, nameid: fullId } = decoded_token;

    Cookies.set('fullId', fullId, cookieOptions);

    // set role in zustand
    auth_store.login(role);

    // set token in headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    window.location.href = '/';
  } catch (err) {
    const errorMessage = err.response?.data?.detail || 'Authentication failed';
    dispatch(setErrorMsg(errorMessage));
    console.error('Login error:', err);
    throw err;
  } finally {
    dispatch(disableLoading());
  }
};

export const logout = async auth_store => {
  try {
    // Remove all authentication cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('fullId');

    // Remove Authorization header
    delete api.defaults.headers.common['Authorization'];

    // Update auth state
    if (auth_store) {
      auth_store.logout();
    }

    // await api.post('/logout');

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
