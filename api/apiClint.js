import Cookies from 'js-cookie';
import { Token } from '../src/utils/token';
const URL = import.meta.env.VITE_API_URL;
const KEY = import.meta.env.VITE_API_KEY;

const isProduction = import.meta.env.PROD;

class ApiClint {
  constructor(url = URL) {
    if (!url) {
      throw new Error(
        'API base URL is missing! Make sure VITE_API_URL is set.'
      );
    }

    this._baseURL = isProduction ? '/api/proxy' : url;
    this._originalURL = url;
  }

  async request(endpoint, method = 'GET', body = null, retry = true) {
    const accessToken = Cookies.get('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': KEY,
    };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    const config = {
      method,
      headers,
    };
    if (body) config.body = JSON.stringify(body);

    try {
      const response = await fetch(`${this.url}${endpoint}`, config);

      if (response.status == 401 && retry) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.request(endpoint, method, body, false);
        } else {
          window.location.href = '/login';
        }
        return;
      }

      if (response.status == 204) return null;
      if (!response.ok) throw new Error(`Error ${response.status}`);

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get url() {
    return this._baseURL;
  }

  async refreshToken() {
    const refreshToken = Cookies.get('refreshToken');
    const fullId = Cookies.get('fullId');

    if (!refreshToken || !fullId) return false;

    try {
      // For the refresh token, ensure we're using the correct path
      const refreshUrl = isProduction
        ? `/api/proxy/Users/${fullId}/Authentications?refreshToken=${refreshToken}`
        : `${this._originalURL}/Users/${fullId}/Authentications?refreshToken=${refreshToken}`;

      const res = await fetch(refreshUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': KEY,
        },
      });

      if (!res.ok) return false;

      const newToken = await res.json();
      Cookies.set('accessToken', newToken);
      return true;
    } catch (e) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('fullId');
      return false;
    }
  }

  get(endpoint) {
    return this.request(endpoint, 'GET');
  }

  post(endpoint, data) {
    return this.request(endpoint, 'POST', data);
  }

  put(endpoint, data) {
    return this.request(endpoint, 'PUT', data);
  }

  delete(endpoint, data) {
    return this.request(endpoint, 'DELETE', data);
  }

  async zPost(endpoint, body) {
    try {
      const response = await fetch(`${this.url}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': KEY,
        },
        body: JSON.stringify(body),
      });

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new ApiClint(URL);
