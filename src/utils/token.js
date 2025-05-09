import { jwtDecode } from 'jwt-decode';
import api from '../../api/apiClint';
import { userName, userPassword } from '../../src/store/useUserStore';

class Token {
  constructor(data) {
    this._data = data;
    this._accessToken = this._data.token;
    this._refreshToken = this._data.refreshToken;
    this._refreshTokenExpTime = this._data.refreshTokenExpireTime;
  }

  static async Create() {
    const theCredentials = {
      userName: userName(),
      password: userPassword(),
    };

    const data = await api.zPost('/api/Authentications', theCredentials);
    return new Token(data);
  }
  async resetRefreshToken() {
    try {
      const KEY = import.meta.env.VITE_API_KEY;
      const URL = import.meta.env.VITE_API_URL;
      const isProduction = import.meta.env.PROD;
      const { nameid: id } = this.decodeAccessToken;
      const refreshUrl = isProduction
        ? `/api/proxy/Users/${id}/Authentications?refreshToken=${this._refreshToken}`
        : `${URL}/api/Users/${id}/Authentications?refreshToken=${this._refreshToken}`;

      const res = await fetch(refreshUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': KEY,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      // Parse the response as plain text (based on Postman collection)
      const newAccessToken = await res.text();
      console.log('API Response (new access token):', newAccessToken);

      // Update the access token if the response is valid
      if (newAccessToken) {
        console.log('Old access token:', this._accessToken);
        this._accessToken = newAccessToken;
        console.log('New access token:', this._accessToken);
      } else {
        console.error('No access token returned from API');
        return null;
      }

      return this._accessToken;
    } catch (e) {
      console.error('Error in resetRefreshToken:', e);
      return null;
    }
  }

  async fetchTokensObj() {
    const theCredentials = {
      userName: userName(),
      password: userPassword(),
    };

    return await api.zPost('/api/Authentications', theCredentials);
  }

  get decodeAccessToken() {
    return jwtDecode(this.accessToken);
  }

  get accessToken() {
    return this._accessToken;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  get refreshTokenExpTime() {
    return this._refreshTokenExpTime;
  }
}

export { Token };
