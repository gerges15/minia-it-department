import Cookies from 'js-cookie';
export class Inventory {
  constructor(data) {
    this._data = data;
  }

  storeAccessToken() {
    const accessToken = this._data.accessToken;
    this.setCookie('accessToken', accessToken);
  }
  storeRefreshToken() {
    const refreshToken = this._data.refreshToken;
    this.setCookie('refreshToken', refreshToken);
  }

  setCookie(name, cookie) {
    Cookies.set(name, cookie, this._data.refreshTokenExpireTime);
  }
}
