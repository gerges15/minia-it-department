import Cookies from 'js-cookie';
export class Inventory {
  constructor(data) {
    this._data = data;
  }

  storeAccessToken() {
    Cookies.set(
      'accessToken',
      this._data.accessToken,
      this._data.refreshTokenExpireTime
    );
  }
  storeRefreshToken() {
    Cookies.set(
      'refreshToken',
      this._data.refreshToken,
      this._data.refreshTokenExpireTime
    );
  }
}
