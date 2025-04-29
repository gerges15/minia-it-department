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

  get accessToken() {
    return this._accessToken;
  }
  get refreshToken() {
    return this._refreshToken;
  }
  get refreshTokenExpTime() {
    return this._refreshTokenExpTime;
  }
  get decodeAccessToken() {
    return jwtDecode(this.accessToken);
  }

  async fetchTokensObj() {
    const theCredentials = {
      userName: userName(),
      password: userPassword(),
    };

    return await api.zPost('/api/Authentications', theCredentials);
  }

  async resetRefreshToken() {
    try {
      const KEY = import.meta.env.VITE_API_KEY;
      const URL = import.meta.env.VITE_API_URL;
      const isProduction = import.meta.env.PROD;
      const { nameid: id } = this.decodeAccessToken;
      const refreshUrl = isProduction
        ? `/api/proxy/Users/${id}/Authentications?refreshToken=${this.refreshToken}`
        : `${URL}/Users/${id}/Authentications?refreshToken=${this.refreshToken}`;

      console.log(`Requesting refresh token from: ${refreshUrl}`);

      const res = await fetch(refreshUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': KEY,
        },
      });

      // Check if the response is OK (status code 2xx)
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      // Parse the response JSON
      const newToken = await res.json();
      console.log('API Response:', newToken); // Log the API response

      // If a refresh token is returned, update the _refreshToken
      if (newToken && newToken.refreshToken) {
        console.log('Old refresh token:', this._refreshToken);
        this._refreshToken = newToken.refreshToken; // Update with new token
        console.log('New refresh token:', this._refreshToken);
      } else {
        console.error('No refresh token returned from API');
      }

      return this._refreshToken;
    } catch (e) {
      console.error('Error in resetRefreshToken:', e);
    }
  }
}

export { Token };
